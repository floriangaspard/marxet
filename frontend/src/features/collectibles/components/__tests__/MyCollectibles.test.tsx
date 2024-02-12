import { afterEach, describe, expect, it, vi } from "vitest";
import { Collectible } from "../../types/Collectible";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MyCollectibles } from "../MyCollectibles";
import { useMyCollectibles } from "../../hooks/useMyCollectibles";

const mockCollectible: Collectible = {
  asset_identifier:
    "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling",
  value: {
    hex: "0x01000000000000000000000000000005e7",
    repr: "u1511",
  },
  block_height: 85084,
  tx_id: "0xa071319bc98c08ce9817cf0f7f2669bbb757be289c532db7374f38ea2ab92804",
};

const mockCollectible2: Collectible = {
  asset_identifier: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.boom-nfts::boom",
  value: {
    hex: "0x0100000000000000000000000000001d5d",
    repr: "u7517",
  },
  block_height: 37467,
  tx_id: "0x173957bb628b0350dbc37a21ffea9165fdc21a8ddab5e1a686c54d18d9644acf",
};

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

vi.mock("@/features/collectibles/hooks/useMyCollectibles");

describe("Display my collectibles", () => {
  afterEach(() => {
    cleanup();
  });

  it("should display collectible data", () => {
    vi.mocked(useMyCollectibles).mockReturnValue({
      collectibles: [mockCollectible],
      isAssetWhitelisted: {
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling": true,
      },
      listAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<MyCollectibles />);

    expect(screen.getByRole("heading").textContent).toBe(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling"
    );
    expect(screen.getByText("u1511")).toBeDefined();
    expect(screen.getByRole("spinbutton")).toBeDefined();
  });

  it("should display list button", () => {
    vi.mocked(useMyCollectibles).mockReturnValue({
      collectibles: [mockCollectible],
      isAssetWhitelisted: {
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling": true,
      },
      listAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<MyCollectibles />);

    expect(screen.getByRole("button")).toBeDefined();
    expect(screen.getByRole("button").textContent).toBe("List");
  });

  it("should not display list button", () => {
    vi.mocked(useMyCollectibles).mockReturnValue({
      collectibles: [mockCollectible],
      isAssetWhitelisted: {
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling": false,
      },
      listAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<MyCollectibles />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should display 2 collectibles", () => {
    vi.mocked(useMyCollectibles).mockReturnValue({
      collectibles: [mockCollectible, mockCollectible2],
      isAssetWhitelisted: {
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling": true,
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.boom-nfts::boom": true,
      },
      listAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<MyCollectibles />);

    expect(screen.getAllByRole("heading")[0].textContent).toBe(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling"
    );
    expect(screen.getAllByRole("heading")[1].textContent).toBe(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.boom-nfts::boom"
    );
    expect(screen.getByText("u1511")).toBeDefined();
    expect(screen.getByText("u7517")).toBeDefined();
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
  });
});

describe("List one of my collectible", () => {
  it("should set transaction status and call list function", () => {
    const mockListAsset = vi.fn();
    const mockSetTransactionStatus = vi.fn();

    vi.mocked(useMyCollectibles).mockReturnValue({
      collectibles: [mockCollectible],
      isAssetWhitelisted: {
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling": true,
      },
      listAsset: mockListAsset,
      setTransactionStatus: mockSetTransactionStatus,
      transactionStatus: "SIGN",
    });

    render(<MyCollectibles />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockListAsset).toHaveBeenCalledOnce();
    expect(mockSetTransactionStatus).toHaveBeenCalledOnce();
  });
});
