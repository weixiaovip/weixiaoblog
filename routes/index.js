var express = require('express');
var fs = require('fs');
var formidable = require('formidable');
var router = express.Router();

/* GET home page. */
//首页
router.get('/', function(req, res, next) {
    if(req.session.user){
        res.render('index', { title: '首页' });
    }else{
        res.redirect('/article/list');
    }
});

router.get('/index.html', function(req, res, next) {
  res.render('index', { title: '首页' });
});

//demo6上传文件的post接口
router.post('/upload', function(req, res, next) {

    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields,files){
      fs.createReadStream(files.fileContent.path).pipe(fs.createWriteStream('../public/demo/6.upLoad/uploadFile/'+files.fileContent.name));
    });

    form.on('end',function(){
      res.send('上传完成！');
    })

});

module.exports = router;
