// .claude/hooks/content-guard.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Claude Code 훅: AI 가 data/ 또는 lib/ 의 파일을 수정하면,
// 곧바로 '내용 형식 가드'(npm run check:content)를 돌립니다.
// 규격을 어겼으면 exit 2 로 "멈추고" 그 이유를 AI 에게 돌려줘,
// AI 가 사용자에게 확인을 요청하도록 합니다.
//
// 연결: .claude/settings.json 의 PostToolUse(Edit|Write|MultiEdit) 에서 호출.
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from "node:child_process";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  let payload = {};
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    // 입력을 못 읽으면 조용히 통과(훅이 작업을 막지 않도록).
    process.exit(0);
  }

  const filePath =
    (payload.tool_input && payload.tool_input.file_path) ||
    (payload.tool_input && payload.tool_input.filePath) ||
    "";
  const normalized = String(filePath).replace(/\\/g, "/");

  // data/ 또는 lib/ 아래의 .ts/.tsx 변경일 때만 검사.
  const relevant =
    /(^|\/)(data|lib)\//.test(normalized) && /\.(ts|tsx)$/.test(normalized);
  if (!relevant) {
    process.exit(0);
  }

  const res = spawnSync("npm run --silent check:content", {
    encoding: "utf8",
    shell: true,
  });
  const output = `${res.stdout || ""}${res.stderr || ""}`.trim();

  if (res.status !== 0) {
    console.error(
      [
        "데이터 파일(data/·lib/) 변경이 '내용 형식 가드'를 통과하지 못했습니다.",
        "여기서 멈춥니다. 아래 위반 내용을 사용자에게 알리고, 어떻게 고칠지 확인받으세요:",
        "",
        output ||
          "(가드 출력이 비어 있습니다. 수동으로 npm run check:content 를 실행해 보세요.)",
      ].join("\n"),
    );
    process.exit(2); // 2 = 블록: stderr 를 Claude 에게 전달하고 멈추게 함
  }

  process.exit(0);
});
