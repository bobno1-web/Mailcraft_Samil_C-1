// components/ChecklistView.tsx
// 3단계(점검 → 발송 준비) 화면. data/checklist.ts 의 항목을 보여 주고 체크하게 합니다.
// kind 로 '앱 보조(assist)'와 '자가확인(self)'을 구분해 표시합니다.
//
// 게이트 규칙: 모든 항목 체크(isChecklistComplete) → 발송(복사·메일 열기) 활성.
// (발송 패널 구현은 루프3-A 에서 채웁니다. 지금은 계약/틀만 둡니다.)

"use client";

import { CHECKLIST, isChecklistComplete } from "../data/checklist";
import type { ComposeInput, Draft } from "../lib/types";

interface Props {
  /** 2단계에서 선택한 초안(발송 본문의 바탕). */
  draft: Draft;
  /** 1단계 입력(수신자 유형 등 보조 판단용). */
  input: ComposeInput;
  /** id→체크 여부. compose/page 가 소유합니다. */
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onBack: () => void;
}

export default function ChecklistView({
  draft,
  checked,
  onToggle,
  onBack,
}: Props) {
  const allDone = isChecklistComplete(checked);

  return (
    <section className="mc-card">
      <h2>발송 전 점검</h2>
      <p className="mc-hint">
        선택한 초안: <strong>{draft.title}</strong>
      </p>

      <ul className="mc-checklist">
        {CHECKLIST.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              id={item.id}
              checked={Boolean(checked[item.id])}
              onChange={() => onToggle(item.id)}
            />
            <div style={{ flex: 1 }}>
              <label htmlFor={item.id}>{item.label}</label>
              {item.hint ? <div className="mc-hint">{item.hint}</div> : null}
            </div>
            <span className="mc-kind">
              {item.kind === "assist" ? "앱 보조" : "자가확인"}
            </span>
          </li>
        ))}
      </ul>

      <p className="mc-gate-note">
        {allDone
          ? "점검 완료. 최종 발송 책임은 작성자에게 있습니다."
          : "모든 항목을 확인하면 복사·메일 열기가 활성화됩니다."}
      </p>

      <div className="mc-actions">
        <button type="button" className="mc-btn" onClick={onBack}>
          이전(초안 보기)
        </button>
      </div>
    </section>
  );
}
