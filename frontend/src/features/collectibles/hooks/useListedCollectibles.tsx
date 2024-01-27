import { useCallback, useEffect, useState } from "react";
import { ListedCollectible } from "../types/Collectible";
import {
  AnchorMode,
  FungibleConditionCode,
  NonFungibleConditionCode,
  callReadOnlyFunction,
  contractPrincipalCV,
  createAssetInfo,
  cvToValue,
  makeContractNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  uintCV,
} from "@stacks/transactions";
import { StacksMocknet } from "@stacks/network";
import { userSession } from "@/user-session";
import { jsonParseCollectible } from "../utils/parsing";
import { openContractCall } from "@stacks/connect";

export const useListedCollectibles = () => {
  const [collectibles, setCollectibles] = useState<ListedCollectible[]>([]);

  const retrieveListingNonce = async () => {
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

  const retrieveCollectibles = useCallback(async () => {
    let response = { value: {} };
    const retrieved: ListedCollectible[] = [];
    const nonce = await retrieveListingNonce();

    for (let i = nonce; i >= 0; i--) {
      response = cvToValue(
        await callReadOnlyFunction({
          network: new StacksMocknet(),
          contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          contractName: "marxet",
          functionName: "get-listing",
          functionArgs: [uintCV(i)],
          senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
        })
      );

      if (response !== null) {
        retrieved.push(jsonParseCollectible(response, i));
      }
    }

    setCollectibles(retrieved);
  }, []);

  const getAssetName = async (address: string, contractName: string) => {
    const response = await fetch(
      "http://localhost:3999/v2/contracts/interface/" +
        address +
        "/" +
        contractName
    );
    return (await response.json())["non_fungible_tokens"][0]["name"];
  };

  const buyAsset = async (collectible: ListedCollectible) => {
    const collectibleAddress = collectible.nftAssetContract.split(".")[0];
    const collectibleContractName = collectible.nftAssetContract.split(".")[1];

    await openContractCall({
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "marxet",
      functionName: "fulfil-listing-stx",
      functionArgs: [
        uintCV(collectible.listingId),
        contractPrincipalCV(collectibleAddress, collectibleContractName),
      ],

      anchorMode: AnchorMode.OnChainOnly,
      network: new StacksMocknet(),

      postConditions: [
        makeContractNonFungiblePostCondition(
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          "marxet",
          NonFungibleConditionCode.Sends,
          createAssetInfo(
            collectibleAddress,
            collectibleContractName,
            await getAssetName(collectibleAddress, collectibleContractName)
          ),
          uintCV(collectible.tokenId)
        ),
        makeStandardSTXPostCondition(
          userSession.loadUserData().profile.stxAddress.testnet,
          FungibleConditionCode.Equal,
          collectible.price
        ),
      ],
    });
  };

  useEffect(() => {
    retrieveCollectibles();
  }, [retrieveCollectibles]);

  return { collectibles, buyAsset };
};
