import { useQuery } from "@tanstack/react-query";

import { authQueryKeys } from "@/features/auth/hooks/constants";

export function useAuthStatus() {
  const { data, isLoading } = useQuery({
    queryKey: authQueryKeys.authStatus,
    staleTime: 60000 * 60 * 24,
  }) as { data: { isAuthenticated: boolean }; isLoading: boolean };

  return { data, isLoading };
}
