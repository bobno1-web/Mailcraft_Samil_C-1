// components/Icons.tsx
// 목업의 얇은 라인 아이콘들(인라인 SVG). 색은 currentColor 를 따릅니다.
// 장식용이라 aria-hidden 입니다.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function EnvelopeIcon() {
  return (
    <svg {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg {...base}>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 18.5z" />
      <path d="M9 3v17" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg {...base}>
      <path d="M4 20.5 4.7 17 16 5.7a2 2 0 0 1 2.8 0l-.5-.5a2 2 0 0 1 0 2.8L7 19.3z" />
      <path d="M14.5 7.5 16.5 9.5" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg {...base} width="16" height="16">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
