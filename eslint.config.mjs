// eslint.config.mjs
// ─────────────────────────────────────────────────────────────────────────────
// ESLint 9 "flat config" 입니다.
// eslint-config-next 는 아직 .eslintrc 형식이라, FlatCompat 로 감싸서 가져옵니다.
// (create-next-app 이 Next 15 + ESLint 9 에서 만들어 주는 것과 같은 방식)
//
//   npm run lint  → eslint .
//   커밋 시 lint-staged 의 `eslint --fix` 도 이 설정을 읽습니다.
// ─────────────────────────────────────────────────────────────────────────────

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "out/**", "build/**"] },
  ...compat.extends("next/core-web-vitals", "prettier"),
];

export default eslintConfig;
