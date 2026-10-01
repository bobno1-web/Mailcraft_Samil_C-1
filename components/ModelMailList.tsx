// components/ModelMailList.tsx
// 모범 메일 목록(틀). data/models.ts 의 MODEL_MAILS 를 카드로 보여 줍니다.
// '내용'은 전부 data/·lib/ 에서 오고, 여기서는 '어떻게 보여줄지'만 다룹니다.
// (recipient/tone 은 key → 사람이 읽는 라벨로 바꿔 태그로 표시합니다)

import { MODEL_MAILS } from "../data/models";
import { RECIPIENT_OPTIONS, TONE_OPTIONS } from "../lib/options";
import type { RecipientKey, ToneKey } from "../lib/types";

const recipientLabel = (key: RecipientKey) =>
  RECIPIENT_OPTIONS.find((o) => o.key === key)?.label ?? key;

const toneLabel = (key: ToneKey) =>
  TONE_OPTIONS.find((o) => o.key === key)?.label ?? key;

export default function ModelMailList() {
  return (
    <section className="mc-card">
      {MODEL_MAILS.map((mail) => (
        <article key={mail.id} className="mc-draft">
          <div className="mc-tags">
            <span className="mc-kind">
              받는 사람: {recipientLabel(mail.recipient)}
            </span>
            <span className="mc-kind">톤: {toneLabel(mail.tone)}</span>
          </div>
          <h3>{mail.title}</h3>
          <p className="mc-hint">제목: {mail.subject}</p>
          <pre>{mail.body}</pre>
          <div className="mc-reasons">
            <p className="mc-label">왜 모범인가</p>
            <ul>
              {mail.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}
