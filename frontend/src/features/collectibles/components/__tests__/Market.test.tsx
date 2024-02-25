import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, it } from "vitest";
import { describe, expect, vi } from "vitest";
import { Market } from "../Market";
import { useMarket } from "../../hooks/useMarket";
import { ListedCollectible } from "../../types/ListedCollectible";

const mockListedCollectibles: ListedCollectible[] = [
  {
    expiry: "500",
    listingId: 0,
    maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    nftAssetContract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract",
    price: 1000,
    tokenId: "12",
    paymentAssetContract: undefined,
    taker: undefined,
    paymentSymbol: "STX",
    paymentAssetName: "",
    metadata: {
      asset_type: "image/png",
      description: "",
      image: "",
      name: "Marbling #1",
      properties: "",
    },
  },
  {
    expiry: "300",
    listingId: 1,
    maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    nftAssetContract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract",
    price: 10200,
    tokenId: "122",
    paymentAssetContract: undefined,
    taker: undefined,
    paymentSymbol: "STX",
    paymentAssetName: "",
    metadata: {
      asset_type: "image/png",
      description: "",
      image: "",
      name: "Marbling #1",
      properties: "",
    },
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
  vi.mock("@/features/collectibles/hooks/useMarket");
});

afterEach(() => {
  cleanup();
});

describe("Display listed collectibles", () => {
  it("should display collectible data", () => {
    vi.mocked(useMarket).mockReturnValue({
      collectibles: [
        {
          expiry: "500",
          listingId: 0,
          maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          nftAssetContract:
            "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract",
          price: 1000,
          tokenId: "12",
          paymentAssetContract: undefined,
          taker: undefined,
          paymentSymbol: "AZE",
          paymentAssetName: "azert",
          metadata: {
            asset_type: "image/png",
            description: "",
            image: "",
            name: "Marbling #1",
            properties: "",
          },
        },
      ],
      buyAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<Market />);

    expect(screen.getByRole("heading").textContent).toBe("Marbling #1");
    expect(screen.getByText("1000 AZE")).toBeDefined();
  });

  it("should display 2 collectibles", () => {
    vi.mocked(useMarket).mockReturnValue({
      collectibles: mockListedCollectibles,
      buyAsset: vi.fn(),
      setTransactionStatus: vi.fn(),
      transactionStatus: "SIGN",
    });

    render(<Market />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});

describe("Try to buy a listed collectible", () => {
  it("should set transaction status and call buy function", () => {
    const mockSetTransactionStatus = vi.fn();
    const mockBuyAsset = vi.fn();

    vi.mocked(useMarket).mockReturnValue({
      collectibles: mockListedCollectibles,
      buyAsset: mockBuyAsset,
      setTransactionStatus: mockSetTransactionStatus,
      transactionStatus: "SIGN",
    });

    render(<Market />);

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockBuyAsset).toHaveBeenCalledOnce();
    expect(mockSetTransactionStatus).toHaveBeenCalledOnce();
  });
});
