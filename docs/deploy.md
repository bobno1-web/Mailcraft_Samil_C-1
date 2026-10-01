# 배포 & 협업 절차

GitHub(비공개) + Vercel 로 배포하고, 팀원은 Collaborator 로 참여합니다.
개발을 몰라도 따라 할 수 있게 단계별로 적었습니다.

> **저장소 위치(개인 계정 vs 조직 계정)는 아직 정해지지 않았습니다.**
> <!-- [확인 필요: GitHub 저장소를 개인 계정에 둘지, 조직(Organization) 계정에 둘지] -->
>
> 아래 `<소유자>` 자리에 정해진 계정/조직 이름을 넣으세요. `[확인 필요]`

---

## 1. GitHub 비공개 저장소 만들기

1. GitHub 로그인 → 우측 상단 **+** → **New repository**
2. Owner: `<소유자>` (개인 or 조직) — `[확인 필요]`
3. Repository name: `mailcraft`
4. **Private** 선택 → **Create repository**

로컬 코드를 올립니다(이미 `git init` 되어 있습니다):

```bash
git add -A
git commit -m "chore: initial import"
git remote add origin https://github.com/<소유자>/mailcraft.git
git branch -M main
git push -u origin main
```

> 처음 `npm install` 을 하면 **커밋 훅이 자동 설치**됩니다(포맷·린트·타입·내용 가드).

---

## 2. Vercel 로 배포하기

1. [vercel.com](https://vercel.com) → GitHub 로 로그인
2. **Add New… → Project** → `mailcraft` 저장소 선택 → **Import**
3. Framework 는 **Next.js** 로 자동 감지됩니다. 추가 환경변수는 **필요 없습니다.**
   (외부 API/AI 키를 쓰지 않는 앱이라 비밀 키가 없습니다 = 절대 원칙 1)
4. **Deploy** 클릭 → 잠시 뒤 배포 주소가 나옵니다.

이후 `main` 에 머지될 때마다 자동 배포되고, PR 마다 미리보기(Preview) 주소가 생깁니다.

---

## 3. 팀원 초대 (Collaborator)

### GitHub

- 저장소 → **Settings → Collaborators**(조직이면 **Members/Teams**) → 팀원 추가
- 내용만 고치는 팀원은 **Write** 권한이면 충분합니다.

### Vercel

- 프로젝트/팀 → **Settings → Members** 에서 팀원 초대

---

## 4. 내용/톤 변경은 PR → 리뷰 승인 → 머지

**가장 중요한 규칙입니다.** 내용·톤이 어긋나는 것을 막는 **최종 관문은 사람 리뷰**입니다.

```bash
git checkout -b content/add-exec-recipient   # 작업용 가지 만들기
# ... lib/ , data/ 수정 ...
npm run check:content && npm run typecheck    # 스스로 확인
git add -A && git commit -m "content: add exec recipient"
git push -u origin content/add-exec-recipient
```

그다음 GitHub 에서 **Pull Request** 를 열고:

1. 리뷰어를 지정합니다.
2. 자동 검사(훅/CI)가 **형식**을 확인합니다.
3. **리뷰어가 '좋은 메일인가'를 사람 눈으로 확인**하고 **Approve** 합니다.
4. 승인 후 **Merge** → 자동 배포.

> 자동 검사는 형식만 봅니다. **직접 `main` 에 밀어 넣지 말고 반드시 PR 로** 올리세요.
> (저장소 설정에서 `main` 브랜치 보호 규칙으로 'PR 필수 + 1인 이상 승인'을 걸어 두면 안전합니다.)

---

## 참고

- 로컬 실행/빌드 명령: [../CLAUDE.md](../CLAUDE.md)
- 내용 기여 방법: [contributing-content.md](contributing-content.md)
