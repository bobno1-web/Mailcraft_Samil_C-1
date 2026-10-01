// components/ChecklistView.tsx
// 3단계(확인 후 발송) 화면. 목업 기준 2단 구성:
//   왼쪽 '최종 메일' : 수신인/참조/마감 + 본문(mailbox, 편집 가능)
//   오른쪽 '보내기 전 확인' : 체크리스트 + 게이트 버튼
//
// 게이트: 모든 항목 체크(isChecklistComplete) → '복사 · 메일 열기' 활성.
//  - 본문(mailbox)이 복사·mailto 본문의 '단일 출처'입니다(초안 본문으로 1회 초기화).
//  - '복사 · 메일 열기' 는 클립보드 복사 + mailto 를 함께 실행합니다.
//  - 외부 API/네트워크 없음. 나가는 값은 작성자가 입력/편집한 것뿐입니다(날조 금지).

"use client";

import { useState } from "react";
import { CHECKLIST, isChecklistComplete } from "../data/checklist";
import { buildMailtoUrl, invalidAddresses } from "../data/send";
import { LockIcon } from "./Icons";
import type { ComposeInput, Draft } from "../lib/types";

interface Props {
  draft: Draft;
  input: ComposeInput;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export default function ChecklistView({ draft, checked, onToggle }: Props) {
  const [body, setBody] = useState<string>(draft.body);
  const [to, setTo] = useState<string>("");
  const [cc, setCc] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const allDone = isChecklistComplete(checked);
  const badTo = invalidAddresses(to);
  const badCc = invalidAddresses(cc);

  const send = () => {
    void navigator.clipboard?.writeText(body);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    // 복사 본문과 mailto 본문은 같은 body 를 씁니다(어긋남 방지).
    window.location.href = buildMailtoUrl({
      to,
      cc,
      subject: draft.subject,
      body,
    });
  };

  const kindLabel = (kind: string) =>
    kind === "assist" ? "앱 보조" : "직접 확인";

  return (
    <div className="mc-send-grid">
      {/* ── 왼쪽: 최종 메일 ── */}
      <section className="mc-card">
        <div className="mc-card__head">
          <h2>최종 메일</h2>
          <span className="mc-badge">앱이 형식을 거들어요</span>
        </div>

        <div className="mc-grid-3">
          <div className="mc-field">
            <label className="mc-label" htmlFor="send-to">
              수신인
            </label>
            <input
              id="send-to"
              className="mc-input"
              value={to}
              placeholder="예: 홍길동 과장 <hong@client.com>"
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="mc-field">
            <label className="mc-label" htmlFor="send-cc">
              참조(CC)
            </label>
            <input
              id="send-cc"
              className="mc-input"
              value={cc}
              placeholder="예: kim@our.co.kr"
              onChange={(e) => setCc(e.target.value)}
            />
          </div>
          <div className="mc-field">
            <label className="mc-label" htmlFor="send-deadline">
              마감
            </label>
            <input
              id="send-deadline"
              type="date"
              className="mc-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        {badTo.length > 0 ? (
          <p className="mc-warn">
            수신인 주소에 &apos;@&apos; 가 없는 항목이 있습니다:{" "}
            {badTo.join(", ")}
          </p>
        ) : null}
        {badCc.length > 0 ? (
          <p className="mc-warn">
            참조 주소에 &apos;@&apos; 가 없는 항목이 있습니다:{" "}
            {badCc.join(", ")}
          </p>
        ) : null}

        <textarea
          className="mc-mailbox"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-label="최종 메일 본문"
        />
      </section>

      {/* ── 오른쪽: 보내기 전 확인 ── */}
      <section className="mc-card">
        <div className="mc-card__head">
          <h2>보내기 전 확인</h2>
        </div>

        <ul className="mc-checklist">
          {CHECKLIST.map((item) => (
            <li key={item.id} data-done={Boolean(checked[item.id])}>
              <input
                type="checkbox"
                id={item.id}
                checked={Boolean(checked[item.id])}
                onChange={() => onToggle(item.id)}
              />
              <div className="mc-check__text">
                <label htmlFor={item.id}>{item.label}</label>
                <span className="mc-check__kind">
                  {" "}
                  · {kindLabel(item.kind)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <hr className="mc-divider" />

        <button
          type="button"
          className="mc-btn mc-btn--primary mc-btn--block"
          onClick={send}
          disabled={!allDone}
        >
          <LockIcon /> 복사 · 메일 열기
        </button>

        <p className="mc-gate-note">
          {allDone
            ? copied
              ? "복사됨 · 메일 프로그램을 엽니다. 최종 발송 책임은 작성자에게 있습니다."
              : "점검 완료 · 최종 발송 책임은 작성자에게 있습니다."
            : `${CHECKLIST.length}개 항목을 모두 확인하면 활성화됩니다.`}
        </p>
      </section>
    </div>
  );
}
