import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/auth";
import Login from "./pages/Login";
import Worker from "./pages/Worker";
import Workers from "./pages/Workers";
import { PATHS } from "./utils/paths";

export const router = () =>
  createBrowserRouter([
    {
      path: PATHS.HOME,
      element: <Navigate to={PATHS.DASHBOARD} />,
    },
    {
      path: PATHS.LOGIN,
      element: <Login />,
    },
    {
      path: PATHS.DASHBOARD,
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={PATHS.WORKERS} />,
        },
        {
          path: PATHS.WORKERS,
          element: <Workers />,
        },
        {
          path: PATHS.WORKER,
          element: <Worker />,
        },
      ],
    },
  ]);
