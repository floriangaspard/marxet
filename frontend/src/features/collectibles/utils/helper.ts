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

export const getAssetName = async (address: string, contractName: string) => {
  const response = await fetch(
    "http://localhost:3999/v2/contracts/interface/" +
      address +
      "/" +
      contractName
  );
  return (await response.json())["non_fungible_tokens"][0]["name"];
};
