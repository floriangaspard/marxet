import ConnectWallet from "@/features/wallet/components/ConnectWallet";
import { Link, Outlet } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./NavigationMenu";
import { userSession } from "@/user-session";

export const MainLayout = () => {
  return (
    <div className="py-3 w-screen h-screen flex flex-col justify-between">
      <NavigationMenu className="px-9 mb-5 max-h-[50px] sticky top-0 bg-white">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="market" className={navigationMenuTriggerStyle()}>
              Market
            </Link>
          </NavigationMenuItem>
          {userSession.isUserSignedIn() && (
            <NavigationMenuItem>
              <Link
                to="mycollectibles"
                className={navigationMenuTriggerStyle()}
              >
                My collectibles
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="mx-9 h-full overflow-y-scroll no-scrollbar bg-gray-100 p-10 rounded-lg">
        <Outlet />
      </div>
      <div className="sticky bottom-0 bg-white pt-4 px-9">
        <ConnectWallet />
      </div>
    </div>
  );
};
