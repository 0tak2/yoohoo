import { Module } from "@nestjs/common";
import { AdminController } from "./plans/admin.controller.js";
import { AuthService } from "./plans/auth.service.js";
import { InMemoryPlanRepository } from "./plans/in-memory-plan.repository.js";
import { PLAN_REPOSITORY } from "./plans/plan-repository.token.js";
import { PlansController } from "./plans/plans.controller.js";
import { PlansService } from "./plans/plans.service.js";

@Module({
  controllers: [PlansController, AdminController],
  providers: [
    PlansService,
    AuthService,
    {
      provide: PLAN_REPOSITORY,
      useClass: InMemoryPlanRepository
    }
  ]
})
export class AppModule {}

