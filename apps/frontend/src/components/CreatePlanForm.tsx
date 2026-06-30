"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { createPlanSchema, type CreatePlanInput } from "@yoohoo/shared";
import { createPlan } from "../lib/api";

type CreatedPlan = Awaited<ReturnType<typeof createPlan>>;
type CreatePlanFormInput = z.input<typeof createPlanSchema>;

export function CreatePlanForm() {
  const [createdPlan, setCreatedPlan] = useState<CreatedPlan | null>(null);
  const form = useForm<CreatePlanFormInput, unknown, CreatePlanInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      title: "여름 휴가 언제 같이가지?",
      adminPassword: "",
      questions: []
    }
  });
  const questions = useFieldArray({
    control: form.control,
    name: "questions"
  });

  async function onSubmit(input: CreatePlanInput) {
    const plan = await createPlan(input);
    setCreatedPlan(plan);
  }

  return (
    <form className="panel" onSubmit={form.handleSubmit(onSubmit)}>
      <label>
        계획 이름
        <input {...form.register("title")} />
      </label>
      <label>
        관리자 암호
        <input type="password" {...form.register("adminPassword")} />
      </label>
      <section className="grid">
        <h2>추가 질문</h2>
        {questions.fields.map((field, index) => (
          <div className="two-columns" key={field.id}>
            <label>
              질문
              <input {...form.register(`questions.${index}.label`)} />
            </label>
            <label>
              답변 타입
              <select {...form.register(`questions.${index}.type`)}>
                <option value="boolean">Bool</option>
                <option value="number">Number</option>
                <option value="string">String</option>
              </select>
            </label>
            <button
              className="secondary"
              type="button"
              onClick={() => questions.remove(index)}
            >
              질문 삭제
            </button>
          </div>
        ))}
        <div className="row">
          <button
            className="secondary"
            type="button"
            onClick={() => questions.append({ label: "", type: "string" })}
          >
            질문 추가
          </button>
        </div>
      </section>
      {form.formState.errors.root ? (
        <p className="error">{form.formState.errors.root.message}</p>
      ) : null}
      <button disabled={form.formState.isSubmitting} type="submit">
        계획 만들기
      </button>
      {createdPlan ? (
        <section className="item">
          <h3>공유 URL이 생겼어요</h3>
          <p>톡방 공유: {window.location.origin + createdPlan.shareUrl}</p>
          <p>관리자: {window.location.origin + createdPlan.adminUrl}</p>
        </section>
      ) : null}
    </form>
  );
}
