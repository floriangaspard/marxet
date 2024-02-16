import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useListCollectible } from "../useListCollectible";
import { Collectible } from "../../types/Collectible";
import { listCollectible } from "../../api/collectibles";

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

vi.mock("@/features/collectibles/api/collectibles");

describe("useListCollectible", () => {
  it("should have SIGN as transaction default status", () => {
    const { result } = renderHook(() => useListCollectible());

    expect(result.current.transactionStatus).toBe("SIGN");
  });

  it("should call listCollectible", async () => {
    const { result } = renderHook(() => useListCollectible());

    await result.current.listAsset(mockCollectible, 12312, "STX");

    expect(listCollectible).toHaveBeenCalledOnce();
  });
});
