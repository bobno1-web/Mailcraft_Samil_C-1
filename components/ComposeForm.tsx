// components/ComposeForm.tsx
// 1단계(입력) 화면. v2: '메모 한 칸' 대신 자료 요청 구조화 필드로 입력받습니다.
// 화면은 '틀'만, 선택지 내용은 lib/options.ts 에서 옵니다.
//  - 대상·기한은 필수(둘 다 채워야 '메일 만들기' 활성)
//  - 톤은 격식/친근 2개(COMPOSE_TONE_OPTIONS), 간결은 변형(초안)으로 이동

"use client";

import {
  RECIPIENT_OPTIONS,
  COMPOSE_TONE_OPTIONS,
  REPLY_METHOD_OPTIONS,
  PHRASE_OPTIONS,
} from "../lib/options";
import type {
  ComposeInput,
  PhraseKey,
  RecipientKey,
  ToneKey,
  ReplyMethodKey,
  RequestFields,
} from "../lib/types";

interface Props {
  value: ComposeInput;
  onChange: (next: ComposeInput) => void;
  onSubmit: () => void;
}

export default function ComposeForm({ value, onChange, onSubmit }: Props) {
  const setReq = (patch: Partial<RequestFields>) =>
    onChange({ ...value, request: { ...value.request, ...patch } });

  const togglePhrase = (key: PhraseKey) => {
    const on = value.phrases.includes(key);
    onChange({
      ...value,
      phrases: on
        ? value.phrases.filter((k) => k !== key)
        : [...value.phrases, key],
    });
  };

  const canSubmit =
    value.request.target.trim().length > 0 &&
    value.request.due.trim().length > 0;

  return (
    <>
      <div className="mc-actions mc-actions--end">
        <button
          type="button"
          className="mc-btn mc-btn--primary"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          메일 만들기 →
        </button>
      </div>

      <section className="mc-card">
        <p className="mc-hint" style={{ marginTop: 0 }}>
          지금은 <strong>자료 요청</strong> 메일 전용입니다. 필요한 항목만
          채우면 초안 3종(요점·정중·간결)을 만들어 드려요.
        </p>

        {/* ① 자료 요청 내용 */}
        <div className="mc-section">
          <div className="mc-section__label">
            ① 요청 내용 <span className="mc-sub">— 자료 요청 전용</span>
          </div>

          <div className="mc-grid-2">
            <div className="mc-field">
              <label className="mc-label" htmlFor="req-target">
                대상 <span style={{ color: "var(--warn)" }}>*</span>
              </label>
              <input
                id="req-target"
                className="mc-input"
                value={value.request.target}
                placeholder="예: 재고자산 조회서"
                onChange={(e) => setReq({ target: e.target.value })}
              />
            </div>
            <div className="mc-field">
              <label className="mc-label" htmlFor="req-due">
                기한 <span style={{ color: "var(--warn)" }}>*</span>
              </label>
              <input
                id="req-due"
                className="mc-input"
                value={value.request.due}
                placeholder="예: 6월 30일"
                onChange={(e) => setReq({ due: e.target.value })}
              />
            </div>
          </div>

          <div className="mc-grid-2">
            <div className="mc-field">
              <label className="mc-label" htmlFor="req-format">
                형식 <span className="mc-sub">(선택)</span>
              </label>
              <input
                id="req-format"
                className="mc-input"
                value={value.request.format ?? ""}
                placeholder="예: PDF"
                onChange={(e) => setReq({ format: e.target.value })}
              />
            </div>
            <div className="mc-field">
              <span className="mc-label">회신 방법</span>
              <div className="mc-pills">
                {REPLY_METHOD_OPTIONS.map((o) => (
                  <button
                    type="button"
                    key={o.key}
                    className="mc-pill"
                    data-on={value.request.replyMethod === o.key}
                    aria-pressed={value.request.replyMethod === o.key}
                    onClick={() =>
                      setReq({ replyMethod: o.key as ReplyMethodKey })
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mc-field">
            <label className="mc-label" htmlFor="req-note">
              비고 <span className="mc-sub">(선택)</span>
            </label>
            <input
              id="req-note"
              className="mc-input"
              value={value.request.note ?? ""}
              placeholder="예: 회신 시 담당자 성함을 함께 기재 부탁드립니다."
              onChange={(e) => setReq({ note: e.target.value })}
            />
          </div>
        </div>

        {/* ② 수신자 */}
        <div className="mc-section">
          <div className="mc-section__label">② 수신자</div>
          <div className="mc-pills">
            {RECIPIENT_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.key}
                className="mc-pill"
                data-on={value.recipient === o.key}
                aria-pressed={value.recipient === o.key}
                onClick={() =>
                  onChange({ ...value, recipient: o.key as RecipientKey })
                }
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* ③ 톤 (격식/친근) */}
        <div className="mc-section">
          <div className="mc-section__label">③ 톤</div>
          <div className="mc-pills">
            {COMPOSE_TONE_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.key}
                className="mc-pill"
                data-on={value.tone === o.key}
                aria-pressed={value.tone === o.key}
                onClick={() => onChange({ ...value, tone: o.key as ToneKey })}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* ④ 포함 문구 */}
        <div className="mc-section">
          <div className="mc-section__label">
            ④ 포함 문구 <span className="mc-sub">(선택)</span>
          </div>
          <div className="mc-chips">
            {PHRASE_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.key}
                className="mc-chip"
                data-on={value.phrases.includes(o.key)}
                aria-pressed={value.phrases.includes(o.key)}
                onClick={() => togglePhrase(o.key)}
              >
                + {o.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
