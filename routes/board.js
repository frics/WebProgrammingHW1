const express = require('express');
const moment = require("moment");

const Board = require('../models/board');

const router = express.Router();

const { isLoggedIn } = require('./middlewares');

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    console.log("checkchekccdashfasdfsdfasfasdfas!!");
    console.log(req.user);
    console.log(req.body);
    console.log(req.body.title);
    console.log(req.user.UserId);
    console.log(req.body.content);
    const board = await Board.create({
      title: req.body.title,
      writer: req.user.UserId,
      content: req.body.content,
    });
    
    //const hashtags = req.body.content.match(/#[^\s#]*/g);
    /*
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      
      await post.addHashtags(result.map(r => r[0]));
    }
    */
    res.redirect('/board');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/delete',function(req,res,next)
{
    var idx = req.body.idx;

    var datas = [idx,passwd];

    conn.query(sql,datas, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows == 0)
        {
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        }
        else
        {
            res.redirect('/board/list/');
        }
    });
});


router.get('/', async (req, res, next) => {
  try {
    const board = await Board.find({});
    console.log(board);
    console.log(moment(board.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    res.render('board', {
      boards: board,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



module.exports = router;