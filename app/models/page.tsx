// app/models/page.tsx
// 모범 메일 모음 화면. data/models.ts 의 MODEL_MAILS 를 그대로 보여 줍니다.
// compose 3단계(입력→초안→점검)와 독립된 '참고용' 페이지입니다.

import type { Metadata } from "next";
import Link from "next/link";
import ModelMailList from "../../components/ModelMailList";

export const metadata: Metadata = {
  title: "모범 메일 — 메일크래프트",
  description: "팀이 합의한 모범 메일 예시 모음(왜 모범인가 포함).",
};

export default function ModelsPage() {
  return (
    <>
      <h2>모범 메일</h2>
      <p className="mc-hint">
        팀이 &quot;이렇게 쓰면 좋다&quot;고 합의한 메일 예시입니다. 각 메일에는
        &quot;왜 모범인가&quot;가 함께 적혀 있습니다.
      </p>

      <ModelMailList />

      <div className="mc-actions">
        <Link className="mc-btn" href="/">
          ← 작성으로 돌아가기
        </Link>
      </div>
    </>
  );
}
