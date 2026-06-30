"use client";

import { CreatePlanForm } from "../../components/CreatePlanForm";
import { PrivacyNotice } from "../../components/PrivacyNotice";

export default function CreatePlanPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">계획 만들기</p>
        <h1>톡방에 던질 링크를 만들어요.</h1>
      </section>
      <PrivacyNotice />
      <CreatePlanForm />
    </main>
  );
}

