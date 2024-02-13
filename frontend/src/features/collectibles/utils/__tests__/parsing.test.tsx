import { describe, expect, it } from "vitest";
import { jsonParseCollectible } from "../parsing";

describe("jsonParseCollectible", () => {
  it("should return collectible object", async () => {
    const mockJson = {
      type: "(tuple (expiry uint) (maker principal) (nft-asset-contract principal) (payment-asset-contract (optional none)) (price uint) (taker (optional none)) (token-id uint))",
      value: {
        expiry: {
          type: "uint",
          value: "500",
        },
        maker: {
          type: "principal",
          value: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        },
        "nft-asset-contract": {
          type: "principal",
          value: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft",
        },
        "payment-asset-contract": {
          type: "(optional none)",
          value: null,
        },
        price: {
          type: "uint",
          value: "1000",
        },
        taker: {
          type: "(optional none)",
          value: null,
        },
        "token-id": {
          type: "uint",
          value: "1",
        },
      },
    };

    const result = await jsonParseCollectible(mockJson, 2);

    expect(result.expiry).toBe("500");
    expect(result.listingId).toBe(2);
    expect(result.maker).toBe("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");
    expect(result.nftAssetContract).toBe(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft"
    );
    expect(result.paymentAssetContract).toBeNull();
    expect(result.price).toBe("1000");
    expect(result.taker).toBeNull();
    expect(result.tokenId).toBe("1");
  });
});
