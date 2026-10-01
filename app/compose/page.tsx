// app/compose/page.tsx
// compose 흐름(상태)을 관리하는 화면. 단계: ① 입력 → ② 초안 → ③ 점검·발송.
// '내용'은 모두 data/·lib/ 에서 오고, 여기서는 '틀'과 단계 이동만 다룹니다.

"use client";

import { useState } from "react";
import Stepper from "../../components/Stepper";
import ComposeForm from "../../components/ComposeForm";
import DraftList from "../../components/DraftList";
import ChecklistView from "../../components/ChecklistView";
import { generateDrafts } from "../../data/templates";
import type { ComposeInput, Draft } from "../../lib/types";

const EMPTY_INPUT: ComposeInput = {
  recipient: "client",
  tone: "formal",
  phrases: [],
  content: "",
  recipientName: "",
  subject: "",
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
      <Stepper current={stage} />

      {stage === 1 && (
        <ComposeForm value={input} onChange={setInput} onSubmit={makeDrafts} />
      )}

      {stage === 2 && (
        <DraftList
          drafts={drafts}
          onBack={() => setStage(1)}
          onSelect={selectDraft}
        />
      )}

      {stage === 3 && selected && (
        <ChecklistView
          key={selected.id}
          draft={selected}
          input={input}
          checked={checked}
          onToggle={toggleChecked}
          onBack={() => setStage(2)}
        />
      )}
    </>
  );
}
