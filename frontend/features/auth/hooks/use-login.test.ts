import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import { useRouter } from "next/navigation";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useLogin } from "@/features/auth/hooks/use-login";
import { apiClient } from "@/lib/api-client";

// Mock dependencies
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock sessionStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
vi.stubGlobal("localStorage", mockLocalStorage);

// Mock btoa function
global.btoa = vi.fn((str) => Buffer.from(str).toString("base64"));

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup default mock for apiClient.post
    (apiClient.post as any).mockReturnValue({
      json: vi.fn().mockResolvedValue({}),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call apiClient.post with correct arguments and return the json result", async () => {
    const mockJsonResult = { token: "mockToken" };
    (apiClient.post as any).mockReturnValue({
      json: vi.fn().mockResolvedValue(mockJsonResult),
    });

    let capturedMutationFn: any;
    vi.mocked(useMutation).mockImplementation((options: any) => {
      capturedMutationFn = options.mutationFn;
      return { mutate: vi.fn() } as any;
    });

    renderHook(() => useLogin());

    const formData = { username: "testuser", password: "testpass" };
    const result = await capturedMutationFn(formData);

    expect(apiClient.post).toHaveBeenCalledWith("accounts/signin/", {
      json: formData,
    });
    expect(result).toEqual(mockJsonResult);
  });

  it("should handle successful login", async () => {
    const mockQueryClient = {
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
    };
    const mockRouter = {
      push: vi.fn(),
    };

    (useQueryClient as any).mockReturnValue(mockQueryClient);
    (useRouter as any).mockReturnValue(mockRouter);

    let onSuccessCallback: () => void;
    vi.mocked(useMutation).mockImplementation(({ onSuccess }: any) => {
      onSuccessCallback = onSuccess as () => void;
      return {
        mutate: vi.fn().mockImplementation(() => {
          onSuccessCallback();
        }),
      } as any;
    });

    const { result } = renderHook(() => useLogin());

    vi.setSystemTime(new Date("2023-01-01"));

    await act(async () => {
      await result.current.mutate({
        username: "testuser",
        password: "testpass",
      });
    });

    expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/editor");
  });
});
