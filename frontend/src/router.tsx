import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import Donate from "./views/Donate";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/donate", element: <Donate /> },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
