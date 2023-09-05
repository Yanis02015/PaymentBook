import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./utils/paths";
import Home from "./pages/Home";

export const router = () =>
  createBrowserRouter([
    {
      path: PATHS.HOME,
      element: <Home />,
    },
  ]);
