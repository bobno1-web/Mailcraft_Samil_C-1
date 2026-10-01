# 디자인 시스템 (색·공통 CSS)

색과 공통 스타일은 **`app/globals.css` 한 곳**에 모여 있습니다.
여기만 바꾸면 앱 전체 모양이 바뀝니다.

---

## 색 토큰 (CSS 변수)

`:root` 안의 변수 하나만 바꾸면 그 색을 쓰는 모든 곳이 바뀝니다.

| 변수                       | 쓰임                  | 현재 값                              |
| -------------------------- | --------------------- | ------------------------------------ |
| `--color-bg`               | 배경                  | `#f6f7f9`                            |
| `--color-surface`          | 카드/입력 배경        | `#ffffff`                            |
| `--color-text`             | 본문 글자             | `#1f2328`                            |
| `--color-muted`            | 보조 글자(설명/힌트)  | `#656d76`                            |
| `--color-border`           | 테두리                | `#d0d7de`                            |
| `--color-primary`          | **강조(버튼·브랜드)** | `#2d6cdf` ← `[확인 필요: 브랜드 색]` |
| `--color-primary-contrast` | 강조 위 글자          | `#ffffff`                            |
| `--color-danger`           | 경고/오류             | `#c4344c`                            |
| `--color-success`          | 성공                  | `#1a7f4b`                            |

> **브랜드 색이 정해지면** `--color-primary`(와 필요 시 `--color-primary-contrast`)만 바꾸세요.
> <!-- [확인 필요: 브랜드 색 HEX 값] -->

### 브랜드 색 바꾸는 법 (복붙)

```css
/* app/globals.css */
:root {
  --color-primary: #2d6cdf; /* ← 이 값을 팀 브랜드 색으로 교체 */
}
```

---

## 간격 / 모서리 토큰

| 변수                    | 값                | 쓰임             |
| ----------------------- | ----------------- | ---------------- |
| `--space-1`~`--space-6` | 4·8·12·16·24·32px | 여백             |
| `--radius`              | 10px              | 카드 모서리      |
| `--radius-sm`           | 6px               | 입력/버튼 모서리 |

---

## 공통 CSS 클래스 레퍼런스

화면 부품에서 아래 클래스를 재사용합니다. 새 화면을 만들 때 그대로 쓰세요.

| 클래스                                      | 용도                                                  |
| ------------------------------------------- | ----------------------------------------------------- |
| `.mc-container`                             | 가운데 정렬 + 최대 폭(본문 래퍼)                      |
| `.mc-card`                                  | 흰 카드 박스                                          |
| `.mc-stepper` / `.mc-step`                  | 단계 표시(활성: `data-active="true"`)                 |
| `.mc-field` / `.mc-label`                   | 폼 한 줄 / 라벨                                       |
| `.mc-input` / `.mc-select` / `.mc-textarea` | 입력 요소                                             |
| `.mc-chips` / `.mc-chip`                    | 다중 선택 칩(켜짐: `data-on="true"`)                  |
| `.mc-btn` / `.mc-btn--primary`              | 버튼 / 강조 버튼                                      |
| `.mc-actions`                               | 버튼 줄(가로 배치)                                    |
| `.mc-draft`                                 | 초안 카드 (모범 메일 카드에도 재사용)                 |
| `.mc-checklist` / `.mc-kind` / `.mc-hint`   | 점검 목록 / 종류 배지 / 힌트 글자                     |
| `.mc-nav`                                   | 헤더 네비게이션(작성 / 모범 메일 링크)                |
| `.mc-tags`                                  | 배지(받는 사람·톤) 가로 묶음 — `.mc-kind` 배지를 담음 |
| `.mc-reasons`                               | 모범 메일의 "왜 모범인가" 근거 목록 블록              |

### 예시: 강조 버튼

```tsx
<button type="button" className="mc-btn mc-btn--primary">
  초안 만들기
</button>
```

### 예시: 카드 안에 폼 한 줄

```tsx
<section className="mc-card">
  <div className="mc-field">
    <label className="mc-label" htmlFor="subject">
      제목
    </label>
    <input id="subject" className="mc-input" />
  </div>
</section>
```

---

## 원칙

- **색은 HEX 를 직접 쓰지 말고** 토큰(`var(--color-...)`)을 쓰세요. 나중에 한 번에 바꾸기 쉽습니다.
- 새 공통 스타일이 필요하면 `globals.css` 에 `.mc-` 접두어로 추가하고, 이 표에 한 줄 적어 주세요.
