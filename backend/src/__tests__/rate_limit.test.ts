import { app } from "../app";

describe("Rate Limit Security", () => {
  beforeAll(async () => {
    // Mock environment variables are set in jest.setup.js
    // RATE_LIMIT_MAX_REQUESTS = 5
    // RATE_LIMIT_WINDOW_MS = 1000

    // Initialize app but don't listen
    // Note: app.start() calls listen, app.initialize() is private in App class.
    // However, app.server is exposed.
    // We might need to access the underlying instance or force initialization if it's not done in constructor.
    // Looking at app.ts, initialize() is called in start().
    // We can't easily call private methods.
    // But we can verify if rate limit plugin is registered or just try to inject.
    // If initialize() is not called, plugins aren't registered.

    // We need to modify App class to allow testing or expose initialize.
    // Or we can try to cast app to any to call initialize.
    await (app as any).initialize();
  });

  afterAll(async () => {
    await app.stop();
  });

  it("should allow requests within limit", async () => {
    const response = await app.server.inject({
      method: "GET",
      url: "/health",
    });
    expect(response.statusCode).toBe(200);
  });

  it("should block excessive requests", async () => {
    // Send 10 requests, limit is 5
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        app.server.inject({
          method: "GET",
          url: "/health", // Use health check as it's lightweight
        }),
      );
    }

    const responses = await Promise.all(requests);
    const success = responses.filter((r) => r.statusCode === 200);
    const blocked = responses.filter((r) => r.statusCode === 429);

    console.log(`Success: ${success.length}, Blocked: ${blocked.length}`);

    // If rate limiting is working, we should see some 429s
    expect(blocked.length).toBeGreaterThan(0);
  });
});
