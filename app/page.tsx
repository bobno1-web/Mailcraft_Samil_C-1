// app/page.tsx
// 랜딩(첫 화면)의 히어로(목업 ①). 무엇을 하는 앱인지 한눈에 보여 주고,
// 두 갈래로 보냅니다.
//  - [메일 작성 시작] → /compose (입력 → 초안 3종 → 점검·발송)
//  - [모범 메일 보기] → /models
// 히어로 아래 3칸은 '동작 방식 = 절대 원칙'을 설명합니다(없는 기능은 적지 않음).
// 상태가 없어 서버 컴포넌트입니다(no "use client", no state).

import Link from "next/link";

export default function Page() {
  return (
    <>
      <section className="mc-card mc-hero">
        <h1 className="mc-hero__title">
          내부 검토용 이메일 초안, 틀부터 점검까지
        </h1>
        <p className="mc-hero__lead">
          외부 AI 없이 정해 둔 틀을 규칙대로 조합합니다. 같은 입력이면 항상 같은
          결과가 나오고, 본문에는 작성자가 적은 내용만 담깁니다. 모든 결과물은
          발송 전 내부 검토용 초안입니다.
        </p>
        <div className="mc-actions">
          <Link className="mc-btn mc-btn--primary" href="/compose">
            메일 작성 시작
          </Link>
          <Link className="mc-btn" href="/models">
            모범 메일 보기
          </Link>
        </div>
      </section>

      {/* 3칸: 앱이 실제로 동작하는 방식(입력 → 초안 3종 → 점검) = 절대 원칙 */}
      <div className="mc-features">
        <div className="mc-feature">
          <h3>틀을 규칙대로 조합</h3>
          <p>
            수신자·톤·포함 문구를 고르면 정해 둔 템플릿으로 초안 3종을 만듭니다.
            외부 AI를 쓰지 않아 같은 입력이면 결과도 같습니다.
          </p>
        </div>
        <div className="mc-feature">
          <h3>없는 내용은 지어내지 않음</h3>
          <p>
            본문은 작성자가 입력한 사실에서만 나옵니다. 앱이 임의로 문장을
            덧붙이거나 내용을 추측하지 않습니다.
          </p>
        </div>
        <div className="mc-feature">
          <h3>발송 전 점검</h3>
          <p>
            체크리스트를 통과해야 복사·메일 열기로 넘어갑니다. 빠뜨린 항목을
            발송 전에 짚어 줍니다.
          </p>
        </div>
      </div>

      <p className="mc-hint">
        모든 메일은 내부 검토용 초안이며, 최종 발송 책임은 작성자에게 있습니다.
      </p>
    </>
  );
}
