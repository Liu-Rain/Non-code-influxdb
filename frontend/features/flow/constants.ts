import { Node } from "@xyflow/react";

import { Cylinder } from "lucide-react";
import short from "short-uuid";

import { NodeType } from "@/features/flow/components/flow-nodes";
import {
  NODE_LABELS,
  NODE_TITLES,
} from "@/features/flow/components/sidebar/constants";

export const FLOW_KEY = "influx-flow";

const EDITOR_API_PATH = "influxdb";

export const EDITOR_ENDPOINTS = {
  getBuckets: `${EDITOR_API_PATH}/buckets` as const,
  getMeasurements: `${EDITOR_API_PATH}/measurements` as const,
  getFields: `${EDITOR_API_PATH}/fields` as const,
};

export const initialNodes: Node[] = [
  {
    id: short.generate(),
    type: "BUCKET" as NodeType,
    deletable: false,
    position: {
      x: 400,
      y: 300,
    },
    data: {
      label: NODE_LABELS.SELECTOR,
      title: NODE_TITLES.BUCKET,
      icon: Cylinder,
    },
  },
];

export const EDITOR_QUERY_KEYS = {
  BUCKETS: ["buckets"] as const,
  MEASUREMENTS: ["measurements"] as const,
  FIELDS: ["fields"] as const,
};

export const FLOW_BACKGROUND_COLOR_LIGHT = "hsl(0, 0%, 100%)";
export const FLOW_BACKGROUND_COLOR_DARK = "hsl(207, 95%, 8%)";
