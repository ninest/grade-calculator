import { GPACalculatorRoute } from "@/routes/gpa-calculator/route";
import { RootRoute } from "@/routes/root";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    children: [
      // { path: "/", element: <CalculatorRouteRedirector /> },
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
