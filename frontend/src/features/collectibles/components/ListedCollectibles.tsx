import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useListedCollectibles } from "../hooks/useListedCollectibles";

export const ListedCollectibles = () => {
  const { collectibles, buyAsset } = useListedCollectibles();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {collectibles.map((collectible) => {
        return (
          <Card key={collectible.nftAssetContract + collectible.tokenId}>
            <CardHeader>
              <CardTitle>{collectible.nftAssetContract}</CardTitle>
            </CardHeader>
            <CardContent>{collectible.tokenId}</CardContent>
            <CardFooter>
              <div className="flex justify-between w-full items-center">
                <span>STX: {collectible.price}</span>
                <Button
                  onClick={() => {
                    buyAsset(collectible);
                  }}
                >
                  Buy
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
