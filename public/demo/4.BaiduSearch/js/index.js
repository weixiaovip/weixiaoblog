/**
 * Created by wx on 2016/7/1.
 */

//var baiduSearch = (function () {
//    var word = null; //记录最后一次搜索的词
//    //工具函数
//    var tools = (function () {
//        //百度搜索的jsonp接口
//        function baiduSuggestion(word, callback) {
//            jsonp('https://www.baidu.com/su', {wd: word}, 'cb', function (data) {
//                callback(data);
//            });
//        }
//
//        //搜索关键词并绑定数据，返回：搜索的关键词
//        function searchAndBind() {
//            word = oInput.value;
//            if (word.length == 0) {
//                return;
//            }
//
//            baiduSuggestion(word, function (data) {
//                if (!data) {
//                    return;
//                }
//                //热词存放在返回对象的属性名s中
//                data = data.s;
//                var str = '';
//                for (var i = 0; i < data.length; i++) {
//                    str += '<li>' + data[i] + '</li>';
//                }
//
//                //让ul显示
//                oUl.style.display = 'block';
//                oUl.innerHTML = str;
//
//            });
//
//            return word;
//        }
//
//        function hasClass(curEle, strName) {
//            console.log(curEle);
//            var reg = new RegExp('\\b' + strName + '\\b', 'g');
//            return reg.test(curEle.className); //curEle.className表示ele对象上的类名属性
//        }
//
//        function addClass(curEle, strClass) {
//            var ary = strClass.replace(/(^ +)|( +$)/g, '').split(/ +/);
//            for (var i = 0; i < ary.length; i++) {
//                var curClass = ary[i];
//                if (!this.hasClass(curEle, curClass)) {
//                    curEle.className += ' ' + curClass;
//                }
//            }
//
//        }
//
//        function removeClass(curEle, strClass) {
//            //把传入的strClass中的前后空格去掉，然后再按空格拆分成数组
//            var aryName = strClass.replace(/(^ +| +$)/, '').split(/ +/g);
//
//            for (var i = 0; i < aryName.length; i++) {
//                var curName = aryName[i];
//                var reg = new RegExp('(^| +)' + curName + '( +|$)');
//                //数组的每一项匹配当前元素的类名字符串，匹配到则把本类名删除
//                if (reg.test(curEle.className)) {
//                    curEle.className = curEle.className.replace(reg, ' ');
//                }
//            }
//        }
//
//        return {
//            baiduSuggestion: baiduSuggestion,
//            searchAndBind: searchAndBind,
//            hasClass: hasClass,
//            addClass: addClass,
//            removeClass: removeClass
//        }
//    })();
//
//    /**
//     * jsonpBaiduSearch 调用百度的jsonp接口，返回搜索词相关的十个热门词汇
//     * @param oInput 输入框
//     * @param oSearchBar 搜索按钮
//     * @param oUl 推荐词汇展示的ul
//     * @param className 被选中的li的类名
//     */
//    function jsonpBaiduSearch(oInput, oSearchBar, oUl, className) {
//
//        var eleName = oUl instanceof  HTMLDListElement?'dd':'li';
//        //搜索按钮绑定点击事件
//        oSearchBar.onclick = tools.searchAndBind;
//
//        //输入框绑定键盘事件
//        oInput.onkeyup = function (e) {
//            e = e || window.event;
//            var val = this.value;
//            //输入框没有值，让ul隐藏
//            if (val.length == 0) {
//                oUl.style.display = 'none';
//            } else {
//                //在输入框中按回车，直接查询搜索词
//                if (e.keyCode == 13) {
//                    word = tools.searchAndBind();
//                }
//
//                //上下方向键
//                if (e.keyCode == 38 || e.keyCode == 40) {
//                    var aLis = oUl.getElementsByTagName(eleName);
//                    if (aLis && aLis.length > 0)
//                    //最大的li的索引值
//                        var maxNum = aLis.length - 1;
//                    var minNum = 0;
//                    var curNum = -1;
//                    //遍历li，根据谁拥有选中的类名，判断当前的li
//                    for (var i = 0; i < aLis.length; i++) {
//                        console.log(aLis[i]);
//                        if (tools.hasClass(aLis[i], className)) {
//                            curNum = i;
//                            tools.removeClass(aLis[i], className)
//                        }
//                    }
//
//                    //上方向键
//                    if (e.keyCode == 38) {
//                        curNum--;
//                        console.log(curNum);
//                        //已经是第一个，再按上键，则显示本次的搜索的关键词
//                        if (curNum < 0) {
//                            console.log(word);
//                            this.value = word;
//                            return;
//                        } else {
//                            curNum = curNum < minNum ? minNum : curNum;
//                        }
//
//                    }
//
//                    //下方向键
//                    if (e.keyCode == 40) {
//                        curNum++;
//                        curNum = curNum > maxNum ? maxNum : curNum;
//                    }
//
//                    //给当前li添加选中类名，并把输入框内容改为当前li中的内容
//                    tools.addClass(aLis[curNum], className);
//                    this.value = aLis[curNum].innerHTML;
//                }
//            }
//
//        };
//
//        //ul下的每个热词的li绑定点击事件，实现新窗口打开
//        oUl.onclick = function (e) {
//            e = e || window.event;
//            var target = e.target || e.srcElement;
//            var val = target.innerHTML;
//            if (val.length > 0) {
//                window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(val), '_blank');
//            }
//        };
//    }
//
//    return {
//        jsonpBaiduSearch: jsonpBaiduSearch
//    }
//})();

