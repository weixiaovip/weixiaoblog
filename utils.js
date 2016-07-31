
/**
 * Created by wx on 2016/7/31.
 */
module.exports = {
    md5:function(str){
        return require('crypto').createHash('md5').update(str).digest('hex');
    }
}
