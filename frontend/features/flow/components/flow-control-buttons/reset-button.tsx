import * as React from "react";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useReactFlow } from "@xyflow/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ControlButton } from "@/features/flow/components/flow-control-buttons/control-button";
import { initialNodes } from "@/features/flow/constants";

export function ResetButton() {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { fitView, setNodes, updateNodeData } = useReactFlow();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ControlButton ref={ref} title="Reset">
          <ReloadIcon />
        </ControlButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will reset your flow to the
            initial state.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setNodes(initialNodes);
              updateNodeData(initialNodes[0].id, {
                value: undefined,
                result: {
                  bucket: undefined,
                },
              });
              setTimeout(fitView);
            }}
          >
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
