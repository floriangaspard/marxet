import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useMarket } from "../hooks/useMarket";
import { TransactionDialog } from "./TransactionDialog";

const getImageUrl = (image: string) => {
  if (image.includes("ipfs://ipfs/"))
    image = image.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
  else if (image.includes("ipfs://"))
    image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

  return image;
};

export const Market = () => {
  const { collectibles, buyAsset, transactionStatus, setTransactionStatus } =
    useMarket();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {collectibles.map((collectible) => {
        if (collectible.metadata) {
          return (
            <Card key={collectible.nftAssetContract + collectible.tokenId}>
              <CardHeader>
                <CardTitle>{collectible.metadata.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center">
                    <img
                      className="h-[300px]"
                      src={getImageUrl(collectible.metadata.image)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full items-center">
                  <span className="font-bold">
                    {collectible.price} {collectible.paymentSymbol}
                  </span>
                  <TransactionDialog
                    buttonText="Buy"
                    status={transactionStatus}
                    title="Buy asset"
                    onClick={() => {
                      setTransactionStatus("SIGN");
                      buyAsset(collectible);
                    }}
                  />
                </div>
              </CardFooter>
            </Card>
          );
        }
      })}
    </div>
  );
};
