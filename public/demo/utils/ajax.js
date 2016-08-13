/**
 * Created by wx on 2016/6/17.
 */
/**
 * createXHR 创建AJAX对象，惰性思想解决兼容性的每次判断问题，
 * @returns {*} 返回值：创建的ajax对象
 */
function createXHR(){
    var xhr = null;
    var ary = [
        function(){
            return new XMLHttpRequest();
        },
        function(){
            return new ActiveXObject('Miscrosoft.XMLHTTP');
        },
        function(){
            return new ActiveXObject('Msxml2.XMLHTTP');
        },
        function(){
            return new ActiveXObject('Msxml3.XMLHTTP');
        }
    ];

    for(var i=0; i<ary.length; i++)
    {
        try {
            xhr = ary[i]();
        }catch (e)
        {
            continue;
        }
        //关键代码，把可行的创建函数 赋值给本函数名
        createXHR = ary[i];
        break;
    }

    return xhr;
}


/**
 * ajax 自己封装Ajax函数
 * @param options 参数集合（对象类型）-》替换默认值
 */
function ajax(options){
    var data = null;
    var _default = {
        url : '',
        type: 'get',
        async: true,
        data: null,
        success:null
    };

    for(var key in options)
    {
        if(_default.hasOwnProperty(key))
        {
            _default[key] = options[key];
        }
    }

    var xhr = createXHR();
    xhr.open( _default.type,_default.url,_default.async);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && /^2\d\d$/.test(xhr.status)){
            data = 'JSON' in window? JSON.parse(xhr.responseText):eval('('+xhr.responseText+')');
            if(typeof _default.success === 'function')
            {
                _default.success(data);
            }
        }
    };
    xhr.send(_default.data);

}


