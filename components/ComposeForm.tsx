// components/ComposeForm.tsx
// 1단계(입력) 화면. 화면은 '틀'만 담당하고, 선택지 내용은 lib/options.ts 에서 옵니다.

import {
  RECIPIENT_OPTIONS,
  TONE_OPTIONS,
  PHRASE_OPTIONS,
} from "../lib/options";
import type { ComposeInput, PhraseKey } from "../lib/types";

interface Props {
  value: ComposeInput;
  onChange: (next: ComposeInput) => void;
  onSubmit: () => void;
}

export default function ComposeForm({ value, onChange, onSubmit }: Props) {
  const togglePhrase = (key: PhraseKey) => {
    const on = value.phrases.includes(key);
    onChange({
      ...value,
      phrases: on
        ? value.phrases.filter((k) => k !== key)
        : [...value.phrases, key],
    });
  };

  return (
    <section className="mc-card">
      <div className="mc-field">
        <label className="mc-label" htmlFor="recipient">
          받는 사람 유형
        </label>
        <select
          id="recipient"
          className="mc-select"
          value={value.recipient}
          onChange={(e) =>
            onChange({
              ...value,
              recipient: e.target.value as ComposeInput["recipient"],
            })
          }
        >
          {RECIPIENT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mc-field">
        <label className="mc-label" htmlFor="tone">
          말투(톤)
        </label>
        <select
          id="tone"
          className="mc-select"
          value={value.tone}
          onChange={(e) =>
            onChange({ ...value, tone: e.target.value as ComposeInput["tone"] })
          }
        >
          {TONE_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mc-field">
        <span className="mc-label">포함 문구</span>
        <div className="mc-chips">
          {PHRASE_OPTIONS.map((o) => (
            <button
              type="button"
              key={o.key}
              className="mc-chip"
              data-on={value.phrases.includes(o.key)}
              onClick={() => togglePhrase(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mc-field">
        <label className="mc-label" htmlFor="recipientName">
          받는 분 이름(선택)
        </label>
        <input
          id="recipientName"
          className="mc-input"
          value={value.recipientName ?? ""}
          placeholder="예: 홍길동"
          onChange={(e) =>
            onChange({ ...value, recipientName: e.target.value })
          }
        />
      </div>

      <div className="mc-field">
        <label className="mc-label" htmlFor="subject">
          제목
        </label>
        <input
          id="subject"
          className="mc-input"
          value={value.subject}
          placeholder="예: [안내] 요청 자료 회신 기한"
          onChange={(e) => onChange({ ...value, subject: e.target.value })}
        />
      </div>

      <div className="mc-field">
        <label className="mc-label" htmlFor="points">
          전달할 내용(한 줄에 하나씩)
        </label>
        <textarea
          id="points"
          className="mc-textarea"
          value={value.points.join("\n")}
          placeholder={"요청하신 자료 초안 첨부\n검토 후 수정 의견 회신 요청"}
          onChange={(e) =>
            onChange({ ...value, points: e.target.value.split("\n") })
          }
        />
      </div>

      <div className="mc-actions">
        <button
          type="button"
          className="mc-btn mc-btn--primary"
          onClick={onSubmit}
        >
          초안 만들기
        </button>
      </div>
    </section>
  );
}
