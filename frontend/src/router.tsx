import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Donate from "./views/Donate";
import Register from "./views/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/donate", element: <Donate /> }
    ],
  },
  { path: "/register", element: <Register /> } 
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
