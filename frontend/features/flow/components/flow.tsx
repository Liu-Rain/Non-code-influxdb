import * as React from "react";

import {
  ReactFlow,
  Controls,
  useNodesState,
  ConnectionLineType,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowInstance,
  useReactFlow,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  AlignButton,
  ResetButton,
} from "@/features/flow/components/flow-control-buttons";
import {
  BucketNode,
  DateRangeNode,
  FieldNode,
  MeasurementNode,
  ValueThresholdNode,
  type NodeProps,
  type NodeType,
} from "@/features/flow/components/flow-nodes";
import { FLOW_KEY, initialNodes } from "@/features/flow/constants";
import { throttle } from "@/lib/utils";

type ReactFlowNodeTypes = {
  [_t in NodeType]: React.FC<NodeProps>;
};

export const nodeTypes: ReactFlowNodeTypes = {
  BUCKET: BucketNode,
  MEASUREMENT: MeasurementNode,
  FIELD: FieldNode,
  DATE_RANGE: DateRangeNode,
  VALUE_THRESHOLD: ValueThresholdNode,
};

export function Flow() {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(
    null,
  );
  const { setViewport } = useReactFlow();

  const onConnect = React.useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: {
              strokeWidth: "1.5px",
              stroke: "hsl(217.2, 32.6%, 70%)",
            },
            animated: true,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const showToastWarning = throttle(() => {
    toast.warning("Invalid connection", {
      description:
        "Please connect bucket ⇢ date range ⇢ measurement ⇢ field ⇢ value threshold",
    });
  }, 1000);

  const throttleToastWarning = React.useCallback(showToastWarning, [
    showToastWarning,
  ]);

  const isValidConnection = React.useCallback(
    (connection: Edge | Connection) => {
      const sourceNode = nodes?.find((node) => node.id === connection.source);
      const targetNode = nodes?.find((node) => node.id === connection.target);
      const sourceType = sourceNode?.type as NodeType;
      const targetType = targetNode?.type as NodeType;

      if (sourceType === "BUCKET" && targetType === "DATE_RANGE") return true;
      if (sourceType === "DATE_RANGE" && targetType === "MEASUREMENT")
        return true;
      if (sourceType === "MEASUREMENT" && targetType === "FIELD") return true;
      if (sourceType === "FIELD" && targetType === "VALUE_THRESHOLD")
        return true;
      if (sourceType === "VALUE_THRESHOLD" && targetType === "VALUE_THRESHOLD")
        return true;

      throttleToastWarning();
      return false;
    },
    [nodes, throttleToastWarning],
  );

  const saveRfInstance = React.useCallback(() => {
    if (rfInstance && nodes && edges) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [edges, nodes, rfInstance]);

  const restoreFlow = React.useCallback(() => {
    const restore = async () => {
      let flow = null;
      try {
        flow = JSON.parse((await localStorage.getItem(FLOW_KEY)) || "");
      } catch (error) {
        flow = null;
      }

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restore();
  }, [setEdges, setNodes, setViewport]);

  React.useEffect(restoreFlow, [restoreFlow]);
  React.useEffect(saveRfInstance, [saveRfInstance]);
  React.useEffect(() => {
    setTimeout(fitView);
  }, [fitView]);

  const { theme } = useTheme();

  return (
    <section className="flow h-full w-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        colorMode={theme === "dark" ? "dark" : "light"}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onMoveEnd={saveRfInstance}
        connectionLineType={ConnectionLineType.Bezier}
        isValidConnection={(connection) =>
          isValidConnection(connection) ?? false
        }
        maxZoom={1}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-left">
          <AlignButton />
          <ResetButton />
        </Controls>
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          bgColor="hsl(var(--background))"
        />
      </ReactFlow>
    </section>
  );
}
