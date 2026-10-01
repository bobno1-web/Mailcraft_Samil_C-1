// components/DraftList.tsx
// 2단계(초안) 화면. generateDrafts() 결과를 보여 줍니다. 복사 버튼 포함.

"use client";

import type { Draft } from "../lib/types";

interface Props {
  drafts: Draft[];
  onBack: () => void;
  onNext: () => void;
}

export default function DraftList({ drafts, onBack, onNext }: Props) {
  const copy = (draft: Draft) => {
    const text = `제목: ${draft.subject}\n\n${draft.body}`;
    void navigator.clipboard?.writeText(text);
  };

  return (
    <section className="mc-card">
      {drafts.map((draft) => (
        <article key={draft.id} className="mc-draft">
          <h3>{draft.title}</h3>
          <p className="mc-hint">제목: {draft.subject}</p>
          <pre>{draft.body}</pre>
          <div className="mc-actions">
            <button
              type="button"
              className="mc-btn"
              onClick={() => copy(draft)}
            >
              본문 복사
            </button>
          </div>
        </article>
      ))}

      <div className="mc-actions">
        <button type="button" className="mc-btn" onClick={onBack}>
          이전(입력 수정)
        </button>
        <button
          type="button"
          className="mc-btn mc-btn--primary"
          onClick={onNext}
        >
          발송 전 점검
        </button>
      </div>
    </section>
  );
}
