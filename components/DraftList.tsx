// components/DraftList.tsx
// 2단계(초안) 화면. generateDrafts() 결과(3종)를 보여 줍니다.
// 각 초안마다 '본문 복사'와 '이 초안 선택'(선택 저장 → 다음 단계)을 제공합니다.

"use client";

import type { Draft } from "../lib/types";

interface Props {
  drafts: Draft[];
  onBack: () => void;
  onSelect: (draft: Draft) => void;
}

export default function DraftList({ drafts, onBack, onSelect }: Props) {
  const copy = (draft: Draft) => {
    const header = draft.subject ? `제목: ${draft.subject}\n\n` : "";
    void navigator.clipboard?.writeText(`${header}${draft.body}`);
  };

  return (
    <section className="mc-card">
      <p className="mc-hint">
        같은 내용으로 배치가 다른 초안 {drafts.length}종입니다. 마음에 드는
        초안을 선택하세요.
      </p>

      {drafts.map((draft) => (
        <article key={draft.id} className="mc-draft">
          <h3>{draft.title}</h3>
          {draft.subject ? (
            <p className="mc-hint">제목: {draft.subject}</p>
          ) : null}
          <pre>{draft.body}</pre>
          <div className="mc-actions">
            <button
              type="button"
              className="mc-btn"
              onClick={() => copy(draft)}
            >
              본문 복사
            </button>
            <button
              type="button"
              className="mc-btn mc-btn--primary"
              onClick={() => onSelect(draft)}
            >
              이 초안 선택
            </button>
          </div>
        </article>
      ))}

      <div className="mc-actions">
        <button type="button" className="mc-btn" onClick={onBack}>
          이전(입력 수정)
        </button>
      </div>
    </section>
  );
}
