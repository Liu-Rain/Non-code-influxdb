import React from "react";

import { LucideIcon } from "lucide-react";
import { useStore } from "zustand";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { sidebarNodes } from "@/features/flow/components/sidebar/constants";
import { SidebarDraggable } from "@/features/flow/components/sidebar/sidebar-draggable";
import { SidebarToggle } from "@/features/flow/components/sidebar/sidebar-toggle";
import { useToggle } from "@/features/flow/hooks/use-toggle";
import { cn } from "@/lib/utils";

export type DraggableNode = {
  label: string;
  title: string;
  icon: LucideIcon;
};

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useStore(useToggle, (state) => ({
    isSidebarOpen: state.isSidebarOpen,
    toggleSidebar: state.toggleSidebar,
  }));

  return (
    <aside
      className={cn(
        "z-20 flex h-full translate-x-0 flex-col border-r transition-[width] ease-in-out",
        isSidebarOpen === false ? "w-[92px]" : "w-52",
      )}
    >
      <div className="flex h-fit w-full items-center justify-center pt-4">
        <h1 className="text-sm font-bold">Nodes</h1>
        <SidebarToggle isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />
      </div>
      <div className="flex h-full w-full flex-col space-y-4 overflow-y-auto overflow-x-hidden bg-background p-4">
        {Object.entries(sidebarNodes)?.map(
          ([type, { label, title, icon: Icon }]) => {
            return !isSidebarOpen ? (
              <TooltipProvider delayDuration={0} key={type} aria-hidden>
                <Tooltip aria-hidden>
                  <TooltipTrigger aria-hidden>
                    <SidebarDraggable
                      key={type}
                      id={type}
                      type={type}
                      className="flex h-14 w-full cursor-grab items-center space-x-2 rounded-lg border bg-background p-2 shadow-sm transition-all ease-in-out hover:bg-primary-foreground hover:shadow-md"
                      aria-label={`Drag ${title} node`}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-accent"
                        aria-hidden
                      >
                        <Icon size={20} aria-hidden />
                      </div>
                    </SidebarDraggable>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="start"
                    sideOffset={5}
                    alignOffset={-3}
                    className="text-[10px] capitalize"
                    aria-hidden
                  >
                    {title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <SidebarDraggable
                key={type}
                id={type}
                type={type}
                aria-label={`Drag ${title} node`}
                className="flex h-14 w-full cursor-grab items-center space-x-2 rounded-lg border bg-background p-2 shadow-sm transition-all ease-in-out hover:bg-primary-foreground hover:shadow-md"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary"
                  aria-hidden
                >
                  <Icon size={20} aria-hidden />
                </div>
                <div
                  className={cn(
                    "absolute flex flex-col items-start pl-10 transition-opacity ease-out",
                    isSidebarOpen ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="text-nowrap text-[10px] capitalize opacity-50">
                    {label}
                  </p>
                  <p className="text-nowrap text-xs font-bold capitalize">
                    {title}
                  </p>
                </div>
              </SidebarDraggable>
            );
          },
        )}
      </div>
    </aside>
  );
};
