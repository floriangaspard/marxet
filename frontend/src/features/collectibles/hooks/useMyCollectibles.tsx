import { useCallback, useEffect, useState } from "react";
import { Collectible } from "../types/Collectible";
import { getHoldings, getMetadata, isWhitelisted } from "../api/collectibles";
import { addressToString, parseAssetInfoString } from "@stacks/transactions";

export const useMyCollectibles = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [isAssetWhitelisted, setIsAssetWhiteListed] = useState<{
    [fieldName: string]: boolean;
  }>({});

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

    await Promise.all(
      holdings.map(async (h) => {
        const infos = parseAssetInfoString(h.asset_identifier);
        h.metadata = await getMetadata(
          parseInt(h.value.repr.substring(1)),
          addressToString(infos.address),
          infos.contractName.content
        );
      })
    );

    setCollectibles(holdings);
    getWhitelistedStatus(holdings);
  }, [getWhitelistedStatus]);

  useEffect(() => {
    retrieveCollectibles();
  }, [retrieveCollectibles]);

  return {
    collectibles,
    isAssetWhitelisted,
  };
};
