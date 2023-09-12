import { queries } from "@/utils/queryKeys";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ globally default to 20 seconds
      staleTime: 1000 * 20,
      networkMode: "always", // A repenser; permet de faire la requete meme si ya pas de co
    },
    mutations: {
      networkMode: "always", // A repenser aussi ici
    },
  },
});

// 🚀 everything wilayas and comunnes will have a 24 hours staleTime
const H24 = 1000 * 60 * 60 * 24;
const M30 = 1000 * 60 * 30;
queryClient.setQueryDefaults(["wilayas"], { staleTime: H24 });
queryClient.setQueryDefaults(["communes"], { staleTime: H24 });
queryClient.setQueryDefaults([queries.loggedIn], { staleTime: M30 });
