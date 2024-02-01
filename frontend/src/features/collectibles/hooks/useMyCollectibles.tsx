import { openContractCall } from "@stacks/connect";
import { userSession } from "../../../user-session";
import { StacksMocknet } from "@stacks/network";
import {
  AnchorMode,
  NonFungibleConditionCode,
  addressToString,
  contractPrincipalCV,
  makeStandardNonFungiblePostCondition,
  noneCV,
  parseAssetInfoString,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { useCallback, useEffect, useState } from "react";
import { Collectible } from "../types/Collectible";
import { isWhitelisted } from "../utils/helper";
import { TRANSACTION_STATUS } from "@/features/collectibles/types/TransactionStatus";

export const useMyCollectibles = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([
    {
      asset_identifier: "ST123.asd::aa",
      block_height: 0,
      tx_id: "1",
      value: { hex: "11", repr: "2" },
    },
  ]);
  const [isAssetWhitelisted, setIsAssetWhiteListed] = useState<{
    [fieldName: string]: boolean;
  }>({});
  const [transactionStatus, setTransactionStatus] =
    useState<TRANSACTION_STATUS>("SIGN");

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

      onFinish: () => {
        setTransactionStatus("SIGNED");
      },
      onCancel: () => {
        setTransactionStatus("CANCELLED");
      },
    });
  };

  useEffect(() => {
    retrieveCollectibles();
  }, [retrieveCollectibles]);

  return {
    collectibles,
    isAssetWhitelisted,
    listAsset,
    transactionStatus,
    setTransactionStatus,
  };
};
