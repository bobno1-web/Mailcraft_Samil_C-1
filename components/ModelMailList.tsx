// components/ModelMailList.tsx
// 모범 메일 목록(틀). data/models.ts 의 MODEL_MAILS 를 카드로 보여 줍니다.
// 목업(2쪽) 기준: '상황' 뱃지 + 제목 + 본문(mailbox) + 구분선 + '왜 모범인가'.
// '내용'은 전부 data/ 에서 옵니다(여기서는 보여 주기만).

import { MODEL_MAILS } from "../data/models";

export default function ModelMailList() {
  return (
    <div className="mc-models-grid">
      {MODEL_MAILS.map((mail) => (
        <article key={mail.id} className="mc-model">
          <div className="mc-model__badge">
            <span className="mc-badge">상황</span>
          </div>
          <h3>{mail.title}</h3>
          <div className="mc-mailbox">{mail.body}</div>
          <hr className="mc-divider" />
          <div className="mc-reasons">
            <p className="mc-reasons__title">왜 모범인가</p>
            <ul>
              {mail.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
