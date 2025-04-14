import { type Monaco } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";

import languageConfig from "@/lib/language-configuration.json";
import { getHighlighter } from "@/lib/shiki";

export async function setupEditor(monaco: Monaco, theme: string) {
  monaco.languages.register({ id: "flux" });
  monaco.languages.setLanguageConfiguration("flux", languageConfig as any);
  monaco.editor.addKeybindingRule({
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
    command: null,
  });

  const highlighter = await getHighlighter();
  await shikiToMonaco(highlighter!, monaco);
  monaco.editor.setTheme(theme);
}
