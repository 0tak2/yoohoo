import type { PlanRecord, PlanResults, ParticipantRecord } from "./plan.types.js";

export interface PlanRepository {
  createPlan(plan: PlanRecord): Promise<PlanRecord>;
  findActivePlanByHandle(handle: string): Promise<PlanRecord | null>;
  handleExists(handle: string): Promise<boolean>;
  addParticipant(participant: ParticipantRecord): Promise<ParticipantRecord>;
  listResults(handle: string): Promise<PlanResults | null>;
  softDeletePlan(handle: string): Promise<void>;
}

