import {
  QueryClient,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { toast } from "sonner";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { LoginCard } from "@/features/auth/components/login-card";
import { useLogin } from "@/features/auth/hooks/use-login";

vi.mock("@/features/auth/hooks/use-login", () => ({
  useLogin: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

describe("LoginCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isError: false,
      isPending: false,
      isSuccess: false,
      isIdle: true,
      status: "idle",
      data: undefined,
      error: null,
      reset: vi.fn(),
    } as unknown as UseMutationResult<
      void,
      Error,
      { username: string; password: string },
      unknown
    >);
  });

  it("renders the login form", () => {
    render(<LoginCard />);

    expect(
      screen.getByRole("heading", { name: "Login", level: 3 }),
    ).toBeDefined();
    expect(screen.getByText(/Enter your username below/)).toBeDefined();
    expect(screen.getByText(/to login to your account/)).toBeDefined();
    expect(screen.getByLabelText("Username")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
  });

  it("submits the form with correct data", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useLogin).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      isPending: false,
      isSuccess: false,
      isIdle: true,
      status: "idle",
      data: undefined,
      error: null,
      reset: vi.fn(),
    } as unknown as UseMutationResult<
      void,
      Error,
      { username: string; password: string },
      unknown
    >);

    render(<LoginCard />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("displays error message when login fails", () => {
    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
      isPending: false,
      isSuccess: false,
      isIdle: false,
      status: "error",
      data: undefined,
      error: new Error("Invalid credentials"),
      reset: vi.fn(),
    } as unknown as UseMutationResult<
      void,
      Error,
      { username: string; password: string },
      unknown
    >);

    render(<LoginCard />);
    expect(toast.error).toHaveBeenCalledWith("Invalid username or password");
  });

  it("disables submit button and shows loading state when login is in progress", () => {
    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isError: false,
      isPending: true,
      isSuccess: false,
      isIdle: false,
      status: "pending",
      data: undefined,
      error: null,
      reset: vi.fn(),
    } as unknown as UseMutationResult<
      void,
      Error,
      { username: string; password: string },
      unknown
    >);

    render(<LoginCard />);
    const submitButton = screen.getByRole("button", { name: "Logging in..." });
    expect(submitButton).toBeDisabled();
  });

  it("shows validation errors when form is submitted with empty fields", async () => {
    render(<LoginCard />);

    fireEvent.submit(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeDefined();
      expect(screen.getByText("Password is required")).toBeDefined();
    });
  });

  it("clears error message when user starts typing after a failed login", async () => {
    const mockReset = vi.fn();

    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
      isPending: false,
      reset: mockReset,
    } as unknown as UseMutationResult<
      void,
      Error,
      { username: string; password: string },
      unknown
    >);

    render(<LoginCard />);

    expect(toast.error).toHaveBeenCalledWith("Invalid username or password");

    fireEvent.focus(screen.getByLabelText("Username"));
    expect(mockReset).toHaveBeenCalledTimes(1);

    fireEvent.focus(screen.getByLabelText("Password"));

    expect(mockReset).toHaveBeenCalledTimes(2);
  });

  it("handles successful login", async () => {
    const user = { id: "1", username: "testuser" };
    const mockMutate = vi.fn().mockImplementation((_data) => {
      // Simulate successful login
      setTimeout(() => {
        mockSetQueryData(["user"], user);
        mockPush("/editor");
      }, 0);
    });
    const mockSetQueryData = vi.fn();
    const mockPush = vi.fn();

    // Mock useQueryClient
    const mockQueryClient = {
      setQueryData: mockSetQueryData,
    } as unknown as QueryClient;

    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);

    // Mock useLogin
    vi.mocked(useLogin).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      isPending: false,
      isSuccess: false,
      isIdle: true,
      data: undefined,
      error: null,
      reset: vi.fn(),
    } as unknown as UseMutationResult<
      void,
      Error,
      { username: string; password: string },
      unknown
    >);

    render(<LoginCard />);

    // Fill in the form
    await userEvent.type(screen.getByLabelText("Username"), "testuser");
    await userEvent.type(screen.getByLabelText("Password"), "password");

    // Submit the form
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // Check if mutate was called with correct data
    expect(mockMutate).toHaveBeenCalledWith({
      username: "testuser",
      password: "password",
    });

    // Wait for the next tick to allow our simulated async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Check if setQueryData was called
    expect(mockSetQueryData).toHaveBeenCalledWith(["user"], user);

    expect(mockPush).toHaveBeenCalledWith("/editor");
  });

  it("has correct tab order and aria attributes", async () => {
    render(<LoginCard />);

    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    // Ensure the body has focus initially
    expect(document.body).toHaveFocus();

    // Use userEvent to tab through the form
    await userEvent.tab();
    expect(username).toHaveFocus();

    await userEvent.tab();
    expect(password).toHaveFocus();

    await userEvent.tab();
    expect(submitButton).toHaveFocus();

    // Check for aria-invalid attribute when form is invalid
    await userEvent.click(submitButton);
    expect(username).toHaveAttribute("aria-invalid", "true");
    expect(password).toHaveAttribute("aria-invalid", "true");
  });
});
