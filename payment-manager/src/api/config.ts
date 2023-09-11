import ky from "ky";
import { isDev, isSameSite } from "@/utils/functions";

const prefixUrl = `${import.meta.env.VITE_API_DOMAINE}/api`;
let credentials: RequestCredentials = "same-origin";

if (isDev() || !isSameSite()) {
  credentials = "include";
}

export const MakeRequest = ky.create({
  prefixUrl,
  credentials,
  hooks: {
    beforeError: [
      async (error) => {
        console.log("Ky hook error handler :");
        console.log(error);

        const { response } = error;

        if (response && response.body) {
          let message;
          try {
            const data = await response.json();
            message = data.message || data.error || "Erreur inconnu";
          } catch (error) {
            message = undefined;
          }
          error.name = "HTTPError";
          error.message = `${message} (${response.status})`;
        }

        return error;
      },
    ],
  },
});
