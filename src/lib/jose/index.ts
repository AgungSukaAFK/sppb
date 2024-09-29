import "server-only";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

const env = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(env);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    }).catch((err) => {
      throw err;
    });
    return payload;
  } catch {
    return false;
  }
}
