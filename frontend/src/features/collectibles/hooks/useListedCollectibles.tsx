import { useCallback, useEffect, useState } from "react";
import { ListedCollectible } from "../types/Collectible";
import {
  AssetInfo,
  addressToString,
  createAssetInfo,
  parseAssetInfoString,
} from "@stacks/transactions";
import { jsonParseCollectible } from "../utils/parsing";
import { TRANSACTION_STATUS } from "../types/TransactionStatus";
import {
  getFungibleAssetName,
  getFungibleAssetSymbol,
  getNonFungibleAssetName,
} from "../api/collectibles";
import {
  buyCollectible,
  retrieveListing,
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
      response = await retrieveListing(i - 1);

      if (response !== null) {
        const parsedCollectible = await jsonParseCollectible(response, i - 1);

        if (parsedCollectible.paymentAssetContract) {
          const assetInfo = parseAssetInfoString(
            parsedCollectible.paymentAssetContract as string
          );
          parsedCollectible.paymentSymbol = await getFungibleAssetSymbol(
            addressToString(assetInfo.address),
            assetInfo.contractName.content
          );

          parsedCollectible.paymentAssetName = await getFungibleAssetName(
            addressToString(assetInfo.address),
            assetInfo.contractName.content
          );
        } else {
          parsedCollectible.paymentSymbol = "STX";
        }

        retrieved.push(parsedCollectible);
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

    let paymentAssetInfo: AssetInfo | undefined = undefined;

    if (collectible.paymentAssetContract) {
      paymentAssetInfo = parseAssetInfoString(
        collectible.paymentAssetContract!
      );

      paymentAssetInfo = createAssetInfo(
        addressToString(paymentAssetInfo!.address),
        paymentAssetInfo!.contractName.content,
        collectible.paymentAssetName
      );
    }

    buyCollectible(
      collectible,
      createAssetInfo(
        addressToString(assetInfo.address),
        assetInfo.contractName.content,
        assetName
      ),
      paymentAssetInfo,
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
