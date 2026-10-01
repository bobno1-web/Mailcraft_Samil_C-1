// data/checklist.ts
// ─────────────────────────────────────────────────────────────────────────────
// 발송 전 '점검' 체크리스트입니다. (compose 3단계: 입력 → 초안 → 점검)
//
// 종류 구분:
//  - kind: "assist" → 앱이 자동으로 거들 수 있는 항목(예: 빈 제목 감지).
//  - kind: "self"   → 사람이 눈으로 직접 봐야 하는 항목(예: 첨부파일 확인).
//
// [예시] 아래는 placeholder 입니다. 팀 기준으로 교체/추가하세요.
// 추가 방법: docs/contributing/checklist.md
// ─────────────────────────────────────────────────────────────────────────────

import type { ChecklistItem } from "../lib/types";

export const CHECKLIST: ChecklistItem[] = [
  {
    id: "subject-filled",
    label: "제목이 비어 있지 않은가?",
    kind: "assist",
    hint: "제목이 '(제목 없음)'이면 다시 적어 주세요.",
  },
  {
    id: "recipient-correct",
    label: "받는 사람 주소가 정확한가?",
    kind: "self",
    hint: "자동 완성으로 엉뚱한 주소가 들어갔는지 눈으로 확인합니다.",
  },
  {
    id: "attachment-included",
    label: "첨부파일을 빠뜨리지 않았는가?",
    kind: "self",
    hint: "본문에 '첨부'라고 썼다면 실제로 붙었는지 확인합니다.",
  },
  {
    id: "facts-only",
    label: "지어낸 내용 없이 사실만 담았는가?",
    kind: "self",
    hint: "확인되지 않은 수치·일정·약속이 들어가지 않았는지 봅니다.",
  },
];
