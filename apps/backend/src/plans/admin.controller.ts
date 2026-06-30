import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Res,
  UseGuards
} from "@nestjs/common";
import type { Response } from "express";
import { adminLoginSchema } from "@yoohoo/shared";
import { AdminGuard } from "./admin.guard.js";
import { PlansService } from "./plans.service.js";

@Controller("admin/plans")
export class AdminController {
  constructor(@Inject(PlansService) private readonly plansService: PlansService) {}

  @Post(":handle/login")
  async login(
    @Param("handle") handle: string,
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response
  ) {
    const { password } = adminLoginSchema.parse(body);
    const { token } = await this.plansService.loginAdmin(handle, password);

    response.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return { ok: true };
  }

  @Get(":handle/responses")
  @UseGuards(AdminGuard)
  getResponses(@Param("handle") handle: string) {
    return this.plansService.getAdminResponses(handle);
  }

  @Delete(":handle")
  @UseGuards(AdminGuard)
  @HttpCode(204)
  async deletePlan(@Param("handle") handle: string) {
    await this.plansService.deletePlan(handle);
  }
}
