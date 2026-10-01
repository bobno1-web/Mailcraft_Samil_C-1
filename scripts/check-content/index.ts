// scripts/check-content/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// 형식 가드: data/·lib/ 의 '내용'이 정해진 규격을 지키는지 검사합니다.
//
// 검사 항목
//   1) types ↔ options ↔ templates 의 key 가 서로 완전히 일치하는가
//      (recipient / tone / phrase 세 종류)
//   2) 각 ModelMail 에 reasons('왜 모범인가')가 2개 이상 들어 있는가
//   3) 각 데이터가 타입 규격(필수 필드/허용 값)과 맞는가
//
// 통과 기준
//   - "규격을 지킨 새 내용 추가"는 통과시킵니다(추가 자체는 막지 않음).
//   - "틀을 깨는 변경"(key 불일치, reasons 누락, 잘못된 kind 등)만 막습니다.
//
// 실행: npm run check:content   (내부적으로 tsx 로 이 파일을 실행)
// 위반 시: 깨진 규칙을 사람이 읽기 좋은 한글로 출력하고 exit code 1 로 종료.
// ─────────────────────────────────────────────────────────────────────────────

import {
  RECIPIENT_OPTIONS,
  TONE_OPTIONS,
  PHRASE_OPTIONS,
} from "../../lib/options";
import {
  RECIPIENT_TEMPLATES,
  TONE_VOICES,
  PHRASE_BLOCKS,
} from "../../data/templates";
import { MODEL_MAILS } from "../../data/models";
import { CHECKLIST } from "../../data/checklist";

const problems: string[] = [];
const report = (msg: string) => problems.push(msg);

/** 두 key 집합이 완전히 같은지 비교(빠진 것/남는 것 모두 보고). */
function compareKeys(
  domain: string,
  optionsKeys: string[],
  templatesKeys: string[],
) {
  const inOptions = new Set(optionsKeys);
  const inTemplates = new Set(templatesKeys);

  for (const k of inOptions) {
    if (!inTemplates.has(k)) {
      report(
        `[${domain}] options 에는 "${k}" 가 있는데 templates 에는 없습니다. ` +
          `→ data/templates.ts 의 ${domain} 묶음에 "${k}" 를 추가하세요.`,
      );
    }
  }
  for (const k of inTemplates) {
    if (!inOptions.has(k)) {
      report(
        `[${domain}] templates 에는 "${k}" 가 있는데 options 에는 없습니다. ` +
          `→ lib/options.ts 의 ${domain} 목록에 "${k}" 를 추가하세요.`,
      );
    }
  }

  // 중복 key 검사(options 쪽)
  if (optionsKeys.length !== inOptions.size) {
    report(`[${domain}] lib/options.ts 에 중복된 key 가 있습니다.`);
  }
}

// ── 1) key 일치 검사 (types ↔ options ↔ templates) ──
// templates 는 Record<...Key, ...> 라 tsc 가 '타입과의 일치'를 이미 보장합니다.
// 여기서는 options 가 templates(=타입)와 같은 집합인지 교차 검사합니다.
compareKeys(
  "recipient",
  RECIPIENT_OPTIONS.map((o) => o.key),
  Object.keys(RECIPIENT_TEMPLATES),
);
compareKeys(
  "tone",
  TONE_OPTIONS.map((o) => o.key),
  Object.keys(TONE_VOICES),
);
compareKeys(
  "phrase",
  PHRASE_OPTIONS.map((o) => o.key),
  Object.keys(PHRASE_BLOCKS),
);

// ── phrase 블록의 자기 key 일치 (PHRASE_BLOCKS[k].key === k) ──
for (const [k, block] of Object.entries(PHRASE_BLOCKS)) {
  if (block.key !== k) {
    report(
      `[phrase] PHRASE_BLOCKS["${k}"] 의 key 가 "${block.key}" 로 어긋납니다. ` +
        `→ key 값을 "${k}" 로 맞추세요.`,
    );
  }
  if (!block.text?.trim()) {
    report(`[phrase] "${k}" 블록의 text 가 비어 있습니다.`);
  }
}

// ── 2) + 3) ModelMail 검사 ──
const recipientKeys = new Set(Object.keys(RECIPIENT_TEMPLATES));
const toneKeys = new Set(Object.keys(TONE_VOICES));
const modelIds = new Set<string>();

MODEL_MAILS.forEach((m, i) => {
  const where = `MODEL_MAILS[${i}] (id: ${m.id || "없음"})`;
  if (!m.id?.trim()) report(`[model] ${where}: id 가 비어 있습니다.`);
  if (m.id && modelIds.has(m.id))
    report(`[model] ${where}: id "${m.id}" 가 중복됩니다.`);
  if (m.id) modelIds.add(m.id);

  for (const field of ["title", "subject", "body"] as const) {
    if (!m[field]?.trim())
      report(`[model] ${where}: ${field} 가 비어 있습니다.`);
  }
  if (!recipientKeys.has(m.recipient))
    report(
      `[model] ${where}: recipient "${m.recipient}" 는 등록되지 않은 값입니다.`,
    );
  if (!toneKeys.has(m.tone))
    report(`[model] ${where}: tone "${m.tone}" 는 등록되지 않은 값입니다.`);

  // reasons: 2개 이상, 각 항목은 비어 있지 않아야 함
  if (!Array.isArray(m.reasons) || m.reasons.length < 2) {
    report(
      `[model] ${where}: reasons('왜 모범인가')가 2개 미만입니다. ` +
        `→ 모범인 이유를 최소 2개 적어 주세요(날조 금지).`,
    );
  } else if (m.reasons.some((r) => !r?.trim())) {
    report(`[model] ${where}: reasons 에 빈 항목이 있습니다.`);
  }
});

// ── 3) Checklist 검사 ──
const checklistIds = new Set<string>();
CHECKLIST.forEach((item, i) => {
  const where = `CHECKLIST[${i}] (id: ${item.id || "없음"})`;
  if (!item.id?.trim()) report(`[checklist] ${where}: id 가 비어 있습니다.`);
  if (item.id && checklistIds.has(item.id))
    report(`[checklist] ${where}: id "${item.id}" 가 중복됩니다.`);
  if (item.id) checklistIds.add(item.id);

  if (!item.label?.trim())
    report(`[checklist] ${where}: label 이 비어 있습니다.`);
  if (item.kind !== "assist" && item.kind !== "self") {
    report(
      `[checklist] ${where}: kind 는 "assist"(앱 보조) 또는 "self"(자가확인) ` +
        `중 하나여야 합니다. 지금 값: "${item.kind}".`,
    );
  }
});

// ── 결과 출력 ──
if (problems.length > 0) {
  console.error("\n❌ 내용 형식 가드: 규격을 어긴 부분이 있습니다.\n");
  problems.forEach((p, i) => console.error(`  ${i + 1}. ${p}`));
  console.error(
    "\n위 항목을 고친 뒤 다시 커밋해 주세요. (도움말: docs/contributing-content.md)\n",
  );
  process.exit(1);
}

console.log("✅ 내용 형식 가드 통과: 규격을 모두 지켰습니다.");
