import { DragOverlay, useDndContext } from "@dnd-kit/core";
import { defaultDropAnimationSideEffects } from "@dnd-kit/core";

import { NodeType } from "@/features/flow/components/flow-nodes/types";
import { sidebarNodes } from "@/features/flow/components/sidebar/constants";

export const SidebarDragOverlay = ({
  isDragComplete,
}: {
  isDragComplete: boolean;
}) => {
  const { active } = useDndContext();
  const type = active?.data.current?.type as NodeType;
  const nodeInfo = sidebarNodes[type];

  return (
    <DragOverlay
      dropAnimation={
        isDragComplete
          ? null
          : {
              duration: 100,
              easing: "ease-out",
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "1",
                  },
                },
              }),
            }
      }
    >
      {active ? (
        <div
          id="overlay"
          className="flex h-14 w-[175px] cursor-grab items-center space-x-2 rounded-lg border bg-primary-foreground p-2 shadow-md transition-all duration-300 ease-out"
        >
          <div className="text-editor-node-text flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
            <nodeInfo.icon size={20} />
          </div>
          <div className="flex flex-col pr-1 capitalize">
            <p className="text-[10px] opacity-50">{nodeInfo.label}</p>
            <p className="text-xs font-bold">{nodeInfo.title}</p>
          </div>
        </div>
      ) : null}
    </DragOverlay>
  );
};
