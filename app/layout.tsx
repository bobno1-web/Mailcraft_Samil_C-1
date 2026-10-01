import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "메일크래프트",
  description:
    "팀 공유 이메일 작성·체크리스트 도구 (외부 AI 미사용, 템플릿 조합 방식)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header className="mc-header">
          <div className="mc-container">
            <strong className="mc-brand">메일크래프트</strong>
            <span className="mc-tagline">내부 검토용 메일 초안 도우미</span>
            <nav className="mc-nav">
              <Link href="/">작성</Link>
              <Link href="/models">모범 메일</Link>
            </nav>
          </div>
        </header>
        <main className="mc-container">{children}</main>
        <footer className="mc-footer">
          <div className="mc-container">
            {/* [확인 필요: 면책 문구 강도·정확한 문장] */}
            모든 메일은 내부 검토용 초안이며, 최종 발송 책임은 작성자에게
            있습니다.
          </div>
        </footer>
      </body>
    </html>
  );
}
