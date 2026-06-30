import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service.js";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const rawHandle = request.params["handle"];
    const handle = Array.isArray(rawHandle) ? rawHandle[0] : rawHandle;
    const token = this.readCookie(request.headers.cookie, "admin_token");

    if (!handle || !token) {
      throw new UnauthorizedException("관리자 권한이 없습니다.");
    }

    this.authService.verifyAdminToken(token, handle);
    return true;
  }

  private readCookie(cookieHeader: string | undefined, name: string) {
    const cookies = cookieHeader?.split(";").map((cookie) => cookie.trim()) ?? [];
    const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
  }
}
