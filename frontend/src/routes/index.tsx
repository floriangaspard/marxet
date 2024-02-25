import { MainLayout } from "@/components/ui/MainLayout";
import { Market } from "@/features/collectibles/components/Market";
import { MyCollectibles } from "@/features/collectibles/components/MyCollectibles";
import { Navigate, useRoutes } from "react-router-dom";

export const AppRoutes = () => {
  const routes = [
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
  ];

  const element = useRoutes([...routes]);

  return element;
};
