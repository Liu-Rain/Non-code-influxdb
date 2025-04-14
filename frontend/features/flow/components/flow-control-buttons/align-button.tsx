import * as React from "react";

import { TextAlignCenterIcon } from "@radix-ui/react-icons";
import { ControlButton, useReactFlow } from "@xyflow/react";

import { getLayoutedElements } from "@/lib/dagre";

export function AlignButton({ className }: { className?: string }) {
  const { fitView, getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const onLayout = React.useCallback(
    (direction: "TB" | "LR") => {
      const nodes = getNodes();
      const edges = getEdges();
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      setTimeout(fitView);
    },
    [getNodes, getEdges, setNodes, setEdges, fitView],
  );
  return (
    <ControlButton
      title="Align"
      onClick={() => {
        onLayout("TB");
        setTimeout(fitView);
      }}
      className={className}
    >
      <TextAlignCenterIcon />
    </ControlButton>
  );
}
