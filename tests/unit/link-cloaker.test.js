jest.mock("@/lib/env", () => ({
  isConfigured: jest.fn(),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

const { createClient } = require("@supabase/supabase-js");
const { isConfigured } = require("@/lib/env");

function loadModule() {
  return require("@/services/affiliate/link-cloaker");
}

function createSupabaseMock() {
  const tables = {};
  const rpc = jest.fn(async () => ({ error: null }));

  const ensureTable = (table) => {
    if (tables[table]) {
      return tables[table];
    }

    const state = {
      upsert: jest.fn(async () => ({ error: null })),
      selectResult: { data: null, error: null },
      updateResult: { error: null },
      deleteResult: { data: [], error: null },
      insert: jest.fn(async () => ({ error: null })),
      order: jest.fn(() => state),
      limit: jest.fn(async () => ({ data: [], error: null })),
      or: jest.fn(() => ({
        select: jest.fn(async () => state.deleteResult),
      })),
      upsertArgs: null,
      updateArgs: null,
    };

    state.select = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(async () => state.selectResult),
      })),
      order: state.order,
      limit: state.limit,
    }));

    state.update = jest.fn((payload) => {
      state.updateArgs = payload;
      return {
        eq: jest.fn(async () => state.updateResult),
      };
    });

    state.delete = jest.fn(() => ({
      or: state.or,
      eq: jest.fn(async () => state.deleteResult),
    }));

    const api = {
      upsert: jest.fn(async (...args) => {
        state.upsertArgs = args;
        return state.upsert(...args);
      }),
      select: state.select,
      update: state.update,
      delete: state.delete,
      insert: state.insert,
    };

    tables[table] = { state, api };
    return tables[table];
  };

  const from = jest.fn((table) => ensureTable(table).api);

  return { from, rpc, tables, ensureTable };
}

describe("services/affiliate/link-cloaker", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://supabase.test",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      NEXT_PUBLIC_SITE_URL: "https://cloudbasket.co",
    };
    isConfigured.mockImplementation((key) => Boolean(process.env[key]));
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("creates an Amazon cloaked link and persists platform metadata", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { createCloakedLink } = loadModule();

    const url = "https://www.amazon.in/dp/B08TEST123?tag=cloudbasket-21";
    const result = await createCloakedLink(url, "amazon", "amzslug1");

    expect(result).toBe("https://cloudbasket.co/go/amzslug1");
    const [rows, options] = supabase.tables.cloaked_links.state.upsertArgs;
    expect(rows[0]).toMatchObject({
      slug: "amzslug1",
      target_url: url,
      platform: "amazon",
      is_active: true,
    });
    expect(options).toEqual({ onConflict: "slug" });
  });

  test("creates a Flipkart cloaked link", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { createCloakedLink } = loadModule();

    const url = "https://www.flipkart.com/product/p/itm123?affid=cb-flipkart";
    const result = await createCloakedLink(url, "flipkart", "flip1234");

    expect(result).toBe("https://cloudbasket.co/go/flip1234");
    expect(supabase.tables.cloaked_links.state.upsertArgs[0][0].platform).toBe("flipkart");
  });

  test("creates a CJ cloaked link", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { createCloakedLink } = loadModule();

    const url = "https://www.tkqlhce.com/click-123-456?url=https%3A%2F%2Fmerchant.test";
    const result = await createCloakedLink(url, "cj", "cj123456");

    expect(result).toBe("https://cloudbasket.co/go/cj123456");
    expect(supabase.tables.cloaked_links.state.upsertArgs[0][0].platform).toBe("cj");
  });

  test("creates an other-platform cloaked link", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { createCloakedLink } = loadModule();

    const url = "https://merchant.test/deal?id=42";
    const result = await createCloakedLink(url, "other", "other999");

    expect(result).toBe("https://cloudbasket.co/go/other999");
    expect(supabase.tables.cloaked_links.state.upsertArgs[0][0].platform).toBe("other");
  });

  test("preserves UTM parameters on the stored target URL", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { createCloakedLink } = loadModule();

    const url =
      "https://www.amazon.in/dp/B08TEST123?tag=cloudbasket-21&utm_source=cb&utm_medium=affiliate&utm_campaign=summer";
    await createCloakedLink(url, "amazon", "utmkeep1");

    expect(supabase.tables.cloaked_links.state.upsertArgs[0][0].target_url).toBe(url);
  });

  test("returns the original URL when Supabase is not configured", async () => {
    isConfigured.mockReturnValue(false);
    const { createCloakedLink } = loadModule();

    const url = "https://merchant.test/fallback";
    const result = await createCloakedLink(url, "other", "nosb1234");

    expect(result).toBe(url);
    expect(createClient).not.toHaveBeenCalled();
  });

  test("returns the original URL for malformed input when persistence fails", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("cloaked_links").state.upsert.mockResolvedValueOnce({
      error: new Error("invalid url"),
    });
    createClient.mockReturnValue(supabase);
    const { createCloakedLink } = loadModule();

    const malformed = "javascript:alert(1)";
    const result = await createCloakedLink(malformed, "other", "badslug1");

    expect(result).toBe(malformed);
  });

  test("resolves an active slug to its original URL and tracks the redirect", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("cloaked_links").state.selectResult = {
      data: {
        id: "1",
        target_url: "https://www.amazon.in/dp/B08TEST123?tag=cloudbasket-21",
        is_active: true,
        expires_at: null,
      },
      error: null,
    };
    createClient.mockReturnValue(supabase);
    const { getOriginalUrl } = loadModule();

    const result = await getOriginalUrl("amzslug1");

    expect(result).toBe("https://www.amazon.in/dp/B08TEST123?tag=cloudbasket-21");
    expect(supabase.rpc).toHaveBeenCalledWith("increment_link_clicks", { link_slug: "amzslug1" });
    expect(supabase.tables.redirection_logs.state.insert).toHaveBeenCalledTimes(1);
  });
});
