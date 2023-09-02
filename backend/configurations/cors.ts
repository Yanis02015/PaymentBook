import Cors from "cors";

export const configureCors = Cors({
  origin: process.env.WEB_SITE_DOMAINE,
  credentials: true,
});
