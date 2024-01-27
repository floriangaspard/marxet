import { ListedCollectible } from "../types/Collectible";

export const jsonParseCollectible = (
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

  return parsed as ListedCollectible;
};
