import { Link, Navigate, createBrowserRouter } from "react-router-dom";
import { PATHS } from "./utils/paths";
import Login from "./pages/Login";
import AuthLayout from "./layouts/auth";
import Workers from "./pages/Workers";

export const router = () =>
  createBrowserRouter([
    {
      path: PATHS.HOME,
      element: (
        <ul>
          <li>
            Dashboard : <Link to={PATHS.DASHBOARD}>{PATHS.DASHBOARD}</Link>
          </li>
          <li>
            Payments : <Link to={PATHS.PAYMENTS}>{PATHS.PAYMENTS}</Link>
          </li>
        </ul>
      ),
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
      ],
    },
  ]);
