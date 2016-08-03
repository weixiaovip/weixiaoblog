/**
 * Created by wx on 2016/8/3.
 */
module.exports = {
    series:function(){

    },
    parallel:function(tasks,callback){
        var result = [];
        var index = 0;
        function cb(pos,err,res){
            index++;
            result[pos] = res;
            if(err || index >= tasks.length){
                callback(err,result);
            }
        }

        for(var i=0; i<tasks.length; i++){
            tasks[i](cb.bind(null,i));
        }

    }
};
