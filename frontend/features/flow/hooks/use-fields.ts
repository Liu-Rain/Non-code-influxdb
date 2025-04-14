import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { NodeData } from "@/features/flow/components/flow-nodes";
import { EDITOR_ENDPOINTS, EDITOR_QUERY_KEYS } from "@/features/flow/constants";
import { apiClient } from "@/lib/api-client";

export type GetFieldsResponse = {
  fields: string[];
};

export function useFields({
  bucket,
  timeStart,
  timeStop,
  measurement,
}: NodeData["result"]): UseQueryResult<GetFieldsResponse, Error> {
  const org = "ATSYS";
  return useQuery({
    queryKey: [
      ...EDITOR_QUERY_KEYS.FIELDS,
      org,
      bucket,
      timeStart,
      timeStop,
      measurement,
    ],
    queryFn: async () => {
      if (!timeStart || !timeStop || !bucket || !measurement) return [];

      const response = await apiClient.get<GetFieldsResponse>(
        `${EDITOR_ENDPOINTS.getFields}?bucket=${bucket}&organization=${org}&time-start=${timeStart}&time-stop=${timeStop}&measurement=${measurement}`,
      );

      if (!response.ok) {
        throw new Error("Couldn't get measurements");
      }

      return response.json();
    },
  });
}
