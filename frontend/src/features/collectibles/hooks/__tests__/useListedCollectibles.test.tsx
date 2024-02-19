import { renderHook, waitFor } from "@testing-library/react";
import { useListedCollectibles } from "../useListedCollectibles";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { callReadOnlyFunction } from "@stacks/transactions";
import { ListedCollectible } from "../../types/Collectible";

const mockCollectible = {
  type: 10,
  value: {
    type: 12,
    data: {
      expiry: {
        type: 1,
        value: 500n,
      },
      maker: {
        type: 5,
        address: {
          hash160: "6d78de7b0625dfbfc16c3a8a5735f6dc3dc3f2ce",
          type: 0,
          version: 26,
        },
      },
      "nft-asset-contract": {
        address: {
          hash160: "6d78de7b0625dfbfc16c3a8a5735f6dc3dc3f2ce",
          type: 0,
          version: 26,
        },
        contractName: {
          content: "sip009-nft",
          lengthPrefixBytes: 1,
          maxLengthBytes: 128,
          type: 2,
        },
        type: 6,
      },
      "payment-asset-contract": {
        type: 9,
      },
      price: {
        type: 1,
        value: 666n,
      },
      taker: {
        type: 9,
      },
      "token-id": {
        type: 1,
        value: 2n,
      },
    },
  },
};

beforeEach(() => {
  vi.mock("@stacks/connect", async (importOriginal) => {
    return {
      ...(await importOriginal<typeof import("@stacks/connect")>()),
      openContractCall: vi.fn(),
    };
  });

  vi.mock("@/user-session", () => {
    return {
      userSession: {
        loadUserData: vi.fn().mockReturnValue({
          profile: { stxAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" },
        }),
      },
    };
  });

  vi.mock(
    "@/features/collectibles/api/listedCollectibles.ts",
    async (importOriginal) => {
      return {
        ...(await importOriginal<
          typeof import("@/features/collectibles/api/listedCollectibles.ts")
        >()),
        retrieveListingNonce: vi.fn().mockReturnValue(2),
      };
    }
  );

  vi.mock("@/features/collectibles/api/collectibles.ts", () => {
    return {
      getNonFungibleAssetName: vi.fn().mockReturnValue("assetName"),
    };
  });

  vi.mock("@stacks/transactions", async (importOriginal) => {
    return {
      ...(await importOriginal<typeof import("@stacks/transactions")>()),
      callReadOnlyFunction: vi.fn(),
      makeStandardSTXPostCondition: vi.fn(),
    };
  });
});

describe("Retrieve listed collectibles", () => {
  it("should be empty", async () => {
    vi.mocked(callReadOnlyFunction).mockImplementation(
      vi.fn().mockReturnValue({ type: 9 })
    );

    const { result } = renderHook(() => useListedCollectibles());
    await waitFor(() => {
      expect(result.current.collectibles).toHaveLength(0);
    });
  });

  it("should list 2 collectibles", async () => {
    vi.mocked(callReadOnlyFunction).mockImplementation(
      vi.fn().mockReturnValue(mockCollectible)
    );

    const { result } = renderHook(() => useListedCollectibles());

    await waitFor(() => {
      expect(result.current.collectibles).toHaveLength(2);
    });
  });
});

describe("Buy collectibles", () => {
  it("should call openContractCall", async () => {
    const { result } = renderHook(() => useListedCollectibles());

    const asset: ListedCollectible = {
      nftAssetContract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.name",
      expiry: "500",
      listingId: 1,
      maker: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      paymentAssetContract: undefined,
      price: "1000",
      taker: "none",
      tokenId: "12",
      paymentSymbol: "STX",
      paymentAssetName: "",
    };

    result.current.buyAsset(asset);

    const { openContractCall } = await import("@stacks/connect");

    expect(openContractCall).toHaveBeenCalledOnce();
  });
});
