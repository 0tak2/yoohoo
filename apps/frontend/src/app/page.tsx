import Link from "next/link";
import { PrivacyNotice } from "../components/PrivacyNotice";

export default function LandingPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">우리들의 휴가를 비튼 이름입니다.</p>
        <h1>유리들의 후가</h1>
        <p className="lead">
          단체 대화방에 공유할 수 있는 휴가 일정 조율 링크를 만듭니다.
          가능한 날짜, 희망 숙박수, 예산과 의견을 한 곳에서 모읍니다.
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
