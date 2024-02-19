import { useCallback, useEffect, useState } from "react";
import { ListedCollectible } from "../types/Collectible";
import {
  addressToString,
  callReadOnlyFunction,
  createAssetInfo,
  cvToValue,
  parseAssetInfoString,
  uintCV,
} from "@stacks/transactions";
import { StacksMocknet } from "@stacks/network";
import { userSession } from "@/user-session";
import { jsonParseCollectible } from "../utils/parsing";
import { TRANSACTION_STATUS } from "../types/TransactionStatus";
import { getNonFungibleAssetName } from "../api/collectibles";
import {
  buyCollectible,
  retrieveListingNonce,
} from "../api/listedCollectibles";

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
        retrieved.push(await jsonParseCollectible(response, i - 1));
      }
    }

    setCollectibles(retrieved);
  }, []);

  const buyAsset = async (collectible: ListedCollectible) => {
    const assetInfo = parseAssetInfoString(collectible.nftAssetContract);
    const assetName = await getNonFungibleAssetName(
      addressToString(assetInfo.address),
      assetInfo.contractName.content
    );

    buyCollectible(
      collectible,
      createAssetInfo(
        addressToString(assetInfo.address),
        assetInfo.contractName.content,
        assetName
      ),
      () => {
        setTransactionStatus("SIGNED");
      },
      () => {
        setTransactionStatus("CANCELLED");
      }
    );
  };

  useEffect(() => {
    retrieveCollectibles();
  }, [retrieveCollectibles]);

  return { collectibles, buyAsset, transactionStatus, setTransactionStatus };
};
