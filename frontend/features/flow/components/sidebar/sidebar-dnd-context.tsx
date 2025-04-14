import * as React from "react";

import { DndContext as DndKitContext, DragEndEvent } from "@dnd-kit/core";
import { useReactFlow } from "@xyflow/react";

import short from "short-uuid";
import { toast } from "sonner";

import { NodeType } from "@/features/flow/components/flow-nodes/types";
import { sidebarNodes } from "@/features/flow/components/sidebar/constants";
import { SidebarDragOverlay } from "@/features/flow/components/sidebar/sidebar-drag-overlay";

interface DndContextProps {
  children: React.ReactNode;
}

export const SidebarDndContext = ({ children }: DndContextProps) => {
  const ctxId = React.useId();
  const { setNodes, screenToFlowPosition } = useReactFlow();
  const [isDragComplete, setIsDragComplete] = React.useState(false);

  const onDragEnd = React.useCallback(
    ({ active }: DragEndEvent) => {
      setIsDragComplete(false);
      const type = active.data.current?.type as NodeType;
      if (!type) return;

      const el = document.getElementById("overlay")!;
      const clientRect = el.getBoundingClientRect();

      const position = screenToFlowPosition({
        x: clientRect.left,
        y: clientRect.top,
      });

      const flow = document.querySelector(".flow");
      const flowRect = flow?.getBoundingClientRect();

      if (!flowRect) {
        toast.info("Flow panel not found", {
          description:
            "Please open the flow panel using the first button in the top right corner",
        });
        return;
      }

      if (
        clientRect.left <= flowRect.left ||
        clientRect.right >= flowRect.right ||
        clientRect.top <= flowRect.top ||
        clientRect.bottom >= flowRect.bottom
      ) {
        toast.info("Node out of bounds", {
          description: "Please drag the node fully into the flow panel",
        });
        return;
      }

      const newNode = {
        id: short.generate(),
        type,
        position,
        data: sidebarNodes[type],
      };

      setNodes((nds) => nds.concat(newNode));
      setIsDragComplete(true);
      toast.success("Node added successfully");
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <DndKitContext id={ctxId} onDragEnd={onDragEnd}>
      <SidebarDragOverlay isDragComplete={isDragComplete} />
      {children}
    </DndKitContext>
  );
};
