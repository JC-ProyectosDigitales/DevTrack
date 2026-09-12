import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET no está configurado.");
}

const encodedSecret = new TextEncoder().encode(secret);

export type SessionPayload = {
  userId: number;
};

export async function createSessionToken(userId: number) {
  return new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      encodedSecret,
    );

    if (typeof payload.userId !== "number") {
      return null;
    }

    return {
      userId: payload.userId,
    };
  } catch {
    return null;
  }
}