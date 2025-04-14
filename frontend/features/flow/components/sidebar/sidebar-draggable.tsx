import { useDraggable } from "@dnd-kit/core";

import { LucideIcon } from "lucide-react";

export type SidebarDraggable = {
  label: string;
  title: string;
  icon: LucideIcon;
};

interface DraggableProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  type: string;
}

export const SidebarDraggable = ({
  id,
  className,
  children,
  type,
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { type },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={className}>
      {children}
    </div>
  );
};
