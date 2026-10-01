// components/Stepper.tsx
// 상단 단계 표시(입력 → 초안 → 점검). 보여 주기만 하는 부품입니다.

const STEPS = ["1. 입력", "2. 초안", "3. 점검"];

export default function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mc-stepper">
      {STEPS.map((label, i) => (
        <li key={label} className="mc-step" data-active={i + 1 === current}>
          {label}
        </li>
      ))}
    </ol>
  );
}
