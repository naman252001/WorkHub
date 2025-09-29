// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/User");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             password: null, // not needed for Google login
//             role: "employee",
//           });
//         }
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then((user) => done(null, user))
//     .catch((err) => done(err, null));
// });

// module.exports = passport;


// backend/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Case 1: Existing User - Proceed to login
          return done(null, user);
        }

        // Check if a user with this email already exists but without Google ID (unlinked account)
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            // Case 2: User exists with email but needs to link Google ID
            // For now, we treat this as a new social user to enforce role/password setup
            // You can refine this later to link accounts automatically.
        }

        // Case 3: New User - Pass temporary data to the router to force signup completion
        const tempUser = {
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          isNewSocialUser: true, // Flag to indicate incomplete signup
        };

        return done(null, tempUser); // Pass tempUser to the next step (authRoutes)
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // If it's a temp user object, we serialize the temp data. 
  // Otherwise, we serialize the user ID.
  if (user.isNewSocialUser) {
    done(null, { ...user }); // Serialize the temporary object
  } else {
    done(null, user.id); // Serialize the actual user ID
  }
});

passport.deserializeUser((data, done) => {
  if (data.isNewSocialUser) {
    // If it's a temp user object, return it as is for processing
    done(null, data);
  } else {
    // If it's a user ID, look up the full user object
    User.findById(data)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  }
});

module.exports = passport;