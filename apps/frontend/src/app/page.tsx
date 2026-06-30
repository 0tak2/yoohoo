import Link from "next/link";
import { PrivacyNotice } from "../components/PrivacyNotice";

export default function LandingPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">단체 대화방에 뿌리는 휴가 조율</p>
        <h1>여름 휴가 언제 같이가지?</h1>
        <p className="lead">
          링크 하나로 친구들의 가능한 날짜, 희망 숙박수, 예산과 의견을 모읍니다.
        </p>
        <div className="row">
          <Link href="/create">
            <button>계획 만들기</button>
          </Link>
        </div>
      </section>
      <PrivacyNotice />
    </main>
  );
}

