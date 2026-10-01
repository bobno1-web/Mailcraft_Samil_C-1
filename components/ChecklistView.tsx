// components/ChecklistView.tsx
// 3단계(점검) 화면. data/checklist.ts 의 항목을 보여 주고 체크하게 합니다.
// kind 로 '앱 보조(assist)'와 '자가확인(self)'을 구분해 표시합니다.

import { CHECKLIST } from "../data/checklist";

interface Props {
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onBack: () => void;
}

export default function ChecklistView({ checked, onToggle, onBack }: Props) {
  const allDone = CHECKLIST.every((item) => checked[item.id]);

  return (
    <section className="mc-card">
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

      <p className="mc-hint" style={{ marginTop: "16px" }}>
        {allDone
          ? "점검 완료. 최종 발송 책임은 작성자에게 있습니다."
          : "모든 항목을 확인해 주세요."}
      </p>

      <div className="mc-actions">
        <button type="button" className="mc-btn" onClick={onBack}>
          이전(초안 보기)
        </button>
      </div>
    </section>
  );
}
