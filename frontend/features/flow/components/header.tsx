import * as React from "react";

import {
  ChartNoAxesCombinedIcon,
  Moon,
  PauseIcon,
  PlayIcon,
  SquareTerminalIcon,
  Sun,
  WorkflowIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useStore } from "zustand";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFluxCode } from "@/features/code/hooks/use-flux-code";
import { useFluxQuery } from "@/features/code/hooks/use-flux-query";
import { useToggle } from "@/features/flow/hooks/use-toggle";

export const Header = () => {
  const {
    isCodeEditorOpen,
    isFlowOpen,
    isVisualizationOpen,
    isQueryRunning,
    toggleCodeEditor,
    toggleFlow,
    toggleVisualization,
    toggleQueryRunning,
  } = useStore(useToggle);

  const { setTheme, theme } = useTheme();
  const code = useFluxCode();
  const { mutate: runQuery } = useFluxQuery();

  const handleRunQuery = () => {
    toggleQueryRunning();
  };

  React.useEffect(() => {
    if (!isQueryRunning) return;
    runQuery(code);
  }, [isQueryRunning, runQuery, code]);

  return (
    <header className="z-50 flex h-10 w-screen items-center justify-between border-b bg-background px-8 py-6">
      <div className="flex w-full items-center justify-between">
        <Link href="/">
          <h1 className="text-lg font-bold">Visual Flux</h1>
        </Link>
        <div className="flex space-x-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="h-8 w-8 p-0"
                  aria-label="toggle theme"
                >
                  {theme === "light" ? (
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  ) : (
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center">
                <span className="text-[10px] capitalize" aria-hidden>
                  toggle theme
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => toggleFlow?.()}
                  className={`h-8 w-8 p-0 ${isFlowOpen && "bg-accent text-accent-foreground"}`}
                  aria-label={
                    isFlowOpen ? "hide flow panel" : "show flow panel"
                  }
                >
                  <WorkflowIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="start" alignOffset={-40}>
                <span className="text-[10px] capitalize" aria-hidden>
                  {isFlowOpen ? "hide" : "show"} flow panel
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => toggleVisualization?.()}
                  className={`h-8 w-8 p-0 ${
                    isVisualizationOpen && "bg-accent text-accent-foreground"
                  }`}
                  aria-label={
                    isVisualizationOpen
                      ? "hide visualization panel"
                      : "show visualization panel"
                  }
                >
                  <ChartNoAxesCombinedIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="start" alignOffset={-60}>
                <span className="text-[10px] capitalize" aria-hidden>
                  {isVisualizationOpen ? "hide" : "show"} visualization panel
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => toggleCodeEditor?.()}
                  className={`h-8 w-8 p-0 ${
                    isCodeEditorOpen && "bg-accent text-accent-foreground"
                  }`}
                  aria-label={
                    isCodeEditorOpen ? "hide code editor" : "show code editor"
                  }
                >
                  <SquareTerminalIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="start" alignOffset={-40}>
                <span className="text-[10px] capitalize" aria-hidden>
                  {isCodeEditorOpen ? "hide" : "show"} code editor
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 w-8 p-0"
                  onClick={handleRunQuery}
                  aria-label={isQueryRunning ? "pause query" : "run query"}
                >
                  {isQueryRunning ? (
                    <PauseIcon size={16} />
                  ) : (
                    <PlayIcon size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent align="start" alignOffset={-30}>
                <span className="text-[10px] capitalize" aria-hidden>
                  {isQueryRunning ? "pause" : "run"} query
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};
