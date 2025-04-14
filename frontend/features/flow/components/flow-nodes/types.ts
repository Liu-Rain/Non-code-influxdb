import { NODE_TITLES } from "@/features/flow/components/sidebar/constants";

export type NodeProps = { id: string };

export type NodeType = keyof typeof NODE_TITLES;

export type NodeData = {
  value: string;
  result: {
    bucket: string;
    timeStart: string;
    timeStop: string;
    measurement?: string;
    field?: string;
    thresholdValue: number | undefined;
    isThresholdIncluded: boolean | undefined;
    thresholdType: "max" | "min" | "equal" | "notEqual" | undefined;
  };
};
