import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type AdminTokenPayload = {
  role: "plan-admin";
  handle: string;
};

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET ?? "local-dev-secret";

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<void> {
    const valid = await bcrypt.compare(password, hash);
    if (!valid) {
      throw new UnauthorizedException("관리자 암호가 올바르지 않습니다.");
    }
  }

  signAdminToken(handle: string): string {
    return jwt.sign(
      {
        role: "plan-admin",
        handle
      } satisfies AdminTokenPayload,
      this.jwtSecret,
      { expiresIn: "7d" }
    );
  }

  verifyAdminToken(token: string, handle: string): void {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as AdminTokenPayload;
      if (payload.role !== "plan-admin" || payload.handle !== handle) {
        throw new UnauthorizedException("관리자 권한이 없습니다.");
      }
    } catch {
      throw new UnauthorizedException("관리자 권한이 없습니다.");
    }
  }
}

