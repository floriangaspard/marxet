import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MainLayout } from "../MainLayout";
import { BrowserRouter } from "react-router-dom";

vi.mock("@/user-session", () => {
  return {
    userSession: {
      loadUserData: vi.fn().mockReturnValue({
        profile: { stxAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" },
      }),
      isUserSignedIn: vi.fn().mockReturnValue(true),
    },
  };
});

describe("MainLayout", () => {
  afterEach(() => {
    cleanup();
  });

  it("should contain navigation links", () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].textContent).toBe("Market");
    expect(links[1].textContent).toBe("My collectibles");
  });

  it("should contain wallet", () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    expect(screen.getByText("Disconnect Wallet")).toBeDefined();
  });
});
