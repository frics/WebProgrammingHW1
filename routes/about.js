const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('about', {
    title: "ABOUT"
  });
});

module.exports = router;