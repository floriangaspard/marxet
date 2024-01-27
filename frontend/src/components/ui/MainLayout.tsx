import ConnectWallet from "@/features/wallet/components/ConnectWallet";
import { Link, Outlet } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./NavigationMenu";

export const MainLayout = () => {
  return (
    <div className="container mx-auto h-screen flex flex-col justify-between">
      <NavigationMenu className="mb-10 max-h-[50px]">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="market" className={navigationMenuTriggerStyle()}>
              Market
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="mycollectibles" className={navigationMenuTriggerStyle()}>
              My collectibles
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
      <ConnectWallet />
    </div>
  );
};
