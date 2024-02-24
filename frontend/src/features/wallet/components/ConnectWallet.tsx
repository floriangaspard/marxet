import { showConnect } from "@stacks/connect";

import { userSession } from "../../../user-session";
import { Button } from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import fetchExplorer from "@/utils/fetchExplorer";

function authenticate() {
  showConnect({
    appDetails: {
      name: "Marxet",
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
  const [stxBalance, setStxBalance] = useState("0");

  useEffect(() => {
    const getWalletBalance = async () => {
      const balances = await fetchExplorer(
        "/extended/v1/address/" +
          userSession.loadUserData().profile.stxAddress.testnet +
          "/balances"
      );

      setStxBalance((await balances.json())["stx"]["balance"]);
    };

    getWalletBalance();
  }, []);

  return (
    <div className="flex gap-5 items-center">
      {userSession.isUserSignedIn() ? (
        <>
          <Button onClick={disconnect}>Disconnect Wallet</Button>
          <div className="flex flex-col">
            <p className="text-xs">
              {userSession.loadUserData().profile.stxAddress.mainnet}
            </p>
            <p className="text-xl font-bold">{stxBalance} STX</p>
          </div>
        </>
      ) : (
        <Button onClick={authenticate}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default ConnectWallet;
