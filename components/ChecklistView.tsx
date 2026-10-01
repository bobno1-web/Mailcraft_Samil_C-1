// components/ChecklistView.tsx
// 3단계(점검 → 발송 준비) 화면. data/checklist.ts 의 항목을 보여 주고 체크하게 합니다.
// kind 로 '앱 보조(assist)'와 '자가확인(self)'을 구분해 표시합니다.
//
// 게이트 규칙: 모든 항목 체크(isChecklistComplete) → 발송(복사·메일 열기) 활성.
// 발송 패널: 최종 본문/제목/수신인/참조/마감을 모아 '복사' 또는 'mailto'로 내보냅니다.
//  - 본문은 이 화면의 <textarea> 가 '단일 출처'입니다(초안 본문으로 1회 초기화).
//  - 복사 텍스트와 mailto 본문은 assembleFinalText 로 '똑같이' 만듭니다(어긋남 방지).
//  - 외부 API/네트워크 없음. 화면에 나가는 값은 작성자가 입력한 것뿐입니다(날조 금지).

"use client";

import { useState } from "react";
import { CHECKLIST, isChecklistComplete } from "../data/checklist";
import {
  assembleFinalText,
  buildMailtoUrl,
  invalidAddresses,
} from "../data/send";
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
  // 발송 폼 로컬 상태.
  // page 가 draft 마다 key 를 바꿔 remount 하므로 아래 초기값은 '1회 초기화'가 됩니다.
  const [body, setBody] = useState<string>(draft.body);
  const [subject, setSubject] = useState<string>(draft.subject ?? "");
  const [to, setTo] = useState<string>("");
  const [cc, setCc] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const allDone = isChecklistComplete(checked);

  // 복사·mailto 양쪽에서 쓰는 '동일한' 최종 텍스트(여기 한 곳에서만 조립).
  const finalText = assembleFinalText({ subject, body, deadline });

  // 앱 보조 경고(비차단): '@' 없는 주소 토큰 안내. 버튼을 막지는 않습니다.
  const badTo = invalidAddresses(to);
  const badCc = invalidAddresses(cc);

  const copy = () => {
    void navigator.clipboard?.writeText(finalText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const openMail = () => {
    // mailto 본문 = finalText (복사본과 글자 하나까지 동일).
    window.location.href = buildMailtoUrl({ to, cc, subject, body: finalText });
  };

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

      {/* ── 발송 준비 패널 ── */}
      <div className="mc-sendform">
        <div className="mc-field">
          <label className="mc-label" htmlFor="send-body">
            최종 메일 본문
          </label>
          <textarea
            id="send-body"
            className="mc-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <p className="mc-hint">
            이 본문이 복사·메일 열기에 쓰이는 &apos;최종본&apos;입니다. 필요하면
            직접 다듬어 주세요.
          </p>
        </div>

        <div className="mc-field">
          <label className="mc-label" htmlFor="send-subject">
            제목
          </label>
          <input
            id="send-subject"
            className="mc-input"
            value={subject}
            placeholder="예: [안내] 요청 자료 회신 기한"
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mc-grid-2">
          <div className="mc-field">
            <label className="mc-label" htmlFor="send-to">
              받는 사람(to)
            </label>
            <input
              id="send-to"
              className="mc-input"
              value={to}
              placeholder="예: a@회사.com, b@회사.com"
              onChange={(e) => setTo(e.target.value)}
            />
            {badTo.length > 0 ? (
              <p className="mc-warn">
                받는 사람 주소에 &apos;@&apos; 가 없는 항목이 있습니다:{" "}
                {badTo.join(", ")}
              </p>
            ) : null}
          </div>

          <div className="mc-field">
            <label className="mc-label" htmlFor="send-cc">
              참조(cc)
            </label>
            <input
              id="send-cc"
              className="mc-input"
              value={cc}
              placeholder="예: c@회사.com"
              onChange={(e) => setCc(e.target.value)}
            />
            {badCc.length > 0 ? (
              <p className="mc-warn">
                참조 주소에 &apos;@&apos; 가 없는 항목이 있습니다:{" "}
                {badCc.join(", ")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mc-field">
          <label className="mc-label" htmlFor="send-deadline">
            마감(회신 기한) · 선택
          </label>
          <input
            id="send-deadline"
            className="mc-input"
            value={deadline}
            placeholder="예: 10/15(수) 18시"
            onChange={(e) => setDeadline(e.target.value)}
          />
          <p className="mc-hint">
            적어 두면 본문 맨 끝에 &apos;회신 기한: …&apos; 한 줄로 덧붙습니다.
            (본문 상자는 그대로 둡니다)
          </p>
        </div>

        <p className="mc-gate-note">
          {allDone
            ? "점검 완료. 최종 발송 책임은 작성자에게 있습니다."
            : "모든 점검 항목을 체크해야 복사·메일 열기가 활성화됩니다."}
        </p>
        {copied ? <p className="mc-hint">복사됨</p> : null}

        <div className="mc-actions">
          <button type="button" className="mc-btn" onClick={onBack}>
            이전(초안 보기)
          </button>
          <button
            type="button"
            className="mc-btn"
            onClick={copy}
            disabled={!allDone}
          >
            본문 복사
          </button>
          <button
            type="button"
            className="mc-btn mc-btn--primary"
            onClick={openMail}
            disabled={!allDone}
          >
            메일 열기
          </button>
        </div>
      </div>
    </section>
  );
}
