'use client';

import { useEffect } from 'react';

export function PingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const ping = () => fetch('https://neuralflow-backend.vercel.app/api/health', { method: 'HEAD' }).catch(() => {});
    ping();
    const interval = setInterval(ping, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
