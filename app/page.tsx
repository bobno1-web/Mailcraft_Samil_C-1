// app/page.tsx
// 랜딩(첫 화면). 무엇을 하는 앱인지 짧게 소개하고, 두 갈래로 보냅니다.
//  - [메일 작성] → /compose (입력 → 초안 → 점검)
//  - [모범 메일 보기] → /models
// 상태가 없어 서버 컴포넌트입니다.

import Link from "next/link";

export default function Page() {
  return (
    <section className="mc-card mc-landing">
      <h2>내부 검토용 이메일 초안 도우미</h2>
      <p>
        정해 둔 틀을 규칙대로 조합해 <strong>이메일 초안</strong>을 만들고, 발송
        전 <strong>점검</strong>을 돕습니다. 외부 AI 없이 같은 입력이면 항상
        같은 결과가 나오며, 본문에는 작성자가 적은 내용만 들어갑니다(없는 내용은
        지어내지 않습니다).
      </p>
      <div className="mc-actions">
        <Link className="mc-btn mc-btn--primary" href="/compose">
          메일 작성
        </Link>
        <Link className="mc-btn" href="/models">
          모범 메일 보기
        </Link>
      </div>
    </section>
  );
}
