import { BundledTheme } from "@/features/code/types";

export const DARK_THEME: BundledTheme = "night-owl";
export const LIGHT_THEME: BundledTheme = "github-light";

export const CODE_EDITOR_FONT_FAMILY = "Fira Code";

const fluxQueryKeys = {
  tableData: ["tableData"] as const,
  chartData: ["chartData"] as const,
};

export { fluxQueryKeys };
