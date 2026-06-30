import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomBytes, randomUUID } from "node:crypto";
import type {
  CreatePlanInput,
  SubmitParticipantResponseInput
} from "@yoohoo/shared";
import { AuthService } from "./auth.service.js";
import { PLAN_REPOSITORY } from "./plan-repository.token.js";
import type { PlanRepository } from "./plan.repository.js";
import type { PlanQuestion, PlanResults } from "./plan.types.js";

@Injectable()
export class PlansService {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: PlanRepository,
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {}

  async createPlan(input: CreatePlanInput) {
    const handle = await this.generateUniqueHandle();
    const id = randomUUID();
    const questions: PlanQuestion[] = input.questions.map((question, index) => ({
      id: randomUUID(),
      label: question.label,
      type: question.type,
      sortOrder: index
    }));

    const plan = await this.planRepository.createPlan({
      id,
      handle,
      title: input.title,
      adminPasswordHash: await this.authService.hashPassword(input.adminPassword),
      questions,
      deletedAt: null,
      createdAt: new Date()
    });

    return {
      id: plan.id,
      handle: plan.handle,
      title: plan.title,
      shareUrl: `/p/${plan.handle}`,
      adminUrl: `/admin/${plan.handle}`
    };
  }

  async getPublicPlan(handle: string) {
    const plan = await this.getActivePlan(handle);
    return {
      id: plan.id,
      handle: plan.handle,
      title: plan.title,
      questions: plan.questions
    };
  }

  async submitResponse(handle: string, input: SubmitParticipantResponseInput) {
    const plan = await this.getActivePlan(handle);
    this.assertAnswersMatchQuestions(plan.questions, input.answers);

    const participant = await this.planRepository.addParticipant({
      id: randomUUID(),
      planId: plan.id,
      nickname: input.nickname,
      desiredNights: input.desiredNights,
      availabilityRanges: input.availabilityRanges,
      answers: input.answers,
      createdAt: new Date()
    });

    return {
      participant
    };
  }

  async getResults(handle: string): Promise<PlanResults> {
    const results = await this.planRepository.listResults(handle);
    if (!results) {
      throw new NotFoundException("계획을 찾을 수 없습니다.");
    }

    return results;
  }

  async loginAdmin(handle: string, password: string) {
    const plan = await this.getActivePlan(handle);
    await this.authService.verifyPassword(password, plan.adminPasswordHash);

    return {
      token: this.authService.signAdminToken(handle)
    };
  }

  async deletePlan(handle: string) {
    await this.getActivePlan(handle);
    await this.planRepository.softDeletePlan(handle);
  }

  async getAdminResponses(handle: string) {
    const results = await this.getResults(handle);
    const calendarEvents = results.participants.flatMap((participant, index) =>
      participant.availabilityRanges.map((range) => ({
        id: `${participant.id}:${range.startDate}:${range.endDate}`,
        participantId: participant.id,
        participantNickname: participant.nickname,
        start: range.startDate,
        end: range.endDate,
        color: palette[index % palette.length]
      }))
    );

    return {
      ...results,
      calendarEvents
    };
  }

  private async getActivePlan(handle: string) {
    const plan = await this.planRepository.findActivePlanByHandle(handle);
    if (!plan) {
      throw new NotFoundException("계획을 찾을 수 없습니다.");
    }

    return plan;
  }

  private async generateUniqueHandle() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const handle = randomBytes(8).toString("base64url").slice(0, 10);
      if (!(await this.planRepository.handleExists(handle))) {
        return handle;
      }
    }

    throw new BadRequestException("공유 URL을 생성하지 못했습니다.");
  }

  private assertAnswersMatchQuestions(
    questions: PlanQuestion[],
    answers: SubmitParticipantResponseInput["answers"]
  ) {
    const questionsById = new Map(
      questions.map((question) => [question.id, question])
    );

    for (const answer of answers) {
      const question = questionsById.get(answer.questionId);
      if (!question || question.type !== answer.type) {
        throw new BadRequestException("질문 답변 타입이 올바르지 않습니다.");
      }
    }
  }
}

const palette = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#d97706",
  "#0891b2"
];
