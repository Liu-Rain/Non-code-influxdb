"use client";

import { useRef } from "react";

import { ImperativePanelHandle } from "react-resizable-panels";

import dynamic from "next/dynamic";
import { useStore } from "zustand";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodeEditor } from "@/features/code/components/code-editor";
import { Flow } from "@/features/flow/components/flow";
import { Header } from "@/features/flow/components/header";
import { Sidebar } from "@/features/flow/components/sidebar";
import { useToggle } from "@/features/flow/hooks/use-toggle";
import { Visualization } from "@/features/visualization/components/visualization";

const SidebarDndContext = dynamic(
  () =>
    import("@/features/flow/components/sidebar/sidebar-dnd-context").then(
      (mod) => mod.SidebarDndContext,
    ),
  {
    ssr: false,
  },
);

export default function EditorPage() {
  const { isCodeEditorOpen, isFlowOpen, isVisualizationOpen } = useStore(
    useToggle,
    (state) => ({
      isCodeEditorOpen: state.isCodeEditorOpen,
      isFlowOpen: state.isFlowOpen,
      isVisualizationOpen: state.isVisualizationOpen,
    }),
  );

  const shouldRenderUpperPanel = isFlowOpen || isCodeEditorOpen;
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const upperPanelRef = useRef<ImperativePanelHandle>(null);

  const resetVerticalPanelSize = () => {
    const upperPanel = upperPanelRef.current;
    if (upperPanel) {
      upperPanel.resize(50);
    }
  };

  const resetHorizontalPanelSize = () => {
    const leftPanel = leftPanelRef.current;
    if (leftPanel) {
      leftPanel.resize(50);
    }
  };

  const showEmptyMessage =
    !isFlowOpen && !isCodeEditorOpen && !isVisualizationOpen;

  return (
    <SidebarDndContext>
      <section className="flex h-screen w-screen flex-col">
        <Header />
        <div className="flex h-full w-full">
          <Sidebar />
          {showEmptyMessage ? (
            <div className="flex flex-1 items-center justify-center text-sm">
              <p className="text-center text-muted-foreground">
                Use the buttons in the top-right corner to open a panel and
                start exploring.
              </p>
            </div>
          ) : (
            <ResizablePanelGroup
              autoSaveId="vertical-panel-group"
              direction="vertical"
              className="flex-1"
            >
              {shouldRenderUpperPanel && (
                <ResizablePanel
                  order={1}
                  id="lower-panel"
                  ref={upperPanelRef}
                  defaultSize={50}
                  minSize={10}
                >
                  <ResizablePanelGroup
                    autoSaveId="horizontal-panel-group"
                    direction="horizontal"
                  >
                    {isFlowOpen && (
                      <ResizablePanel
                        order={2}
                        id="flow-panel"
                        ref={leftPanelRef}
                        defaultSize={50}
                        minSize={10}
                      >
                        <Flow />
                      </ResizablePanel>
                    )}

                    {isFlowOpen && isCodeEditorOpen && (
                      <ResizableHandle
                        onDoubleClickCapture={resetHorizontalPanelSize}
                      />
                    )}

                    {isCodeEditorOpen && (
                      <ResizablePanel
                        order={3}
                        id="code-panel"
                        defaultSize={50}
                        minSize={10}
                      >
                        <CodeEditor />
                      </ResizablePanel>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              )}
              {shouldRenderUpperPanel && isVisualizationOpen && (
                <ResizableHandle
                  onDoubleClickCapture={resetVerticalPanelSize}
                />
              )}
              {isVisualizationOpen && (
                <ResizablePanel
                  order={4}
                  id="visualization-panel"
                  defaultSize={50}
                  minSize={10}
                >
                  <Visualization />
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          )}
        </div>
      </section>
    </SidebarDndContext>
  );
}
