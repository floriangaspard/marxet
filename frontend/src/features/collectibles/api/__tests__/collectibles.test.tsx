import { Mock, describe, expect, it, vi } from "vitest";
import {
  getHoldings,
  getNonFungibleAssetName,
  isWhitelisted,
  listCollectible,
} from "../collectibles";
import { callReadOnlyFunction, createAssetInfo } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";

vi.mock("@/user-session", () => {
  return {
    userSession: {
      loadUserData: vi.fn().mockReturnValue({
        profile: { stxAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" },
      }),
    },
  };
});

vi.mock("@stacks/transactions", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("@stacks/transactions")>()),
    callReadOnlyFunction: vi.fn(),
    makeStandardNonFungiblePostCondition: vi.fn(),
  };
});

describe("getHoldings", () => {
  it("should return nft holdings json", async () => {
    const mockJson = {
      limit: 50,
      offset: 0,
      total: 2,
      results: [
        {
          asset_identifier:
            "SPXG42Y7WDTMZF5MPV02C3AWY1VNP9FH9C23PRXH.Marbling::Marbling",
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
            "SP497E7RX3233ATBS2AB9G4WTHB63X5PBSP5VGAQ.boom-nfts::boom",
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

    global.fetch = vi.fn(async () =>
      Promise.resolve({
        json: () => Promise.resolve(mockJson),
      })
    ) as Mock;

    expect(await getHoldings()).toBe(mockJson);
  });
});

describe("getAssetName", () => {
  it("should return nft name", async () => {
    const mockJson = {
      functions: [
        {
          name: "called-from-mint",
          access: "private",
          args: [],
          outputs: { type: "bool" },
        },
      ],
      variables: [
        { name: "BAN-COIN-CONTRACT", type: "principal", access: "constant" },

        { name: "token-mint-price", key: "principal", value: "uint128" },
      ],
      fungible_tokens: [],
      non_fungible_tokens: [{ name: "Marbling", type: "uint128" }],
      epoch: "Epoch2_05",
      clarity_version: "Clarity1",
    };

    global.fetch = vi.fn(async () =>
      Promise.resolve({
        json: () => Promise.resolve(mockJson),
      })
    ) as Mock;

    expect(await getNonFungibleAssetName("", "")).toBe("Marbling");
  });
});

describe("isWhitelisted", () => {
  it("should return true", async () => {
    vi.mocked(callReadOnlyFunction).mockResolvedValue({ type: 3 });

    expect(
      await isWhitelisted("SPXG42Y7WDTMZF5MPV02C3AWY1VNP9FH9C23PRXH.a")
    ).toBe(true);
  });

  it("should return false", async () => {
    vi.mocked(callReadOnlyFunction).mockResolvedValue({ type: 4 });

    expect(
      await isWhitelisted("SPXG42Y7WDTMZF5MPV02C3AWY1VNP9FH9C23PRXH.a")
    ).toBe(false);
  });
});

describe("listCollectible", () => {
  vi.mock("@stacks/connect", async (importOriginal) => {
    return {
      ...(await importOriginal<typeof import("@stacks/connect")>()),
      openContractCall: vi.fn(),
    };
  });

  it("should call openContractCall", async () => {
    await listCollectible(
      2,
      createAssetInfo(
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        "Marbling",
        "Marbling"
      ),
      33330,
      undefined,
      () => {},
      () => {}
    );

    expect(openContractCall).toHaveBeenCalledOnce();
  });
});
