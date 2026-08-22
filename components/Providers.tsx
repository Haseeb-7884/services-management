"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { BrandingProvider } from "@/context/BrandingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/components/ConfirmDialog";

// One shared client instance for the whole app, created once per browser
// session (useState lazy-init) rather than at module scope, so it isn't
// accidentally shared across requests in a server context.
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrandingProvider>
        <AuthProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </AuthProvider>
      </BrandingProvider>
    </QueryClientProvider>
  );
}
