import { useCallback, useEffect, useState } from "react";
import { Collectible } from "../types/Collectible";
import { getHoldings, isWhitelisted } from "../api/collectibles";

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
