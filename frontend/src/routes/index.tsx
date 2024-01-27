import { MainLayout } from "@/components/ui/MainLayout";
import { ListedCollectibles } from "@/features/collectibles/components/ListedCollectibles";
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
          element: <ListedCollectibles />,
        },
      ],
    },
  ];

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
