export type Collectible = {
  asset_identifier: string;
  value: {
    hex: string;
    repr: string;
  };
  block_height: number;
  tx_id: string;
};

export type ListedCollectible = {
  listingId: number;
  expiry: string;
  maker: string;
  nftAssetContract: string;
  paymentAssetContract: string | undefined;
  price: string;
  taker: string | undefined;
  tokenId: string;
  paymentSymbol: string;
};
