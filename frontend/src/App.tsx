import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./router";

export default function App() {
  return (
    <>
      <RouterProvider router={router()} />
      <ReactQueryDevtools />
    </>
  );
}
