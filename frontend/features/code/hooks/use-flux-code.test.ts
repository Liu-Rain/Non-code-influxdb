import { renderHook } from "@testing-library/react";
import { useNodes, useEdges, Edge, Node } from "@xyflow/react";

import { expect, Mock, vi } from "vitest";

import { useFluxCode } from "@/features/code/hooks/use-flux-code";
import { FLOW_KEY } from "@/features/flow/constants";

// Mock the useNodes and useEdges hooks
vi.mock("@xyflow/react", () => ({
  useNodes: vi.fn(),
  useEdges: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = (key: string, value: any) => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => JSON.stringify(value)),
      setItem: vi.fn(),
    },
    writable: true,
  });
};

describe("useFluxCode", () => {
  it("should generate the correct Flux code", () => {
    // Mock data
    const mockNodes: Node[] = [
      {
        id: "be1fXvV12Cx1u7YbBv6ZhL",
        type: "BUCKET",
        deletable: false,
        position: {
          x: 450,
          y: 0,
        },
        data: {
          label: "selector",
          title: "bucket",
          icon: {},
          value: "home",
          result: {
            bucket: "home",
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "9naCWkHFDtNpokZAQKybkK",
        type: "DATE_RANGE",
        position: {
          x: 421,
          y: 108,
        },
        data: {
          label: "filter",
          title: "date range",
          icon: {},
          value: "Jan 01, 2022 - Jan 02, 2022",
          result: {
            bucket: "home",
            timeStart: "2022-01-01T00%3A00%3A00Z",
            timeStop: "2022-01-02T00%3A00%3A00Z",
          },
        },
        measured: {
          width: 233,
          height: 58,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "f9ikqxzkhFuP9vWzD8HTWA",
        type: "MEASUREMENT",
        position: {
          x: 450,
          y: 216,
        },
        data: {
          label: "selector",
          title: "measurement",
          icon: {},
          value: "home",
          result: {
            bucket: "home",
            timeStart: "2022-01-01T00%3A00%3A00Z",
            timeStop: "2022-01-02T00%3A00%3A00Z",
            measurement: "home",
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "x5HojKPQgbnjqo1bnph1ik",
        type: "FIELD",
        position: {
          x: 112.5,
          y: 324,
        },
        data: {
          label: "selector",
          title: "field",
          icon: {},
          value: "hum",
          result: {
            bucket: "home",
            timeStart: "2022-01-01T00%3A00%3A00Z",
            timeStop: "2022-01-02T00%3A00%3A00Z",
            measurement: "home",
            field: "hum",
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
      },
      {
        id: "qh8x7XVraMthraCdwg8HYQ",
        type: "FIELD",
        position: {
          x: 450,
          y: 324,
        },
        data: {
          label: "selector",
          title: "field",
          icon: {},
          value: "temp",
          result: {
            bucket: "home",
            timeStart: "2022-01-01T00%3A00%3A00Z",
            timeStop: "2022-01-02T00%3A00%3A00Z",
            measurement: "home",
            field: "temp",
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "a7GZ5di7HTQdTEnjVirT2B",
        type: "FIELD",
        position: {
          x: 675,
          y: 324,
        },
        data: {
          label: "selector",
          title: "field",
          icon: {},
          value: "co",
          result: {
            bucket: "home",
            timeStart: "2022-01-01T00%3A00%3A00Z",
            timeStop: "2022-01-02T00%3A00%3A00Z",
            measurement: "home",
            field: "co",
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
      },
      {
        id: "dVw78ULuueP5sSNUuN5TCW",
        type: "VALUE_THRESHOLD",
        position: {
          x: 0,
          y: 432,
        },
        data: {
          label: "filter",
          title: "value threshold",
          icon: {},
          value: "value ≥ 123",
          result: {
            thresholdValue: 123,
            thresholdType: "min",
            isThresholdIncluded: true,
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
      },
      {
        id: "3N13icUqpN23WpWTaNg9FH",
        type: "VALUE_THRESHOLD",
        position: {
          x: 225,
          y: 432,
        },
        data: {
          label: "filter",
          title: "value threshold",
          icon: {},
          value: "value < 12",
          result: {
            thresholdValue: 12,
            thresholdType: "max",
            isThresholdIncluded: false,
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
      },
      {
        id: "wsuvypYTJPgWNdrR14zpVw",
        type: "VALUE_THRESHOLD",
        position: {
          x: 450,
          y: 432,
        },
        data: {
          label: "filter",
          title: "value threshold",
          icon: {},
          value: "value < 12",
          result: {
            thresholdValue: 12,
            thresholdType: "max",
            isThresholdIncluded: false,
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "3ocMnZrLirZpDZkFX7b1AL",
        type: "VALUE_THRESHOLD",
        position: {
          x: 450,
          y: 540,
        },
        data: {
          label: "filter",
          title: "value threshold",
          icon: {},
          value: "value > 1",
          result: {
            thresholdValue: 1,
            thresholdType: "min",
            isThresholdIncluded: false,
          },
        },
        measured: {
          width: 175,
          height: 58,
        },
        selected: false,
        dragging: false,
      },
    ];

    const mockEdges: Edge[] = [
      {
        source: "be1fXvV12Cx1u7YbBv6ZhL",
        sourceHandle: "BUCKET",
        target: "9naCWkHFDtNpokZAQKybkK",
        targetHandle: "BUCKET",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__be1fXvV12Cx1u7YbBv6ZhLBUCKET-9naCWkHFDtNpokZAQKybkKBUCKET",
      },
      {
        source: "9naCWkHFDtNpokZAQKybkK",
        sourceHandle: "DATE_RANGE",
        target: "f9ikqxzkhFuP9vWzD8HTWA",
        targetHandle: "DATE_RANGE",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__9naCWkHFDtNpokZAQKybkKDATE_RANGE-f9ikqxzkhFuP9vWzD8HTWADATE_RANGE",
      },
      {
        source: "f9ikqxzkhFuP9vWzD8HTWA",
        sourceHandle: "MEASUREMENT",
        target: "x5HojKPQgbnjqo1bnph1ik",
        targetHandle: "MEASUREMENT",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__f9ikqxzkhFuP9vWzD8HTWAMEASUREMENT-x5HojKPQgbnjqo1bnph1ikMEASUREMENT",
      },
      {
        source: "f9ikqxzkhFuP9vWzD8HTWA",
        sourceHandle: "MEASUREMENT",
        target: "qh8x7XVraMthraCdwg8HYQ",
        targetHandle: "MEASUREMENT",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__f9ikqxzkhFuP9vWzD8HTWAMEASUREMENT-qh8x7XVraMthraCdwg8HYQMEASUREMENT",
      },
      {
        source: "f9ikqxzkhFuP9vWzD8HTWA",
        sourceHandle: "MEASUREMENT",
        target: "a7GZ5di7HTQdTEnjVirT2B",
        targetHandle: "MEASUREMENT",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__f9ikqxzkhFuP9vWzD8HTWAMEASUREMENT-a7GZ5di7HTQdTEnjVirT2BMEASUREMENT",
      },
      {
        source: "x5HojKPQgbnjqo1bnph1ik",
        sourceHandle: "FIELD",
        target: "dVw78ULuueP5sSNUuN5TCW",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__x5HojKPQgbnjqo1bnph1ikFIELD-dVw78ULuueP5sSNUuN5TCW",
      },
      {
        source: "x5HojKPQgbnjqo1bnph1ik",
        sourceHandle: "FIELD",
        target: "3N13icUqpN23WpWTaNg9FH",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__x5HojKPQgbnjqo1bnph1ikFIELD-3N13icUqpN23WpWTaNg9FH",
      },
      {
        source: "qh8x7XVraMthraCdwg8HYQ",
        sourceHandle: "FIELD",
        target: "wsuvypYTJPgWNdrR14zpVw",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__qh8x7XVraMthraCdwg8HYQFIELD-wsuvypYTJPgWNdrR14zpVw",
      },
      {
        source: "wsuvypYTJPgWNdrR14zpVw",
        target: "3ocMnZrLirZpDZkFX7b1AL",
        style: {
          strokeWidth: "1.5px",
          stroke: "hsl(217.2, 32.6%, 70%)",
        },
        animated: true,
        id: "xy-edge__wsuvypYTJPgWNdrR14zpVw-3ocMnZrLirZpDZkFX7b1AL",
      },
    ];

    // Set up mocks
    (useNodes as Mock).mockReturnValue(mockNodes);
    (useEdges as Mock).mockReturnValue(mockEdges);
    mockLocalStorage(FLOW_KEY, { nodes: mockNodes, edges: mockEdges });

    // Render the hook
    const { result } = renderHook(() => useFluxCode());

    // Assert the generated Flux code
    const expectedFluxCode = `from(bucket: "home")
  |> range(start: 2022-01-01T00:00:00Z, stop: 2022-01-02T00:00:00Z)
  |> filter(
    fn: (r) => (r._measurement == "home" and ((r._field == "hum" and (r._value >= 123 or r._value < 12)) or (r._field == "temp" and (r._value < 12 and (r._value > 1))) or r._field == "co"))
  )
`;
    expect(result.current).toBe(expectedFluxCode);
  });
});
