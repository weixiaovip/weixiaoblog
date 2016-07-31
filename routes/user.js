var express = require('express');
var util = require('../utils'); //工具方法
var router = express.Router();
var auth = require('../middle'); //权限中间件
/* GET users listing. */
//注册页面
router.get('/reg',auth.checkNotLogin, function (req, res, next) {
    res.render('user/reg', {title: '注册'});
});

//注册页面
router.post('/reg', function (req, res, next) {
    var user = req.body;
    if (user.password != user.repassword) { //判断两次输入的密码是否相同，用工具可以直接发送，不经过前端验证
        //向session中写入一个消息，类型时error
        req.flash('error','密码和重复密码不一致');
        //req.flash('error');//一旦读取之后，就销毁了
        return res.redirect('back');
    }
    //向数据库保存用户
    /*
     * 1、对用户密码加密
     * 2、得到用户的头像
     *
     * */
    user.password = util.md5(user.password);
    //得到用户的头像
    user.avatar = "https://secure.gravatar.com/avatar/"
        + util.md5(user.email) + "?s=32";
    Model('user').create(user, function (err, doc) {
        if (err) {
            req.flash('error','注册失败');
            return res.redirect('back');
        } else {
            //如果此客户端在服务器端的session中有user表示已登录
            req.flash('success','注册成功');
            req.session.user = doc;
            return res.redirect('/');
        }
    })
});

//登录页面
router.get('/login',auth.checkNotLogin, function (req, res, next) {
    res.render('user/login', {title: '登录'});
});

router.post('/login', function (req, res, next) {
    var user = req.body;
    user.password = util.md5(user.password);
    Model('user').findOne(user, function (err, doc) {
        if (err) {
            req.flash('error','登录失败');
            res.redirect('back');
        } else {
            if (doc) {
                req.session.user = doc;
                req.flash('success','登录成功');
                return res.redirect('/');
            } else {
                req.flash('error','登录失败，账号不存在，请先注册！');
                return res.redirect('/user/reg')
            }
        }
    });
});

router.get('/logout',auth.checkLogin, function (req, res, next) {
    req.session.user = null;
    return res.redirect('/user/login');
});

module.exports = router;
