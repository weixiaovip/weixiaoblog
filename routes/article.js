/**
 * Created by wx on 2016/7/30.
 */
var express = require('express');
var router = express.Router();
var auth = require('../middle'); //权限中间件
var markdown = require('markdown').markdown;
var async = require('async');
/* GET home page. */
//query传参 pageNum 当前的页数 pageSize 每页的条数
router.get('/list', function(req, res) {
    //当form表单以get方式发送到后台，会将表单序列化成查询字符串并追加在url后面
    var keyword = req.query.keyword;
    var pageNum = req.query.pageNum?parseInt(req.query.pageNum):1; //页数
    var pageSize = req.query.pageSize?parseInt(req.query.pageSize):5; //条数
    var order = req.query.order?parseInt(req.query.order):-1;
    var orderBy = req.query.orderBy;

    var query = {};

    if(keyword){
        //把关键字变成正则
        var reg = new RegExp(keyword,'i');
        //用正则当查询字符串的值
        query['$or'] = [{title:reg},{content:reg}];
    }
    var orderObj = {};
    if(orderBy){
        orderObj[orderBy] = order;
    }

    Model('article').find(query).count(function(err,count){
        //skip指跳过的条数  limit最大取得条数
        Model('article').find(query).sort(orderObj).skip(pageSize*(pageNum-1)).limit(pageSize).populate('user').exec(function(err,docs){
            if(err){
                console.log('查询文章失败');
            }else{

                res.render('article/list',{title:'文章列表',
                    articles:docs,  //文章信息
                    keyword:keyword, //搜索关键词
                    pageNum:pageNum, //第几页
                    pageSize:pageSize, //每页条数
                    totalPage:Math.ceil(count/pageSize), //总页数
                    order:order,
                    orderBy:orderBy
                }); //向模板继续传递keyword
            }

        });
    });

});

//注册页面
router.get('/add',auth.checkLogin, function(req, res) {
    res.render('article/add', { title: '发表文章',article:'' });
});

router.post('/add', function(req, res) {

    var article = req.body;
    article.createAt = new Date();
    var _id = article._id;
    if(_id){ //修改
        Model('article').update( //修改数据库中对应的文章标题和内容
            {_id:_id},
            {$set:{title:article.title,content:article.content}},

            function(err,result){

                if(err){
                    req.flash('error','修改文章失败');
                    res.redirect('back');
                }else{
                    req.flash('success','修改文章成功');
                    //如果前台是通过ajax请求此路由，那么并不能跳转
                    res.redirect('/article/detail/'+ _id);
                }
            }
        )


    }else{ //新增
        delete article._id; //因为_id有值，为空，插入数据库会失败，删除后让其自动生成_id即可
        article.user = req.session.user._id; //当前用户的id
        Model('article').create(article,function(err,doc){
            if(err){
                req.flash('error','发表文章失败');
                res.redirect('back');
            }else{
                req.flash('success','发表文章成功');
                res.redirect('/article/list');
            }
        })
    }

});

//详情页
router.get('/detail/:_id', function(req, res) {
    async.parallel({ //并行执行函数,可以是数组或对象，（数组的话执行结果也是按定义的顺序的数组，对象的话结果是对应定义属性名（例如：pv/doc）的对象）
        pv:function(cb){  //cb--由系统自动传入，用来通知函数执行完成，调用时传入执行的err和result
            Model('article').update({_id:req.params._id},
                {$inc:{pv:1}},
                function(err,result){
                    cb(err,result);
                }
            )
        },
        doc:function(cb){
            Model('article').findById(req.params._id).populate('comments.user').exec(function(err,doc){
                doc.content = markdown.toHTML(doc.content);
                cb(err,doc);
            });
        }
    },function(err,result){
        res.render('article/detail',{title:'文章详情',article:result.doc});
    });
    //Model('article').findById(req.params._id).populate('comments.user').exec(function(err,doc){
    //    doc.content = markdown.toHTML(doc.content);
    //    res.render('article/detail',{title:'文章详情',article:doc})
    //})
});

router.get('/delete/:_id', function(req, res) {

    Model('article').findById(req.params._id,function(err,doc){
        if(doc){
            //req.session.user 只有登入才有值
            if(req.session.user && (req.session.user._id == doc.user)){
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

//先得到文章的ID  ，然后得到文章的详情对象，并跳转到编辑页
router.get('/edit/:_id', function(req, res) {
    var _id= req.params._id;

    //根据id找到对应文章
    Model('article').findById(req.params._id,function(err,doc){
        if(doc){
            //req.session.user 只有登入才有值
            if(req.session.user && (req.session.user._id == doc.user)){
                res.render('article/add.html',{title:'修改文章', article:doc});

            }else{
                req.flash('error','不是你发表的文章，不能编辑');
                res.redirect('back');
            }
        }else{
            req.flash('error','编辑文章失败,没有找到对应文章');
            res.redirect('back');
        }
    })

});

router.post('/comment', auth.checkLogin, function(req,res){
    var comment = req.body;// user createAt content(上传主体中自带content)
    comment.user = req.session.user._id;//从session得到用户的ID
    comment.createAt = new Date().toLocaleDateString();

    Model('article').update({_id:comment.articleId},{
            $push:{comments:comment}},function(err,newDoc){
            if(err){
                req.flash('error','评论失败');
                res.redirect('back');
            }else{
                req.flash('success','评论成功');
                res.redirect('back');
            }
        }
    );
    /*Model('Article').findById(comment.articleId,function(err,doc){
     doc.comments.push(comment);
     doc.save(function(err,newDoc){
     if(err){
     req.flash('error','评论失败');
     res.redirect('back');
     }else{
     req.flash('success','评论成功');
     res.redirect('back');
     }
     });
     })*/

});

//demo页面
router.get('/demo',auth.checkLogin, function(req, res) {
    res.render('article/demo', { title: 'demo列表'});
});

module.exports = router;
