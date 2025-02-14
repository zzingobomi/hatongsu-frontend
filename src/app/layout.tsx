import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthSession from "./_component/AuthSession";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import RQProvider from "./_component/RQProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "hatongsu",
  description: "cute hatongsu",
  icons: {
    icon: "/hatongsu.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="ko">
        <body className={inter.className}>
          <AuthSession>
            <RQProvider>{children}</RQProvider>
          </AuthSession>
        </body>
      </html>
    </ViewTransitions>
  );
}
