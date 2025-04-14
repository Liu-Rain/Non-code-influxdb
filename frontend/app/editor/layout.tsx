"use client";

import React from "react";

import { ReactFlowProvider } from "@xyflow/react";

import { useIsClient } from "@/hooks/use-is-client";

interface EditorLayoutProps {
  children: React.ReactNode;
}

const EditorLayout = function ({ children }: EditorLayoutProps) {
  const isClient = useIsClient();
  return isClient ? (
    <ReactFlowProvider>
      <div className="h-screen w-screen bg-background">{children}</div>
    </ReactFlowProvider>
  ) : null;
};

export default EditorLayout;
