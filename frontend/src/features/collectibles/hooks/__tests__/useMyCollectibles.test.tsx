import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMyCollectibles } from "../useMyCollectibles";
import { beforeEach } from "node:test";
import { fetchHoldings, isWhitelisted } from "../../utils/helper";
import { openContractCall } from "@stacks/connect";

const mockHoldings = {
  limit: 50,
  offset: 0,
  total: 2,
  results: [
    {
      asset_identifier:
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling",
      value: {
        hex: "0x01000000000000000000000000000005e7",
        repr: "u1511",
      },
      block_height: 85084,
      tx_id:
        "0xa071319bc98c08ce9817cf0f7f2669bbb757be289c532db7374f38ea2ab92804",
    },
    {
      asset_identifier:
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.boom-nfts::boom",
      value: {
        hex: "0x0100000000000000000000000000001d5d",
        repr: "u7517",
      },
      block_height: 37467,
      tx_id:
        "0x173957bb628b0350dbc37a21ffea9165fdc21a8ddab5e1a686c54d18d9644acf",
    },
  ],
};

beforeEach(() => {
  vi.mock("@/user-session", () => {
    return {
      userSession: {
        loadUserData: vi.fn().mockReturnValue({
          profile: { stxAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" },
        }),
      },
    };
  });

  vi.mock("@/features/collectibles/utils/helper.ts", async (importOriginal) => {
    return {
      ...(await importOriginal<
        typeof import("@/features/collectibles/utils/helper.ts")
      >()),
      fetchHoldings: vi.fn(),
      isWhitelisted: vi.fn(),
    };
  });
});

describe("Retrieve my collectibles", () => {
  it("should be empty", async () => {
    vi.mocked(fetchHoldings).mockResolvedValue({
      limit: 50,
      offset: 0,
      total: 0,
      results: [],
    });
    vi.mocked(isWhitelisted).mockResolvedValue(true);

    const { result } = renderHook(() => useMyCollectibles());
    await waitFor(() => expect(result.current.collectibles).toHaveLength(0));
  });

  it("should list 2 collectibles", async () => {
    vi.mocked(fetchHoldings).mockResolvedValue(mockHoldings);
    vi.mocked(isWhitelisted).mockResolvedValue(true);

    const { result } = renderHook(() => useMyCollectibles());
    await waitFor(() => expect(result.current.collectibles).toHaveLength(2));
  });

  it("should list 1 whitelisted true and 1 whitelisted false", async () => {
    vi.mocked(fetchHoldings).mockResolvedValue(mockHoldings);
    vi.mocked(isWhitelisted).mockResolvedValueOnce(false);
    vi.mocked(isWhitelisted).mockResolvedValue(true);

    const { result } = renderHook(() => useMyCollectibles());

    await waitFor(() =>
      expect(
        result.current.isAssetWhitelisted[
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Marbling::Marbling"
        ]
      ).toBeFalsy()
    );
    await waitFor(() =>
      expect(
        result.current.isAssetWhitelisted[
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.boom-nfts::boom"
        ]
      ).toBeTruthy()
    );
  });
});

describe("List collectibles", () => {
  beforeEach(() => {
    vi.mock("@stacks/connect", async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import("@stacks/connect")>()),
        openContractCall: vi.fn(),
      };
    });
  });

  beforeEach(() => {
    vi.mock("@stacks/transactions", async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import("@stacks/connect")>()),
        makeStandardNonFungiblePostCondition: vi.fn(),
      };
    });
  });

  it("should call openContractCall", async () => {
    vi.mocked(fetchHoldings).mockResolvedValue(mockHoldings);
    vi.mocked(isWhitelisted).mockResolvedValue(true);

    const { result } = renderHook(() => useMyCollectibles());

    await waitFor(() => expect(result.current.collectibles).toHaveLength(2));
    result.current.listAsset(result.current.collectibles[1], 11111);

    expect(openContractCall).toHaveBeenCalledOnce();
  });
});
