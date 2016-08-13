~function (pro) {
    pro.myBind = myBind;
    function myBind(context) {
        var _this = this;
        var outerArg = [].slice.call(arguments, 1);
        return function () {
            var innerArg = [].slice.call(arguments, 0);
            _this.apply(context, outerArg.concat(innerArg));
        }
    }
}(Function.prototype);

function Event() {

}

Event.prototype.on = function on(curEle, type, fn) {

    if (/^self/.test(type)) {
        if (!this['aSelf' + type]) {
            this['aSelf' + type] = [];
        }
        var ary = this['aSelf' + type];

    } else {
        if (curEle.addEventListener) {
            curEle.addEventListener(type, fn, false);
            return this;
        } else {
            if (!this['myEvent' + type]) {
                this['myEvent' + type] = [];
                curEle.attachEvent('on' + type, run.bind(this));
            }
            var ary = this['myEvent' + type];
        }
    }

    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            return;
        }
    }

    ary.push(fn);
    return this;
};

Event.prototype.off = function off(curEle, type, fn) {
    if (/^self/.test(type)) {
        var ary = this['aSelf' + type] || [];
    } else {
        if(curEle.removeEventListener)
        {
            curEle.removeEventListener(type, fn, false);
            return this;
        }
        var ary = this['myEvent' + type] || [];
    }

    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            ary[i] = null;
            return this;
        }
    }

    return this;
};

Event.prototype.run = function run(e, selfEvent) {

    e = window.event;
    if (!e.target) {
        e.target = e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientX + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }



    if (selfEvent && /^self/.test(selfEvent.type)) {
        var ary = this['aSelf' + selfEvent.type] || [];

    } else {
        var ary = this['myEvent' + e.type] || [];
    }

    for (var i = 0; i < ary.length; i++) {
        var curFn = ary[i];
        if (typeof curFn === 'function') {
            curFn.call(this, e, selfEvent);
        } else {
            ary.splice(i, 1);
            i--;
        }
    }

    return this;
};


function Drag(curEle) {
    this.ele = curEle;
    this.x = null;
    this.y = null;
    this.minL = null;
    this.maxL = null;
    this.minT = null;
    this.maxT = null;
    this.DOWN = this.down.myBind(this);
    this.MOVE = this.move.myBind(this);
    this.UP = this.up.myBind(this);
    this.on(this.ele, 'mousedown', this.DOWN);

}

Drag.prototype = new Event();
Drag.prototype.constructor = Drag;

Drag.prototype.down = function down(e) {
    var curEle = this.ele;
    this.x = e.pageX - curEle.offsetLeft;
    this.y = e.pageY - curEle.offsetTop;

    if (this.minL === null) { //若this.maxL没有提前指定值，则在鼠标按下的时候自动计算
        this.minL = -e.clientX;
    }

    if (this.minT === null) { //若this.maxL没有提前指定值，则在鼠标按下的时候自动计算
        this.minT = -e.clientY;
    }

    if (this.maxL === null) { //若this.maxL没有提前指定值，则在鼠标按下的时候自动计算
        this.maxL = (document.documentElement.clientWidth || document.body.clientWidth) - curEle.offsetWidth;
    }
    if (this.maxT === null) {
        this.maxT = (document.documentElement.clientHeight || document.body.clientHeight) - curEle.offsetHeight;
    }

    if (curEle.setCapture) {
        curEle.setCapture();
        this.on(curEle, 'mousemove', this.MOVE);
        this.on(curEle, 'mouseup', this.UP);
    } else {
        this.on(document, 'mousemove', this.MOVE);
        this.on(document, 'mouseup', this.UP);
    }
    e.preventDefault();
    this.run.call(this, e, {type: 'selfdragstart', message: '鼠标已按下'});
};

Drag.prototype.move = function move(e) {
    var curL = e.pageX - this.x;
    var curT = e.pageY - this.y;
    curL = curL < this.minL ? this.minL : (curL > this.maxL ? this.maxL : curL);
    curT = curT < this.minT ? this.minT : (curT > this.maxT ? this.maxT : curT);

    document.title = curL+','+curT;
    this.ele.style.left = curL + 'px';
    this.ele.style.top = curT + 'px';

    this.run.call(this, e, {type: 'selfdragging', message: '鼠标在移动'});
};

Drag.prototype.up = function up(e) {
    var curEle = this.ele;
    if (curEle.releaseCapture) {
        curEle.releaseCapture();
        this.off(curEle, 'mousemove', this.MOVE)
        this.off(curEle, 'mouseup', this.UP)
    } else {
        this.off(document, 'mousemove', this.MOVE);
        this.off(document, 'mouseup', this.UP);
    }

    this.run.call(this, e, {type: 'selfdragend', message: '鼠标已抬起'});
};

