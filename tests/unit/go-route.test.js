jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn((destination, init) => ({
      url: typeof destination === "string" ? destination : destination.toString(),
      status: init?.status ?? 302,
    })),
  },
}));

const { createClient } = require("@supabase/supabase-js");
const { NextResponse } = require("next/server");

function loadModule() {
  return require("@/app/go/[id]/route");
}

function createSupabaseMock(insertResult = { error: null }) {
  const insert = jest.fn(async () => insertResult);
  const from = jest.fn(() => ({
    insert,
  }));
  return { from, insert };
}

function createRequest(url = "https://cloudbasket.co/go/test") {
  return {
    url,
    headers: { get: jest.fn(() => null) },
    nextUrl: { searchParams: new URL(url).searchParams },
  };
}

async function callRoute(id, url = "https://cloudbasket.co/go/test") {
  const { GET } = loadModule();
  const response = await GET(createRequest(url), {
    params: Promise.resolve({ id }),
  });
  await Promise.resolve();
  return response;
}

describe("app/go/[id]/route", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://supabase.test",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      AMAZON_ASSOCIATE_TAG: "cloudbasket-21",
      FLIPKART_AFFID: "cb-flipkart",
      CJ_PUBLISHER_ID: "cb-cj",
      VCOMMISSION_ID: "cb-vcm",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("redirects Amazon IDs and logs the attributed click payload", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("amazon-B08XYZ1234");

    expect(response).toEqual({
      url: "https://www.amazon.in/dp/B08XYZ1234?tag=cloudbasket-21",
      status: 302,
    });
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "B08XYZ1234",
        platform: "amazon",
        page_url: "https://www.amazon.in/dp/B08XYZ1234?tag=cloudbasket-21",
      }),
    );
  });

  test("redirects Flipkart IDs", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("flipkart-samsung-m14");

    expect(response.url).toBe("https://www.flipkart.com/search?q=samsung-m14&affid=cb-flipkart");
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "samsung-m14",
        platform: "flipkart",
      }),
    );
  });

  test("redirects CJ IDs", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("cj-merchant-offer");

    expect(response.url).toBe("https://www.tkqlhce.com/click-merchant-offer?publisher=cb-cj");
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "merchant-offer",
        platform: "cj",
      }),
    );
  });

  test("redirects POD IDs to the pod page", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("pod-artist-drop", "https://cloudbasket.co/go/pod-artist-drop");

    expect(response.url).toBe("https://cloudbasket.co/pod");
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "artist-drop",
        platform: "pod",
        page_url: "https://cloudbasket.co/pod",
      }),
    );
  });

  test("redirects VCommission IDs", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("vcm-deal-44");

    expect(response.url).toBe("https://www.vcommission.com/track/deal-44?id=cb-vcm");
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "deal-44",
        platform: "vcommission",
      }),
    );
  });

  test("falls back to Amazon search for unknown prefixes", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("wireless earbuds");

    expect(response.url).toBe("https://www.amazon.in/s?k=wireless%20earbuds&tag=cloudbasket-21");
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "wireless earbuds",
        platform: "amazon_fallback",
      }),
    );
  });

  test("redirects blank IDs to not-found", async () => {
    const supabase = createSupabaseMock();
    createClient.mockReturnValue(supabase);

    const response = await callRoute("   ");

    expect(response).toEqual({
      url: "https://cloudbasket.co/not-found",
      status: 302,
    });
    expect(supabase.insert).not.toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  test("returns the redirect even when click logging fails", async () => {
    const supabase = createSupabaseMock({ error: { message: "insert failed" } });
    createClient.mockReturnValue(supabase);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await callRoute("amazon-B08ERR1234");

    expect(response.url).toBe("https://www.amazon.in/dp/B08ERR1234?tag=cloudbasket-21");
    expect(supabase.insert).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith("[go/route] Click log failed:", "insert failed");

    errorSpy.mockRestore();
  });
});
