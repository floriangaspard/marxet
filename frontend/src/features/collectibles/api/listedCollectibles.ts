import { userSession } from "@/user-session";
import { StacksMocknet } from "@stacks/network";
import { callReadOnlyFunction, cvToValue } from "@stacks/transactions";

export const retrieveListingNonce = async () => {
  return parseInt(
    cvToValue(
      await callReadOnlyFunction({
        network: new StacksMocknet(),
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "marxet",
        functionName: "get-listing-nonce",
        functionArgs: [],
        senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
      })
    )["value"]
  );
};
