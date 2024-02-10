import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, it } from "vitest";
import { describe, expect, vi } from "vitest";
import { ListedCollectibles } from "../ListedCollectibles";
import { ListedCollectible } from "../../types/Collectible";
import { useListedCollectibles } from "../../hooks/useListedCollectibles";

const mockListedCollectibles: ListedCollectible[] = [
  {
    expiry: "500",
    listingId: 0,
    maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    nftAssetContract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract",
    price: "1000",
    tokenId: "12",
    paymentAssetContract: undefined,
    taker: undefined,
  },
  {
    expiry: "300",
    listingId: 1,
    maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    nftAssetContract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract",
    price: "10200",
    tokenId: "122",
    paymentAssetContract: undefined,
    taker: undefined,
  },
];

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

beforeEach(() => {
  vi.mock("@/features/collectibles/hooks/useListedCollectibles");
});

afterEach(() => {
  cleanup();
});

describe("Display listed collectibles", () => {
  it("should display collectible data", () => {
    vi.mocked(useListedCollectibles).mockReturnValue({
      collectibles: [
        {
          expiry: "500",
          listingId: 0,
          maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          nftAssetContract:
            "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract",
          price: "1000",
          tokenId: "12",
          paymentAssetContract: undefined,
          taker: undefined,
        },
      ],
      buyAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<ListedCollectibles />);

    expect(screen.getByRole("heading").textContent).toBe(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract"
    );
    expect(screen.getByText("STX: 1000")).toBeDefined();
  });

  it("should display 2 collectibles", () => {
    vi.mocked(useListedCollectibles).mockReturnValue({
      collectibles: mockListedCollectibles,
      buyAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<ListedCollectibles />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should set transaction status and call buy function", () => {
    const mockSetTransactionStatus = vi.fn();
    const mockBuyAsset = vi.fn();

    vi.mocked(useListedCollectibles).mockReturnValue({
      collectibles: mockListedCollectibles,
      buyAsset: mockBuyAsset,
      setTransactionStatus: mockSetTransactionStatus,
      transactionStatus: "SIGN",
    });

    render(<ListedCollectibles />);

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockBuyAsset).toHaveBeenCalledOnce();
    expect(mockSetTransactionStatus).toHaveBeenCalledOnce();
  });
});
