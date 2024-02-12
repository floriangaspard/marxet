import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { useMyCollectibles } from "../hooks/useMyCollectibles";
import { useRef } from "react";
import { TransactionDialog } from "./TransactionDialog";

export const MyCollectibles = () => {
  const {
    collectibles,
    isAssetWhitelisted,
    listAsset,
    transactionStatus,
    setTransactionStatus,
  } = useMyCollectibles();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {collectibles.map((collectible, idx) => {
        return (
          <Card key={collectible.tx_id}>
            <CardHeader>
              <CardTitle>{collectible.asset_identifier}</CardTitle>
            </CardHeader>
            <CardContent>{collectible.value.repr}</CardContent>
            <CardFooter>
              {isAssetWhitelisted[collectible.asset_identifier] && (
                <>
                  <Input
                    type="number"
                    ref={(el) =>
                      (inputRefs.current[idx] = el as HTMLInputElement)
                    }
                  ></Input>
                  <TransactionDialog
                    buttonText="List"
                    title="Listing asset"
                    status={transactionStatus}
                    onClick={async () => {
                      setTransactionStatus("SIGN");
                      await listAsset(
                        collectible,
                        parseInt(inputRefs.current[idx].value)
                      );
                    }}
                  />
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
