import * as React from "react";

import { Editor, type Monaco } from "@monaco-editor/react";

import { useTheme } from "next-themes";

import {
  CODE_EDITOR_FONT_FAMILY,
  DARK_THEME,
  LIGHT_THEME,
} from "@/features/code/constants";
import { useFluxCode } from "@/features/code/hooks/use-flux-code";
import { firaCode } from "@/lib/fonts";
import { setupEditor } from "@/lib/monaco";

export const CodeEditor = () => {
  const { theme } = useTheme();

  const beforeMount = React.useCallback(
    async (monaco: Monaco) =>
      await setupEditor(monaco, theme === "dark" ? DARK_THEME : LIGHT_THEME),
    [theme],
  );

  const code = useFluxCode();

  return (
    <Editor
      beforeMount={beforeMount}
      theme={theme === "dark" ? DARK_THEME : LIGHT_THEME}
      loading={
        <div className={`${firaCode.variable} font-mono`}>
          Loading code editor...
        </div>
      }
      height="100%"
      defaultLanguage="flux"
      value={code}
      options={{
        wordWrap: "on",
        readOnly: true,
        fontLigatures: true,
        fontSize: 16,
        lineHeight: 32,
        lineNumbers: "off",
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        hideCursorInOverviewRuler: true,
        renderLineHighlight: "none",
        fontFamily: CODE_EDITOR_FONT_FAMILY,
        padding: { top: 26 },
        minimap: { enabled: false },
        overviewRulerLanes: 0,
      }}
    />
  );
};
