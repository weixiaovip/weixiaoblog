/**
 * Created by wx on 2016/7/31.
 */
//用于权限
module.exports = {
    //要求未登录
    checkNotLogin:function(req,res,next){
        if(req.session.user){
            req.flash('error','已经登录');
            res.redirect('/')
        }else{
            next();
        }
    },
    //要求登录
    checkLogin:function(req,res,next){
        if(req.session.user){
            next();
        }else{
            req.flash('error','未登录');
            res.redirect('/')
        }
    }
};
