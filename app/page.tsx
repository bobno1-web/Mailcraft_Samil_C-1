// app/page.tsx
// 전체 흐름(상태)을 관리하는 화면. compose 3단계: 입력 → 초안 → 점검.
// '내용'은 모두 data/·lib/ 에서 오고, 여기서는 '틀'과 단계 이동만 다룹니다.

"use client";

import { useState } from "react";
import Stepper from "../components/Stepper";
import ComposeForm from "../components/ComposeForm";
import DraftList from "../components/DraftList";
import ChecklistView from "../components/ChecklistView";
import { generateDrafts } from "../data/templates";
import type { ComposeInput, Draft } from "../lib/types";

const EMPTY_INPUT: ComposeInput = {
  recipient: "client",
  tone: "formal",
  phrases: [],
  subject: "",
  points: [],
  recipientName: "",
};

export default function Page() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [input, setInput] = useState<ComposeInput>(EMPTY_INPUT);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const makeDrafts = () => {
    setDrafts(generateDrafts(input));
    setStage(2);
  };

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <Stepper current={stage} />

      {stage === 1 && (
        <ComposeForm value={input} onChange={setInput} onSubmit={makeDrafts} />
      )}

      {stage === 2 && (
        <DraftList
          drafts={drafts}
          onBack={() => setStage(1)}
          onNext={() => setStage(3)}
        />
      )}

      {stage === 3 && (
        <ChecklistView
          checked={checked}
          onToggle={toggle}
          onBack={() => setStage(2)}
        />
      )}
    </>
  );
}
