import React, { forwardRef } from "react";

import type { ControlButtonProps as OriginalControlButtonProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

// Extend ControlButtonProps to include standard button attributes
type ControlButtonProps = OriginalControlButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ children, className, ...rest }, ref) => (
    <button
      type="button"
      ref={ref}
      className={cn(
        "react-flow__controls-button",
        className,
        "bg-background text-foreground",
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);

ControlButton.displayName = "ControlButton";

export { ControlButton };
