import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoohoo",
  description: "친구들과 여름 휴가 일정을 맞추는 간단한 서비스"
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

