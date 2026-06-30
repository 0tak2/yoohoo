import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import {
  createPlanSchema,
  submitParticipantResponseSchema
} from "@yoohoo/shared";
import { PlansService } from "./plans.service.js";

@Controller("plans")
export class PlansController {
  constructor(@Inject(PlansService) private readonly plansService: PlansService) {}

  @Post()
  createPlan(@Body() body: unknown) {
    return this.plansService.createPlan(createPlanSchema.parse(body));
  }

  @Get(":handle")
  getPublicPlan(@Param("handle") handle: string) {
    return this.plansService.getPublicPlan(handle);
  }

  @Post(":handle/responses")
  submitResponse(@Param("handle") handle: string, @Body() body: unknown) {
    return this.plansService.submitResponse(
      handle,
      submitParticipantResponseSchema.parse(body)
    );
  }

  @Get(":handle/results")
  getResults(@Param("handle") handle: string) {
    return this.plansService.getResults(handle);
  }
}
