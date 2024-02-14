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
import { TRANSACTION_STATUS } from "@/features/collectibles/types/TransactionStatus";
import { getHoldings, isWhitelisted } from "../api/collectibles";

export const useMyCollectibles = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
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
    const holdings = (await getHoldings())["results"] as Collectible[];

    setCollectibles(holdings);
    getWhitelistedStatus(holdings);
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
