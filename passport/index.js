const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
   passport.serializeUser((user, done) => {
      done(null, user.UserId);
   });

   passport.deserializeUser((UserId, done) => {
      User.findOne({ UserId: UserId })
      .then(user => done(null, user))
      .catch(err => done(err));
   });

   local();
};