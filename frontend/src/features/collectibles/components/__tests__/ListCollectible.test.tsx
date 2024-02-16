import { describe, expect, it, vi } from "vitest";
import { Collectible } from "../../types/Collectible";
import { ListCollectible } from "../ListCollectible";
import { fireEvent, render, screen } from "@testing-library/react";
import { useListCollectible } from "../../hooks/useListCollectible";

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

vi.mock("@/user-session", () => {
  return {
    userSession: {
      isUserSignedIn: vi.fn().mockReturnValue(true),
    },
  };
});

vi.mock("@/features/collectibles/hooks/useListCollectible");

describe("List one of my collectible", () => {
  it("should set transaction status and call list function", () => {
    const mockListAsset = vi.fn();
    const mockSetTransactionStatus = vi.fn();

    vi.mocked(useListCollectible).mockReturnValue({
      listAsset: mockListAsset,
      setTransactionStatus: mockSetTransactionStatus,
      transactionStatus: "SIGN",
    });

    render(<ListCollectible collectible={mockCollectible} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockSetTransactionStatus).toHaveBeenCalledOnce();
    expect(mockListAsset).toHaveBeenCalledOnce();
  });
});
