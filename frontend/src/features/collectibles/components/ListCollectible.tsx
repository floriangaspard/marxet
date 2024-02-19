import { Input } from "@/components/ui/Input";
import { useRef, useState } from "react";
import { PaymentAssetChoice } from "./PaymentAssetChoice";
import { TransactionDialog } from "./TransactionDialog";
import { useListCollectible } from "../hooks/useListCollectible";
import { Collectible } from "../types/Collectible";

export const ListCollectible = ({
  collectible,
}: {
  collectible: Collectible;
}) => {
  const [paymentAsset, setPaymentAsset] = useState("");
  const { listAsset, transactionStatus, setTransactionStatus } =
    useListCollectible();

  const inputRefs = useRef<HTMLInputElement>();

  return (
    <>
      <div className="flex gap-2">
        <Input
          type="number"
          ref={(el) => (inputRefs.current = el as HTMLInputElement)}
          placeholder="price"
        ></Input>
        <PaymentAssetChoice value={paymentAsset} setValue={setPaymentAsset} />
      </div>

      <TransactionDialog
        buttonText="List"
        title="Listing asset"
        status={transactionStatus}
        onClick={async () => {
          setTransactionStatus("SIGN");
          await listAsset(
            collectible,
            parseInt(inputRefs.current!.value),
            paymentAsset
          );
        }}
      />
    </>
  );
};
