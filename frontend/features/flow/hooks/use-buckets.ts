import { useQuery } from "@tanstack/react-query";

import { EDITOR_ENDPOINTS, EDITOR_QUERY_KEYS } from "@/features/flow/constants";
import { apiClient } from "@/lib/api-client";

type GetBucketsResponse = {
  buckets: string[];
};

export function useBuckets() {
  return useQuery({
    queryKey: EDITOR_QUERY_KEYS.BUCKETS,
    queryFn: async () => {
      const response = await apiClient.get<GetBucketsResponse>(
        `${EDITOR_ENDPOINTS.getBuckets}?organization=ATSYS`,
      );
      if (!response.ok) {
        throw new Error("Couldn't get buckets");
      }
      return response.json();
    },
  });
}
