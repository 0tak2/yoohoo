"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import {
  type CustomAnswerInput,
  submitParticipantResponseSchema,
  type SubmitParticipantResponseInput
} from "@yoohoo/shared";
import { fetchPublicPlan, submitParticipantResponse, type PublicPlan } from "../lib/api";

type ParticipantResponseFormInput = z.input<typeof submitParticipantResponseSchema>;

export function ParticipantResponseForm({ handle }: { handle: string }) {
  const [plan, setPlan] = useState<PublicPlan | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<
    ParticipantResponseFormInput,
    unknown,
    SubmitParticipantResponseInput
  >({
    resolver: zodResolver(submitParticipantResponseSchema),
    defaultValues: {
      nickname: "",
      desiredNights: 2,
      availabilityRanges: [{ startDate: "", endDate: "" }],
      answers: []
    }
  });
  const ranges = useFieldArray({
    control: form.control,
    name: "availabilityRanges"
  });

  useEffect(() => {
    void fetchPublicPlan(handle).then((loadedPlan) => {
      setPlan(loadedPlan);
      form.setValue(
        "answers",
        loadedPlan.questions.map((question) => ({
          questionId: question.id,
          type: question.type,
          value:
            question.type === "boolean"
              ? false
              : question.type === "number"
                ? 0
                : ""
        })) as CustomAnswerInput[]
      );
    });
  }, [form, handle]);

  async function onSubmit(input: SubmitParticipantResponseInput) {
    await submitParticipantResponse(handle, input);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="panel">
        <p className="success">답변이 저장됐어요.</p>
        <a href={`/p/${handle}/results`}>
          <button>다른 사람 답변 보기</button>
        </a>
      </section>
    );
  }

  return (
    <form className="panel" onSubmit={form.handleSubmit(onSubmit)}>
      <h2>{plan?.title ?? "계획을 불러오는 중"}</h2>
      <label>
        닉네임
        <input {...form.register("nickname")} />
      </label>
      <label>
        희망 숙박수
        <input type="number" {...form.register("desiredNights", { valueAsNumber: true })} />
      </label>
      <section className="grid">
        <h3>가능한 일정</h3>
        {ranges.fields.map((field, index) => (
          <div className="two-columns" key={field.id}>
            <label>
              시작일
              <input type="date" {...form.register(`availabilityRanges.${index}.startDate`)} />
            </label>
            <label>
              종료일
              <input type="date" {...form.register(`availabilityRanges.${index}.endDate`)} />
            </label>
            <button
              className="secondary"
              type="button"
              onClick={() => ranges.remove(index)}
            >
              일정 삭제
            </button>
          </div>
        ))}
        <button
          className="secondary"
          type="button"
          onClick={() => ranges.append({ startDate: "", endDate: "" })}
        >
          일정 추가
        </button>
      </section>
      <section className="grid">
        <h3>추가 질문</h3>
        {plan?.questions.map((question, index) => (
          <label key={question.id}>
            {question.label}
            <input type="hidden" {...form.register(`answers.${index}.questionId`)} />
            <input type="hidden" {...form.register(`answers.${index}.type`)} />
            {question.type === "boolean" ? (
              <select
                {...form.register(`answers.${index}.value`, {
                  setValueAs: (value) => value === "true"
                })}
              >
                <option value="false">아니오</option>
                <option value="true">예</option>
              </select>
            ) : null}
            {question.type === "number" ? (
              <input
                type="number"
                {...form.register(`answers.${index}.value`, { valueAsNumber: true })}
              />
            ) : null}
            {question.type === "string" ? (
              <textarea {...form.register(`answers.${index}.value`)} />
            ) : null}
          </label>
        ))}
      </section>
      <button disabled={form.formState.isSubmitting || !plan} type="submit">
        답변 제출
      </button>
    </form>
  );
}
