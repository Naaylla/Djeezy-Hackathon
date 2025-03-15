import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import Donate from "./views/Donate";
import Register from "./views/Register";
import Login from "./views/Login";
import Profile from "./components/Profile";
import MyDonations from "./components/MyDonations";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/donate", element: <Donate /> },
      { path: "/profile", element: <Profile /> },
      { path: "/my-donations", element: <MyDonations /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
