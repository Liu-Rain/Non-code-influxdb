import * as React from "react";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStatus } from "@/features/auth/hooks/use-auth-status";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data, isLoading } = useAuthStatus();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!data?.isAuthenticated) {
        router.push("/login");
      } else {
        router.push("/");
      }
    }
  }, [data?.isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
