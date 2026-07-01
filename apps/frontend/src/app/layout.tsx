import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "유리들의 후가",
  description: "단체 대화방에 공유하는 휴가 일정 조율 서비스"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
