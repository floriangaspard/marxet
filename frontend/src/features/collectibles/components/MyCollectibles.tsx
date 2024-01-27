import { Input } from "@/components/ui/Input";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { useMyCollectibles } from "../hooks/useMyCollectibles";
import { useRef } from "react";

export const MyCollectibles = () => {
  const { collectibles, isAssetWhitelisted, listAsset } = useMyCollectibles();
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
              {isAssetWhitelisted && (
                <>
                  <Input
                    type="number"
                    ref={(el) =>
                      (inputRefs.current[idx] = el as HTMLInputElement)
                    }
                  ></Input>
                  <Button
                    onClick={async () => {
                      await listAsset(
                        collectible,
                        parseInt(inputRefs.current[idx].value)
                      );
                    }}
                  >
                    List
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
