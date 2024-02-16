import { showConnect } from "@stacks/connect";

import { userSession } from "../../../user-session";
import { Button } from "../../../components/ui/Button";

function authenticate() {
  showConnect({
    appDetails: {
      name: "Stacks React Starter",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  return (
    <div className="flex gap-5 items-center">
      {userSession.isUserSignedIn() ? (
        <>
          <Button onClick={disconnect}>Disconnect Wallet</Button>
          <p className="text-xs">
            mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}
          </p>
          <p className="text-xs">
            testnet: {userSession.loadUserData().profile.stxAddress.testnet}
          </p>
        </>
      ) : (
        <Button onClick={authenticate}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default ConnectWallet;
