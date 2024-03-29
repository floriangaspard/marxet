import { Metadata } from "./Metadata";

export type ListedCollectible = {
  listingId: number;
  expiry: string;
  maker: string;
  nftAssetContract: string;
  paymentAssetContract: string | undefined;
  price: number;
  taker: string | undefined;
  tokenId: string;
  paymentSymbol: string;
  paymentAssetName: string;
  metadata: Metadata;
};
