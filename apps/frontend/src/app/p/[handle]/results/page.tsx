"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPlanResults, type PlanResults } from "../../../../lib/api";
import { PrivacyNotice } from "../../../../components/PrivacyNotice";

export default function PublicResultsPage() {
  const params = useParams<{ handle: string }>();
  const [results, setResults] = useState<PlanResults | null>(null);

  useEffect(() => {
    void fetchPlanResults(params.handle).then(setResults);
  }, [params.handle]);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">답변 현황</p>
        <h1>{results?.plan.title ?? "답변을 모으는 중"}</h1>
      </section>
      <PrivacyNotice />
      <section className="panel">
        {!results ? <p>불러오는 중입니다.</p> : null}
        {results && results.participants.length === 0 ? (
          <p className="lead">
            아직 다른 친구는 답변하지 않았어요. 톡방에 알려주세요.
          </p>
        ) : null}
        {results && results.participants.length > 0 ? (
          <ul className="list">
            {results.participants.map((participant) => (
              <li className="item" key={participant.id}>
                <h3>{participant.nickname}</h3>
                <p>희망 숙박수: {participant.desiredNights}박</p>
                <p>
                  가능 일정:{" "}
                  {participant.availabilityRanges
                    .map((range) => `${range.startDate}~${range.endDate}`)
                    .join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}

