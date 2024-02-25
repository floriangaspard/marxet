import { describe, expect, it } from "vitest";
import { getImageUrl, jsonParseCollectible } from "../parsing";

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
          value: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.materials",
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
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.materials"
    );
    expect(result.paymentAssetContract).toBeNull();
    expect(result.price).toBe("1000");
    expect(result.taker).toBeNull();
    expect(result.tokenId).toBe("1");
  });
});

describe("getImageUrl", () => {
  it("should return the right ipfs url when url contains ipfs://", () => {
    const url = getImageUrl(
      "ipfs://QmajLS1WEMdBCNPwFh3yRKPxSiYQnfiZqooSyreGsXtzX1/1.png"
    );
    expect(url).toBe(
      "https://ipfs.io/ipfs/QmajLS1WEMdBCNPwFh3yRKPxSiYQnfiZqooSyreGsXtzX1/1.png"
    );
  });

  it("should return the right ipfs url when url contains ipfs://ipfs", () => {
    const url = getImageUrl(
      "ipfs://ipfs/QmVq6zLZnfrTCqYHXvuUdBwe3amiYuCq13bxCdnE9mqTMH/images/nerad_pixel_art_blockchain_Sat_coin_the_smallest_denomination_o_8d535c0c-c818-4375-aae8-a05f4af126c7.png"
    );
    expect(url).toBe(
      "https://ipfs.io/ipfs/QmVq6zLZnfrTCqYHXvuUdBwe3amiYuCq13bxCdnE9mqTMH/images/nerad_pixel_art_blockchain_Sat_coin_the_smallest_denomination_o_8d535c0c-c818-4375-aae8-a05f4af126c7.png"
    );
  });
});
