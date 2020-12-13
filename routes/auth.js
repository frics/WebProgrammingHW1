const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { UserId, UserName, UserPassword } = req.body;
  try {
    const exUser = await User.findOne( { UserId: UserId  });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(UserPassword, 12);
    await User.create({
      UserId: UserId,
      UserName: UserName, 
      UserPassword: hash,
    });
    console.log('메인으로 간다.');
    return res.redirect('./');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      console.log("11111111111111111");
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.log("12222222222");
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('back');
      
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
