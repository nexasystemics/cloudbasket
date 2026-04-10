jest.mock("@/lib/env", () => ({
  isConfigured: jest.fn(),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

jest.mock("web-push", () => ({
  __esModule: true,
  default: {
    setVapidDetails: jest.fn(),
    sendNotification: jest.fn(),
    generateVAPIDKeys: jest.fn(() => ({
      publicKey: "public-key",
      privateKey: "private-key",
    })),
  },
}));

const { isConfigured } = require("@/lib/env");
const { createClient } = require("@supabase/supabase-js");
const webpush = require("web-push").default;

function loadModule() {
  return require("@/services/notifications/push-service");
}

function createSupabaseMock() {
  const tables = {};

  const ensureTable = (table) => {
    if (tables[table]) {
      return tables[table];
    }

    const state = {
      upsertResult: { error: null },
      deleteResult: { error: null },
      selectEqResult: { data: [], error: null },
      rangeResultQueue: [],
      upsertArgs: null,
      deleteEqArgs: null,
    };

    const api = {
      upsert: jest.fn(async (...args) => {
        state.upsertArgs = args;
        return state.upsertResult;
      }),
      delete: jest.fn(() => ({
        eq: jest.fn(async (field, value) => {
          state.deleteEqArgs = [field, value];
          return state.deleteResult;
        }),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(async () => state.selectEqResult),
        range: jest.fn(async () => state.rangeResultQueue.shift() ?? { data: [], error: null }),
      })),
    };

    tables[table] = { state, api };
    return tables[table];
  };

  const from = jest.fn((table) => ensureTable(table).api);

  return { from, tables, ensureTable };
}

function subscription(endpoint) {
  return {
    endpoint,
    keys: {
      auth: `auth-${endpoint}`,
      p256dh: `p256dh-${endpoint}`,
    },
  };
}

describe("services/notifications/push-service", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://supabase.test",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: "vapid-public",
      VAPID_PRIVATE_KEY: "vapid-private",
      VAPID_EMAIL: "push@cloudbasket.co",
    };
    isConfigured.mockImplementation((key) => Boolean(process.env[key]));
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("subscribeUser stores a subscription successfully", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { subscribeUser } = loadModule();

    const result = await subscribeUser("user-1", subscription("https://push.test/1"));

    expect(result).toBe(true);
    const [rows, options] = supabase.tables.push_subscriptions.state.upsertArgs;
    expect(rows[0]).toMatchObject({
      user_id: "user-1",
      endpoint: "https://push.test/1",
    });
    expect(options).toEqual({ onConflict: "endpoint" });
  });

  test("subscribeUser returns false when upsert fails", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("push_subscriptions").state.upsertResult = { error: new Error("upsert failed") };
    createClient.mockReturnValue(supabase);
    const { subscribeUser } = loadModule();

    const result = await subscribeUser("user-1", subscription("https://push.test/1"));

    expect(result).toBe(false);
  });

  test("unsubscribeUser removes a subscription successfully", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);
    const { unsubscribeUser } = loadModule();

    const result = await unsubscribeUser("https://push.test/2");

    expect(result).toBe(true);
    expect(supabase.tables.push_subscriptions.state.deleteEqArgs).toEqual(["endpoint", "https://push.test/2"]);
  });

  test("unsubscribeUser returns false when delete fails", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("push_subscriptions").state.deleteResult = { error: new Error("delete failed") };
    createClient.mockReturnValue(supabase);
    const { unsubscribeUser } = loadModule();

    const result = await unsubscribeUser("https://push.test/2");

    expect(result).toBe(false);
  });

  test("sendPushNotification reports sent and failed counts", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("push_subscriptions").state.selectEqResult = {
      data: [
        { subscription_json: JSON.stringify(subscription("https://push.test/1")) },
        { subscription_json: JSON.stringify(subscription("https://push.test/2")) },
      ],
      error: null,
    };
    createClient.mockReturnValue(supabase);
    webpush.sendNotification
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce({ statusCode: 500 });
    const { sendPushNotification } = loadModule();

    const result = await sendPushNotification("user-1", {
      title: "Price Drop",
      body: "A watched product is cheaper now.",
    });

    expect(result).toEqual({ sent: 1, failed: 1 });
    expect(webpush.setVapidDetails).toHaveBeenCalledWith(
      "mailto:push@cloudbasket.co",
      "vapid-public",
      "vapid-private",
    );
  });

  test("sendPushNotification cleans up 410 endpoints", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("push_subscriptions").state.selectEqResult = {
      data: [{ subscription_json: JSON.stringify(subscription("https://push.test/410")) }],
      error: null,
    };
    createClient.mockReturnValue(supabase);
    webpush.sendNotification.mockRejectedValueOnce({ statusCode: 410 });
    const { sendPushNotification } = loadModule();

    const result = await sendPushNotification("user-1", {
      title: "Alert",
      body: "Endpoint cleanup path",
    });

    expect(result).toEqual({ sent: 0, failed: 1 });
    expect(supabase.tables.push_subscriptions.state.deleteEqArgs).toEqual(["endpoint", "https://push.test/410"]);
  });

  test("sendPushNotification returns zeros when VAPID env is missing", async () => {
    delete process.env.VAPID_PRIVATE_KEY;
    isConfigured.mockImplementation((key) => Boolean(process.env[key]));
    createClient.mockReturnValue(createSupabaseMock());
    const { sendPushNotification } = loadModule();

    const result = await sendPushNotification("user-1", {
      title: "Alert",
      body: "No vapid",
    });

    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  test("broadcastNotification processes subscriptions in batches", async () => {
    const supabase = createSupabaseMock();
    supabase.ensureTable("push_subscriptions").state.rangeResultQueue = [
      {
        data: [
          {
            endpoint: "https://push.test/1",
            subscription_json: JSON.stringify(subscription("https://push.test/1")),
          },
          {
            endpoint: "https://push.test/2",
            subscription_json: JSON.stringify(subscription("https://push.test/2")),
          },
        ],
        error: null,
      },
      {
        data: [
          {
            endpoint: "https://push.test/3",
            subscription_json: JSON.stringify(subscription("https://push.test/3")),
          },
        ],
        error: null,
      },
    ];
    createClient.mockReturnValue(supabase);
    webpush.sendNotification
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce({ statusCode: 404 })
      .mockResolvedValueOnce(undefined);
    const { broadcastNotification } = loadModule();

    const result = await broadcastNotification(
      {
        title: "Broadcast",
        body: "System-wide update",
        data: { url: "/alerts" },
      },
      2,
    );

    expect(result).toEqual({ total_sent: 2, total_failed: 1 });
    expect(supabase.tables.push_subscriptions.state.deleteEqArgs).toEqual(["endpoint", "https://push.test/2"]);
    expect(webpush.sendNotification).toHaveBeenCalledTimes(3);
  });
});
