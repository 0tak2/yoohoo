"use client";

import { useParams } from "next/navigation";
import { ParticipantResponseForm } from "../../../components/ParticipantResponseForm";
import { PrivacyNotice } from "../../../components/PrivacyNotice";

export default function ParticipantPage() {
  const params = useParams<{ handle: string }>();

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">친구 답변</p>
        <h1>가능한 날을 알려주세요.</h1>
      </section>
      <PrivacyNotice />
      <ParticipantResponseForm handle={params.handle} />
    </main>
  );
}

