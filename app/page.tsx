// app/page.tsx
// 랜딩(첫 화면, 목업 1쪽). 브랜드바 + 가운데 히어로 + 두 갈래 카드.
//  - [메일 작성] → /compose (입력 → 초안 → 점검·발송)
//  - [모범 메일 보기] → /models
// 상태가 없어 서버 컴포넌트입니다.

import Link from "next/link";
import { EnvelopeIcon, BookIcon, PencilIcon } from "../components/Icons";

export default function Page() {
  return (
    <>
      <header className="mc-brandbar">
        <span className="mc-brand">
          <span className="mc-logo">
            <EnvelopeIcon />
          </span>
          메일크래프트
        </span>
        <span className="mc-beta">내부 공유용 · 베타</span>
      </header>

      <section className="mc-hero">
        <span className="mc-hero__logo">
          <span className="mc-logo">
            <EnvelopeIcon />
          </span>
        </span>
        <h1 className="mc-hero__title">메일크래프트</h1>
        <p className="mc-hero__lead">
          상황에 맞는 톤으로 메일을 고르고,
          <br />
          보내기 전 체크리스트로 한 번 더 확인하세요.
        </p>
      </section>

      <div className="mc-home-cards">
        <Link className="mc-home-card" href="/models">
          <span className="mc-home-card__icon">
            <BookIcon />
          </span>
          <h2>모범 메일 보기</h2>
          <p>잘 쓴 메일 3가지와 “왜 모범인지” 이유까지</p>
          <span className="mc-home-card__cta">살펴보기 →</span>
        </Link>

        <Link className="mc-home-card mc-home-card--accent" href="/compose">
          <span className="mc-home-card__icon">
            <PencilIcon />
          </span>
          <h2>메일 작성</h2>
          <p>톤·수신자를 고르면 초안을 만들어 드려요</p>
          <span className="mc-home-card__cta">시작하기 →</span>
        </Link>
      </div>
    </>
  );
}
