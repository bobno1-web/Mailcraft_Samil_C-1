// app/models/page.tsx
// 모범 메일 모음 화면(목업 2쪽). data/models.ts 의 MODEL_MAILS 를 그대로 보여 줍니다.
// compose 3단계(입력→초안→점검)와 독립된 '참고용' 페이지입니다.

import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import ModelMailList from "../../components/ModelMailList";
import { MODEL_MAILS } from "../../data/models";

export const metadata: Metadata = {
  title: "모범 메일 — 메일크래프트",
  description: "팀이 합의한 모범 메일 예시 모음(왜 모범인가 포함).",
};

export default function ModelsPage() {
  return (
    <>
      <PageHeader
        title="모범 메일"
        status={`잘 쓴 메일과 그 이유 · ${MODEL_MAILS.length}`}
        backLabel="홈"
        backHref="/"
      />
      <ModelMailList />
    </>
  );
}
