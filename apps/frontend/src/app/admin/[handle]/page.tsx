"use client";

import { useParams } from "next/navigation";
import { AdminDashboard } from "../../../components/AdminDashboard";
import { PrivacyNotice } from "../../../components/PrivacyNotice";

export default function AdminPage() {
  const params = useParams<{ handle: string }>();

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">관리자 페이지</p>
        <h1>답변이 모이는 곳.</h1>
      </section>
      <PrivacyNotice />
      <AdminDashboard handle={params.handle} />
    </main>
  );
}

