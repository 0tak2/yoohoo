import { Injectable } from "@nestjs/common";
import type { PlanRepository } from "./plan.repository.js";
import type { PlanRecord, PlanResults, ParticipantRecord } from "./plan.types.js";

@Injectable()
export class InMemoryPlanRepository implements PlanRepository {
  private readonly plans = new Map<string, PlanRecord>();
  private readonly participants = new Map<string, ParticipantRecord[]>();

  async createPlan(plan: PlanRecord): Promise<PlanRecord> {
    this.plans.set(plan.handle, plan);
    this.participants.set(plan.id, []);
    return plan;
  }

  async findActivePlanByHandle(handle: string): Promise<PlanRecord | null> {
    const plan = this.plans.get(handle);
    if (!plan || plan.deletedAt) {
      return null;
    }

    return plan;
  }

  async handleExists(handle: string): Promise<boolean> {
    return this.plans.has(handle);
  }

  async addParticipant(
    participant: ParticipantRecord
  ): Promise<ParticipantRecord> {
    const existing = this.participants.get(participant.planId) ?? [];
    existing.push(participant);
    this.participants.set(participant.planId, existing);
    return participant;
  }

  async listResults(handle: string): Promise<PlanResults | null> {
    const plan = await this.findActivePlanByHandle(handle);
    if (!plan) {
      return null;
    }

    return {
      plan: {
        id: plan.id,
        handle: plan.handle,
        title: plan.title,
        questions: plan.questions
      },
      participants: this.participants.get(plan.id) ?? []
    };
  }

  async softDeletePlan(handle: string): Promise<void> {
    const plan = this.plans.get(handle);
    if (plan) {
      this.plans.set(handle, {
        ...plan,
        deletedAt: new Date()
      });
    }
  }
}

