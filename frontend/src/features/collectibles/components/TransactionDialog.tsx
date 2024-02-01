import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { TRANSACTION_STATUS } from "../types/TransactionStatus";
import spinner from "@/assets/spinner.svg";
import check from "@/assets/check.svg";
import cancel from "@/assets/cancel.svg";
import { userSession } from "@/user-session";

export const TransactionDialog = ({
  buttonText,
  title,
  onClick,
  status,
}: {
  buttonText: string;
  title: string;
  onClick: () => void;
  status: TRANSACTION_STATUS;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={onClick} disabled={!userSession.isUserSignedIn()}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          {status === "SIGN" ? (
            <span className="flex items-center">
              <img src={spinner} className="animate-spin h-5 w-5 mr-3" />
              Signing transaction...
            </span>
          ) : status === "SIGNED" ? (
            <span className="flex items-center">
              <img src={check} className="h-5 w-5 mr-3" />
              Transaction signed
            </span>
          ) : (
            <span className="flex items-center">
              <img src={cancel} className="h-5 w-5 mr-3" />
              Transaction cancelled.
            </span>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
