// components/DraftList.tsx
// 2단계(초안 선택) 화면. generateDrafts() 결과(요점/정중/간결 3종)를 보여 줍니다.
// 상단에 '선택한 조건'(수신자·톤·포함 문구)을 뱃지로 되짚어 줍니다.
// 초안 미리보기는 흐르게(.mc-flow) 보여 주고, 최종 편집은 3단계(발송)에서 합니다.

"use client";

import {
  RECIPIENT_OPTIONS,
  TONE_OPTIONS,
  PHRASE_OPTIONS,
} from "../lib/options";
import type { ComposeInput, Draft } from "../lib/types";

interface Props {
  drafts: Draft[];
  input: ComposeInput;
  onSelect: (draft: Draft) => void;
}

const label = (
  list: ReadonlyArray<{ key: string; label: string }>,
  key: string,
) => list.find((o) => o.key === key)?.label ?? key;

export default function DraftList({ drafts, input, onSelect }: Props) {
  const conds = [
    label(RECIPIENT_OPTIONS, input.recipient),
    label(TONE_OPTIONS, input.tone),
    ...input.phrases.map((p) => label(PHRASE_OPTIONS, p)),
  ];

  return (
    <>
      <div className="mc-conds">
        <span className="mc-conds__label">선택한 조건</span>
        {conds.map((c, i) => (
          <span key={i} className="mc-badge mc-badge--plain">
            {c}
          </span>
        ))}
      </div>

      {drafts.map((draft, i) => (
        <article key={draft.id} className="mc-version">
          <div className="mc-version__head">
            <strong>{draft.title}</strong>
            {draft.badge ? (
              <span className="mc-badge">{draft.badge}</span>
            ) : null}
          </div>
          <p className="mc-version__body mc-flow">{draft.body}</p>
          <div className="mc-actions mc-actions--end">
            <button
              type="button"
              className={`mc-btn ${i === 0 ? "mc-btn--primary" : "mc-btn--ghost"}`}
              onClick={() => onSelect(draft)}
            >
              이 버전 선택 →
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
