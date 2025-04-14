import AsyncLock from "async-lock";
import { createHighlighter, type Highlighter } from "shiki";

import { DARK_THEME, LIGHT_THEME } from "@/features/code/constants";
import grammar from "@/lib/flux.tmLanguage.json";

let highlighter: Highlighter | null = null;
const highlighterLock = new AsyncLock();

export async function getHighlighter() {
  return highlighterLock.acquire("highlighter", async () => {
    if (!highlighter) {
      highlighter = await createHighlighter({
        themes: [DARK_THEME, LIGHT_THEME],
        langs: [grammar as any],
      });
    }
    return highlighter;
  });
}
