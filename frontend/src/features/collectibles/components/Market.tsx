import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useMarket } from "../hooks/useMarket";
import { TransactionDialog } from "./TransactionDialog";

export const Market = () => {
  const { collectibles, buyAsset, transactionStatus, setTransactionStatus } =
    useMarket();

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
                <span>
                  {collectible.paymentSymbol}: {collectible.price}
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
      })}
    </div>
  );
};
