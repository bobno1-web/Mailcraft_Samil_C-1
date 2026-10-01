# 디자인 시스템 (색·공통 CSS)

색과 공통 스타일은 **`app/globals.css` 한 곳**에 모여 있습니다.
여기만 바꾸면 앱 전체 모양이 바뀝니다. 기준 디자인: `design/mockup.pdf`.

---

## 색 토큰 (CSS 변수) — 브랜드: 틸(teal)

`:root` 안의 변수 하나만 바꾸면 그 색을 쓰는 모든 곳이 바뀝니다.

| 변수             | 쓰임                       | 값        |
| ---------------- | -------------------------- | --------- |
| `--bg`           | 배경(따뜻한 종이색)        | `#F6F5F2` |
| `--surface`      | 카드/입력 배경             | `#FFFFFF` |
| `--ink`          | 본문 글자                  | `#1E1C1A` |
| `--muted`        | 보조 글자                  | `#5E5A54` |
| `--faint`        | 더 흐린 글자(상태/힌트)    | `#8A857E` |
| `--line`         | 테두리                     | `#E3E0DA` |
| `--line-strong`  | 진한 테두리(입력)          | `#D7D3CC` |
| `--accent`       | **강조(버튼·브랜드·pill)** | `#16695A` |
| `--accent-hover` | 강조 hover                 | `#0F5044` |
| `--accent-soft`  | 강조 옅은 배경(chip·뱃지)  | `#E6F0ED` |
| `--accent-line`  | 강조 옅은 테두리           | `#BEDBD3` |
| `--warn`         | 주의(미확인 항목·경고)     | `#B5792B` |

> 브랜드 색이 바뀌면 `--accent` 계열만 바꾸면 됩니다. (예전 `[확인 필요: 브랜드 색]` 은 틸로 확정)

## 간격 / 모서리 토큰

| 변수                    | 값                | 쓰임               |
| ----------------------- | ----------------- | ------------------ |
| `--space-1`~`--space-6` | 4·8·12·16·24·32px | 여백               |
| `--radius`              | 14px              | 카드 모서리        |
| `--radius-sm`           | 10px              | 입력/버튼/본문박스 |
| `--radius-pill`         | 999px             | pill·chip·뱃지     |

## 폰트

`Noto Sans KR` 을 `next/font`(`app/layout.tsx`)로 **빌드 시 자체 호스팅**합니다
(런타임 외부 요청 없음 = 절대 원칙 1 유지). CSS 는 `var(--font-noto)` → 시스템 폰트 순으로 폴백합니다.

---

## 공통 CSS 클래스 레퍼런스

| 클래스                                                   | 용도                                               |
| -------------------------------------------------------- | -------------------------------------------------- |
| `.mc-container`                                          | 가운데 정렬 + 최대 폭(본문 래퍼)                   |
| `.mc-pagehead` / `.mc-back` / `.mc-pagehead__status`     | 흐름 페이지 상단 바(← 뒤로 · 제목 · 진행상태)      |
| `.mc-brandbar` / `.mc-brand` / `.mc-logo` / `.mc-beta`   | 랜딩 브랜드바(로고·워드마크·베타 pill)             |
| `.mc-hero` / `.mc-hero__title` / `.mc-hero__lead`        | 랜딩 히어로                                        |
| `.mc-home-cards` / `.mc-home-card` / `--accent`          | 랜딩 2갈래 카드(흰/틸)                             |
| `.mc-card` / `.mc-card__head`                            | 흰 카드 / 카드 머리(제목+뱃지)                     |
| `.mc-section` / `.mc-section__label`                     | 번호 섹션(①②③④) / 섹션 라벨                        |
| `.mc-field` / `.mc-label` / `.mc-input` / `.mc-textarea` | 폼 한 줄 / 라벨 / 입력                             |
| `.mc-grid-2` / `.mc-grid-3`                              | 2·3열 입력 배치(폰에서 1열)                        |
| `.mc-pills` / `.mc-pill`                                 | 단일 선택 pill(수신자/톤/회신방법; `data-on`)      |
| `.mc-chips` / `.mc-chip`                                 | 포함 문구 토글 chip(`data-on`)                     |
| `.mc-badge` / `.mc-badge--plain`                         | 작은 뱃지(변형/상황) / 조건 뱃지                   |
| `.mc-btn` / `--primary` / `--ghost` / `--block`          | 버튼(강조/외곽선/가득)                             |
| `.mc-actions` / `.mc-actions--end`                       | 버튼 줄 / 오른쪽 정렬                              |
| `.mc-mailbox`                                            | 본문 박스(읽기/편집; `pre-wrap`)                   |
| `.mc-version` / `.mc-version__head` / `.mc-flow`         | 초안 버전 카드 / 머리 / 미리보기(줄바꿈 흐름)      |
| `.mc-conds` / `.mc-conds__label`                         | '선택한 조건' 줄                                   |
| `.mc-send-grid`                                          | 발송 2단(최종 메일 / 보내기 전 확인)               |
| `.mc-checklist` / `.mc-check__text` / `.mc-check__kind`  | 체크리스트(미확인 항목은 `data-done="false"`→주의) |
| `.mc-divider` / `.mc-gate-note` / `.mc-warn`             | 구분선 / 게이트 안내 / 경고(주의색)                |
| `.mc-models-grid` / `.mc-model` / `.mc-reasons`          | 모범 메일 그리드 / 카드 / '왜 모범인가'            |
| `.mc-hint` / `.mc-footer`                                | 힌트 글자 / 푸터                                   |

아이콘(봉투·책·연필·자물쇠)은 `components/Icons.tsx` 의 인라인 SVG(`currentColor`)입니다.

---

## 반응형 (폰 폭)

`globals.css` 맨 아래 **`@media (max-width: 720px)`** 한 블록이 폰 폭을 담당합니다.

- 모든 그리드(`.mc-home-cards`·`.mc-grid-2`·`.mc-grid-3`·`.mc-send-grid`)는 **1열**로.
  (`.mc-models-grid` 는 `auto-fill` 이라 자동으로 열 수가 줄어듭니다)
- 히어로 제목·로고가 작아지고, 상단 바와 `.mc-actions` 버튼이 접힙니다.
- `img`·`pre`·`.mc-mailbox` 는 넘치지 않게 줄바꿈 → 가로 스크롤이 없습니다.

> 화면별로 미디어쿼리를 흩뿌리지 말고 **이 한 블록에서** 관리하세요(색 토큰과 같은 원칙).

---

## 원칙

- **색은 HEX 를 직접 쓰지 말고** 토큰(`var(--...)`)을 쓰세요. 나중에 한 번에 바꾸기 쉽습니다.
- 새 공통 스타일이 필요하면 `globals.css` 에 `.mc-` 접두어로 추가하고, 이 표에 한 줄 적어 주세요.
