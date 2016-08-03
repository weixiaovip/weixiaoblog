/**
 * Created by wx on 2016/8/3.
 */
var async = require('./async');
/*
* 用于处理控制异步流程
* 数组中所有的函数同事执行，
* 当所有函数都执行完才会执行回调函数
*
*
* */
async.parallel([function(cb){
  setTimeout(function(){
      cb(null,1); //系统自带的回调函数，调用cb表示完成
  },2000);
},function(cb){
    setTimeout(function(){
        cb(null,2);
    },1000);
}],function(err,result){
    console.log(result); //[1,2] 、、
});
