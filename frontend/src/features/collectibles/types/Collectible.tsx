import { Metadata } from "./Metadata";

export type Collectible = {
  asset_identifier: string;
  value: {
    hex: string;
    repr: string;
  };
  block_height: number;
  tx_id: string;
  metadata: Metadata;
};
