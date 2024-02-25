import { MainLayout } from "@/components/ui/MainLayout";
import { Market } from "@/features/collectibles/components/Market";
import { MyCollectibles } from "@/features/collectibles/components/MyCollectibles";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

export const AppRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="/market" replace /> },
        {
          path: "mycollectibles",
          element: <MyCollectibles />,
        },
        {
          path: "market",
          element: <Market />,
        },
      ],
    },
  ]);

  // const element = useRoutes([...routes]);

  return <RouterProvider router={routes} />;
};
