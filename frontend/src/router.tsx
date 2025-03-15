import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Donate from "./views/Donate";
import Register from "./views/Register";
import Login from "./views/Login"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/donate", element: <Donate /> },
      { path: "/register", element: <Register /> },
      { path: "/Login", element: <Home /> }

    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
