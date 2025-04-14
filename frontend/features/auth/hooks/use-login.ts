import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { type FormData } from "@/features/auth/components/login-card";
import { authQueryKeys } from "@/features/auth/hooks/constants";
import { apiClient } from "@/lib/api-client";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      apiClient.post("accounts/signin/", { json: data }).json(),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.authStatus, {
        isAuthenticated: true,
      });
      router.push("/editor");
    },
  });
}
