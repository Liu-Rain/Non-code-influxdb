import * as React from "react";

import { Edge, Node, useEdges, useNodes } from "@xyflow/react";

import { NodeData, NodeType } from "@/features/flow/components/flow-nodes";
import { FLOW_KEY } from "@/features/flow/constants";

export const useFluxCode = () => {
  const [fluxCode, setFluxCode] = React.useState("");
  const nodesFromFlow = useNodes();
  const edgesFromFlow = useEdges();

  let flow = null;
  try {
    flow = JSON.parse(localStorage.getItem(FLOW_KEY) || "");
  } catch (error) {
    flow = null;
  }

  const nodes = React.useMemo(
    () => (nodesFromFlow.length > 0 ? nodesFromFlow : flow?.nodes || []),
    [flow?.nodes, nodesFromFlow],
  );
  const edges = React.useMemo(
    () => (edgesFromFlow.length > 0 ? edgesFromFlow : flow?.edges || []),
    [flow?.edges, edgesFromFlow],
  );

  const parseThresholds = React.useCallback(
    (node: Node, edges: Edge[], nodes: Node[]): string => {
      const childEdges = edges?.filter((edge: Edge) => edge.source === node.id);
      const childNodes = childEdges
        ?.map((edge: Edge) => nodes.find((n: Node) => n.id === edge.target))
        ?.filter((n): n is Node => n !== undefined);

      if (childNodes.length === 0) {
        const thresholdData = node?.data as NodeData;
        if (!thresholdData || !thresholdData.value) return "";
        if (thresholdData.value === "Pick a threshold")
          return "/* Pick a threshold */";
        const parts = thresholdData.value.split(" ");
        if (parts.length < 3) return "";
        const [_, operator, thresholdValue] = parts;
        if (!operator || !thresholdValue) return "";
        return `r._value ${
          operator === "≤"
            ? "<="
            : operator === "≥"
              ? ">="
              : operator === ">"
                ? ">"
                : operator === "<"
                  ? "<"
                  : operator === "="
                    ? "=="
                    : operator === "≠"
                      ? "!="
                      : ""
        } ${thresholdValue}`;
      }

      const childConditions = childNodes
        ?.map((childNode) => parseThresholds(childNode, edges, nodes))
        ?.filter((condition) => condition !== "");

      const parentCondition = (() => {
        const thresholdData = node?.data as NodeData;
        if (!thresholdData || !thresholdData.value) return "";
        const parts = thresholdData.value.split(" ");
        if (parts.length < 3) return "";
        const [_, operator, thresholdValue] = parts;
        console.log({ operator, thresholdValue });
        return `r._value ${operator === "≤" ? "<=" : operator === "≥" ? ">=" : operator === ">" ? ">" : operator === "<" ? "<" : operator === "=" ? "==" : operator === "≠" ? "!=" : ""} ${thresholdValue}`;
      })();

      if (parentCondition && childConditions.length > 0) {
        return `(${parentCondition} and (${childConditions.join(" or ")}))`;
      } else if (childConditions.length > 1) {
        return `(${childConditions.join(" or ")})`;
      } else {
        return childConditions[0] || parentCondition;
      }
    },
    [],
  );

  React.useEffect(() => {
    // Initialize the Flux code with the bucket node
    const bucketNode = nodes.find(
      (node: Node) => node.type === ("BUCKET" as NodeType),
    );
    const bucketValue = bucketNode?.data.value || "/* Pick a bucket */";
    let newFluxCode = `from(bucket: "${bucketValue}")\n`;

    // Find the date range node connected to the bucket
    const dateRangeEdge = edges.find(
      (edge: Edge) => edge.targetHandle === ("BUCKET" as NodeType),
    );
    const dateRangeNode = nodes.find(
      (node: Node) => node.id === dateRangeEdge?.target,
    );

    // Add the date range to the Flux code if it exists
    if (dateRangeNode) {
      if (dateRangeNode.data.value === undefined) {
        newFluxCode += `  |> range(/* Pick a date range */)\n`;
      } else {
        const { timeStart, timeStop } =
          (dateRangeNode.data as NodeData)?.result || {};
        if (timeStart) {
          const start = timeStart.replaceAll("%3A", ":");
          const stop = timeStop
            ? `, stop: ${timeStop.replaceAll("%3A", ":")}`
            : "";
          newFluxCode += `  |> range(start: ${start}${stop})\n`;
        }
      }
    }

    const measurementEdges = edges?.filter(
      (edge: Edge) => edge.source === dateRangeNode?.id,
    );
    const measurementNodes = measurementEdges
      ?.map((edge: Edge) => nodes.find((node: Node) => node.id === edge.target))
      ?.filter((n: Node | undefined): n is Node => n !== undefined);

    if (measurementNodes.length > 0) {
      const combinedFilters = measurementNodes
        .map((measurementNode: Node) => {
          const connectedFieldNodes = edges
            ?.filter((edge: Edge) => edge.source === measurementNode.id)
            ?.map((edge: Edge) =>
              nodes?.find((node: Node) => node.id === edge.target),
            )
            ?.filter((n: Node | undefined): n is Node => n !== undefined);

          const fieldFilters = connectedFieldNodes
            ?.map((fieldNode: Node) => {
              const thresholdFilter = parseThresholds(fieldNode, edges, nodes);
              return thresholdFilter
                ? `(r._field == "${fieldNode?.data?.value ?? "/* Pick a field */"}" and ${thresholdFilter})`
                : `r._field == "${fieldNode?.data?.value ?? "/* Pick a field */"}"`;
            })
            .join(" or ");

          if (fieldFilters === "") {
            return `(r._measurement == "${measurementNode?.data?.value ?? "/* Pick a measurement */"}")`;
          }

          return `(r._measurement == "${measurementNode?.data?.value ?? "/* Pick a measurement */"}" and (${fieldFilters}))`;
        })
        .join(" or ");

      newFluxCode += `  |> filter(
    fn: (r) => ${combinedFilters}\n  )\n`;
    }

    setFluxCode(newFluxCode);
  }, [nodes, edges, parseThresholds]);

  return fluxCode;
};
