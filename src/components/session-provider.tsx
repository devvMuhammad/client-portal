"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function ClientSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session;
}) {
  return (
    <SessionProvider session={session || null}>{children}</SessionProvider>
  );
}
