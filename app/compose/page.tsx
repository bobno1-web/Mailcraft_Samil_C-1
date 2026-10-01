// app/compose/page.tsx
// compose 흐름(상태)을 관리하는 화면. 단계: ① 입력 → ② 초안 → (③ 점검: 루프 3 스텁).
// '내용'은 모두 data/·lib/ 에서 오고, 여기서는 '틀'과 단계 이동만 다룹니다.

"use client";

import { useState } from "react";
import Link from "next/link";
import Stepper from "../../components/Stepper";
import ComposeForm from "../../components/ComposeForm";
import DraftList from "../../components/DraftList";
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

  const makeDrafts = () => {
    setDrafts(generateDrafts(input));
    setStage(2);
  };

  const selectDraft = (draft: Draft) => {
    setSelected(draft);
    setStage(3);
  };

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
        <section className="mc-card">
          <h2>초안을 선택했습니다</h2>
          <p className="mc-hint">
            선택한 초안: <strong>{selected.title}</strong>
          </p>
          <article className="mc-draft">
            {selected.subject ? (
              <p className="mc-hint">제목: {selected.subject}</p>
            ) : null}
            <pre>{selected.body}</pre>
          </article>
          <p className="mc-hint">
            다음 단계(발송 전 점검)는 <strong>루프 3</strong>에서 구현됩니다.
          </p>
          <div className="mc-actions">
            <button
              type="button"
              className="mc-btn"
              onClick={() => setStage(2)}
            >
              이전(초안 다시 보기)
            </button>
            <button type="button" className="mc-btn mc-btn--primary" disabled>
              다음: 체크리스트 (루프 3) — 준비 중
            </button>
            <Link className="mc-btn" href="/">
              처음으로
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
