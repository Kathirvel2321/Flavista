import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   GOOGLE STRATEGY
========================= */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"), null);

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            username: `${profile.displayName}_${Date.now().toString().slice(-5)}`,
            email,
            profileImageUrl: profile.photos?.[0]?.value,
            provider: "google",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

/* =========================
   SESSION HANDLING
========================= */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
