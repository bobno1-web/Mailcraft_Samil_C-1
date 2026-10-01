// app/compose/page.tsx
// compose 흐름(상태)을 관리하는 화면. 단계: ① 입력 → ② 초안 → ③ 점검·발송.
// '내용'은 모두 data/·lib/ 에서 오고, 여기서는 '틀'과 단계 이동만 다룹니다.
// 각 단계 상단은 PageHeader(← 뒤로 · 제목 · 진행상태)로 통일합니다.

"use client";

import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import ComposeForm from "../../components/ComposeForm";
import DraftList from "../../components/DraftList";
import ChecklistView from "../../components/ChecklistView";
import { generateDrafts } from "../../data/templates";
import type { ComposeInput, Draft } from "../../lib/types";

const EMPTY_INPUT: ComposeInput = {
  recipient: "client",
  tone: "formal",
  phrases: [],
  request: {
    target: "",
    due: "",
    format: "",
    replyMethod: "reply",
    note: "",
  },
};

export default function ComposePage() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [input, setInput] = useState<ComposeInput>(EMPTY_INPUT);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selected, setSelected] = useState<Draft | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const makeDrafts = () => {
    setDrafts(generateDrafts(input));
    setStage(2);
  };

  const selectDraft = (draft: Draft) => {
    setSelected(draft);
    setChecked({}); // 초안을 (다시) 고르면 점검은 처음부터.
    setStage(3);
  };

  const toggleChecked = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {stage === 1 && (
        <>
          <PageHeader
            title="메일 작성"
            status="1 / 3 · 조건 선택"
            backLabel="홈"
            backHref="/"
          />
          <ComposeForm
            value={input}
            onChange={setInput}
            onSubmit={makeDrafts}
          />
        </>
      )}

      {stage === 2 && (
        <>
          <PageHeader
            title="초안 선택"
            status="2 / 3 · 마음에 드는 버전 고르기"
            backLabel="작성"
            onBack={() => setStage(1)}
          />
          <DraftList drafts={drafts} input={input} onSelect={selectDraft} />
        </>
      )}

      {stage === 3 && selected && (
        <>
          <PageHeader
            title="확인 후 발송"
            status="3 / 3 · 보내기 전 점검"
            backLabel="초안"
            onBack={() => setStage(2)}
          />
          <ChecklistView
            key={selected.id}
            draft={selected}
            input={input}
            checked={checked}
            onToggle={toggleChecked}
          />
        </>
      )}
    </>
  );
}
