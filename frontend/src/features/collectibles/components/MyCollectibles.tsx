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
        if (collectible.metadata) {
          return (
            <Card key={collectible.tx_id}>
              <CardHeader>
                <CardTitle>{collectible.metadata.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center">
                    <img
                      className="h-[300px]"
                      src={collectible.metadata.image}
                    />
                  </div>

                  {collectible.metadata.description}
                </div>
              </CardContent>
              <CardFooter className="gap-4 flex flex-col items-start">
                {isAssetWhitelisted[collectible.asset_identifier] && (
                  <ListCollectible collectible={collectible} />
                )}
              </CardFooter>
            </Card>
          );
        }
      })}
    </div>
  );
};
