import { GPACalculatorRoute } from "@/routes/gpa-calculator/route";
import { RootRoute } from "@/routes/root";
import { ShareGradesRoute } from "@/routes/share-grades/route";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    children: [
      { path: "/share/:data", element: <ShareGradesRoute /> },
      {
        path: "/:tabId?",
        element: <GPACalculatorRoute />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
