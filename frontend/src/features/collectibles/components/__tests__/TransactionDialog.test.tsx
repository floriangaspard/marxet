import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransactionDialog } from "../TransactionDialog";

vi.mock("@/user-session", () => {
  return {
    userSession: {
      isUserSignedIn: vi.fn().mockReturnValue(true),
    },
  };
});

describe("Display transaction dialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("should display trigger button", () => {
    render(
      <TransactionDialog
        buttonText="trigger text"
        onClick={vi.fn()}
        status="SIGN"
        title="title text"
      />
    );

    expect(screen.getByRole("button").textContent).toBe("trigger text");
  });

  it("should display dialog content", () => {
    const mockOnClick = vi.fn();

    render(
      <TransactionDialog
        buttonText="trigger text"
        onClick={mockOnClick}
        status="SIGN"
        title="title text"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("heading").textContent).toBe("title text");
    expect(screen.getByText("Signing transaction...")).toBeDefined();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should display transaction signed text", () => {
    render(
      <TransactionDialog
        buttonText="trigger text"
        onClick={vi.fn()}
        status="SIGNED"
        title="title text"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Transaction signed")).toBeDefined();
  });

  it("should display transaction cancelled text", () => {
    render(
      <TransactionDialog
        buttonText="trigger text"
        onClick={vi.fn()}
        status="CANCELLED"
        title="title text"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Transaction cancelled.")).toBeDefined();
  });
});
