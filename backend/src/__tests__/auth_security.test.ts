import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import * as jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config";

// Mocks must be defined before imports that use them
jest.mock("../modules/auth/auth.service");
jest.mock("../shared/redis");
jest.mock("../shared/database");

// Import after mocks
import { app } from "../app";
import { AuthService } from "../modules/auth/auth.service";

describe("Security Reproduction: Revoked Token Bypass", () => {
  let server: any;
  let mockAuthServiceInstance: any;

  beforeAll(async () => {
    // Setup mocks
    mockAuthServiceInstance = {
      isTokenBlacklisted: jest.fn().mockResolvedValue(true as never), // Token IS blacklisted
      getProfile: jest.fn().mockResolvedValue({
        id: "user-123",
        walletAddress: "0x123",
        email: "test@example.com",
      } as never),
    };

    (AuthService.getInstance as jest.Mock).mockReturnValue(
      mockAuthServiceInstance,
    );

    // Initialize app (access private method via any)
    await (app as any).initialize();
    server = app.server;
  });

  afterAll(async () => {
    await app.stop();
  });

  it("should BLOCK access with blacklisted token", async () => {
    // 1. Generate a VALID signed token (so signature check passes)
    const token = jwt.sign(
      {
        userId: "user-123",
        walletAddress: "0x123",
        type: "access",
      },
      envConfig.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // 2. Make request to protected endpoint
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Assert SECURITY
    console.log("Response status:", response.statusCode);

    expect(response.statusCode).toBe(401);

    // Verify that isTokenBlacklisted WAS called
    expect(mockAuthServiceInstance.isTokenBlacklisted).toHaveBeenCalledWith(
      token,
    );
  });

  it("should allow access with valid non-blacklisted token", async () => {
    // 1. Setup mock to return FALSE
    mockAuthServiceInstance.isTokenBlacklisted.mockResolvedValue(
      false as never,
    );

    const token = jwt.sign(
      {
        userId: "user-123",
        walletAddress: "0x123",
        type: "access",
      },
      envConfig.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 2. Expect success (200)
    expect(response.statusCode).toBe(200);
    expect(mockAuthServiceInstance.isTokenBlacklisted).toHaveBeenCalledWith(
      token,
    );
  });
});
