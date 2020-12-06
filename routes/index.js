const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();


router.use((req, res, next) => {
   res.locals.user = req.user;
   next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'ABOUT' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입' });
});

router.get('/', async (req, res, next) => {
  
    res.render('main', {
      title: 'HW1 AT routes/index.js',
    });
});

/*
router.get('/', (req, res) => {
  // res.send('HELLO, EXPRESS');
  res.render('main', {});
});
*/
/*
router.get('/join', isNotLoggedIn, (req, res) => {
  // res.send('HELLO, EXPRESS');
  res.render('join', { title: '회원가입'});
});*/
module.exports = router;