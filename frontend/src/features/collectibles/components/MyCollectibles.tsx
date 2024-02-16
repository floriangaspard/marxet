import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { useMyCollectibles } from "../hooks/useMyCollectibles";
import { ListCollectible } from "./ListCollectible";

export const MyCollectibles = () => {
  const { collectibles, isAssetWhitelisted } = useMyCollectibles();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {collectibles.map((collectible) => {
        return (
          <Card key={collectible.tx_id}>
            <CardHeader>
              <CardTitle>{collectible.asset_identifier}</CardTitle>
            </CardHeader>
            <CardContent>{collectible.value.repr}</CardContent>
            <CardFooter className="gap-4 flex flex-col items-start">
              {isAssetWhitelisted[collectible.asset_identifier] && (
                <ListCollectible collectible={collectible} />
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
