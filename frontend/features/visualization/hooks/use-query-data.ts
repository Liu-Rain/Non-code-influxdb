import { useQuery } from "@tanstack/react-query";

import { fluxQueryKeys } from "@/features/code/constants";
import { Row } from "@/features/visualization/types";

export function useTableData() {
  const { data } = useQuery({
    queryKey: fluxQueryKeys.tableData,
    staleTime: 60000 * 60 * 24,
  }) as {
    data: Row[];
  };

  return data;
}

export function useChartData() {
  const { data } = useQuery({
    queryKey: fluxQueryKeys.chartData,
    staleTime: 60000 * 60 * 24,
  }) as {
    data: Row[];
  };

  return data;
}
