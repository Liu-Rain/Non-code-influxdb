import { useMutation, useQueryClient } from "@tanstack/react-query";

import { formatDate } from "date-fns";
import { toast } from "sonner";

import { fluxQueryKeys } from "@/features/code/constants";
import { Row } from "@/features/visualization/types";
import { apiClient } from "@/lib/api-client";

export const useFluxQuery = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { result: Record<string, any> } | undefined,
    unknown,
    string
  >({
    mutationFn: async (code: string) => {
      const sanitizedCode = code
        ?.split("\n")
        ?.map((line) => line.trim())
        ?.filter((line) => line.length > 0)
        ?.join(" ")
        ?.replace(/\s*([|><=(),])\s*/g, "$1");

      if (
        sanitizedCode === "" ||
        sanitizedCode.includes("/*") ||
        !sanitizedCode.includes("range")
      ) {
        return;
      }
      return apiClient
        .post("influxdb/query?organization=ATSYS", {
          json: { query: sanitizedCode },
        })
        .json();
    },
    onSuccess: (data: { result: Record<string, any> } | undefined) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: fluxQueryKeys.tableData });
      queryClient.invalidateQueries({ queryKey: fluxQueryKeys.chartData });
      const labels = {
        co: "Carbon Dioxide Level",
        hum: "Humidity",
        temp: "Temperature",
      } as const;
      const chartData: Row[] = [];
      const tableData: Row[] = [];
      Object.values(data.result)
        ?.flat()
        ?.filter((r) => r.result === "_result")
        ?.forEach((curr) => {
          const {
            room,
            _field: field,
            _measurement: measurement,
            _time: time,
            _value: value,
            _start: start,
            _stop: stop,
          } = curr;

          tableData.push({
            time: formatDate(time as string, "yyyy-MM-dd HH:mm:ss"),
            measurement: measurement as string,
            field: field as "co" | "temp" | "hum",
            room: room as "Kitchen" | "Living Room",
            value: parseFloat(value),
            label: labels[field as "co" | "temp" | "hum"],
            start: formatDate(start as string, "yyyy-MM-dd HH:mm:ss"),
            stop: formatDate(stop as string, "yyyy-MM-dd HH:mm:ss"),
          });

          const existingEntry = chartData?.find(
            (entry) =>
              entry.measurement === measurement &&
              entry.field === field &&
              entry.time === time,
          ) as Row;

          if (existingEntry) {
            existingEntry[room as "Kitchen" | "Living Room"] =
              parseFloat(value);
          } else {
            chartData?.push({
              time,
              start,
              stop,
              measurement,
              field,
              room,
              value: parseFloat(value),
              label: labels[field as "co" | "hum" | "temp"],
              [room]: parseFloat(value),
            });
          }
        });

      tableData?.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      );

      chartData?.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      );

      queryClient.setQueryData(fluxQueryKeys.chartData, chartData);
      queryClient.setQueryData(fluxQueryKeys.tableData, tableData);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error("Error querying data", {
          description: error.message,
        });
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });
};
