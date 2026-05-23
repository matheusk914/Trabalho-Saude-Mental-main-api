import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { StringValue } from "ms";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "24h") as StringValue;

export interface TokenPayload {
  userId: number;
  email: string;
  role: "user" | "admin";
}

export class AuthUtils {
  static generateToken(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      throw new Error("Token inválido ou expirado");
    }
  }
}
