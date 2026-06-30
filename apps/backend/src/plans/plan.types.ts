import type {
  CustomAnswerInput,
  QuestionType,
  SubmitParticipantResponseInput
} from "@yoohoo/shared";

export type PlanQuestion = {
  id: string;
  label: string;
  type: QuestionType;
  sortOrder: number;
};

export type PlanRecord = {
  id: string;
  handle: string;
  title: string;
  adminPasswordHash: string;
  questions: PlanQuestion[];
  deletedAt: Date | null;
  createdAt: Date;
};

export type ParticipantRecord = {
  id: string;
  planId: string;
  nickname: string;
  desiredNights: number;
  availabilityRanges: SubmitParticipantResponseInput["availabilityRanges"];
  answers: CustomAnswerInput[];
  createdAt: Date;
};

export type PlanResults = {
  plan: Pick<PlanRecord, "id" | "handle" | "title"> & {
    questions: PlanQuestion[];
  };
  participants: ParticipantRecord[];
};

