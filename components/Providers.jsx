'use client';

import { SessionProvider } from 'next-auth/react';

/** Wraps the app in NextAuth's SessionProvider so useSession() works everywhere. */
export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
