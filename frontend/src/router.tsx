import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Donate from "./views/Donate";
import Register from "./views/Register";
import Login from "./views/Login";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }, 
  {
    path: "/app",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> }, 
      { path: "/donate", element: <Donate /> },
    ],
  },
  { path: "/register", element: <Register /> } 
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}