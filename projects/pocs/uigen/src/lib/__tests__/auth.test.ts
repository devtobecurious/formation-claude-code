import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createSession } from "../auth";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock jose
vi.mock("jose", () => ({
  SignJWT: vi.fn(),
  jwtVerify: vi.fn(),
}));

describe("createSession", () => {
  const mockSet = vi.fn();
  const mockCookieStore = {
    set: mockSet,
    get: vi.fn(),
    delete: vi.fn(),
  };

  const mockSign = vi.fn();
  const mockSetProtectedHeader = vi.fn();
  const mockSetExpirationTime = vi.fn();
  const mockSetIssuedAt = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup SignJWT mock chain
    mockSetProtectedHeader.mockReturnValue({
      setExpirationTime: mockSetExpirationTime,
    });
    mockSetExpirationTime.mockReturnValue({
      setIssuedAt: mockSetIssuedAt,
    });
    mockSetIssuedAt.mockReturnValue({
      sign: mockSign,
    });

    (SignJWT as any).mockImplementation(() => ({
      setProtectedHeader: mockSetProtectedHeader,
    }));

    // Setup cookies mock
    (cookies as any).mockResolvedValue(mockCookieStore);

    // Mock Date.now() to return a consistent value
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a session with correct JWT payload", async () => {
    const userId = "user123";
    const email = "test@example.com";
    const mockToken = "mock.jwt.token";

    mockSign.mockResolvedValue(mockToken);

    await createSession(userId, email);

    // Verify SignJWT was called with correct payload
    const expectedExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    expect(SignJWT).toHaveBeenCalledWith({
      userId,
      email,
      expiresAt: expectedExpiresAt,
    });
  });

  it("should set JWT with HS256 algorithm", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    expect(mockSetProtectedHeader).toHaveBeenCalledWith({ alg: "HS256" });
  });

  it("should set JWT expiration to 7 days", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    expect(mockSetExpirationTime).toHaveBeenCalledWith("7d");
  });

  it("should set JWT issued at time", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    expect(mockSetIssuedAt).toHaveBeenCalled();
  });

  it("should store token in cookie with correct settings", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    const expectedExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    expect(mockSet).toHaveBeenCalledWith("auth-token", mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expectedExpiresAt,
      path: "/",
    });
  });

  it("should set cookie as httpOnly", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    const cookieOptions = mockSet.mock.calls[0][2];
    expect(cookieOptions.httpOnly).toBe(true);
  });

  it("should set cookie as secure in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    const cookieOptions = mockSet.mock.calls[0][2];
    expect(cookieOptions.secure).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });

  it("should not set cookie as secure in development", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    const cookieOptions = mockSet.mock.calls[0][2];
    expect(cookieOptions.secure).toBe(false);

    process.env.NODE_ENV = originalEnv;
  });

  it("should set cookie with sameSite lax", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    const cookieOptions = mockSet.mock.calls[0][2];
    expect(cookieOptions.sameSite).toBe("lax");
  });

  it("should set cookie with root path", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("user123", "test@example.com");

    const cookieOptions = mockSet.mock.calls[0][2];
    expect(cookieOptions.path).toBe("/");
  });

  it("should set cookie expiration to 7 days from now", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    const now = Date.now();
    await createSession("user123", "test@example.com");

    const cookieOptions = mockSet.mock.calls[0][2];
    const expectedExpires = new Date(now + 7 * 24 * 60 * 60 * 1000);
    expect(cookieOptions.expires).toEqual(expectedExpires);
  });

  it("should handle different user IDs", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    await createSession("different-user-id", "another@example.com");

    expect(SignJWT).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "different-user-id",
        email: "another@example.com",
      })
    );
  });

  it("should handle email addresses with special characters", async () => {
    const mockToken = "mock.jwt.token";
    mockSign.mockResolvedValue(mockToken);

    const specialEmail = "test+tag@example.co.uk";
    await createSession("user123", specialEmail);

    expect(SignJWT).toHaveBeenCalledWith(
      expect.objectContaining({
        email: specialEmail,
      })
    );
  });
});
