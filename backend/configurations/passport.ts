import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy((username, password, done) => {
    // Vérification des informations d'authentification ici
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return done(null, { username });
    } else {
      return done(null, false, { message: "Identifiants incorrects" });
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  // Recherche de l'utilisateur par son ID, par exemple depuis une base de données
  done(null, { id, username: process.env.ADMIN_USERNAME });
});
