// components/PageHeader.tsx
// 흐름 페이지(작성/초안/발송/모범 메일) 공통 상단 바.
//   "← {뒤로}  {제목}" ... "{진행상태}"
// 뒤로는 backHref(링크) 또는 onBack(콜백) 중 하나로 동작합니다.

"use client";

import Link from "next/link";

interface Props {
  title: string;
  status?: string;
  backLabel: string;
  /** 링크로 이동(예: 홈 "/"). onBack 과 함께 쓰지 않습니다. */
  backHref?: string;
  /** 단계 이동 콜백(compose 내부). */
  onBack?: () => void;
}

export default function PageHeader({
  title,
  status,
  backLabel,
  backHref,
  onBack,
}: Props) {
  return (
    <div className="mc-pagehead">
      <div className="mc-pagehead__left">
        {backHref ? (
          <Link className="mc-back" href={backHref}>
            ← {backLabel}
          </Link>
        ) : (
          <button type="button" className="mc-back" onClick={onBack}>
            ← {backLabel}
          </button>
        )}
        <h1 className="mc-pagehead__title">{title}</h1>
      </div>
      {status ? <span className="mc-pagehead__status">{status}</span> : null}
    </div>
  );
}
