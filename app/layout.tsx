import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// Noto Sans KR 을 빌드 시 자체 호스팅합니다(런타임 외부 요청 없음 = 절대 원칙 1 유지).
const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-noto",
});

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
    <html lang="ko" className={noto.variable}>
      <body>
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
