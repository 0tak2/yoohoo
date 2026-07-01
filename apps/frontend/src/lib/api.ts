import type {
  CreatePlanInput,
  QuestionType,
  SubmitParticipantResponseInput
} from "@yoohoo/shared";
import { getApiBaseUrl } from "./api-base-url";

const apiBaseUrl = getApiBaseUrl();

export type PublicPlan = {
  id: string;
  handle: string;
  title: string;
  questions: Array<{
    id: string;
    label: string;
    type: QuestionType;
    sortOrder: number;
  }>;
};

export type Participant = {
  id: string;
  nickname: string;
  desiredNights: number;
  availabilityRanges: Array<{
    startDate: string;
    endDate: string;
  }>;
};

export type PlanResults = {
  plan: PublicPlan;
  participants: Participant[];
};

export type AdminCalendarEvent = {
  id: string;
  participantId: string;
  participantNickname: string;
  start: string;
  end: string;
  color: string;
};

export type AdminResponses = PlanResults & {
  calendarEvents: AdminCalendarEvent[];
};

export async function createPlan(input: CreatePlanInput) {
  return request<{ id: string; handle: string; title: string; shareUrl: string; adminUrl: string }>(
    "/plans",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function fetchPublicPlan(handle: string) {
  return request<PublicPlan>(`/plans/${handle}`);
}

export async function submitParticipantResponse(
  handle: string,
  input: SubmitParticipantResponseInput
) {
  return request<{ participant: Participant }>(`/plans/${handle}/responses`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function fetchPlanResults(handle: string) {
  return request<PlanResults>(`/plans/${handle}/results`);
}

export async function adminLogin(handle: string, password: string) {
  return request<{ ok: true }>(`/admin/plans/${handle}/login`, {
    method: "POST",
    body: JSON.stringify({ password })
  });
}

export async function fetchAdminResponses(handle: string) {
  return request<AdminResponses>(`/admin/plans/${handle}/responses`);
}

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`요청에 실패했습니다. (${response.status})`);
  }

  return (await response.json()) as T;
}
