import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ globally default to 20 seconds
      staleTime: 1000 * 20,
    },
  },
});

// 🚀 everything wilayas and comunnes will have a 24 hours staleTime
const H24 = 1000 * 60 * 60 * 24;
queryClient.setQueryDefaults(["wilayas"], { staleTime: H24 });
queryClient.setQueryDefaults(["communes"], { staleTime: H24 });
