import { ListedCollectible } from "../types/Collectible";

export const jsonParseCollectible = async (
  response: {
    value: { [key: string]: { value: unknown } };
  },
  listingId: number
) => {
  const parsed: { [key: string]: unknown } = {};

  Object.keys(response.value).forEach((key) => {
    let newKey = key;
    if (key === "nft-asset-contract") newKey = "nftAssetContract";
    else if (key === "payment-asset-contract") newKey = "paymentAssetContract";
    else if (key === "token-id") newKey = "tokenId";

    parsed[newKey] =
      response.value[key] !== undefined ? response.value[key]["value"] : null;
  });

  parsed["listingId"] = listingId;

  if (parsed["paymentAssetContract"]) {
    parsed["paymentAssetContract"] = (
      parsed["paymentAssetContract"] as { [key: string]: { value: "string" } }
    )["value"];
  }

  return parsed as ListedCollectible;
};
