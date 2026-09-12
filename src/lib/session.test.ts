import { beforeAll, describe, expect, it } from "vitest";

describe("session tokens", () => {
  beforeAll(() => {
    process.env.AUTH_SECRET = "test-secret-for-devtrack";
  });

  it("creates and verifies a valid session token", async () => {
    const {
      createSessionToken,
      verifySessionToken,
    } = await import("./session");

    const token = await createSessionToken(123);

    const session = await verifySessionToken(token);

    expect(session).toEqual({
      userId: 123,
    });
  });

  it("rejects an invalid token", async () => {
    const {
      verifySessionToken,
    } = await import("./session");

    const session = await verifySessionToken(
      "invalid-token",
    );

    expect(session).toBeNull();
  });

  it("rejects a token without a numeric userId", async () => {
    const { SignJWT } = await import("jose");

    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET,
    );

    const token = await new SignJWT({
      userId: "123",
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const {
      verifySessionToken,
    } = await import("./session");

    const session = await verifySessionToken(token);

    expect(session).toBeNull();
  });

    it("rejects an expired session token", async () => {
    const { SignJWT } = await import("jose");

    const secret = new TextEncoder().encode(
        process.env.AUTH_SECRET,
    );

    const token = await new SignJWT({
        userId: 123,
    })
        .setProtectedHeader({
        alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime(
        Math.floor(Date.now() / 1000) - 60,
        )
        .sign(secret);

    const {
        verifySessionToken,
    } = await import("./session");

    const session = await verifySessionToken(token);

    expect(session).toBeNull();
    });
});