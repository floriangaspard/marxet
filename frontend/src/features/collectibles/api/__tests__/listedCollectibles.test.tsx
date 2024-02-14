import { describe, expect, it, vi } from "vitest";
import { callReadOnlyFunction } from "@stacks/transactions";
import { retrieveListingNonce } from "../listedCollectibles";

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
  };
});

describe("retrieveListingNonce", () => {
  it("should retrieve nonce 3", async () => {
    const mockValue = {
      type: 7,
      value: {
        type: 1,
        value: 3n,
      },
    };
    vi.mocked(callReadOnlyFunction).mockResolvedValue(mockValue);

    expect(await retrieveListingNonce()).toBe(3);
  });
});
