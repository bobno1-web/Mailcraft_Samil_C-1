# 메일크래프트 (Mailcraft)

팀이 함께 쓰는 **내부 검토용 이메일 초안 작성·점검 웹앱**입니다.
Next.js(App Router) + TypeScript 로 만들어졌습니다.

> 이 파일은 프로젝트의 "표지 겸 규칙서"입니다. 짧게 유지하고, 자세한 내용은 아래 `docs/` 링크를 따라가세요.

---

## 절대 원칙 (반드시 지킴)

1. **외부 API/AI 키를 쓰지 않습니다.** "작성"은 미리 정해 둔 템플릿을 **결정론적으로 조합**하는 방식입니다. (같은 입력 → 항상 같은 결과)
2. **없는 사실을 지어내지 않습니다(날조 금지).** 본문의 내용은 작성자가 입력한 '사실'에서만 나옵니다.
3. **모든 메일은 내부 검토용 초안**이며, **최종 발송 책임은 작성자**에게 있습니다.

<!-- [확인 필요: 위 3개 원칙 문구의 강도와 정확한 면책 문장 — 법무/팀 확인] -->

---

## 실행 / 빌드 명령

```bash
npm install        # 최초 1회 (훅도 이때 자동 설치됨)
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
npm run typecheck  # 타입 검사 (tsc --noEmit)
npm run check:content  # 내용 형식 가드(키 일치·reasons 등) 검사
npm run format     # Prettier 자동 포맷
```

---

## 설계 한눈에 (데이터 주도)

- **화면(app/·components/)은 "틀"만** 담당합니다.
- **내용(data/·lib/)이 "알맹이"** 입니다. 글귀·선택지·규격이 모두 여기 있습니다.
- 핵심 조합 로직: `data/templates.ts` 의 **`generateDrafts()`**.
- 흐름: **입력 → 초안 → 점검** (compose 3단계).

자세히: [docs/architecture.md](docs/architecture.md)

---

## 코딩/기여 컨벤션 요약

- 수신자/톤/포함문구를 추가·수정할 때는 **`lib/types.ts` · `lib/options.ts` · `data/templates.ts` 세 곳을 함께** 고칩니다. (하나만 고치면 버그 → 형식 가드가 막습니다)
- 모범 메일은 **`reasons`('왜 모범인가')를 반드시** 채웁니다.
- 체크리스트 항목은 **`assist`(앱 보조) / `self`(자가확인)** 를 구분합니다.
- 들여쓰기·따옴표 등은 **Prettier** 가 자동 정리하므로 신경 쓰지 않아도 됩니다.
- 커밋하면 **자동 검사**(포맷·린트·타입·내용 가드)가 돌고, 실패하면 커밋이 멈춥니다.

---

## 문서 안내 (docs/)

| 문서                                                          | 내용                                      |
| ------------------------------------------------------------- | ----------------------------------------- |
| [architecture.md](docs/architecture.md)                       | 폴더 지도 · 데이터 주도 설계 · 3단계 흐름 |
| [contributing-content.md](docs/contributing-content.md)       | **내용 기여 허브** (아래 3개로 연결)      |
| └ [contributing/templates.md](docs/contributing/templates.md) | 수신자/톤/포함문구 추가법 (3곳 동기화)    |
| └ [contributing/models.md](docs/contributing/models.md)       | 모범 메일 추가법                          |
| └ [contributing/checklist.md](docs/contributing/checklist.md) | 체크리스트 항목 추가법                    |
| [design-system.md](docs/design-system.md)                     | 색 토큰 · 공통 CSS 클래스                 |
| [deploy.md](docs/deploy.md)                                   | 배포(GitHub/Vercel) 절차                  |

> **내용·톤 변경은 반드시 PR(풀 리퀘스트)로 올리고, 리뷰어 승인 후 머지합니다.**
> 자동 검사는 '형식'만 봅니다. '좋은 메일인가'의 최종 관문은 **사람 리뷰**입니다.
