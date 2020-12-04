const express = require('express');

const router = express.Router();

router.route('/')
.get((req, res) => {
   res.send('GET /test');
})
.post((req, res) => {
   res.send('POST /test');
});

module.exports = router;