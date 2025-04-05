import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/query-provider";
import ClientSessionProvider from "@/components/session-provider";
import dynamic from "next/dynamic";
const PresenceListener = dynamic(
  () => import("@/components/presence-listener"),
  { ssr: false }
);

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SEOIT",
    template: "%s | SEOIT",
  },
  description: "Digital Agency that excels in SEO & SMM services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientSessionProvider>
          <QueryProvider>
            <PresenceListener />
            {children}
            <Toaster />
          </QueryProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
