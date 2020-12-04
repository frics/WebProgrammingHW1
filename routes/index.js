const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  // res.send('HELLO, EXPRESS');
  res.render('main', {});
});

module.exports = router;