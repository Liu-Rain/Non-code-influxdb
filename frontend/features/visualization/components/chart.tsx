"use client";

import * as React from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "zustand";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDateRange } from "@/features/flow/hooks/use-date-range";
import { useChartData } from "@/features/visualization/hooks/use-query-data";
import { Row } from "@/features/visualization/types";

const chartConfig = {
  livingRoom: {
    label: "Living Room",
    color: "hsl(var(--chart-1))",
  },
  kitchen: {
    label: "Kitchen",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Chart({ type }: { type: "line" | "bar" | "area" }) {
  const { dateRange } = useStore(useDateRange, (state) => ({
    dateRange: state.dateRange,
  }));
  const chartData = useChartData();

  const labels = React.useMemo(
    () =>
      chartData?.reduce(
        (acc, cur) => acc.set(cur.field, cur.label),
        new Map<string, string>(),
      ),
    [chartData],
  );

  const [activeChart, setActiveChart] = React.useState<Row["field"]>("co");

  React.useEffect(() => {
    if (labels?.size > 0) {
      setActiveChart(Array?.from(labels)[0][0] as Row["field"]);
    }
  }, [chartData, labels]);

  const sum = React.useMemo(() => {
    return {
      hum: chartData?.reduce(
        (acc, curr) => (curr.field === "hum" ? acc + (curr?.value ?? 0) : acc),
        0,
      ),
      temp: chartData?.reduce(
        (acc, curr) => (curr.field === "temp" ? acc + (curr?.value ?? 0) : acc),
        0,
      ),
      co: chartData?.reduce(
        (acc, curr) => (curr.field === "co" ? acc + (curr?.value ?? 0) : acc),
        0,
      ),
    };
  }, [chartData]);

  const counts = React.useMemo(() => {
    return {
      hum: chartData?.filter((row) => row.field === "hum").length,
      temp: chartData?.filter((row) => row.field === "temp").length,
      co: chartData?.filter((row) => row.field === "co").length,
    };
  }, [chartData]);

  const average = React.useMemo(() => {
    return Object.entries(counts).reduce(
      (acc, [key, count]) => {
        acc[key as keyof typeof acc] = sum[key as keyof typeof sum] / count;
        return acc;
      },
      {} as Record<keyof typeof counts, number>,
    );
  }, [counts, sum]);

  const chartComponents = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart,
  };

  const ChartComponent = chartComponents[type];

  const chartComponentData = React.useMemo(() => {
    return chartData
      ?.filter((row) => row.field === activeChart)
      ?.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [chartData, activeChart]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          {labels?.size > 0 ? (
            <>
              <CardTitle className="capitalize">
                {Array?.from(labels)?.find(([key]) => key === activeChart)?.[1]}
              </CardTitle>
              <CardDescription>
                Showing data {dateRange.includes("-") ? "for " : "from "}
                {dateRange}
              </CardDescription>
            </>
          ) : (
            <CardDescription className="text-center">
              No data available
            </CardDescription>
          )}
        </div>
        <div className="flex">
          {labels?.size > 0
            ? Array?.from(labels)
                ?.sort((a, b) => a[0].localeCompare(b[0]))
                ?.map(([key, value]) => {
                  const chart = key as Row["field"];
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs capitalize text-muted-foreground">
                        Avg. {value}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        {average[chart as keyof typeof average]?.toFixed(2)}
                      </span>
                    </button>
                  );
                })
            : null}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[170px] w-full"
        >
          <ChartComponent
            accessibilityLayer
            data={chartComponentData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return (
                  date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }) +
                  " " +
                  date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="room"
                  labelFormatter={(value) => {
                    {
                      const date = new Date(value);
                      return (
                        date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }) +
                        " " +
                        date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      );
                    }
                  }}
                />
              }
            />
            {type === "line" ? (
              <>
                <Line
                  dataKey="Kitchen"
                  type="monotone"
                  stroke={`var(--color-kitchen)`}
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  dataKey="Living Room"
                  type="monotone"
                  stroke={`var(--color-livingRoom)`}
                  dot={false}
                  strokeWidth={2}
                />
              </>
            ) : null}
            {type === "bar" || type === "area" ? (
              <defs>
                <linearGradient id="fillKitchen" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-kitchen)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-kitchen)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillLivingRoom" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-livingRoom)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-livingRoom)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
            ) : null}
            {type === "bar" ? (
              <>
                <Bar
                  dataKey="Kitchen"
                  fill="var(--color-kitchen)"
                  fillOpacity={0.4}
                  stroke="var(--color-kitchen)"
                  strokeWidth={2}
                />
                <Bar
                  dataKey="Living Room"
                  type="natural"
                  fill="var(--color-livingRoom)"
                  fillOpacity={0.4}
                  stroke="var(--color-livingRoom)"
                  strokeWidth={2}
                />
              </>
            ) : null}
            {type === "area" ? (
              <>
                <Area
                  dataKey="Kitchen"
                  type="natural"
                  fill="url(#fillKitchen)"
                  fillOpacity={0.4}
                  stroke="var(--color-kitchen)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="Living Room"
                  type="natural"
                  fill="url(#fillLivingRoom)"
                  fillOpacity={0.4}
                  stroke="var(--color-livingRoom)"
                  strokeWidth={2}
                  stackId="a"
                />
              </>
            ) : null}
          </ChartComponent>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
