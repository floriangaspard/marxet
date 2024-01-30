import { openContractCall } from "@stacks/connect";
import { userSession } from "../../../user-session";
import { StacksMocknet } from "@stacks/network";
import {
  AnchorMode,
  NonFungibleConditionCode,
  addressToString,
  callReadOnlyFunction,
  contractPrincipalCV,
  cvToValue,
  makeStandardNonFungiblePostCondition,
  noneCV,
  parseAssetInfoString,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { useCallback, useEffect, useState } from "react";
import { Collectible } from "../types/Collectible";

export const useMyCollectibles = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [isAssetWhitelisted, setIsAssetWhiteListed] = useState<{
    [fieldName: string]: boolean;
  }>({});

  const isWhitelisted = async (contract: string) => {
    return cvToValue(
      await callReadOnlyFunction({
        network: new StacksMocknet(),
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "marxet",
        functionName: "is-whitelisted",
        functionArgs: [
          contractPrincipalCV(contract.split(".")[0], contract.split(".")[1]),
        ],
        senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
      })
    );
  };

  const getWhitelistedStatus = useCallback(
    async (collectibles: Collectible[]) => {
      const unique = [
        ...new Set(
          collectibles.map((collectible) => collectible.asset_identifier)
        ),
      ];
      unique.map(async (asset) => {
        const isW = await isWhitelisted(asset.split("::")[0]);
        setIsAssetWhiteListed((prev) => ({
          ...prev,
          [asset]: isW,
        }));
      });
    },
    []
  );

  const retrieveCollectibles = useCallback(async () => {
    const retrievedMessage = await fetch(
      "http://localhost:3999/extended/v1/tokens/nft/holdings?" +
        new URLSearchParams({
          principal: userSession.loadUserData().profile.stxAddress.testnet,
        })
    );
    const responseJson = await retrievedMessage.json();
    const result = responseJson["results"] as Collectible[];
    setCollectibles(result);
    getWhitelistedStatus(result);
  }, [getWhitelistedStatus]);

  const listAsset = async (collectible: Collectible, price: number) => {
    const tokenId = parseInt(collectible.value.repr.substring(1));
    const assetInfo = parseAssetInfoString(collectible.asset_identifier);

    await openContractCall({
      network: new StacksMocknet(),
      anchorMode: AnchorMode.OnChainOnly,

      postConditions: [
        makeStandardNonFungiblePostCondition(
          userSession.loadUserData().profile.stxAddress.testnet,
          NonFungibleConditionCode.Sends,
          assetInfo,
          uintCV(tokenId)
        ),
      ],

      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "marxet",
      functionName: "list-asset",
      functionArgs: [
        contractPrincipalCV(
          addressToString(assetInfo.address),
          assetInfo.contractName.content
        ),
        tupleCV({
          taker: noneCV(),
          "token-id": uintCV(tokenId),
          expiry: uintCV(500),
          price: uintCV(price),
          "payment-asset-contract": noneCV(),
        }),
      ],

      onFinish: (response) => {
        console.log(response);
        // WHEN user confirms pop-up
      },
      onCancel: () => {
        // WHEN user cancels/closes pop-up
      },
    });
  };

  useEffect(() => {
    retrieveCollectibles();
  }, [retrieveCollectibles]);

  return { collectibles, isAssetWhitelisted, listAsset };
};
