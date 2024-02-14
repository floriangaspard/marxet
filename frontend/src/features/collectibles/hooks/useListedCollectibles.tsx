import { useCallback, useEffect, useState } from "react";
import { ListedCollectible } from "../types/Collectible";
import {
  AnchorMode,
  FungibleConditionCode,
  NonFungibleConditionCode,
  addressToString,
  callReadOnlyFunction,
  contractPrincipalCV,
  createAssetInfo,
  cvToValue,
  makeContractNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  parseAssetInfoString,
  uintCV,
} from "@stacks/transactions";
import { StacksMocknet } from "@stacks/network";
import { userSession } from "@/user-session";
import { jsonParseCollectible } from "../utils/parsing";
import { openContractCall } from "@stacks/connect";
import { TRANSACTION_STATUS } from "../types/TransactionStatus";
import { getAssetName } from "../api/collectibles";
import { retrieveListingNonce } from "../api/listedCollectibles";

export const useListedCollectibles = () => {
  const [collectibles, setCollectibles] = useState<ListedCollectible[]>([]);
  const [transactionStatus, setTransactionStatus] =
    useState<TRANSACTION_STATUS>("SIGN");

  const retrieveCollectibles = useCallback(async () => {
    let response = { value: {} };
    const retrieved: ListedCollectible[] = [];
    const nonce = await retrieveListingNonce();

    for (let i = nonce; i > 0; i--) {
      response = cvToValue(
        await callReadOnlyFunction({
          network: new StacksMocknet(),
          contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          contractName: "marxet",
          functionName: "get-listing",
          functionArgs: [uintCV(i - 1)],
          senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
        })
      );

      if (response !== null) {
        retrieved.push(jsonParseCollectible(response, i - 1));
      }
    }

    setCollectibles(retrieved);
  }, []);

  const buyAsset = async (collectible: ListedCollectible) => {
    const assetInfo = parseAssetInfoString(collectible.nftAssetContract);
    const assetName = await getAssetName(
      addressToString(assetInfo.address),
      assetInfo.contractName.content
    );

    await openContractCall({
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "marxet",
      functionName: "fulfil-listing-stx",
      functionArgs: [
        uintCV(collectible.listingId),
        contractPrincipalCV(
          addressToString(assetInfo.address),
          assetInfo.contractName.content
        ),
      ],

      anchorMode: AnchorMode.OnChainOnly,
      network: new StacksMocknet(),

      postConditions: [
        makeContractNonFungiblePostCondition(
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          "marxet",
          NonFungibleConditionCode.Sends,
          createAssetInfo(
            addressToString(assetInfo.address),
            assetInfo.contractName.content,
            assetName
          ),
          uintCV(collectible.tokenId)
        ),
        makeStandardSTXPostCondition(
          userSession.loadUserData().profile.stxAddress.testnet,
          FungibleConditionCode.Equal,
          collectible.price
        ),
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

  return { collectibles, buyAsset, transactionStatus, setTransactionStatus };
};
