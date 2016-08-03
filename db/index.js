/**
 * Created by wx on 2016/7/31.
 */
var mongoose = require('mongoose');
var settings = require('../settings');
var ObjectId = mongoose.Schema.Types.ObjectId;
var db = mongoose.connect(settings.url);

//创建注册model
mongoose.model('user',new mongoose.Schema({
    username:{
        type:String,
        isRequired:true
    },
    password:{
        type:String,
        isRequired:true
    },
    email:{
        type:String,
        isRequired:true
    },
    avatar:{ //头像
        type:String
    }
}));

//创建文章model
mongoose.model('article',new mongoose.Schema({
    title:{ //标题
        type:String,
        isRequired:true
    },
    content:{ //内容
        type:String,
        isRequired:true
    },
    createAt:{ //创建时间
        type:Date,
        default:Date.now()
    },
    comments:[{
        user:{type:ObjectId,ref:'user'}, //评论人
        content:{type:String}, //评论内容
        createAt:{type:Date,default:Date.now()} //评论时间
    }],
    user:{ //作者
        type:ObjectId,
        ref:'user'
    },
    pv:{type:Number,default:0}//page view浏览量 每访问一次加1
}));

//把获取mode的方法挂在global上
global.Model = function(modelName){
    return mongoose.model(modelName); //一个参数，表示获取模型
};