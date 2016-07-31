var express = require('express');
var router = express.Router();

/* GET home page. */
//首页
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
  //res.redirect('/article/list');
});

router.get('/index.html', function(req, res, next) {
  res.render('index', { title: '首页' });
});

module.exports = router;
