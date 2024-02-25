import { AssetInfo, parseAssetInfoString } from "@stacks/transactions";
import { listCollectible } from "../api/collectibles";
import { Collectible } from "../types/Collectible";
import { TRANSACTION_STATUS } from "../types/TransactionStatus";
import { useState } from "react";

export const useListCollectible = () => {
  const [transactionStatus, setTransactionStatus] =
    useState<TRANSACTION_STATUS>("SIGN");

  const listAsset = async (
    collectible: Collectible,
    price: number,
    paymentAsset: string
  ) => {
    const tokenId = parseInt(collectible.value.repr.substring(1));
    const assetInfo = parseAssetInfoString(collectible.asset_identifier);

    let paymentAssetPrincipal: AssetInfo | undefined = undefined;
    if (paymentAsset !== "STX") {
      paymentAssetPrincipal = parseAssetInfoString(paymentAsset);
    }

    await listCollectible(
      tokenId,
      assetInfo,
      price * 1e6,
      paymentAssetPrincipal,
      () => {
        setTransactionStatus("SIGNED");
      },
      () => {
        setTransactionStatus("CANCELLED");
      }
    );
  };

  return { listAsset, transactionStatus, setTransactionStatus };
};
