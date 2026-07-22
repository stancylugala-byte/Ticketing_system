const passport        = require('passport');
const GoogleStrategy  = require('passport-google-oauth20').Strategy;
const db              = require('../models');
const { User }        = db;

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  '/api/auth/google/callback',
    scope:        ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email    = profile.emails?.[0]?.value;
      const googleId = profile.id;
      const fullName = profile.displayName || profile.name?.givenName || 'Google User';

      if (!email) return done(new Error('No email returned from Google'), null);

      // 1. Try to find by google_id
      let user = await User.findOne({ where: { google_id: googleId } });

      if (!user) {
        // 2. Try to find by email (existing account — link it)
        user = await User.findOne({ where: { email } });

        if (user) {
          // Link google_id to existing account
          await user.update({ google_id: googleId });
        } else {
          // 3. Create brand new user
          user = await User.create({
            full_name: fullName,
            email,
            password:  null,   // no password for OAuth users
            google_id: googleId,
            role:      'Client',
          });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// We don't use sessions — JWT only. These are required by passport but won't be used.
passport.serializeUser((user, done)   => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (e) { done(e, null); }
});

module.exports = passport;
