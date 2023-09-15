import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./router";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <>
      <RouterProvider router={router()} />
      <Toaster />
      <ReactQueryDevtools />
    </>
  );
}
