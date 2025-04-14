import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { NodeData } from "@/features/flow/components/flow-nodes";
import { EDITOR_ENDPOINTS, EDITOR_QUERY_KEYS } from "@/features/flow/constants";
import { apiClient } from "@/lib/api-client";

export type GetMeasurementsResponse = {
  measurements: string[] | undefined;
};

export function useMeasurements(
  result: NodeData["result"] | null,
): UseQueryResult<GetMeasurementsResponse, Error> {
  const org = "ATSYS";
  return useQuery({
    queryKey: [
      ...EDITOR_QUERY_KEYS.MEASUREMENTS,
      org,
      result?.bucket,
      result?.timeStart,
      result?.timeStop,
      result,
    ],
    queryFn: async () => {
      if (!result || !result.bucket || !result.timeStart || !result.timeStop) {
        return [];
      }

      const response = await apiClient.get<GetMeasurementsResponse>(
        `${EDITOR_ENDPOINTS.getMeasurements}?bucket=${result.bucket}&organization=${org}&time-start=${result.timeStart}&time-stop=${result.timeStop}`,
      );

      if (!response.ok) {
        throw new Error("Couldn't get measurements");
      }

      return response.json();
    },
  });
}
