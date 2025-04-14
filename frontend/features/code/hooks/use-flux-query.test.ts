import { useQueryClient, useMutation } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { useFluxQuery } from "@/features/code/hooks/use-flux-query";
import { apiClient } from "@/lib/api-client";

// Mock dependencies
vi.mock("@tanstack/react-query", () => {
  let mutationFn: any;
  return {
    useQueryClient: vi.fn(),
    useMutation: vi.fn().mockImplementation((options: any) => {
      mutationFn = options.mutationFn;
      return {
        mutateAsync: vi.fn().mockImplementation((variables) => {
          return mutationFn(variables);
        }),
      };
    }),
  };
});

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("useFluxQuery", () => {
  const queryClient = {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
  };

  beforeEach(() => {
    (useQueryClient as any).mockReturnValue(queryClient);
  });

  it("should call apiClient.post with the correct arguments", async () => {
    vi.clearAllMocks();
    const code = 'from(bucket: "my-bucket") |> range(start: -1h)';
    const sanitizedCode = 'from(bucket: "my-bucket")|>range(start: -1h)';

    (apiClient.post as any).mockReturnValue({
      json: vi.fn().mockResolvedValue({}),
    });

    let capturedMutationFn: any;
    vi.mocked(useMutation).mockImplementation((options: any) => {
      capturedMutationFn = options.mutationFn;
      return { mutate: vi.fn() } as any;
    });

    renderHook(() => useFluxQuery());

    const result = await capturedMutationFn(code);

    expect(apiClient.post).toHaveBeenCalledWith(
      "influxdb/query?organization=ATSYS",
      {
        json: { query: sanitizedCode },
      },
    );
    expect(result).toEqual({});
  });

  it("should return undefined if the code is empty or includes a comment", async () => {
    vi.clearAllMocks();
    const emptyCode = "";
    const commentCode = "/* a comment */";
    let capturedMutationFn: any;
    vi.mocked(useMutation).mockImplementation((options: any) => {
      capturedMutationFn = options.mutationFn;
      return { mutate: vi.fn() } as any;
    });
    renderHook(() => useFluxQuery());

    await act(async () => {
      const emptyResult = await capturedMutationFn(emptyCode);
      const commentResult = await capturedMutationFn(commentCode);

      expect(emptyResult).toBeUndefined();
      expect(commentResult).toBeUndefined();
    });
  });
});
