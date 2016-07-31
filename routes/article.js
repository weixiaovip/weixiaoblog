/**
 * Created by wx on 2016/7/30.
 */
var express = require('express');
var router = express.Router();
var auth = require('../middle'); //权限中间件
var markdown = require('markdown').markdown;
/* GET home page. */
router.get('/list',auth.checkLogin, function(req, res) {
    Model('article').find().populate('user').exec(function(err,docs){
        if(err){
            console.log('查询文章失败');
        }else{
            docs.forEach(function(doc){
                doc.content = markdown.toHTML(doc.content);
            });
            res.render('article/list',{title:'文章列表',articles:docs});
        }

    });
});

//注册页面
router.get('/add',auth.checkLogin, function(req, res) {
    res.render('article/add', { title: '发表文章' });
});

router.post('/add', function(req, res) {
    var article = req.body;
    article.user = req.session.user._id; //当前用户的id
    Model('article').create(article,function(err,doc){
        if(err){
            req.flash('error','发表文章失败');
            res.redirect('back');
        }else{
            req.flash('success','发表文章成功');
            res.redirect('/');
        }
    })
});

//详情页
router.get('/detail/:_id', function(req, res) {
    console.log('11111111111111111111111');
    console.log(req.params);
    Model('article').findById(req.params._id,function(err,doc){
        res.render('article/detail',{title:'文章详情',article:doc})
    })
});

router.get('/delete/:_id', function(req, res) {
    console.log('delete-----------------');
    Model('article').findById(req.params._id,function(err,doc){
        if(doc){
            if(req.session.user._id == doc.user){
                Model('article').remove({_id:req.params._id},function(err,doc){
                    req.flash('success','删除成功');
                    res.redirect('/');
                })
            }else{
                req.flash('error','不是你发表的文章，不能删除');
                res.redirect('back');
            }
        }else{
            req.flash('error','删除文章失败,没有找到对应文章');
            res.redirect('back');
        }
    })

});

module.exports = router;