//百度搜索热词jsonp接口
var jsonpBaiduSearch = (function () {
    var word = null; //记录最后一次搜索的词
    //工具函数
    var tools = (function () {
        //百度搜索的jsonp接口
        function baiduSuggestion(word, callback) {
            jsonp('https://www.baidu.com/su', {wd: word}, 'cb', function (data) {
                callback(data);
            });
        }

        //搜索关键词并绑定数据，返回：搜索的关键词
        function searchAndBind(oInput,oUl,eleName) {
            word = oInput.value;
            if (word.length == 0) {
                return;
            }

            baiduSuggestion(word, function (data) {
                if (!data) {
                    return;
                }
                //热词存放在返回对象的属性名s中
                data = data.s;
                var len = data.length > 5? 5:data.length > 5;
                var str = '';
                for (var i = 0; i < len; i++) {
                    str += '<'+eleName+'>' + data[i] + '</'+ eleName +'>';
                }

                //让ul显示
                oUl.style.display = 'block';
                oUl.innerHTML = str;

                //var aLi = oUl.getElementsByTagName('li');
                //for(var i=0; i<aLi.length; i++){
                //    aLi[i].onclick = function(){
                //        console.log(this);
                //    }
                //}
            });

            return word;
        }

        function hasClass(curEle, strName) {
            var reg = new RegExp('\\b' + strName + '\\b', 'g');
            return reg.test(curEle.className); //curEle.className表示ele对象上的类名属性
        }

        function addClass(curEle, strClass) {
            var ary = strClass.replace(/(^ +)|( +$)/g, '').split(/ +/);
            for (var i = 0; i < ary.length; i++) {
                var curClass = ary[i];
                if (!this.hasClass(curEle, curClass)) {
                    curEle.className += ' ' + curClass;
                }
            }

        }

        function removeClass(curEle, strClass) {
            //把传入的strClass中的前后空格去掉，然后再按空格拆分成数组
            var aryName = strClass.replace(/(^ +| +$)/, '').split(/ +/g);

            for (var i = 0; i < aryName.length; i++) {
                var curName = aryName[i];
                var reg = new RegExp('(^| +)' + curName + '( +|$)');
                //数组的每一项匹配当前元素的类名字符串，匹配到则把本类名删除
                if (reg.test(curEle.className)) {
                    curEle.className = curEle.className.replace(reg, ' ');
                }
            }
        }

        return {
            baiduSuggestion: baiduSuggestion,
            searchAndBind: searchAndBind,
            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass
        }
    })();

    /**
     * jsonpBaiduSearch 调用百度的jsonp接口，返回搜索词相关的十个热门词汇
     * @param oInput 输入框
     * @param oSearchBar 搜索按钮
     * @param oUl 推荐词汇展示的ul
     * @param className 被选中的li的类名
     */
    function jsonpBaiduSearch(oInput, oSearchBar, oUl, className) {

        var eleName = oUl instanceof  HTMLDListElement?'dd':'li';
        console.log(eleName)

        //搜索按钮绑定点击事件
        oSearchBar.onclick = function(){
            //tools.searchAndBind(oInput,oUl,eleName);
            //点击搜索让输入框获得焦点，从而进行jsonp调用
            oInput.focus();
        };

        //输入框获得焦点就进行搜索
        oInput.onfocus = function(){
            tools.searchAndBind(oInput,oUl,eleName);
        };

        //失去焦点时让ul隐藏
        oInput.onblur = function(){
            setTimeout(function(){
                console.log('onblur');
                oUl.style.display = 'none';
            },200);

        };


        //输入框绑定键盘事件
        oInput.onkeyup = function (e) {
            e = e || window.event;
            var val = this.value;
            //输入框没有值，让ul隐藏
            if (val.length == 0) {
                oUl.style.display = 'none';
            } else {
                //在输入框中按回车，直接查询搜索词
                if (e.keyCode == 13) {
                    word = tools.searchAndBind(oInput,oUl,eleName);
                }

                //上下方向键
                if (e.keyCode == 38 || e.keyCode == 40) {
                    var aLis = oUl.getElementsByTagName(eleName);
                    if (aLis && aLis.length > 0)
                    //最大的li的索引值
                        var maxNum = aLis.length - 1;
                    var minNum = 0;
                    var curNum = -1;
                    //遍历li，根据谁拥有选中的类名，判断当前的li
                    for (var i = 0; i < aLis.length; i++) {

                        if (tools.hasClass(aLis[i], className)) {
                            curNum = i;
                            tools.removeClass(aLis[i], className)
                        }
                    }

                    //上方向键
                    if (e.keyCode == 38) {
                        curNum--;
                        //已经是第一个，再按上键，则显示本次的搜索的关键词
                        if (curNum < 0) {
                            this.value = word;
                            return;
                        } else {
                            curNum = curNum < minNum ? minNum : curNum;
                        }

                    }

                    //下方向键
                    if (e.keyCode == 40) {
                        curNum++;
                        curNum = curNum > maxNum ? maxNum : curNum;
                    }

                    //给当前li添加选中类名，并把输入框内容改为当前li中的内容
                    tools.addClass(aLis[curNum], className);
                    this.value = aLis[curNum].innerHTML;
                }
            }

        };

        var aLi = oUl.getElementsByTagName('li');
        console.log(aLi);
        for(var i=0; i<aLi.length; i++){
            aLi[i].onclick = function(){
                console.log(this);
            }
        }

        //ul下的每个热词的li绑定点击事件，实现新窗口打开
        oUl.onclick = function (e) {
            console.log('oUl.onclick');
            e = e || window.event;
            var target = e.target || e.srcElement;
            var val = target.innerHTML;
            if (val.length > 0) {
                window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(val), '_blank');
            }
        };
    }

    return jsonpBaiduSearch;
})();

var oInput = document.getElementById('input');
var oSearchBar = document.getElementById('searchBar');
var oUl = document.getElementById('list');

jsonpBaiduSearch(oInput, oSearchBar, oUl, 'bg');







