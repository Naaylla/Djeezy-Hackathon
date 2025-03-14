import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Donate from "./views/Donate";
import Register from "./views/Register"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Register /> },
      { path: "/donate", element: <Donate /> },
      { path: "/register", element: <Home /> }
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
