/**
 * Created by LMS on 19-2-13.
 */
import $ from 'jquery';
var MARK1 = 0;//定义游标组
var MARK2 = 1;//定义游标组
var MARK3 = 2;//定义游标组
var MARK4 = 3;//定义游标组
var MARK5 = 4;//定义游标组
var MARK6 = 5;//定义游标组
var GRID_X_NUM = 1,
    GRID_Y_NUM = 1,
    DEF_DB_GRID = 10,
    DEF_START_Y = -10,
    colorSet = {
        "INACTIVE_WAVE": "#AAAAAA",
        "ACTIVE_WAVE": '#54F200',
        "INACTIVE_NORMAL_MARK": '#0EC2C2',
        "INACTIVE_EVENT_MARK": "#FFFF00",
        "ACTIVE_MARK": "#FFFFFF",
        "MARK1": "#0EC2C2", //蓝
        "MARK2": "#54F200", //绿
        "MARK3": "#FD56FF", //紫
        "MARK4": "#cccc00", //黄
        "MARK5": "#ff0000", //红
        "MARK6": "#A9A9A9", //灰
        "FRAME_GRID": "#C1C1C1",//"#757575",//网格的颜色
        "BACKGROUND": "#343434",//背景颜色
        "RE_FRAME_GRID": "#000000",//网格颜色的相反颜色
        "RE_BACKGROUND": "#FFFFFF",//"#0B0B0B",//背景颜色的相反颜色
        "TOP_TEXT": "#FFFFFF",
        "AXIS_LABEL_COLOR": "#C1C1C1",
        "RE_AXIS_LABEL_COLOR" : "#000000",
        'WAVES': ['#CCCC00', '#FF0000', '#00EEFF', '#00FFFF'],
        'RE_WAVES': ['#0078B9', '#DC0000', '#0000BE', '#BE00BE']
    };
var xUnit = 'MHz';
/**
 * Created with JetBrains WebStorm.
 * User: Zhxp
 * Date: 13-4-28
 * Time: 下午2:31
 * To change this template use File | Settings | File Templates.
 */

/*
 文本位置示意图
      ________________304________________
      |_201|112_______111_______110|204_|
      | 101|1          8          7|109 |
      |    |                       |    |
      |    |                       |    |
     3|    |                       |    |3
     0| 102|2          9          6|108 |0
     1|    |                       |    |3
      |    |                       |    |
      |    |                       |    |
      |_103|3__________4__________5|107_|
      |_202|104_______105_______106|203_|
                      302
 */
// 文本定位常量
var gdiTextPos = {
    "INNER_LEFTTOP": 1,
    "INNER_LEFTMIDDLE": 2,
    "INNER_LEFTBOTTOM": 3,
    "INNER_CENTERBOTTOM": 4,
    "INNER_RIGHTBOTTOM": 5,
    "INNER_RIGHTMIDDLE": 6,
    "INNER_RIGHTTOP": 7,
    "INNER_CENTERTOP": 8,
    "INNER_CETERMIDDLE": 9,

    "OUTER_LEFTTOP": 101,
    "OUTER_LEFTMIDDLE": 102,
    "OUTER_LEFTBOTTOM": 103,
    "OUTER_BOTTOMLEFT": 104,
    "OUTER_BOTTOMCENTER": 105,
    "OUTER_BOTTOMRIGHT": 106,
    "OUTER_RIGHTBOTTOM": 107,
    "OUTER_RIGHTMIDDLE": 108,
    "OUTER_RIGHTTOP": 109,
    "OUTER_TOPRIGHT": 110,
    "OUTER_TOPCENTER": 111,
    "OUTER_TOPLEFT": 112,

    "CORNER_LEFTTOP": 201,
    "CORNER_LEFTBOTTOM": 202,
    "CORNER_RIGHTBOTTOM": 203,
    "CORNER_RIGHTTOP": 204,

    "HEADER_LEFTMIDDLE": 301,
    "HEADER_BOTTOMCENTER": 302,
    "HEADER_RIGHTMIDDLE": 303,
    "HEADER_TOPCENTER": 304,

    "CUSTOMIZE": -1
};
// 对象方向
var gdiObjDir = {
    "HOR": "horizon",
    "VER": "vertical"
};
// 限定边界距离
var gdiLmtBndDist = 0.001;

// 点类
function GdiPoint(x, y) {
    "use strict";

    // 类私有成员
    var instance = {},                          // 点实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类公共成员
    instance.x = x;                             // 横坐标
    instance.y = y;                             // 纵坐标

    return instance;
}

// 矩形类
function GdiRect(left, top, right, bottom) {
    "use strict";

    // 类私有成员
    var instance = {},                          // 矩形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类公共成员
    instance.left = left;                       // 左
    instance.top = top;                         // 上
    instance.right = right;                     // 右
    instance.bottom = bottom;                   // 下

    // 类接口函数
    instance.getWidth = function () {// 获得宽度
        return this.right - this.left;
    };
    instance.getHeight = function () {// 获得高度
        return this.bottom - this.top;
    };
    instance.setRect = function (rect) {// 设置矩形
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            this.left = rect.left;
            this.top = rect.top;
            this.bottom = rect.bottom;
            this.right = rect.right;

            if (this.left > this.right) {
                this.left = rect.right;
                this.right = rect.left;
            }
            if (this.top > this.bottom) {
                this.top = rect.bottom;
                this.bottom = rect.top;
            }
        }
    };
    instance.inflate = function (size) {// 扩大矩形
        this.left -= size;
        this.top -= size;
        this.right += size;
        this.bottom += size;
    };
    instance.ptInRect = function (point) {
        if (point.isKindOf && point.isKindOf(GdiPoint)) {
            return ((point.x - this.left) * (this.right - point.x) >= 0 &&
                    (point.y - this.top) * (this.bottom - point.y) >= 0);
        }
        return false;
    };
    instance.limitToRect = function (rect) {
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            if (this.left < rect.left) {
                this.left = rect.left;
            } else if (this.left > rect.right) {
                this.left = rect.right;
            }
            if (this.top < rect.top) {
                this.top = rect.top;
            } else if (this.top > rect.bottom) {
                this.top = rect.bottom;
            }
            if (this.bottom < rect.top) {
                this.bottom = rect.top;
            } else if (this.bottom > rect.bottom) {
                this.bottom = rect.bottom;
            }
            if (this.right > rect.right) {
                this.right = rect.right;
            } else if (this.right < rect.left) {
                this.right = rect.left;
            }
        }
    };

    return instance;
}

// 颜色类
function GdiColor(red, green, blue, alpha) {
    "use strict";

    // 类私有成员
    var instance = {},                          // 颜色实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类保护成员
    this.fromString = function (clrString) {
        var clrstr = clrString.toLocaleLowerCase(), fromIndex, endIndex;
        if (clrstr.indexOf("#", 0) !== -1) {
            clrstr = clrstr.substr(clrstr.indexOf("#", 0), 7);
            if (clrstr.length !== 7) {
                return false;
            }
            fromIndex = 1;
            instance.red = parseInt(clrstr.substr(fromIndex, 2), 16);
            instance.green = parseInt(clrstr.substr(fromIndex + 2, 2), 16);
            instance.blue = parseInt(clrstr.substr(fromIndex + 4, 2), 16);
            instance.alpha = 1;
        } else if (clrstr.indexOf("rgb(", 0) !== -1) {
            clrstr = clrstr.substr(clrstr.indexOf("rgb(", 0));
            fromIndex = 4;
            endIndex = clrstr.indexOf(",", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.red = parseInt(clrstr.substring(fromIndex, endIndex), 10);
            fromIndex = endIndex + 1;
            endIndex = clrstr.indexOf(",", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.green = parseInt(clrstr.substring(fromIndex, endIndex), 10);
            fromIndex = endIndex + 1;
            endIndex = clrstr.indexOf(")", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.blue = parseInt(clrstr.substring(fromIndex, endIndex), 10);
            instance.alpha = 1.0;
        } else if (clrstr.indexOf("rgba(", 0) !== -1) {
            clrstr = clrstr.substr(clrstr.indexOf("rgba(", 0));
            fromIndex = 5;
            endIndex = clrstr.indexOf(",", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.red = parseInt(clrstr.substring(fromIndex, endIndex), 10);
            fromIndex = endIndex + 1;
            endIndex = clrstr.indexOf(",", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.green = parseInt(clrstr.substring(fromIndex, endIndex), 10);
            fromIndex = endIndex + 1;
            endIndex = clrstr.indexOf(",", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.blue = parseInt(clrstr.substring(fromIndex, endIndex), 10);
            fromIndex = endIndex + 1;
            endIndex = clrstr.indexOf(")", fromIndex);
            if (endIndex === -1) {
                return false;
            }
            instance.alpha = parseFloat(clrstr.substring(fromIndex, endIndex));
        } else {
            instance.alpha = 1;
            switch(clrstr) {
                case "aqua":
                    instance.red = 0;
                    instance.green = 255;
                    instance.blue = 255;
                    break;
                case "black":
                    instance.red = 0;
                    instance.green = 0;
                    instance.blue = 0;
                    break;
                case "blue":
                    instance.red = 0;
                    instance.green = 0;
                    instance.blue = 255;
                    break;
                case "fuchsia":
                    instance.red = 255;
                    instance.green = 0;
                    instance.blue = 255;
                    break;
                case "gray":
                    instance.red = 128;
                    instance.green = 128;
                    instance.blue = 128;
                    break;
                case "green":
                    instance.red = 0;
                    instance.green = 128;
                    instance.blue = 0;
                    break;
                case "lime":
                    instance.red = 0;
                    instance.green = 255;
                    instance.blue = 0;
                    break;
                case "maroon":
                    instance.red = 128;
                    instance.green = 0;
                    instance.blue = 0;
                    break;
                case "navy":
                    instance.red = 0;
                    instance.green = 0;
                    instance.blue = 128;
                    break;
                case "olive":
                    instance.red = 128;
                    instance.green = 128;
                    instance.blue = 0;
                    break;
                case "orange":
                    instance.red = 255;
                    instance.green = 165;
                    instance.blue = 0;
                    break;
                case "purple":
                    instance.red = 128;
                    instance.green = 0;
                    instance.blue = 128;
                    break;
                case "red":
                    instance.red = 255;
                    instance.green = 0;
                    instance.blue = 0;
                    break;
                case "silver":
                    instance.red = 192;
                    instance.green = 192;
                    instance.blue = 192;
                    break;
                case "teal":
                    instance.red = 0;
                    instance.green = 128;
                    instance.blue = 128;
                    break;
                case "white":
                    instance.red = 255;
                    instance.green = 255;
                    instance.blue = 255;
                    break;
                case "yellow":
                    instance.red = 255;
                    instance.green = 255;
                    instance.blue = 0;
                    break;
                default:
                    return false;
            }
        }
        return true;
    };

    // 类公共成员
    instance.red = red;                         // 红
    instance.green = green;                     // 率
    instance.blue = blue;                       // 蓝
    instance.alpha = alpha;                     // 透明度

    // 类接口函数
    instance.toString = function () {
        return "rgba("
            + this.red + ","
            + this.green + ","
            + this.blue + ","
            + this.alpha + ")";
    };
    instance.parseColor = function (color) {
        if (color.isKindOf && color.isKindOf(GdiColor)) {
            this.red = color.red;
            this.green = color.green;
            this.blue = color.blue;
            this.alpha = color.alpha;
            return true;
        } else {
            return me.fromString(color);
        }
    };
    instance.reverse = function () {
        var r, g, b;
        r = 255 - this.red;
        g = 255 - this.green;
        b = 255 - this.blue;
        if (Math.abs(r - this.red) < 128) {
            if (this.red >= 128) {
                r = this.red - 128;
            } else {
                r = this.red + 128;
            }
        }
        if (Math.abs(g - this.green) < 128) {
            if (this.green >= 128) {
                g = this.green - 128;
            } else {
                g = this.green + 128;
            }
        }
        if (Math.abs(b - this.blue) < 128) {
            if (this.blue >= 128) {
                b = this.blue - 128;
            } else {
                b = this.blue + 128;
            }
        }
        this.red = r;
        this.green = g;
        this.blue = b;
    };

    return instance;
}

// 字体类
function GdiFont(size, family) {
    "use strict";

    // 类私有成员
    var instance = {},                          // 颜色实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类保护成员
    this.fromString = function (fontString) {
        var fontstr = fontString.toLocaleLowerCase(), fromIndex, sizestr;
        fromIndex = fontstr.lastIndexOf(" ");
        if (fromIndex !== -1) {
            instance.family = fontstr.substr(fromIndex + 1);
        }
        fontstr = fontstr.substr(0, fromIndex);
        fromIndex = fontstr.lastIndexOf(" ");
        if (fromIndex !== -1) {
            sizestr = fontstr.substr(fromIndex + 1);
        } else {
            sizestr = fontstr;
        }
        fromIndex = sizestr.indexOf("px");
        if (fromIndex === -1) {
            return false;
        }
        instance.size = parseFloat(sizestr.substr(0, fromIndex));
        sizestr = sizestr.substr(fromIndex + 2);
        if (sizestr.length) {
            fromIndex = sizestr.indexOf("/");
            if (fromIndex !== -1) {
                instance.height = parseFloat(sizestr.substr(fromIndex + 1));
            } else {
                instance.height = Math.round(instance.size * 1.4);
            }
        } else {
            instance.height = Math.round(instance.size * 1.4);
        }

        return true;
    };

    // 类公共成员
    instance.size = size;                       // 大小
    instance.family = family;                   // 字体
    instance.height = Math.round(size * 1.4);   // 文本高度

    // 类接口函数
    instance.toString = function () {
        return this.size.toString() + "px " + this.family;
    };
    instance.parseFont = function (font) {
        if (font.isKindOf && font.isKindOf(GdiFont)) {
            this.size = font.size;
            this.family = font.family;
            this.height = font.height;
            return true;
        } else {
            return me.fromString(font);
        }
    };

    return instance;
}

// 数据类型定义
function GdiDatum() {
    "use strict";

    // 类私有成员
    var instance = {},                          // 数据实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类接口函数
    instance.getType = function () {// 获得数据类型
        return undefined;
    };

    return instance;
}
// 一维数据
function GdiDatumOneDim(value) {
    "use strict";

    // 类私有成员
    var instance = GdiDatum.call(this),         // 数据实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiDatum()).isKindOf.call(me, type);
    };

    // 类公共成员
    instance.value = value;                     // 数据值

    // 类接口函数
    instance.getType = function () {// 获得数据类型
        return "DatumOneDim";
    };

    return instance;
}
// 二维数据
function GdiDatumTwoDim(xValue, yValue) {
    "use strict";

    // 类私有成员
    var instance = GdiDatum.call(this),         // 数据实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiDatum()).isKindOf.call(me, type);
    };

    // 类公共成员
    instance.xValue = xValue;                   // 横坐标值
    instance.yValue = yValue;                   // 纵坐标值

    // 类接口函数
    instance.getType = function () {// 获得数据类型
        return "DatumTwoDim";
    };

    return instance;
}
// 带颜色二维数据
function GdiDatumTwoDimWithClr(xValue, yValue, color) {
    "use strict";

    // 类私有成员
    var instance = GdiDatumTwoDim.call(this),   // 数据实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {
        return me instanceof type ||
            (new GdiDatumTwoDim()).isKindOf.call(me, type);
    };

    // 类公共成员
    instance.xValue = xValue;                   // 横坐标值
    instance.yValue = yValue;                   // 纵坐标值
    instance.color = color;                     // 颜色值

    // 类接口函数
    instance.getType = function () {// 获得数据类型
        return "DatumTwoDimWithClr";
    };

    return instance;
}

// 竖直线段数据
function GdiDatumVLine(minYValue, maxYValue) {
    "use strict";

    // 类私有成员
    var instance = GdiDatum.call(this),
        me = this;

    instance.isKindOf = function (type) {
        return me instanceof type ||
            (new GdiDatum().isKindOf.call(me, type));
    };

    // 类公共成员
    instance.minYValue = minYValue;
    instance.maxYValue = maxYValue;

    // 类接口函数
    instance.getType = function () {
        return "DatumVLine";
    };

    return instance;
}

// 带横坐标的竖直线段数据
function GdiDatumVLineWithX(minYValue, maxYValue, xValue) {
    "use strict";

    // 类私有成员
    var instance = GdiDatumVLine.call(this),
        me = this;

    instance.isKindOf = function (type) {
        return me instanceof type ||
            (new GdiDatumVLine().isKindOf.call(me, type));
    };

    // 类公共成员
    instance.minYValue = minYValue;
    instance.maxYValue = maxYValue;
    instance.xValue = xValue;

    // 类接口函数
    instance.getType = function () {
        return "DatumVLineWithX";
    };

    return instance;
}

// 图形基础对象类
function GdiObject() {
    "use strict";

    // 类私有成员
    var instance = {},                          // 框架实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类保护成员
    this.name = "";                             // 对象名称
    this.extraData = null;                      // 对象附加数据

    // 类公共成员
    // 接口函数
    instance.setName = function (name) {// 设置对象名称
        me.name = name;
    };
    instance.getName = function () {// 获得对象名称
        return me.name;
    };
    instance.setExtraData = function (extraData) {// 设置附加数据
        me.extraData = extraData;
    };
    instance.getExtraData = function () {// 获得附加数据
        return me.extraData;
    };

    return instance;
}

// 文本类
function GdiText(text, posFlag) {
    "use strict";

    // 类私有成员
    var instance = GdiObject.call(this),        // 文本实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiObject()).isKindOf.call(me, type);
    };

    function Position() {
        this.x = 0;                             // 横坐标
        this.y = 0;                             // 纵坐标
        this.align = "left";                    // 水平对齐 left center right
        this.baseline = "top";                  // 垂直对齐 top middle bottom
        this.rotateAngle = 0;                   // 旋转角度
    }

    // 类保护成员
    this.color =
        new GdiColor(255, 255, 255, 1.0);       // 颜色
    this.bkgndColor =
        new GdiColor(0, 0, 0, 0.0);             // 颜色
    this.font = new GdiFont(10, "微软雅黑");     // 字体

    // 类公共成员
    // 变量
    instance.text = text;                       // 内容
    instance.posFlag = posFlag;                 // 标志
    instance.position = new Position();         // 位置
    // 接口函数
    instance.setColor = function (color) {// 设置颜色
        me.color.parseColor(color);
    };
    instance.getColor = function () {// 获得颜色
        return me.color.toString();
    };
    instance.setBkgndColor = function (color) {// 设置背景颜色
        me.bkgndColor.parseColor(color);
    };
    instance.getBkgndColor = function () {// 获得背景颜色
        return me.bkgndColor.toString();
    };
    instance.setFont = function (font) {// 设置字体
        me.font.parseFont(font);
    };
    instance.getFont = function () {// 获得字体
        return me.font.toString();
    };
    // 绘图函数
    instance.draw = function (context) {// 绘制文本
        var offsetY = 0, point = new GdiPoint(0, 0), width, height;
        if (this.position.baseline === "top") {
            offsetY += me.font.height / 2;
        } else if (this.position.baseline === "bottom") {
            offsetY -= me.font.height / 2;
        }
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.position.rotateAngle);
        context.textAlign = this.position.align;
        context.textBaseline = "middle";
        context.font = me.font.toString();
        if (me.bkgndColor.alpha !== 0.0) {
            width = context.measureText(this.text).width;
            height = me.font.height;
            if (this.position.align === "center") {
                point.x = -width / 2;
            }
            else if (this.position.align === "right") {
                point.x = -width;
            }
            if (this.position.baseline === "middle") {
                point.y = -height / 2;
            }
            else if (this.position.baseline === "bottom") {
                point.y = -height;
            }
            context.fillStyle = me.bkgndColor.toString();
            context.fillRect(point.x, point.y, width, height);
        }
        context.fillStyle = me.color.toString();
        context.fillText(this.text, 0, offsetY);
        context.restore();
    };
    instance.measureText = function (context) {// 测量文本尺寸
        var metrics;
        context.save();
        context.font = me.font.toString();
        metrics = context.measureText(this.text);
        context.restore();
        return metrics;
    };
    instance.recalcPos = function (innerRect, outerRect, headerRect) {// 重新设置文本位置
        switch (this.posFlag) {
        case gdiTextPos.INNER_LEFTTOP:// 1
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = innerRect.left;
                this.position.y = innerRect.top;
                this.position.align = "left";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_LEFTMIDDLE:// 2
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = innerRect.left;
                this.position.y = (innerRect.top + innerRect.bottom) / 2;
                this.position.align = "left";
                this.position.baseline = "middle";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_LEFTBOTTOM:// 3
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = innerRect.left;
                this.position.y = innerRect.bottom;
                this.position.align = "left";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_CENTERBOTTOM:// 4
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = (innerRect.left + innerRect.right) / 2;
                this.position.y = innerRect.bottom;
                this.position.align = "center";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_RIGHTBOTTOM:// 5
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = innerRect.right;
                this.position.y = innerRect.bottom;
                this.position.align = "right";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_RIGHTMIDDLE:// 6
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = innerRect.right;
                this.position.y = (innerRect.top + innerRect.bottom) / 2;
                this.position.align = "right";
                this.position.baseline = "middle";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_RIGHTTOP:// 7
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = innerRect.right;
                this.position.y = innerRect.top;
                this.position.align = "right";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_CENTERTOP:// 8
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = (innerRect.left + innerRect.right) / 2;
                this.position.y = innerRect.top;
                this.position.align = "center";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.INNER_CETERMIDDLE:// 9
            if (innerRect.isKindOf && innerRect.isKindOf(GdiRect)) {
                this.position.x = (innerRect.left + innerRect.right) / 2;
                this.position.y = (innerRect.top + innerRect.bottom) / 2;
                this.position.align = "center";
                this.position.baseline = "middle";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_LEFTTOP:// 101
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = outerRect.top;
                this.position.align = "right";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_LEFTMIDDLE:// 102
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = (outerRect.top + outerRect.bottom) / 2;
                this.position.align = "right";
                this.position.baseline = "middle";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_LEFTBOTTOM:// 103
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = outerRect.bottom;
                this.position.align = "right";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_BOTTOMLEFT:// 104
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = outerRect.bottom;
                this.position.align = "left";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_BOTTOMCENTER:// 105
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = (outerRect.left + outerRect.right) / 2;
                this.position.y = outerRect.bottom;
                this.position.align = "center";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_BOTTOMRIGHT:// 106
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = outerRect.bottom;
                this.position.align = "right";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_RIGHTBOTTOM:// 107
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = outerRect.bottom;
                this.position.align = "left";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_RIGHTMIDDLE:// 108
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = (outerRect.top + outerRect.bottom) / 2;
                this.position.align = "left";
                this.position.baseline = "middle";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_RIGHTTOP:// 109
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = outerRect.top;
                this.position.align = "left";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_TOPRIGHT:// 110
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = outerRect.top;
                this.position.align = "right";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_TOPCENTER:// 111
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = (outerRect.left + outerRect.right) / 2;
                this.position.y = outerRect.top;
                this.position.align = "center";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.OUTER_TOPLEFT:// 112
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = outerRect.top;
                this.position.align = "left";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.CORNER_LEFTTOP:// 201
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = outerRect.top;
                this.position.align = "right";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.CORNER_LEFTBOTTOM:// 202
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.left;
                this.position.y = outerRect.bottom;
                this.position.align = "right";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.CORNER_RIGHTBOTTOM:// 203
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = outerRect.bottom;
                this.position.align = "left";
                this.position.baseline = "top";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.CORNER_RIGHTTOP:// 204
            if (outerRect.isKindOf && outerRect.isKindOf(GdiRect)) {
                this.position.x = outerRect.right;
                this.position.y = outerRect.top;
                this.position.align = "left";
                this.position.baseline = "bottom";
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.HEADER_LEFTMIDDLE:// 301
            if (headerRect.isKindOf && headerRect.isKindOf(GdiRect)) {
                this.position.x = headerRect.left;
                this.position.y = (headerRect.top + headerRect.bottom) / 2;
                this.position.align = 'center';
                this.position.baseline = 'bottom';
                this.rotateAngle = Math.PI * 3 / 2;
            }
            break;
        case gdiTextPos.HEADER_BOTTOMCENTER:// 302
            if (headerRect.isKindOf && headerRect.isKindOf(GdiRect)) {
                this.position.x = (headerRect.left + headerRect.right) / 2;
                this.position.y = headerRect.bottom;
                this.position.align = 'center';
                this.position.baseline = 'top';
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.HEADER_RIGHTMIDDLE:// 303
            if (headerRect.isKindOf && headerRect.isKindOf(GdiRect)) {
                this.position.x = headerRect.right;
                this.position.y = (headerRect.top + headerRect.bottom) / 2;
                this.position.align = 'center';
                this.position.baseline = 'top';
                this.rotateAngle = Math.PI * 3 / 2;
            }
            break;
        case gdiTextPos.HEADER_TOPCENTER:// 304
            if (headerRect.isKindOf && headerRect.isKindOf(GdiRect)) {
                this.position.x = (headerRect.left + headerRect.right) / 2;
                this.position.y = headerRect.top;
                this.position.align = 'center';
                this.position.baseline = 'bottom';
                this.position.rotateAngle = 0;
            }
            break;
        case gdiTextPos.CUSTOMIZE:
            break;
        default:
            break;
        }
    };

    return instance;
}

// 坐标轴信息
function GdiAxis(visible, position) {
    "use strict";

    // 类私有成员
    var instance = GdiObject.call(this),        // 坐标轴实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiObject()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.visible = visible;                     // 可见
    this.start = 0;                             // 起始
    this.stop = 100;                            // 终止
    this.unit = "";                             // 单位
    this.split = 1;                             // 分割
    this.position = position;                   // 类型 left top right bottom
    this.boundary = new GdiRect(0, 0, 0, 0);    // 边框
    this.lineVisible = true;                    // 线条可见
    this.lineWidth = 1;                         // 线条宽度
    this.lineColor =
        new GdiColor(127, 127, 127, 1.0);       // 线条颜色
    this.labelVisible = true;                   // 使用标注
    this.labelPrecision = 2;                    // 标注精度
    this.labelExponential = false;              // 标注指数计数法表示
    this.labelColor =
        new GdiColor(255, 255, 255, 1.0);       // 标注颜色
    this.labelFont = new GdiFont(14, "微软雅黑");// 标注字体
    this.labels = [];                           // 标注文本
    this.labelPosition = position;             // 标注文本相对于轴的位置，left top right bottom
    this.labelAllowedPosition = {
        left: ["left", "right"],
        right: ["left", "right"],
        top: ["top", "bottom"],
        bottom: ["top", "bottom"]
    };

    // 类公共成员
    // 接口函数
    instance.setVisible = function (visible) {// 设置可见状态
        me.visible = visible;
    };
    instance.getVisible = function () {// 获得可见状态
        return me.visible;
    };
    instance.setSpan = function (start, stop) {// 设置跨度
        me.start = start;
        me.stop = stop;
    };
    instance.getSpan = function () {// 获得跨度
        return {
            start: me.start,
            stop: me.stop
        };
    };
    instance.setUnit = function (unit) {// 设置单位
        me.unit = unit;
    };
    instance.getUnit = function () {// 获得单位
        return me.unit;
    };
    instance.setSplit = function (split) {// 设置分割
        if (split >= 1) {
            me.split = split;
        }
    };
    instance.getSplit = function () {// 获得分割
        return me.split;
    };
    instance.getPosition = function () {// 获得方位
        return me.position;
    };
    instance.setBoundary = function (rect) {// 设置边界
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            me.boundary.setRect(rect);
        }
    };
    instance.getBoundary = function () {// 获得边界
        return new GdiRect(
            me.boundary.left,
            me.boundary.top,
            me.boundary.right,
            me.boundary.bottom
        );
    };
    instance.setLineVisible = function (visible) {// 设置线条可见状态
        me.lineVisible = visible;
    };
    instance.getLineVisible = function () {// 获得线条可见状态
        return me.lineVisible;
    };
    instance.setLineWidth = function (width) {// 设置线条宽度
        me.lineWidth = width;
    };
    instance.getLineWidth = function () {// 获得线条宽度
        return me.lineWidth;
    };
    instance.setLineColor = function (color) {// 设置线条颜色
        me.lineColor.parseColor(color);
    };
    instance.getLineColor = function () {// 获得线条颜色
        return me.lineColor.toString();
    };
    instance.setLabelVisible = function (visible) {// 设置标注可见状态
        me.labelVisible = visible;
    };
    instance.getLabelVisible = function () {// 获得标注可见状态
        return me.labelVisible;
    };
    instance.setLabelPrecision = function (precision) {// 设置标注精度
        me.labelPrecision = precision;
    };
    instance.getLabelPrecision = function () {// 获得标注精度
        return me.labelPrecision;
    };
    instance.setLabelExponential = function (enable) {// 设置标注指数计数法状态
        me.labelExponential = enable;
    };
    instance.getLabelExponential = function () {// 获得标注指数计数法状态
        return me.labelExponential;
    };
    instance.setLabelColor = function (color) {// 设置标注颜色
        me.labelColor.parseColor(color);
    };
    instance.getLabelColor = function () {// 获得标注颜色
        return me.labelColor.toString();
    };
    instance.setLabelFont = function (font) {// 设置标注字体
        me.labelFont.parseFont(font);
    };
    instance.getLabelFont = function () {// 获得标注字体
        return me.labelFont.toString();
    };
    instance.setLabelPosition = function (position) { //设置标注位置
        if (-1 !== me.labelAllowedPosition[me.position].indexOf(me.labelPosition)) {
            me.labelPosition = position;
        }
    };
    instance.getLabelPosition = function () { //获取标注位置
        return me.labelPosition;
    };
    instance.addLabel = function (label) {// 增加标注
        me.labels.push(label);
        return me.labels.length - 1;
    };
    instance.insertLabelAt = function (index, label) {// 插入标注
        if (index >= 0 && index < me.labels.length) {
            me.labels.splice(index, 0, label);
        } else {
            index = me.addLabel(label);
        }
        return index;
    };
    instance.getLabelAt = function (index) {// 获得标注
        if (index >= 0 && index < me.labels.length) {
            return me.labels[index];
        }
        return null;
    };
    instance.removeLabelAt = function (index) {// 移除标注
        if (index >= 0 && index < me.labels.length) {
            me.labels.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.removeAllLabel = function () {
        me.labels.length = 0;
    };
    instance.getLabelCount = function () {// 获得标注个数
        return me.labels.length;
    };
    // 操作函数
    instance.formatLabel = function (value) {// 格式化标注
        var fVar = parseFloat(value);
        if (!me.labelExponential) {
            return fVar.toFixed(me.labelPrecision);
        }
        return fVar.toExponential(me.labelPrecision);
    };
    instance.genLabels = function () {// 生成标注
        if (me.split < 1) {// 分割无效
            return false;
        }
        me.labels = [];

        var i, interval, label;
        label = this.formatLabel(me.start);
        if (me.unit.length) {
            label += ' ' + me.unit;
        }
        me.labels.push(label);
        interval = (me.stop - me.start) / me.split;
        for (i = 1; i < me.split; i += 1) {
            label = this.formatLabel(me.start + i * interval);
            if (me.unit.length) {
                label += ' ' + me.unit;
            }
            me.labels.push(label);
        }
        label = this.formatLabel(me.stop);
        if (me.unit.length) {
            label += ' ' + me.unit;
        }
        me.labels.push(label);
        return true;
    };
    instance.draw = function (context) {
        var i, offset, interval, text;
        if (me.visible && me.lineVisible) {
            context.beginPath();
            context.lineWidth = me.lineWidth;
            context.strokeStyle = me.lineColor.toString();
            offset = me.lineWidth / 2;
            if (me.position === "left") {
                context.moveTo(me.boundary.left - offset, me.boundary.top);
                context.lineTo(me.boundary.left - offset, me.boundary.bottom);
            } else if (me.position === "top") {
                context.moveTo(me.boundary.left, me.boundary.top - offset);
                context.lineTo(me.boundary.right, me.boundary.top - offset);
            } else if (me.position === "right") {
                context.moveTo(me.boundary.right + offset, me.boundary.top);
                context.lineTo(me.boundary.right + offset, me.boundary.bottom);
            } else if (me.position === "bottom") {
                context.moveTo(me.boundary.left, me.boundary.bottom + offset);
                context.lineTo(me.boundary.right, me.boundary.bottom + offset);
            }
            context.stroke();
        }
        if (me.visible && me.labelVisible) {
            if (me.labels.length >= 2) {
                text = new GdiText('', gdiTextPos.CUSTOMIZE);
                text.setFont(me.labelFont);
                text.setColor(me.labelColor);
                if (me.position === "left") {
                    if ("left" === me.labelPosition) {
                        text.position.align = "right";
                        text.position.x = me.boundary.left - me.lineWidth - 1;
                    } else {
                        text.position.align = "left";
                        text.position.x = me.boundary.left + me.lineWidth + 1;
                    }
                    text.position.baseline = "bottom";
                    text.position.y = me.boundary.bottom;
                    text.text = me.labels[0];
                    text.draw(context);
                    text.position.baseline = "top";
                    text.position.y = me.boundary.top;
                    text.text = me.labels[me.labels.length - 1];
                    text.draw(context);
                    text.position.baseline = "middle";
                    interval = me.boundary.getHeight() / (me.labels.length - 1);
                    for (i = 1; i < me.labels.length - 1; i += 1) {
                        text.position.y = me.boundary.bottom - i * interval;
                        text.text = me.labels[i];
                        text.draw(context);
                    }
                }
                else if (me.position === "top") {
                    if ("top" === me.labelPosition) {
                        text.position.baseline = "bottom";
                        text.position.y = me.boundary.top - me.lineWidth;
                    } else {
                        text.position.baseline = "top";
                        text.position.y = me.boundary.top + me.lineWidth;
                    }
                    text.position.align = "left";
                    text.position.x = me.boundary.left;
                    text.text = me.labels[0];
                    text.draw(context);
                    text.position.align = "right";
                    text.position.x = me.boundary.right;
                    text.text = me.labels[me.labels.length - 1];
                    text.draw(context);
                    text.position.align = "center";
                    interval = me.boundary.getWidth() / (me.labels.length - 1);
                    for (i = 1; i < me.labels.length - 1; i += 1) {
                        text.position.x = me.boundary.left + i * interval;
                        text.text = me.labels[i];
                        text.draw(context);
                    }
                }
                else if (me.position === "right") {
                    if ("right" === me.labelPosition) {
                        text.position.align = "left";
                        text.position.x = me.boundary.right + me.lineWidth + 1;
                    } else {
                        text.position.align = "right";
                        text.position.x = me.boundary.right - me.lineWidth - 1;
                    }
                    text.position.baseline = "bottom";
                    text.position.y = me.boundary.bottom;
                    text.text = me.labels[0];
                    text.draw(context);
                    text.position.baseline = "top";
                    text.position.y = me.boundary.top;
                    text.text = me.labels[me.labels.length - 1];
                    text.draw(context);
                    text.position.baseline = "middle";
                    interval = me.boundary.getHeight() / (me.labels.length - 1);
                    for (i = 1; i < me.labels.length - 1; i += 1) {
                        text.position.y = me.boundary.bottom - i * interval;
                        text.text = me.labels[i];
                        text.draw(context);
                    }
                }
                else if (me.position === "bottom") {
                    if ("bottom" === me.labelPosition) {
                        text.position.baseline = "top";
                        text.position.y = me.boundary.bottom + me.lineWidth;
                    } else {
                        text.position.baseline = "bottom";
                        text.position.y = me.boundary.bottom - me.lineWidth;
                    }
                    text.position.align = "left";
                    text.position.x = me.boundary.left;
                    text.text = me.labels[0];
                    text.draw(context);
                    text.position.align = "right";
                    text.position.x = me.boundary.right;
                    text.text = me.labels[me.labels.length - 1];
                    text.draw(context);
                    text.position.align = "center";
                    interval = me.boundary.getWidth() / (me.labels.length - 1);
                    for (i = 1; i < me.labels.length - 1; i += 1) {
                        text.position.x = me.boundary.left + i * interval;
                        text.text = me.labels[i];
                        text.draw(context);
                    }
                }
            }
        }
    };
    // 坐标转换
    instance.transform = function (value, bounded) {// 转换坐标轴值到像素值
        var pix;
        if (me.stop !== me.start) {
            if (me.position === "left" || me.position === "right") {
                pix = me.boundary.top +
                    (me.stop - value) * (me.boundary.getHeight() - gdiLmtBndDist) / (me.stop - me.start);
                if (bounded) {
                    pix = Math.max(pix, me.boundary.top);
                    pix = Math.min(pix, me.boundary.bottom - gdiLmtBndDist);
                }
            } else if (me.position === "top" || me.position === "bottom") {
                pix = me.boundary.left +
                    (value - me.start) * (me.boundary.getWidth() - gdiLmtBndDist) / (me.stop - me.start);
                if (bounded) {
                    pix = Math.max(pix, me.boundary.left);
                    pix = Math.min(pix, me.boundary.right - gdiLmtBndDist);
                }
            }
        } else if (value === me.start) {
            if (me.position === "left" || me.position === "right") {
                pix = me.boundary.top + (me.boundary.getHeight()) / 2;
            } else if (me.position === "top" || me.position === "bottom") {
                pix = me.boundary.left + (me.boundary.getWidth()) / 2;
            }
        }
        return pix;
    };
    instance.invTransform = function (value, customRange) {// 转换像素值到坐标轴值
        var range, coord;
        if (customRange) {
            range = customRange;
        } else if (me.position === "left" || me.position === "right") {
            range = {
                "min": me.boundary.left,
                "max": me.boundary.right
            };
        } else if (me.position === "top" || me.position === "bottom") {
            range = {
                "min": me.boundary.bottom,
                "max": me.boundary.top
            };
        }
        coord = me.start + (value - range.min) * (me.stop - me.start) / (range.max - range.min);
        coord = this.formatLabel(coord);
        return coord;
    };

    return instance;
}

// 框架类
function GdiFrame() {
    "use strict";

    // 类私有成员
    var instance = GdiObject.call(this),        // 框架实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiObject()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.clrBkgnd =
        new GdiColor(47, 47, 47, 1.0);          // 背景颜色
    this.borderRect = new GdiRect(0, 0, 0, 0);  // 边框尺寸
    this.drawBkgnd = function (context) {// 绘制背景
        //绘制背景
        context.fillStyle = me.clrBkgnd.toString();
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    };
    this.drawFrame = function (context) {
        context.clearRect(0,0,context.canvas.width,context.canvas.height);
        me.drawBkgnd(context);
    };

    // 类公共成员
    // 接口函数
    instance.setBkgndColor = function (color) {// 设置背景色
        me.clrBkgnd.parseColor(color);
    };
    instance.getBkgndColor = function () {// 获得背景色
        return me.clrBkgnd.toString();
    };
    instance.setBorderRect = function (rect) {// 设置边框尺寸
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            var temp;
            if (rect.right < rect.left) {
                temp = rect.right;
                rect.right = rect.left;
                rect.left = temp;
            }
            if (rect.bottom < rect.top) {
                temp = rect.bottom;
                rect.bottom = rect.top;
                rect.top = temp;
            }
            me.borderRect.setRect(rect);
        }
    };
    instance.getBorderRect = function () {// 获得边框尺寸
        return new GdiRect(
            me.borderRect.left,
            me.borderRect.top,
            me.borderRect.right,
            me.borderRect.bottom
        );
    };
    // 绘制
    instance.draw = function (context) {// 绘制函数
        me.drawFrame(context);
    };
    // 操作
    instance.getInnerRect = function () {// 获得内部矩形区域
        return new GdiRect(0, 0, 0, 0);
    };
    instance.getOuterRect = function () {// 获得外部矩形区域
        return new GdiRect(0, 0, 0, 0);
    };
    instance.assignIntf = function (gdiObj) {
        /*global GdiFigure, GdiMarker, GdiMarkerManager*/
        if (gdiObj.isKindOf &&
                (gdiObj.isKindOf(GdiFigure) ||
                gdiObj.isKindOf(GdiMarker) ||
                gdiObj.isKindOf(GdiMarkerManager))) {
            gdiObj.setFrameFns({
                "getInnerRect": this.getInnerRect,
                "getOuterRect": this.getOuterRect
            });
        }
    };

    return instance;
}
// 网格框架
function GdiFrmGrid() {
    "use strict";

    // 类私有成员
    var instance = GdiFrame.call(this),         // 框架实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFrame()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.frameColor =
        new GdiColor(64, 128, 64, 1.0);         // 框架颜色
    this.borderWidth = 1;                       // 边框线宽
    this.borderEnabled = true;                  // 是否显示边框
    this.gridEnable = true;                     // 启用网格
    this.gridWidth = 1;                         // 网格线宽
    this.gridRows = 8;                          // 网格行数
    this.gridColumns = 10;                      // 网格列数
    this.gridSpetrum = true;                    // 启用频谱仪网格
    this.axis = {
        "left": new GdiAxis(true, 'left'),
        "top": new GdiAxis(false, 'top'),
        "right": new GdiAxis(true, 'right'),
        "bottom": new GdiAxis(true, 'bottom')
    };                          // 四个坐标轴
    this.drawBorder = function (context) {
        var offset = me.borderWidth / 2;
        // 绘制边框(边框在me.borderRect像素外)
        context.lineWidth = me.borderWidth;
        context.strokeStyle = me.frameColor.toString();
        context.strokeRect(me.borderRect.left - offset, me.borderRect.top - offset,
            me.borderRect.getWidth() + me.borderWidth, me.borderRect.getHeight() + me.borderWidth);
    };
    this.drawGrid = function (context) {// 绘制网格
        // 变量定义
        if (!me.gridEnable) {
            return;
        }
        var i, j, intervalX, intervalY, curX, curY, offset, count;
        // 绘制网格
        context.beginPath();
        context.lineWidth = me.gridWidth;
        context.strokeStyle = me.frameColor.toString();
        offset = me.gridWidth % 2 ? 0.5 : 0;
        if (!me.gridSpetrum) {
            // 绘制网格虚线
            // 虚线的线条和空白部分长度为3
            // 边框刻度和中心线的长度为5
            intervalY = (me.borderRect.getHeight() + me.gridWidth) / me.gridRows;
            for (i = 1; i < me.gridRows; i += 1) {
                if (i !== me.gridRows / 2) {
                    curY = parseInt(me.borderRect.top + i * intervalY - me.gridWidth / 2, 10) + offset;
                    for (j = me.borderRect.left + 8; j < me.borderRect.right - 5; j += 6) {
                        context.moveTo(j, curY);
                        context.lineTo(j + 3, curY);
                    }
                }
            }
            intervalX = (me.borderRect.getWidth() + me.gridWidth) / me.gridColumns;
            for (i = 1; i < me.gridColumns; i += 1) {
                if (i !== me.gridColumns / 2) {
                    curX = parseInt(me.borderRect.left + i * intervalX - me.gridWidth / 2, 10) + offset;
                    for (j = me.borderRect.top + 8; j < me.borderRect.bottom - 5; j += 6) {
                        context.moveTo(curX, j);
                        context.lineTo(curX, j + 3);
                    }
                }
            }

            // 绘制刻度线
            count = 10 * me.gridColumns;
            intervalY = me.borderRect.getHeight() / 2;
            intervalX = (me.borderRect.getWidth() + me.gridWidth) / count;
            for (i = 0; i < 3; i += 1) {
                curY = parseInt(me.borderRect.top + i * intervalY, 10) - parseInt(i * 2.5, 10);
                for (j = 1; j < count; j += 1) {
                    curX = parseInt(me.borderRect.left + j * intervalX - me.gridWidth / 2, 10) + offset;
                    if (i !== 1 ||
                            ((curX - me.borderRect.left) > 5 &&
                            (me.borderRect.right - curX) > 5)) {
                        context.moveTo(curX, curY);
                        context.lineTo(curX, curY + 5);
                    }
                }
            }
            count = 10 * me.gridRows;
            intervalX = me.borderRect.getWidth() / 2;
            intervalY = (me.borderRect.getHeight() + me.gridWidth) / count;
            for (i = 0; i < 3; i += 1) {
                curX = parseInt(me.borderRect.left + i * intervalX, 10) - parseInt(i * 2.5, 10);
                for (j = 1; j < count; j += 1) {
                    curY = parseInt(me.borderRect.top + j * intervalY - me.gridWidth / 2, 10) + offset;
                    if (i !== 1 ||
                            ((curY - me.borderRect.top) > 5 &&
                            (me.borderRect.bottom - curY) > 5)) {
                        context.moveTo(curX, curY);
                        context.lineTo(curX + 5, curY);
                    }
                }
            }
        } else {
            // 绘制网格线条
            intervalY = (me.borderRect.getHeight() + me.gridWidth) / me.gridRows;
            for (i = 1; i < me.gridRows; i += 1) {
                curY = parseInt(me.borderRect.top + i * intervalY - me.gridWidth / 2, 10) + offset;
                context.moveTo(me.borderRect.left, curY);
                context.lineTo(me.borderRect.right, curY);
            }
            intervalX = (me.borderRect.getWidth() + me.gridWidth) / me.gridColumns;
            for (i = 1; i < me.gridColumns; i += 1) {
                curX = parseInt(me.borderRect.left + i * intervalX - me.gridWidth / 2, 10) + offset;
                context.moveTo(curX, me.borderRect.top);
                context.lineTo(curX, me.borderRect.bottom);
            }
        }
        context.stroke();
    };
    this.drawAxis = function (context) {
        me.axis.left.draw(context);
        me.axis.top.draw(context);
        me.axis.right.draw(context);
        me.axis.bottom.draw(context);
    };
    this.drawFrmGrid = function (context) {
        me.drawFrame(context);
        if (instance.isBorderEnabled()) {
            me.drawBorder(context);
        }
        me.drawGrid(context);
        me.drawAxis(context);
    };

    // 类公共成员
    // 接口函数
    instance.setBorderRect = function (rect) {// 设置边框尺寸
        var temp;
        if (rect.right < rect.left) {
            temp = rect.right;
            rect.right = rect.left;
            rect.left = temp;
        }
        if (rect.bottom < rect.top) {
            temp = rect.bottom;
            rect.bottom = rect.top;
            rect.top = temp;
        }
        me.borderRect.setRect(rect);
        me.axis.left.setBoundary(rect);
        me.axis.top.setBoundary(rect);
        me.axis.right.setBoundary(rect);
        me.axis.bottom.setBoundary(rect);
    };
    instance.getBorderRect = function () {// 获得边框尺寸
        return new GdiRect(
            me.borderRect.left,
            me.borderRect.top,
            me.borderRect.right,
            me.borderRect.bottom
        );
    };
    instance.setFrameColor = function (color) {// 设置框架颜色
        me.frameColor.parseColor(color);
    };
    instance.getFrameColor = function () {// 获得框架颜色
        return me.frameColor.toString();
    };
    instance.setBorderWidth = function (width) {// 设置边框线宽
        me.borderWidth = width;
    };
    instance.getBorderWidth = function () {// 获得边框线宽
        return me.borderWidth;
    };
    instance.enableGrid = function (enable) {// 启用/禁用网格
        me.gridEnable = enable;
    };
    instance.isGridEnable = function () {// 获得网格状态
        return me.gridEnable;
    };
    instance.setGridWidth = function (width) {// 设置网格线宽
        me.gridWidth = width;
    };
    instance.getGridWidth = function () {// 获得网格线宽
        return me.gridWidth;
    };
    instance.setGridNum = function (rows, columns) {// 设置网格行列数目
        me.gridRows = rows;
        me.gridColumns = columns;
        //genLabels();
    };
    instance.getGridNum = function () {// 获得网格行列数目
        return {
            rows : me.gridRows,
            columns : me.gridColumns
        };
    };
    instance.enableGridSpectrum = function (enable) {// 启用/禁用频谱仪网格
        me.gridSpetrum = enable;
    };
    instance.isGridSpectrumEnable = function () {// 获得频谱仪网格状态
        return me.gridSpetrum;
    };
    instance.getAxis = function (position) {
        return me.axis[position];
    };
    // 绘制函数
    instance.draw = function (context) {
        me.drawFrmGrid(context);
    };
    // 操作
    instance.getInnerRect = function () {// 获得内部矩形区域
        return new GdiRect(
            me.borderRect.left,
            me.borderRect.top,
            me.borderRect.right,
            me.borderRect.bottom
        );
    };
    instance.getOuterRect = function () {// 获得外部矩形区域
        return new GdiRect(
            me.borderRect.left - me.borderWidth,
            me.borderRect.top - me.borderWidth,
            me.borderRect.right + me.borderWidth,
            me.borderRect.bottom + me.borderWidth
        );
    };

    // 是否显示边框
    instance.isBorderEnabled = function () {
        return me.borderEnabled;
    };

    // 设置是否显示边框
    instance.enableBorder = function (enabled) {
        me.borderEnabled = !!enabled;
    };

    return instance;
}
// 星座图框架
function GdiFrmGridQam() {
    "use strict";

    // 类私有成员
    var instance = GdiFrmGrid.call(this),       // 框架实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFrame()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.circleEnable = false;                  // 启用中心圈
    this.circleSize = 0.5;                      // 中心圈大小 0.0-1.0
    this.circleColor =
        new GdiColor(220, 220, 220, 1.0);       // 中心圈颜色
    this.crossEnable = false;                   // 启用中心叉(点)
    this.crossSize = 0.05;                      // 中心叉(点)大小 0.0-1.0
    this.sectorEnable = false;                  // 启用区域框
    this.sectorColor =
        new GdiColor(0, 0, 192, 1.0);           // 区域框颜色
    this.sectorWidth = 1;                       // 区域框线宽
    this.sectorPos = 1;                         // 区域框位置 1-4
    this.drawCircle = function (context) {
        // 变量定义
        var i, j, intervalX, intervalY, curX, curY, sizeX, sizeY, offset,
            scale, radius, radian;
        // 绘制中心圈
        if (me.circleEnable) {
            sizeX = [];
            intervalX = (me.borderRect.getWidth() + me.gridWidth) / me.gridColumns;
            for (i = 0; i < me.gridColumns; i += 1) {
                sizeX[i] = (parseInt((i + 1) * intervalX - me.gridWidth / 2, 10) -
                    parseInt(i * intervalX - me.gridWidth / 2, 10)) / 2;
            }
            sizeY = [];
            intervalY = (me.borderRect.getHeight() + me.gridWidth) / me.gridRows;
            for (j = 0; j < me.gridRows; j += 1) {
                sizeY[j] = (parseInt((j + 1) * intervalY - me.gridWidth / 2, 10) -
                    parseInt(j * intervalY - me.gridWidth / 2, 10)) / 2;
            }
            radian = 2 * Math.PI;
            context.lineWidth = me.gridWidth;
            context.strokeStyle = me.circleColor.toString();
            offset = me.gridWidth % 2 ? 0.5 : 0;
            for (i = 0; i < me.gridColumns; i += 1) {
                radius = sizeX[i] * me.circleSize;
                curX = parseInt(me.borderRect.left + i * intervalX - me.gridWidth / 2, 10) +
                    sizeX[i] + offset;
                for (j = 0; j < me.gridRows; j += 1) {
                    scale = sizeY[j] / sizeX[i];
                    curY = parseInt(me.borderRect.top + j * intervalY - me.gridWidth / 2, 10) +
                        sizeY[j] + offset;
                    context.beginPath();
                    context.save();
                    context.translate(curX, curY);
                    context.scale(1, scale);
                    context.arc(0, 0, radius, 0, radian, true);
                    context.restore();
                    context.stroke();
                }
            }
        }
    };
    this.drawCross = function (context) {
        // 变量定义
        var i, j, intervalX, intervalY, curX, curY, sizeX, sizeY, offset, radius;
        // 绘制中心叉(点)
        if (me.crossEnable) {
            sizeX = [];
            intervalX = (me.borderRect.getWidth() + me.gridWidth) / me.gridColumns;
            for (i = 0; i < me.gridColumns; i += 1) {
                sizeX[i] = (parseInt((i + 1) * intervalX - me.gridWidth / 2, 10) -
                    parseInt(i * intervalX - me.gridWidth / 2, 10)) / 2;
            }
            sizeY = [];
            intervalY = (me.borderRect.getHeight() + me.gridWidth) / me.gridRows;
            for (j = 0; j < me.gridRows; j += 1) {
                sizeY[j] = (parseInt((j + 1) * intervalY - me.gridWidth / 2, 10) -
                    parseInt(j * intervalY - me.gridWidth / 2, 10)) / 2;
            }
            radius = [];
            context.beginPath();
            context.lineWidth = me.gridWidth;
            context.strokeStyle = me.frameColor.toString();
            offset = me.gridWidth % 2 ? 0.5 : 0;
            for (i = 0; i < me.gridColumns; i += 1) {
                radius[0] = sizeX[i] * me.crossSize;
                curX = parseInt(me.borderRect.left + i * intervalX - me.gridWidth / 2, 10) +
                    sizeX[i] + offset;
                for (j = 0; j < me.gridRows; j += 1) {
                    radius[1] = sizeY[j] * me.crossSize;
                    curY = parseInt(me.borderRect.top + j * intervalY - me.gridWidth / 2, 10) +
                        sizeY[j] + offset;
                    context.save();
                    context.translate(curX, curY);
                    context.moveTo(-radius[0], -radius[1]);
                    context.lineTo(radius[0], radius[1]);
                    context.moveTo(-radius[0], radius[1]);
                    context.lineTo(radius[0], -radius[1]);
                    context.restore();
                }
            }
            context.stroke();
        }
    };
    this.drawSector = function (context) {
        // 变量定义
        var sizeX, sizeY, offset;
        // 绘制区域框
        if (me.sectorEnable) {
            context.lineWidth = me.sectorWidth;
            context.strokeStyle = me.sectorColor.toString();
            offset = me.sectorWidth / 2;
            sizeX = parseInt(me.borderRect.getWidth() / 2, 10);
            sizeY = parseInt(me.borderRect.getHeight() / 2, 10);
            context.beginPath();
            switch (me.sectorPos) {
            case 1:
                context.rect(me.borderRect.left - offset,
                    me.borderRect.top - offset,
                    sizeX + me.sectorWidth,
                    sizeY + me.sectorWidth);
                break;
            case 2:
                context.rect(
                    me.borderRect.left + sizeX + 1 - offset,
                    me.borderRect.top - offset,
                    me.borderRect.getWidth() - sizeX - 1 + me.sectorWidth,
                    sizeY + me.sectorWidth
                );
                break;
            case 3:
                context.rect(
                    me.borderRect.left - offset,
                    me.borderRect.top + sizeY + 1 - offset,
                    sizeX + me.sectorWidth,
                    me.borderRect.getHeight() - sizeY - 1 + me.sectorWidth
                );
                break;
            case 4:
                context.rect(
                    me.borderRect.left + sizeX + 1 - offset,
                    me.borderRect.top + sizeY + 1 - offset,
                    me.borderRect.getWidth() - sizeX - 1 + me.sectorWidth,
                    me.borderRect.getHeight() - sizeY - 1 + me.sectorWidth
                );
                break;
            default:
                break;
            }
            context.stroke();
        }
    };
    this.drawFrmGridQam = function (context) {
        me.drawFrmGrid(context);
        me.drawCircle(context);
        me.drawCross(context);
        me.drawSector(context);
    };

    // 类公共成员
    // 接口函数
    instance.enableCircle = function (enable) {// 启用/禁用中心圈
        me.circleEnable = enable;
    };
    instance.isCircleEnable = function () {// 获得中心圈状态
        return me.circleEnable;
    };
    instance.setCircleStyle = function (color, size) {// 设置中心圈样式
        me.circleColor.parseColor(color);
        me.circleSize = size;
    };
    instance.getCircleStyle = function () {// 获得中心圈样式
        return {
            color : me.circleColor.toString(),
            size : me.circleSize
        };
    };
    instance.enableCross = function (enable) {// 启用/禁用中心叉
        me.crossEnable = enable;
    };
    instance.isCrossEnable = function () {// 获得中心叉状态
        return me.crossEnable;
    };
    instance.setCrossStyle = function (size) {// 设置中心叉大小
        me.crossSize = size;
    };
    instance.getCrossStyle = function () {// 获得中心叉大小
        return {
            size : me.crossSize
        };
    };
    instance.enableSector = function (enable) {// 启用/禁用区域框
        me.sectorEnable = enable;
    };
    instance.isSectorEnable = function () {// 获得区域框状态
        return me.sectorEnable;
    };
    instance.setSectorStyle = function (color, width) {// 设置区域框样式
        me.sectorColor.parseColor(color);
        me.sectorWidth = width;
    };
    instance.getSectorStyle = function () {// 获得区域框样式
        return {
            color : me.sectorColor.toString(),
            width : me.sectorWidth
        };
    };
    instance.setSectorPos = function (pos) {// 设置区域框位置
        me.sectorPos = pos;
    };
    instance.getSectorPos = function () {// 获得区域框位置
        return me.sectorPos;
    };
    // 绘图函数
    instance.draw = function (context) {
        me.drawFrmGridQam(context);
    };

    return instance;
}
// 漏斗框架
function GdiFrmFunnel() {
    "use strict";

    // 类私有成员
    var instance = GdiFrame.call(this),         // 框架实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFrame()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.drawFrmFunel = function (context) {
        // 暂未实现
    };

    // 类公共成员
    // 绘图函数
    instance.draw = function (context) {
        me.drawFrmFunel(context);
    };

    return instance;
}

// 图形类
function GdiFigure() {
    "use strict";

    // 类私有成员
    var instance = GdiObject.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiObject()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.color = new GdiColor(0, 255, 0, 1);    // 颜色
    this.xAxis = null;                          // x轴
    this.yAxis = null;                          // y轴
    this.objDir = gdiObjDir.HOR;                // 绘制方向
    this.stopData = [];                         // 停靠点[{stopGrp, pos, label{xLabel, yLabel}, datumIndex}, ...]
    this.data = [];                             // 数据
    this.dataType = null;                       // 类型
    this.frameFns = null;                       // 框架函数
    this.stopFns = null;                        // 停靠点函数
    this.limitToBoundary = true;               // 限制到边界内
    this.viewStopLabel = true;                 // 停靠点Label是否可见

    this.drawFigure = function (context) {// 绘制图形
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        var boundary = this.frameFns.getInnerRect();
        context.save();
        context.beginPath();
        context.rect(boundary.left, boundary.top, boundary.getWidth(), boundary.getHeight());
        context.clip();
        this.drawFigShape(context);
        context.restore();
    };
    this.drawFigShape = function (context) {// 绘制图形样式
        // 子类实现
    };

    // 类公共成员
    // 接口函数
    instance.setColor = function (color) {
        me.color.parseColor(color);
    };
    instance.getColor = function () {
        return me.color.toString();
    };
    instance.setXAxis = function (axis) {
        me.xAxis = axis;
    };
    instance.getXAxis = function () {
        return me.xAxis;
    };
    instance.setYAxis = function (axis) {
        me.yAxis = axis;
    };
    instance.getYAxis = function () {
        return me.yAxis;
    };
    instance.setObjDir = function (objDir) {// 设置对象绘制方向
        me.objDir = objDir;
    };
    instance.getObjDir = function () {// 获得对象绘制方向
        return me.objDir;
    };
    instance.setFrameFns = function (frameFns) {// 设置框架函数
        if (frameFns.getInnerRect && frameFns.getOuterRect) {
            me.frameFns = frameFns;
        }
    };
    instance.setStopFns = function (stopFns) {// 设置停靠点函数
        if (stopFns.addStop &&
                stopFns.removeStop &&
                stopFns.removeStopByFigure) {
            me.stopFns = stopFns;
        }
    };
    instance.setLimitToBoundary = function (enable) {// 设置限制到边界内启用状态
        me.limitToBoundary = enable;
    };
    instance.getLimitToBoundary = function () {// 获得限制到边界内启用状态
        return me.limitToBoundary;
    };
    // 数据函数
    instance.addDatum = function (datum) {
        if (me.dataType === null) {
            me.dataType = datum.getType();
        } else if (me.dataType !== datum.getType()) {
            // "Datum Type is inconsistent";
            return -1;
        }
        me.data.push(datum);
        return me.data.length - 1;
    };
    instance.getDatumAt = function (index) {
        if (index >= 0 && index < me.data.length) {
            return me.data[index];
        }
        return null;
    };
    instance.setDatumAt = function (index, datum) {
        if (index >= 0 || index < me.data.length) {
            if (me.dataType === null) {
                me.dataType = datum.getType();
            } else if (me.dataType !== datum.getType()) {
                // "Datum Type is inconsistent";
                return false;
            }
            me.data[index] = datum;
            return true;
        }
        return false;
    };
    instance.getData = function () {
        return me.data;
    };
    instance.setSize = function (len) {
        me.data.length = len;
    };
    instance.getCount = function () {
        return me.data.length;
    };
    instance.removeDatumAt = function (index) {
        if (index >= 0 || index < me.data.length) {
            me.data.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.clearData = function () {
        me.data.length = 0;
    };
    instance.setDataType = function (type) {
        if (me.dataType !== type) {
            var i;
            for (i = 0; i < me.data.length; i += 1) {
                if (me.data[i].getType() !== type) {
                    return false;
                }
            }
            me.dataType = type;
        }
        return true;
    };
    instance.getDataType = function () {
        return me.dataType;
    };
    // 绘图函数
    instance.draw = function (context) {// 绘制函数
        me.drawFigure(context);
    };
    // 停靠点
    instance.genStop = function (stopGrp) {// 生成停靠点
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        this.resetStops();
        var i, interval, boundary;
        if (me.dataType === "DatumOneDim") {
            boundary = me.frameFns.getInnerRect();
            interval = (boundary.getWidth() - gdiLmtBndDist) / (me.data.length - 1);
            for (i = 0; i < me.data.length; i += 1) {
                this.addStop(stopGrp, boundary.left + i * interval, {
                    "xLabel": undefined,
                    "yLabel": undefined,
                    "customs": []
                }, i);
            }
        } else if (me.dataType === "DatumTwoDim") {
            if (me.xAxis) {
                for (i = 0; i < me.data.length; i += 1) {
                    this.addStop(stopGrp, me.xAxis.transform(me.data[i].xValue, me.limitToBoundary), {
                        "xLabel": undefined,
                        "yLabel": undefined,
                        "customs": []
                    }, i);
                }
            }
        }
    };
    instance.addStop = function (stopGrp, pos, label, datumIndex) {// 增加停靠点
        if (me.stopFns === null) {
            alert("Please call setStopFns first!");
            return -1;
        }
        var i;
        for (i = 0; i < me.stopData.length; i += 1) {
            if (me.stopData[i].stopGrp === stopGrp &&
                    me.stopData[i].pos === pos) {
                return -1;
            }
        }
        me.stopData.push({
            "stopGrp": stopGrp,
            "pos": pos,
            "label": label,
            "datumIndex": datumIndex
        });
        me.stopFns.addStop(stopGrp, pos, instance);
        return me.stopData.length - 1;
    };
    instance.getStopCount = function () {// 获得停靠点个数
        return me.stopData.length;
    };
    instance.removeStop = function (stopGrp, pos) {// 删除停靠点
        if (me.stopFns === null) {
            alert("Please call setStopFns first!");
            return false;
        }
        var i;
        for (i = 0; i < me.stopData.length; i += 1) {
            if (me.stopData[i].stopGrp === stopGrp &&
                    me.stopData[i].pos === pos) {
                me.stopFns.removeStop(stopGrp, pos, this);
                me.stopData.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    instance.resetStops = function () {// 复位停靠点
        if (me.stopFns === null) {
            alert("Please call setStopFns first!");
            return;
        }
        me.stopFns.removeStopByFigure(this);
        me.stopData.splice(0, me.stopData.length);
    };
    instance.getStopIndex = function (stopGrp, pos) {// 根据停靠点信息获得停靠点索引
        var index;
        for (index = 0; index < me.stopData.length; index += 1) {
            if (me.stopData[index].stopGrp === stopGrp && me.stopData[index].pos === pos) {
                break;
            }
        }
        return index;
    };
    instance.getStopInfo = function (index) {// 根据停靠点索引获得停靠点信息
        if (index >= 0 && index < me.stopData.length) {
            return {
                "stopGrp": me.stopData[index].stopGrp,
                "pos": me.stopData[index].pos
            };
        }
        return null;
    };
    instance.getStopLabel = function (stopGrp, pos) {// 获得停靠点标注
        return this.getStopLabelAt(this.getStopIndex(stopGrp, pos));
    };
    instance.getStopCoord = function (stopGrp, pos) {// 获得停靠点位置
        return this.getStopCoordAt(this.getStopIndex(stopGrp, pos));
    };
    instance.setStopLabel = function (stopGrp, pos, label) {// 设置停靠点标注
        this.setStopLabelAt(this.getStopIndex(stopGrp, pos), label);
    };
    instance.getStopLabelAt = function (index) {// 通过索引获得停靠点标注
        var xLabel, yLabel, customs;
        if (index >= 0 && index < me.stopData.length) {
            if (me.dataType === "DatumOneDim" &&
                    me.stopData[index].datumIndex >= 0 &&
                    me.stopData[index].datumIndex < me.data.length) {
                xLabel = me.stopData[index].label.xLabel;
                if (xLabel === undefined && me.xAxis !== null) {
                    xLabel = me.xAxis.invTransform(index, {"min": 0, "max": me.data.length - 1});
                    if (me.xAxis.getUnit().length) {
                        xLabel += ' ' + me.xAxis.getUnit();
                    }
                }
                yLabel = me.stopData[index].label.yLabel;
                if (yLabel === undefined && me.yAxis !== null) {
                    yLabel = me.yAxis.formatLabel(me.data[me.stopData[index].datumIndex].value);
                    if (me.yAxis.getUnit().length) {
                        yLabel += ' ' + me.yAxis.getUnit();
                    }
                }
                customs = me.stopData[index].label.customs;
            } else if (me.dataType === "DatumTwoDim" &&
                    me.stopData[index].datumIndex >= 0 &&
                    me.stopData[index].datumIndex < me.data.length) {
                xLabel = me.stopData[index].label.xLabel;
                if (xLabel === undefined && me.xAxis !== null) {
                    xLabel = me.xAxis.formatLabel(me.data[me.stopData[index].datumIndex].xValue);
                    if (me.xAxis.getUnit().length) {
                        xLabel += ' ' + me.xAxis.getUnit();
                    }
                }
                yLabel = me.stopData[index].label.yLabel;
                if (yLabel === undefined && me.yAxis !== null) {
                    yLabel = me.yAxis.formatLabel(me.data[me.stopData[index].datumIndex].yValue);
                    if (me.yAxis.getUnit().length) {
                        yLabel += ' ' + me.yAxis.getUnit();
                    }
                }
                customs = me.stopData[index].label.customs;
            } else if (me.dataType === "DatumVLine" &&
                    me.stopData[index].datumIndex >= 0 &&
                    me.stopData[index].datumIndex < me.data.length) {
                xLabel = me.stopData[index].label.xLabel;
                if (xLabel === undefined && me.xAxis !== null) {
                    xLabel = me.xAxis.invTransform(index, {"min": 0, "max": me.data.length});
                    if (me.xAxis.getUnit().length) {
                        xLabel += ' ' + me.xAxis.getUnit();
                    }
                }
                yLabel = me.stopData[index].label.yLabel;
                if (yLabel === undefined && me.yAxis !== null) {
                    yLabel = "Min: " + me.yAxis.formatLabel(me.data[me.stopData[index].datumIndex].minYValue);
                    if (me.yAxis.getUnit().length) {
                        yLabel += ' ' + me.yAxis.getUnit();
                    }
                    yLabel += "   Max: " + me.yAxis.formatLabel(me.data[me.stopData[index].datumIndex].maxYValue);
                    if (me.yAxis.getUnit().length) {
                        yLabel += ' ' + me.yAxis.getUnit();
                    }
                }
                customs = me.stopData[index].label.customs;
            }
        }
        return {
            "xLabel": xLabel,
            "yLabel": yLabel,
            "customs": customs
        };
    };
    instance.setStopLabelAt = function (index, label) {// 通过索引设置停靠点标注
        if (index >= 0 && index < me.stopData.length) {
            me.stopData[index].label.xLabel = me.viewStopLabel ? label.xLabel : "";
            me.stopData[index].label.yLabel = me.viewStopLabel ? label.yLabel : "";
            me.stopData[index].label.customs = me.viewStopLabel ? label.customs : "";
            return true;
        }
        return false;
    };
    instance.getStopCoordAt = function (index) {// 通过索引获得停靠点位置
        var xCoord, yCoord;
        if (index >= 0 && index < me.stopData.length) {
            if (me.dataType === "DatumOneDim" &&
                    me.stopData[index].datumIndex >= 0 &&
                    me.stopData[index].datumIndex < me.data.length) {
                xCoord = me.stopData[index].pos;
                if (me.yAxis !== null) {
                    yCoord = me.yAxis.transform(me.data[me.stopData[index].datumIndex].value,
                        me.limitToBoundary);
                }
            }
        }
        return new GdiPoint(xCoord, yCoord);
    };

    instance.setViewStopLabel = function (viewStopLabel) {
        me.viewStopLabel = viewStopLabel;
    };

    instance.getViewLabel = function () {
        return me.viewStopLabel;
    };

    return instance;
}
// 折线图
function GdiFigPolyline() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.width = 1;                             // 线宽
    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        
        if (0 === me.data.length) {
            return;
        }
        
        var i, offset, boundary, xPos, yPos, intervalX, gDatum;
        boundary = this.frameFns.getInnerRect();
        context.beginPath();
        context.lineWidth = me.width;
        context.strokeStyle = me.color.toString();
        offset = me.width % 2 ? 0.5 : 0;
        if (instance.getDataType() === "DatumOneDim") {
            intervalX = boundary.getWidth() / (me.data.length - 1);
            gDatum = me.data[0].value;
            yPos = me.yAxis.transform(gDatum, me.limitToBoundary);
            context.moveTo(boundary.left, yPos);
            for (i = 1; i < me.data.length; i += 1) {
                gDatum = me.data[i].value;
                yPos = me.yAxis.transform(gDatum, me.limitToBoundary);
                context.lineTo(parseInt(boundary.left + i * intervalX, 10) + offset,
                    parseInt(yPos, 10) + offset);
            }
        } else if (instance.getDataType() === "DatumTwoDim") {
            gDatum = me.data[0];
            xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
            yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
            context.moveTo(xPos, yPos);
            for (i = 1; i < me.data.length; i += 1) {
                gDatum = me.data[i];
                xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                context.lineTo(parseInt(xPos, 10) + offset,
                    parseInt(yPos, 10) + offset);
            }
        }
        context.stroke();
    };

    // 类公共成员
    // 接口函数
    instance.setWidth = function (width) {
        me.width = width;
    };
    instance.getWidth = function () {
        return me.width;
    };

    return instance;
}

// 齿轮图
function GdiFigGear() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.lineWidth = 1;                             // 线宽

    // 根据横坐标排序二维数据
    this.sortTwoDimData = function (twoDimDataArray) {
        var i = 0,
            j = 0,
            twoDimData = null;

        for (i = 0; i < twoDimDataArray.length - 1; i += 1) {
            for (j = 0; j < twoDimDataArray.length - i - 1; j += 1) {
                if (twoDimDataArray[j].xValue > twoDimDataArray[j + 1].xValue) {
                    twoDimData = twoDimDataArray[j];
                    twoDimDataArray[j] = twoDimDataArray[j + 1];
                    twoDimDataArray[j + 1] = twoDimData;
                }
            }
        }
    };

    // 二维数据去重
    this.duplicateRemoval = function (twoDimDataArray) {
        var i = 0,
            minVal = me.xAxis.getSpan().start,
            maxVal = me.xAxis.getSpan().stop;

        // 范围判断
        for (i = twoDimDataArray.length - 1; i >= 0; i -= 1) {
            if (twoDimDataArray[i].xValue < minVal ||
                twoDimDataArray[i].xValue > maxVal) {
                twoDimDataArray.splice(i, 1);
            }
        }

        // 去重
        for (i = twoDimDataArray.length - 1; i >= 0; i -= 1) {
            if (0 !== i) {
                if (twoDimDataArray[i].xValue === twoDimDataArray[i - 1].xValue) {
                    twoDimDataArray.splice(i, 1);
                }
            }
        }
    };

    // 预处理二维数据
    this.preprocessTwoDimData = function (twoDimDataArray) {
        me.sortTwoDimData(twoDimDataArray);
        me.duplicateRemoval(twoDimDataArray);
    };

    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }

        var i, offset, boundary, xPos, yPos, intervalX, gDatum;
        boundary = this.frameFns.getInnerRect();

        context.beginPath();
        context.lineWidth = me.width;
        context.strokeStyle = me.color.toString();
        offset = me.lineWidth % 2 ? 0.5 : 0;

        if ("DatumOneDim" === me.dataType) {
            intervalX = boundary.getWidth() / me.data.length;
            gDatum = me.data[0].value;
            yPos = me.yAxis.transform(gDatum, me.limitToBoundary);
            context.moveTo(boundary.left, yPos);
            for (i = 0; i < me.data.length; i += 1) {
                gDatum = me.data[i].value;
                yPos = me.yAxis.transform(gDatum, me.limitToBoundary);

                if (0 !== i) {
                    context.lineTo(parseInt(boundary.left + i * intervalX, 10) + 0.5,
                        parseInt(yPos, 10) + offset);
                }
                context.lineTo(parseInt(boundary.left + (i + 1) * intervalX, 10) + 0.5,
                    parseInt(yPos, 10) + offset);
            }
        } else if ("DatumTwoDim" === me.dataType) {
            intervalX = boundary.getWidth() / (me.xAxis.getSpan().stop - me.xAxis.getSpan().start);

            me.preprocessTwoDimData(me.data);

            for (i = 0; i < me.data.length; i += 1) {
                gDatum = me.data[i];
                xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                xPos = parseInt(xPos, 10) + offset;
                yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                yPos = parseInt(yPos, 10) + offset;

                if (0 === i || me.data[i - 1].xValue !== gDatum.xValue - 1) {
                    context.moveTo(xPos, yPos);
                    xPos = parseInt(xPos + intervalX, 10) + offset;
                    context.lineTo(xPos, yPos);
                } else {
                    context.lineTo(xPos, yPos);
                    xPos = parseInt(xPos + intervalX, 10) + offset;
                    context.lineTo(xPos, yPos);
                }
            }
        }
        context.stroke();
    };

    // 类公共成员
    // 接口函数
    instance.setWidth = function (width) {
        me.width = width;
    };
    instance.getWidth = function () {
        return me.width;
    };


    return instance;
}

// 弹簧图
function GdiFigSpring() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),
        me = this;

    instance.isKindOf = function (type) {
        return me instanceof type ||
            (new GdiFigure().isKindOf.call(me, type));
    };

    // 类保护成员
    this.lineWidth = 1;

    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        var i, offset, boundary, xPos, yMinPos, yMaxPos, intervalX, gDatum;
        boundary = this.frameFns.getInnerRect();
        context.beginPath();
        context.strokeStyle = me.color.toString();
        offset = me.width % 2 ? 0.5 : 0;

        if (instance.getDataType() === "DatumVLine") {
            intervalX = boundary.getWidth() / (me.data.length - 1);
            me.lineWidth = intervalX;

            for (i = 0; i < me.data.length; i += 1) {
                xPos = boundary.left + i * intervalX;
                xPos = Math.round(xPos) + offset;
                yMinPos = me.yAxis.transform(me.data[i].minYValue, me.limitToBoundary);
                yMinPos = Math.round(yMinPos);
                yMaxPos = me.yAxis.transform(me.data[i].maxYValue, me.limitToBoundary);
                yMaxPos = Math.round(yMaxPos);

                if (yMaxPos === yMinPos) {
                    context.lineWidth = 1;
                    context.moveTo(Math.round(xPos - 0.5 * intervalX), yMaxPos);
                    context.lineTo(Math.round(xPos + 0.5 * intervalX), yMinPos);
                } else {
                    context.lineWidth = me.lineWidth;
                    context.moveTo(xPos, yMinPos);
                    context.lineTo(xPos, yMaxPos);
                }
            }

        } else if (instance.getDataType() === "DatumVLineWithX") {
            intervalX = boundary.getWidth() / (me.xAxis.getSpan().stop - me.xAxis.getSpan().start);
            me.lineWidth = intervalX;

            for (i = 0; i < me.data.length; i +=1) {
                xPos = me.xAxis.transform(Math.round(me.data[i].xValue), me.limitToBoundary);
                xPos = Math.round(xPos) + offset;
                yMinPos = me.yAxis.transform(me.data[i].minYValue, me.limitToBoundary);
                yMinPos = Math.round(yMinPos);
                yMaxPos = me.yAxis.transform(me.data[i].maxYValue, me.limitToBoundary);
                yMaxPos = Math.round(yMaxPos);

                context.lineWidth = me.lineWidth;
                context.moveTo(xPos, yMinPos);
                context.lineTo(xPos, yMaxPos);
            }
        }
        context.stroke();
    };

    // 停靠点
    instance.genStop = function (stopGrp) {// 生成停靠点
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        this.resetStops();
        var i, interval, boundary;

        if (me.dataType === "DatumVLine") {
            boundary = me.frameFns.getInnerRect();
            interval = (boundary.getWidth() - gdiLmtBndDist) / (me.data.length - 1);
            for (i = 0; i < me.data.length; i += 1) {
                this.addStop(stopGrp, boundary.left + i * interval, {
                    "xLabel": undefined,
                    "yLabel": undefined,
                    "customs": []
                }, i);
            }
        } else if (me.dataType === "DatumVLineWithX") {
            if (me.xAxis) {
                for (i = 0; i < me.data.length; i += 1) {
                    this.addStop(stopGrp, me.xAxis.transform(me.data[i].xValue, me.limitToBoundary), {
                        "xLabel": undefined,
                        "yLabel": undefined,
                        "customs": []
                    }, i);
                }
            }
        }
    };

    return instance;
}

// 点图
function GdiFigPoint() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.size = 1;                              // 尺寸
    this.drawFigShape = function (context) {// 绘制图形样式
        var i, offset, gDatum, xPos, yPos;
        if (instance.getDataType() === "DatumTwoDim") {
            context.beginPath();
            context.lineWidth = me.size;
            context.strokeStyle = me.color.toString();
            offset = me.size % 2 ? 0.5 : 0;
            for (i = 0; i < me.data.length; i += 1) {
                gDatum = me.data[i];
                xPos = parseInt(me.xAxis.transform(gDatum.xValue, me.limitToBoundary), 10) + offset;
                yPos = parseInt(me.yAxis.transform(gDatum.yValue, me.limitToBoundary), 10) + offset;
                context.moveTo(xPos - me.size / 2, yPos);
                context.lineTo(xPos + me.size / 2, yPos);
            }
            context.stroke();
        }
    };

    // 类公共成员
    // 接口函数
    instance.setSize = function (size) {
        me.size = size;
    };
    instance.getSize = function () {
        return me.size;
    };

    return instance;
}
// 柱状图
function GdiFigPillar() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.rounding = true;                       // 取整像素
    this.widthRatio = 0.02;                     // 柱宽系数(柱宽=Frame宽度*柱宽系数)
    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        var i, boundary, width, xPos, yPos, gDatum, intervalX;
        boundary = me.frameFns.getInnerRect();
        width = me.rounding === false ? boundary.getWidth() * me.widthRatio :
                Math.round(boundary.getWidth() * me.widthRatio);
        if (me.dataType === "DatumOneDim") {
            intervalX = boundary.getWidth() / me.data.length;
            if (width >= 1) {// 宽度大于1用fillRect实现
                context.fillStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = boundary.left + (i + 0.5) * intervalX;
                    yPos = me.yAxis.transform(gDatum.value, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.fillRect(xPos - width / 2, yPos, width,
                            boundary.bottom - yPos);
                    } else {
                        yPos = parseInt(yPos, 10);
                        context.fillRect(parseInt(xPos - width / 2, 10), yPos, width,
                            boundary.bottom - yPos);
                    }
                }
            } else {
                context.beginPath();
                context.lineWidth = me.rounding === false ? width : 1;
                context.strokeStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = boundary.left + (i + 0.5) * intervalX;
                    yPos = me.yAxis.transform(gDatum.value, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.moveTo(xPos, boundary.bottom);
                        context.lineTo(xPos, yPos);
                    } else {
                        context.moveTo(parseInt(xPos, 10) + 0.5, boundary.bottom);
                        context.lineTo(parseInt(xPos, 10) + 0.5, parseInt(yPos, 10));
                    }
                }
                context.stroke();
            }
        } else if (me.dataType === "DatumTwoDim") {
            if (width >= 1) {// 宽度大于1用fillRect实现
                context.fillStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                    yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.fillRect(xPos - width / 2, yPos, width,
                            boundary.bottom - yPos);
                    } else {
                        yPos = parseInt(yPos, 10);
                        context.fillRect(parseInt(xPos - width / 2, 10), yPos, width,
                            boundary.bottom - yPos);
                    }
                }
            } else {
                context.beginPath();
                context.lineWidth = me.rounding === false ? width : 1;
                context.strokeStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                    yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.moveTo(xPos, boundary.bottom);
                        context.lineTo(xPos, yPos);
                    } else {
                        context.moveTo(parseInt(xPos, 10) + 0.5, boundary.bottom);
                        context.lineTo(parseInt(xPos, 10) + 0.5, parseInt(yPos, 10));
                    }
                }
                context.stroke();
            }
        }
    };

    // 类公共成员
    // 接口函数
    instance.setRounding = function (enable) {// 设置取整像素状态
        me.rounding = enable;
    };
    instance.getRounding = function () {// 获得取整像素状态
        return me.rounding;
    };
    instance.setWidthRatio = function (widthRatio) {// 设置柱宽系数
        me.widthRatio = widthRatio;
    };
    instance.getWidthRatio = function () {// 获得柱宽系数
        return me.widthRatio;
    };
    // 停靠点
    instance.genStop = function (stopGrp) {// 生成停靠点
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        this.resetStops();
        var i, boundary, interval;
        if (me.dataType === "DatumOneDim") {
            boundary = me.frameFns.getInnerRect();
            interval = boundary.getWidth() / me.data.length;
            for (i = 0; i < me.data.length; i += 1) {
                this.addStop(stopGrp, boundary.left + (i + 0.5) * interval, {
                    "xLabel": undefined,
                    "yLabel": undefined,
                    "customs": []
                }, i);
            }
        } else if (me.dataType === "DatumTwoDim") {
            if (me.xAxis) {
                for (i = 0; i < me.data.length; i += 1) {
                    this.addStop(stopGrp, me.xAxis.transform(me.data[i].xValue, me.limitToBoundary), {
                        "xLabel": undefined,
                        "yLabel": undefined,
                        "customs": []
                    }, i);
                }
            }
        }
    };

    return instance;
}

// 线段图
function GdiFigSegment() {
    "use strict";

    // 私有成员
    var instance = GdiFigure.call(this),      // 图形实例
        me = this;

    // 类保护成员
    this.segmentWidth = 1;                    // 线段宽
    this.segmentHeightRatio = 0.5;           // 线段高系数（线段高=Frame高度*线段高系数）
    this.maxSegmentsCount = 500;              // 最大线段数
    this.segmentEnabledArray = [];            // 需要显示线段的索引位置

    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }

        var i, boundary, height, xPos, yBottomPos, yTopPos, intervalX, offset;

        boundary = me.frameFns.getInnerRect();
        height = boundary.getHeight() * me.segmentHeightRatio;
        yTopPos = boundary.top + (boundary.getHeight() - height) / 2;
        yBottomPos = yTopPos + height;
        intervalX = boundary.getWidth() / (me.maxSegmentsCount - 1);

        context.beginPath();
        context.lineWidth = me.segmentWidth;
        context.strokeStyle = me.color.toString();
        offset = me.segmentWidth % 2 ? 0.5 : 0;

        for (i in me.segmentEnabledArray) {
            if (me.segmentEnabledArray.hasOwnProperty(i) &&
                me.segmentEnabledArray[i]) {
                xPos = parseInt(boundary.left + i * intervalX, 10) + offset;
                yBottomPos = parseInt(yBottomPos, 10) + offset;
                yTopPos = parseInt(yTopPos, 10) + offset;

                context.moveTo(xPos, yBottomPos);
                context.lineTo(xPos, yTopPos);
            }
        }

        context.stroke();
    };

    // 公有成员
    instance.isKindOf = function (type) {
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 获取最大线段数
    instance.getMaxSegsCount = function () {
        return me.maxSegmentsCount;
    };

    // 设置最大线段数
    instance.setMaxSegsCount = function (maxSegsCount) {
        if (maxSegsCount < 0) {
            return;
        }
        me.maxSegmentsCount = maxSegsCount;
    };

    /*
    允许显示某线段
    参数为线段索引或者索引的数组
     */
    instance.enableSegment = function (segIndex) {
        var i = 0;

        if (!(segIndex instanceof Array)) {
            segIndex = [segIndex];
        }

        for (i = 0; i < segIndex.length; i += 1) {
            if (segIndex[i] < me.maxSegmentsCount) {
                me.segmentEnabledArray[segIndex[i]] = true;
            }
        }
    };

    /*
     禁止显示某线段
     参数为线段索引或者索引的数组
     */
    instance.disableSegment = function (segIndex) {
        var i = 0;

        if (!(segIndex instanceof Array)) {
            segIndex = [segIndex];
        }

        for (i = 0; i < segIndex.length; i += 1) {
            me.segmentEnabledArray.splice(segIndex[i], 1);
        }
    };

    /*
    禁止所有线段的显示
     */
    instance.disableAll = function () {
        me.segmentEnabledArray = [];
    };

    // 获取线段宽度
    instance.getSegWidth = function () {
        return me.segmentWidth;
    };

    // 设置线段宽度
    instance.setSegWidth = function (width) {
        me.segmentWidth = parseInt(width, 10);
    };

    // 获取线段高度系数
    instance.getSegHeightRatio = function (heightRatio) {
        return me.segmentHeightRatio;
    };

    // 设置线段高度系数
    instance.setSegHeightRatio = function (heightRatio) {
        me.segmentHeightRatio = heightRatio > 1 ? 1 : heightRatio;
    };

    return instance;
}

//尺刻图类 ////////////////////////////////////////////////////////////////////////
function GdiRulerScale() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    me.rounding = true;                       // 取整像素
    me.widthRatio = 0.02;                     // 柱宽系数(柱宽=Frame宽度*柱宽系数)
    me.scaleLabels = [];                      //刻度数组,格式  {show:true,text:87,offsetX:-5,offsetY:-10}
    me.labelColor = '#ffffff';
    me.labelFont = new GdiFont(14, "微软雅黑");
    me.unit = {text:'',x:0, y:0};       //刻度单位
    me.pillar_width = 1;
    me.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        var i, boundary, width, xPos, yPos, gDatum, intervalX;
        boundary = me.frameFns.getInnerRect();
        width = me.rounding === false ? boundary.getWidth() * me.widthRatio :
            Math.round(boundary.getWidth() * me.widthRatio);
        me.pillar_width = width;
        if (me.dataType === "DatumOneDim") {
            intervalX = boundary.getWidth() / me.data.length;
            if (width > 1) {// 宽度大于1用fillRect实现
                context.fillStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = boundary.left + (i+0.5) * intervalX;
                    yPos = me.yAxis.transform(gDatum.value, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.fillRect(xPos - width / 2, yPos, width,
                            boundary.bottom - yPos);
                    } else {
                        yPos = parseInt(yPos, 10);
                        context.fillRect(parseInt(xPos - width / 2, 10), yPos, width,
                            boundary.bottom - yPos);
                    }
                }
            }
            else {
                context.beginPath();
                context.lineWidth = me.rounding === false ? width : 1;
                context.strokeStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = boundary.left + (i + 0.5) * intervalX;
                    yPos = me.yAxis.transform(gDatum.value, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.moveTo(xPos, boundary.bottom);
                        context.lineTo(xPos, yPos);
                    } else {
                        context.moveTo(parseInt(xPos, 10) + 0.5, boundary.bottom);
                        context.lineTo(parseInt(xPos, 10) + 0.5, parseInt(yPos, 10));
                    }
                }
                context.closePath();
                context.stroke();
            }
        }
        else if (me.dataType === "DatumTwoDim") {
            if (width > 1) {// 宽度大于1用fillRect实现
                context.fillStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                    yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.fillRect(xPos - width / 2, yPos, width,
                            boundary.bottom - yPos);
                    } else {
                        yPos = parseInt(yPos, 10);
                        context.fillRect(parseInt(xPos - width / 2, 10), yPos, width,
                            boundary.bottom - yPos);
                    }
                }
            }
            else {
                context.beginPath();
                context.lineWidth = me.rounding === false ? width : 1;
                context.strokeStyle = me.color.toString();
                for (i = 0; i < me.data.length; i += 1) {
                    gDatum = me.data[i];
                    xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                    yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                    if (me.rounding === false) {
                        context.moveTo(xPos, boundary.bottom);
                        context.lineTo(xPos, yPos);
                    } else {
                        context.moveTo(parseInt(xPos, 10) + 0.5, boundary.bottom);
                        context.lineTo(parseInt(xPos, 10) + 0.5, parseInt(yPos, 10));
                    }
                }
                context.closePath();
                context.stroke();
            }
        }
        //刻度标注
        for (i = 0; i < me.data.length; i += 1) {
            if(!me.scaleLabels[i] || !me.scaleLabels[i].show){
                continue;
            }
            var scaleLabel = me.scaleLabels[i];
            gDatum = me.data[i];
            xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
            yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
            var text = new GdiText(scaleLabel.text, gdiTextPos.CUSTOMIZE);
            text.setFont(me.labelFont);
            text.setColor(me.labelColor);
            if(scaleLabel.offsetX == 'mid'){
                var wid = text.measureText(context);
                text.position.x = parseInt(xPos - wid.width / 2);
            }
            else{
                text.position.x = parseInt(xPos +scaleLabel.offsetX);
            }
            text.position.y = parseInt(yPos+scaleLabel.offsetY);
            context.restore(); //取消边框限制
            text.draw(context);
        }
        //刻度单位
        var unitText = new GdiText(me.unit.text, gdiTextPos.CUSTOMIZE);
        unitText.setFont(me.labelFont);
        unitText.setColor(me.labelColor);
        unitText.position.x = parseInt(me.unit.x);
        unitText.position.y = parseInt(me.unit.y);
        unitText.draw(context);
    };

    // 类公共成员
    // 接口函数
    instance.setRounding = function (enable) {// 设置取整像素状态
        me.rounding = enable;
    };
    instance.getRounding = function () {// 获得取整像素状态
        return me.rounding;
    };
    instance.setWidthRatio = function (widthRatio) {// 设置柱宽系数
        me.widthRatio = widthRatio;
    };
    instance.getWidthRatio = function () {// 获得柱宽系数
        return me.widthRatio;
    };
    instance.getPillarWidth = function () {// 获得柱宽
        return me.pillar_width;
    };
    //添加标注
    instance.addScaleLabel = function(label){
        me.scaleLabels.push(label);
    };
    //设置刻度单位
    instance.setUnit = function(unit){
        me.unit.text = unit.text;
        me.unit.x = unit.x;
        me.unit.y = unit.y;
    };
    // 停靠点
    instance.genStop = function (stopGrp) {// 生成停靠点
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        this.resetStops();
        var i, boundary, interval;
        if (me.dataType === "DatumOneDim") {
            boundary = me.frameFns.getInnerRect();
            interval = boundary.getWidth() / me.data.length;
            for (i = 0; i < me.data.length; i += 1) {
                this.addStop(stopGrp, boundary.left + (i + 0.5) * interval, {
                    "xLabel": undefined,
                    "yLabel": undefined,
                    "customs": []
                }, i);
            }
        } else if (me.dataType === "DatumTwoDim") {
            if (me.xAxis) {
                for (i = 0; i < me.data.length; i += 1) {
                    var posX = me.xAxis.transform(me.data[i].xValue, me.limitToBoundary);
                    this.addStop(stopGrp, posX, {
                        "xLabel": undefined,
                        "yLabel": undefined,
                        "customs": []
                    }, i);
                }
            }
        }
    };

    return instance;
}
//尺刻游标信息图案
function GdiRulerInfoPatn(){
    "use strict";

    // 类私有成员
    var instance = GdiPattern.call(this),       // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiPattern()).isKindOf.call(me, type);
    };

    // 类保护成员
    me.width = 1000;                                // 图案区域的宽
    me.rect = new GdiRect(0, 0, 0, 0);              // 矩形区域
    me.lineWidth = 1;                               // 线条宽度
    me.lineColor = new GdiColor(255, 255, 255, 1);  // 线条颜色
    me.fillColor = new GdiColor(255, 255, 255, 1);  // 填充颜色
    me.left_triangle_color = new GdiColor(255, 255, 255, 1);
    me.right_triangle_color = new GdiColor(255, 255, 255, 1);
    me.text1 = '电台名105';
    me.text1_type = '未知';
    me.text1_type_color = '#FFA436';
    me.text2 = '106.8 MHz';
    me.text3 = '';
    me.fontSize1 = 18;
    me.fontSize2 = 24;
    me.fontSize3 = 18;
    me.rect_triangle = 10; //矩形和三角形直接的间距
    me.drawInfoPatn = function (context) {
        context.lineWidth = me.lineWidth;
        context.fillStyle = me.fillColor.toString();
        context.strokeStyle = me.lineColor.toString();
        //矩形
        context.save();
        var offset = me.lineWidth / 2;
        context.fillRect(me.rect.left - offset, me.rect.top - offset,
            me.rect.getWidth() + me.lineWidth, me.rect.getHeight() + me.lineWidth);
        context.strokeRect(me.rect.left - offset, me.rect.top - offset,
            me.rect.getWidth() + me.lineWidth, me.rect.getHeight() + me.lineWidth);
        context.restore();
        //三角triangle
        var xpos, ypos;
        //左侧三角
        context.fillStyle = me.left_triangle_color.toString();
        context.strokeStyle = me.left_triangle_color.toString();
        context.beginPath();
        xpos = me.rect.left - me.rect_triangle;
        ypos = me.rect.top;
        context.moveTo(xpos, ypos);
        context.lineTo(xpos - me.rect.getHeight(), ypos + me.rect.getHeight()/2);
        context.lineTo(xpos, ypos + me.rect.getHeight());
        context.closePath();
        context.fill();
        context.stroke();
        //右侧三角
        context.fillStyle = me.right_triangle_color.toString();
        context.strokeStyle = me.right_triangle_color.toString();
        context.beginPath();
        xpos = me.rect.right + me.rect_triangle;
        ypos = me.rect.top;
        context.moveTo(xpos, ypos);
        context.lineTo(xpos + me.rect.getHeight(), ypos + me.rect.getHeight()/2);
        context.lineTo(xpos, ypos + me.rect.getHeight());
        context.closePath();
        context.fill();
        context.stroke();
        context.strokeStyle = me.lineColor.toString();
        //左侧文字
        var leftText = new GdiText(me.text1+' / ', gdiTextPos.CUSTOMIZE);
        leftText.setFont(new GdiFont(me.fontSize1, "微软雅黑"));
        leftText.setColor(me.text1_type_color);
        leftText.position.x = 20;
        leftText.position.y = me.rect.top;
        leftText.draw(context);
        var typeText = new GdiText(me.text1_type, gdiTextPos.CUSTOMIZE);
        typeText.setFont(new GdiFont(18, "微软雅黑"));
        typeText.setColor(me.text1_type_color);
        typeText.position.x = 20 + leftText.measureText(context).width;
        typeText.position.y = me.rect.top;
        typeText.draw(context);
        //矩形上方文字
        var topText = new GdiText(me.text2, gdiTextPos.CUSTOMIZE);
        topText.setFont(new GdiFont(me.fontSize2, "微软雅黑"));
        topText.setColor(new GdiColor(0, 0, 0, 1));
        var wid = topText.measureText(context);
        topText.position.x = me.rect.left + (me.rect.getWidth()-wid.width)/2;
        topText.position.y = me.rect.top + (me.rect.getHeight()-me.fontSize2-4)/2;
        topText.draw(context);
        //右侧文字
        var rightText = new GdiText(me.text3, gdiTextPos.CUSTOMIZE);
        rightText.setFont(new GdiFont(me.fontSize3, "微软雅黑"));
        rightText.setColor(new GdiColor(255, 255, 255, 1));
        wid = rightText.measureText(context);
        rightText.position.x = me.width - wid.width;
        rightText.position.y = me.rect.top ;
        rightText.draw(context);
    };

    // 类公共成员
    instance.setWidth = function(width){    //整个图案的宽
        me.width = width;
    };
    instance.setRect = function (rect) {// 设置矩形区域
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            me.rect.setRect(rect);
        }
    };
    instance.getRect = function () {// 获得矩形区域
        return new GdiRect(
            me.rect.left,
            me.rect.top,
            me.rect.right,
            me.rect.bottom
        );
    };
    instance.setText1 = function(text){
        me.text1 = text;
    };
    instance.setText1_type = function(text){
        me.text1_type = text;
    };
    instance.setText1TypeColor = function(color){
        me.text1_type_color = color;
    };
    instance.setText2 = function(text){
        me.text2 = text;
    };
    instance.getText2 = function(){
        return me.text2;
    };
    instance.setFontSize2 = function(size){
        me.fontSize2 = size;
    };
    instance.setLineWidth = function (width) {// 设置线条宽度
        me.lineWidth = width;
    };
    instance.getLineWidth = function () {// 获得线条宽度
        return me.lineWidth;
    };
    instance.setLineColor = function (color) {// 设置线条颜色
        me.lineColor.parseColor(color);
    };
    instance.getLineColor = function () {// 获得线条颜色
        return me.lineColor.toString();
    };
    instance.setFillColor = function (color) {// 设置填充颜色
        me.fillColor.parseColor(color);
    };
    instance.getFillColor = function () {// 获得填充颜色
        return me.fillColor.toString();
    };
    instance.setLeftTriangleColor = function(color){
        me.left_triangle_color.parseColor(color);
    };
    instance.setRightTriangleColor = function(color){
        me.right_triangle_color.parseColor(color);
    };
    instance.getActiveTriangle = function(point){
        if (point.isKindOf && point.isKindOf(GdiPoint)) {
            var left_triangle = {};
            var right_triangle = {};
            //左
            left_triangle.left = me.rect.left - me.rect_triangle - me.rect.getHeight();
            left_triangle.right = me.rect.left - me.rect_triangle;
            left_triangle.top = me.rect.top;
            left_triangle.bottom = me.rect.top + me.rect.getHeight();
            if((point.x - left_triangle.left) * (left_triangle.right - point.x) >= 0 &&
                (point.y - left_triangle.top) * (left_triangle.bottom - point.y) >= 0){
                return 'left_triangle';
            }
            //右
            right_triangle.left = me.rect.right + me.rect_triangle;
            right_triangle.right = me.rect.right + me.rect_triangle + me.rect.getHeight();
            right_triangle.top = me.rect.top;
            right_triangle.bottom = me.rect.top + me.rect.getHeight();
            if((point.x - right_triangle.left) * (right_triangle.right - point.x) >= 0 &&
                (point.y - right_triangle.top) * (right_triangle.bottom - point.y) >= 0){
                return 'right_triangle';
            }
        }
        return false;
    };

    // 绘制函数
    instance.draw = function (context) {
        me.drawInfoPatn(context);
    };

    return instance;
}
//带峰值的条形图
function GdiBarWithPeakValuePatn(name){
    "use strict";

    // 类私有成员
    var instance = GdiPattern.call(this),       // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiPattern()).isKindOf.call(me, type);
    };
    // 类保护成员
    me.OffsetX = 20;            //左上角所在X轴位置
    me.OffsetY = 205;           //左上角所在Y轴位置
    me.width = 1000;             //图案区宽
    me.height = 30;             //图案区高
    me.titleWidth = 150;        //标题宽
    me.valueWidth = 170;        //数值显示区宽
    me.barWidth = me.width-me.titleWidth-me.valueWidth;    //条形图区域宽
    me.fontSize = 18;           //字体大小
    me.title = '电平/峰值：';
    me.unit = 'dbm';
    me.curValue = 60;           //当前值
    me.maxValue = 65;           //峰值
    me.titleColor = '#FFFFFF';  //标题文字颜色
    me.valueColor = '#000000';  //数值文字颜色
    me.span = {start:0,stop:140};   //条图的横轴范围
    me.barColor = '#00FF00';    //条图颜色
    me.peakColor = '#FF0000';   //峰值线颜色
    me.peakLineWidth = 2;       //峰值线宽度
    me.pillarNum = 100;
    me.bShowMaxText = true;
    me.bshowPillar = true;      //是显示成栅格还是实心的

    me.drawBarPatn = function(context) {
        context.save();
        //标题
        var titleText = new GdiText(me.title, gdiTextPos.CUSTOMIZE);
        titleText.setFont(new GdiFont(me.fontSize, "微软雅黑"));
        titleText.setColor(me.titleColor);
        titleText.position.x = me.OffsetX;
        titleText.position.y = me.OffsetY + (me.height-me.fontSize)/2;
        titleText.draw(context);
        //数值显示
        context.fillStyle = '#FFFFFF';
        context.fillRect(me.OffsetX + me.titleWidth, me.OffsetY,
            me.valueWidth-11, me.height);
        var value = '---';
        if(me.bShowMaxText){
            value = me.curValue + '/'+me.maxValue + ' ' + me.unit;
        }
        else{
           value = me.curValue + ' ' + me.unit;
        }
        var valueText = new GdiText(value, gdiTextPos.CUSTOMIZE);
        valueText.setFont(new GdiFont(me.fontSize, "微软雅黑"));
        valueText.setColor(me.valueColor);
        var wid = valueText.measureText(context);
        valueText.position.x = me.OffsetX + me.titleWidth + (me.valueWidth-wid.width)/2;
        valueText.position.y = me.OffsetY + (me.height-me.fontSize)/2;
        valueText.draw(context);
        //数值与条图之间的分割线
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(me.OffsetX + me.titleWidth+me.valueWidth-6, me.OffsetY);
        context.lineTo(me.OffsetX + me.titleWidth+me.valueWidth-6, me.OffsetY+me.height);
        context.closePath();
        context.stroke();
        //bar
        if(me.bshowPillar){
            me.barWidth = me.width - me.titleWidth - me.valueWidth;
            var startX = me.OffsetX + me.titleWidth + me.valueWidth;
            var pillarWid = me.barWidth / (me.pillarNum * 2);
            var percent = me.value2PosX(me.curValue) / me.barWidth ;
            var pillars = parseInt(me.pillarNum * percent);
            context.fillStyle = me.barColor;
            for(var i=0; i<pillars; i++){
                context.fillRect(startX, me.OffsetY,pillarWid, me.height);
                startX += pillarWid*1.8;
            }
        }
        else{
            context.fillRect(me.OffsetX + me.titleWidth + me.valueWidth, me.OffsetY,
                me.value2PosX(me.curValue), me.height);
        }
        //峰值
        context.fillStyle = me.peakColor;
        startX = me.OffsetX + me.titleWidth+me.valueWidth;
        percent = me.value2PosX(me.maxValue) / me.barWidth
        pillars = parseInt(me.pillarNum * percent);

        context.fillRect(startX+pillars*pillarWid*1.8, me.OffsetY,pillarWid, me.height);
        /*context.beginPath();
        context.lineWidth = me.peakLineWidth;
        context.strokeStyle = me.peakColor;
        var maxX = me.OffsetX + me.titleWidth+me.valueWidth + me.value2PosX(me.maxValue);
        context.moveTo(maxX, me.OffsetY);
        context.lineTo(maxX, me.OffsetY+me.height);
        context.stroke();*/
        //复位
        context.restore();
    };

    //数值转X轴坐标值
    me.value2PosX = function(value){
        var ratio = me.barWidth / (me.span.stop - me.span.start);
        var posX = parseInt(value * ratio);
        return posX;
    };

    // 类公共成员
    instance.Name  = name;
    instance.setTitleWidth = function(width) {
        me.titleWidth = width;
    };
    instance.setValueWidth = function(width){
        me.valueWidth = width;
    };
    instance.setWidth = function(width){
        me.width = width;
    };
    instance.setOffsetXY = function(offsetX,offsetY){
        me.OffsetX = offsetX;
        me.OffsetY = offsetY;
    };
    instance.setHeight = function(height){
        me.height = height;
    };
    instance.setFontSize = function(fontSize){
        me.fontSize = fontSize;
    };
    instance.setTitle = function (title){
        me.title = title;
    };
    instance.setUnit = function (unit){
        me.unit = unit;
    };
    instance.setCurValue = function(value){
        me.curValue = value;
    };
    instance.setMaxVaulue = function(value){
        me.maxValue = value;
    };
    instance.setTitleColor = function(color){
        me.titleColor = color;
    };
    instance.setValueColor = function(color){
        me.valueColor = color;
    };
    instance.setSpan = function(start, stop){
        me.span.start = start;
        me.span.stop = stop;
    };
    instance.setBarColor = function(barColor){
        me.barColor = barColor;
    };
    instance.setPeakColor = function(color){
        me.peakColor = color;
    };
    instance.setPeakLineWidth = function(lineWidth){
        me.peakLineWidth = lineWidth;
    };
    instance.setShowMaxText = function(bshow){
        me.bShowMaxText = bshow;
    };

    // 绘制函数
    instance.draw = function (context) {
        me.drawBarPatn(context);
    };

    return instance;

}
//音柱图（竖版）
function GdiVolumePatn(name){
    "use strict";

    // 类私有成员
    var instance = GdiPattern.call(this),       // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiPattern()).isKindOf.call(me, type);
    };
    // 类保护成员
    me.OffsetX = 20;            //左上角所在X轴位置
    me.OffsetY = 10;           //左上角所在Y轴位置
    me.width = 100;             //图案区宽
    me.height = 280;            //图案区高
    me.splitHeight = 11;
    me.valueHeight = 30;        //数值显示区高
    me.barHeight = me.height-me.valueHeight-me.splitHeight;    //条形图区域高
    me.fontSize = 18;           //字体大小
    me.unit = 'MHz';
    me.freq = '---'                 //频率 MHz
    me.curValue = 60;           //当前值
    me.maxValue = 65;           //峰值
    me.valueColor = '#000000';  //数值文字颜色
    me.span = {start:0,stop:100};   //条图的纵轴范围
    me.barColor = '#00FF00';    //条图颜色
    me.peakColor = '#FF0000';   //峰值线颜色
    me.pillarNum = 30;
    me.bshowPillar = true;      //是显示成栅格还是实心的

    me.drawVolumePatn = function(context) {
        //context.save();
        //数值显示
        context.fillStyle = '#FFFFFF';
        me.barHeight = me.height-me.valueHeight-me.splitHeight;
        context.fillRect(me.OffsetX, me.OffsetY+me.barHeight+me.splitHeight,
            me.width, me.valueHeight);
        var value = '---';
        value = me.freq + ' ' + me.unit;
        var valueText = new GdiText(value, gdiTextPos.CUSTOMIZE);
        valueText.setFont(new GdiFont(me.fontSize, "微软雅黑"));
        valueText.setColor(me.valueColor);
        var wid = valueText.measureText(context);
        valueText.position.x = me.OffsetX +(me.width-wid.width)/2;
        valueText.position.y = me.OffsetY+me.barHeight+me.splitHeight+(me.valueHeight-me.fontSize)/2;
        valueText.draw(context);
        //数值与条图之间的分割线
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(me.OffsetX, me.OffsetY + me.barHeight+me.splitHeight-6);
        context.lineTo(me.OffsetX+me.width, me.OffsetY + me.barHeight+me.splitHeight-6);
        context.closePath();
        context.stroke(); //开始画线
        //bar
        if(me.bshowPillar){
            me.barHeight = me.height-me.valueHeight-me.splitHeight;
            var startY = me.OffsetY + me.barHeight;
            var pillarWid = me.barHeight / (me.pillarNum * 2);
            var percent = me.value2PosY(me.curValue) / me.barHeight ;
            var pillars = parseInt(me.pillarNum * percent);
            context.fillStyle = me.barColor;
            for(var i=0; i<pillars; i++){
                context.fillRect(me.OffsetX, startY-pillarWid,me.width, pillarWid);
                startY -= pillarWid*1.8;
            }
        }
        else{
            context.fillRect(me.OffsetX, startY -  me.value2PosY(me.curValue),
                me.width,  me.value2PosY(me.curValue));
        }
        //峰值
        context.fillStyle = me.peakColor;
        startY = me.OffsetY + me.barHeight;
        percent = me.value2PosY(me.maxValue) / me.barHeight
        pillars = parseInt(me.pillarNum * percent);

        context.fillRect(me.OffsetX, startY-pillars*pillarWid*1.8-pillarWid,me.width, pillarWid);
        //复位
        //context.restore();
    };

    //数值转Y轴坐标值
    me.value2PosY = function(value){
        var ratio = me.barHeight / (me.span.stop - me.span.start);
        var posY = parseInt(value * ratio);
        return posY;
    };

    // 类公共成员
    instance.Name  = name;
    instance.setValueHeight = function(height){
        me.valueHeight = height;
    }
    instance.setValueWidth = function(width){
        me.valueWidth = width;
    };
    instance.setWidth = function(width){
        me.width = width;
    };
    instance.setOffsetXY = function(offsetX,offsetY){
        me.OffsetX = offsetX;
        me.OffsetY = offsetY;
    };
    instance.setHeight = function(height){
        me.height = height;
    };
    instance.setFontSize = function(fontSize){
        me.fontSize = fontSize;
    };
    instance.setUnit = function (unit){
        me.unit = unit;
    };
    instance.setCurValue = function(value){
        me.curValue = value;
    };
    instance.setMaxVaulue = function(value){
        me.maxValue = value;
    };
    instance.setValueColor = function(color){
        me.valueColor = color;
    };
    instance.setSpan = function(start, stop){
        me.span.start = start;
        me.span.stop = stop;
    };
    instance.setBarColor = function(barColor){
        me.barColor = barColor;
    };
    instance.setPeakColor = function(color){
        me.peakColor = color;
    };
    instance.setFreq = function(freq){
        me.freq = freq;
    };

    // 绘制函数
    instance.draw = function (context) {
        me.drawVolumePatn(context);
    };

    return instance;

}

//尺刻图类 ////////////////////////////////////////////////////////////////////////

// 块图
function GdiFigBlock() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.rounding = true;                       // 取整像素
    this.widthRatio = 0.02;                     // 块宽系数(块宽=Frame宽度*块宽系数)
    this.heightRatio = 0.02;                    // 块高系数(块高=Frame高度*块高系数)
    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        var i, boundary, width, height, xPos, yPos, gDatum, gdiClr;
        boundary = me.frameFns.getInnerRect();
        width = boundary.getWidth() * me.widthRatio;
        height = boundary.getHeight() * me.heightRatio;
        if (me.rounding === true) {
            width = Math.round(width);
            height = Math.round(height);
        }
        if (me.dataType === "DatumTwoDimWithClr") {
            gdiClr = new GdiColor(0, 0, 0, 0);
            for (i = 0; i < me.data.length; i += 1) {
                gDatum = me.data[i];
                gdiClr.parseColor(gDatum.color ? gDatum.color : me.color);
                context.fillStyle = gdiClr.toString();
                xPos = me.xAxis.transform(gDatum.xValue, me.limitToBoundary);
                yPos = me.yAxis.transform(gDatum.yValue, me.limitToBoundary);
                if (me.rounding === false) {
                    context.fillRect(xPos - width / 2, yPos - height / 2,
                        width, height
                    );
                } else {
                    context.fillRect(parseInt(xPos - width / 2, 10),
                        parseInt(yPos - height / 2, 10), width, height
                    );
                }
            }
        }
    };

    // 类公共成员
    // 接口函数
    instance.setRounding = function (enable) {// 设置取整像素状态
        me.rounding = enable;
    };
    instance.getRounding = function () {// 获得取整像素状态
        return me.rounding;
    };
    instance.setWidthRatio = function (widthRatio) {// 设置块宽系数
        me.widthRatio = widthRatio;
    };
    instance.getWidthRatio = function () {// 获得块宽系数
        return me.widthRatio;
    };
    instance.setHeightRatio = function (heightRatio) {// 设置块高系数
        me.heightRatio = heightRatio;
    };
    instance.getHeightRatio = function () {// 获得块高系数
        return me.heightRatio;
    };

    return instance;
}
// 动态光谱图
function GdiFigSpectrogram() {
    "use strict";

    // 类私有成员
    var instance = GdiFigure.call(this),        // 图形实例
        me = this;
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
        (new GdiFigure()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.rounding = true;                       // 取整像素
    this.maxAccumNum = 100;                     // 最大累积数
    this.accumulatedNum = 0;                    // 已经累计数
    this.canvasBuf =
        document.createElement('canvas');       // 绘图缓冲区
    this.updateFig = true;                      // 更新图形
    this.fnValue2Clr = function (value) {// 数值转换颜色函数
        return me.color.toString();
    };
    this.drawFigShape = function (context) {// 绘制图形样式
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        var i, boundary, width, height, xPosS, xPosE, gDatum, bufCt, nAccumNum, gdiClr;
        bufCt = me.canvasBuf.getContext("2d");
        boundary = me.frameFns.getInnerRect();
        nAccumNum = Math.min(me.maxAccumNum, boundary.getHeight());
        width = boundary.getWidth() / me.data.length;
        height = Math.ceil(boundary.getHeight() / nAccumNum);
        nAccumNum = Math.ceil(boundary.getHeight() / height);
        if (me.dataType === "DatumOneDim") {
            bufCt.fillStyle = context.fillStyle;
            bufCt.fillRect(0, 0, me.canvasBuf.width, me.canvasBuf.height - height * me.accumulatedNum);

            if (!me.updateFig) {
                if (me.canvasBuf.width === boundary.getWidth()
                    && me.canvasBuf.height === height * (nAccumNum - 1)
                ) {
                    context.drawImage(me.canvasBuf, boundary.left, boundary.bottom - me.canvasBuf.height,
                        boundary.getWidth(), me.canvasBuf.height
                    );
                }
                return;
            }
            if (me.canvasBuf.width === boundary.getWidth()
                && me.canvasBuf.height === height * (nAccumNum - 1)
            ) {
                context.drawImage(me.canvasBuf, boundary.left, boundary.bottom - height * nAccumNum,
                    boundary.getWidth(), me.canvasBuf.height
                );
            } else {
                me.canvasBuf.width = boundary.getWidth();
                me.canvasBuf.height = height * (nAccumNum - 1);
            }
            xPosS = boundary.left;
            gdiClr = new GdiColor(0, 0, 0, 0);
            for (i = 0; i < me.data.length; i += 1) {
                xPosE = boundary.left + (i + 1) * width;
                gDatum = me.data[i];
                gdiClr.parseColor(me.fnValue2Clr(gDatum.value));
                context.fillStyle = gdiClr.toString();
                if (me.rounding === true) {
                    context.fillRect(parseInt(xPosS, 10), boundary.bottom - height,
                     parseInt(xPosE, 10) - parseInt(xPosS, 10), height
                    );
                } else {
                    context.fillRect(xPosS, boundary.bottom - height,
                        xPosE - xPosS, height
                    );
                }
                xPosS = xPosE;
            }
            bufCt.drawImage(context.canvas, boundary.left, boundary.bottom - me.canvasBuf.height,
                boundary.getWidth(), me.canvasBuf.height,
                0, 0, me.canvasBuf.width, me.canvasBuf.height
            );
            if (me.accumulatedNum < me.maxAccumNum) {
                me.accumulatedNum += 1;
            }
        }
    };

    // 类公共成员
    // 接口函数
    instance.setRounding = function (enable) {// 设置取整像素状态
        me.rounding = enable;
    };
    instance.getRounding = function () {// 获得取整像素状态
        return me.rounding;
    };
    instance.setMaxAccumNum = function (maxAccumNum) {// 设置最大累积数
        me.maxAccumNum = maxAccumNum;
    };
    instance.getMaxAccumNum = function () {// 获得最大累积数
        return me.maxAccumNum;
    };
    instance.setValue2Clr = function (fnValue2Clr) {// 设置数值转颜色函数
        me.fnValue2Clr = fnValue2Clr;
    };
    instance.clearBuffer = function () {// 清空缓冲区
        me.canvasBuf.width = 0;
        me.canvasBuf.height = 0;
    };
    instance.setUpdateFigure = function (enable) {// 设置更新图形状态
        me.updateFig = enable;
    };
    instance.getUpdateFigure = function () {// 获得更新图形状态
        return me.updateFig;
    };

    return instance;
}

// 游标类
function GdiMarker() {
    "use strict";

    // 类私有成员
    var instance = GdiObject.call(this),        // 游标实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiObject()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.color =
        new GdiColor(0, 255, 255, 1.0);         // 颜色
    this.labelTextColor = new GdiColor(255, 255, 255, 1.0);
    this.visible = true;                        // 可见
    this.viewLabel = true;                      // label是否可见
    this.position = 0;                          // 位置
    this.objDir = gdiObjDir.VER;                // 方向
    this.labelData = [];                        // 标注[{labels[], color, markBlockClr, crossPt, figure}, ...]   markBlockClr仅在GdiMkrLineWithMarkBlock类中支持
    this.labelFont = new GdiFont(14, "微软雅黑");// 标注字体
    this.textPos = gdiTextPos.OUTER_LEFTTOP;    // 标注位置
    this.textOffset = new GdiPoint(0, 0);       // 标注偏移
    this.frameFns = null;                       // 框架函数
    this.clipBound = true;                      // 剪切边界
    this.subMarkVisibleData = [];              // 对应每个figure的子游标是否显示

    this.drawMarker = function (context) {// 绘制游标
        if (this.frameFns === null) {
            alert("Please call setFrameFns first!");
            return;
        }
        if (this.visible) {
            context.save();
            if (this.clipBound) {
                var boundary = this.frameFns.getInnerRect();
                context.beginPath();
                context.rect(boundary.left, boundary.top,
                    boundary.getWidth(), boundary.getHeight());
                context.clip();
            }
            this.drawMkrShape(context);
            this.drawMkrText(context);
            context.restore();
        }
    };
    this.drawMkrShape = function (context) {// 绘制游标模型
        // 子类实现
    };
    this.drawMkrText = function (context) {// 绘制游标文本
        var i, j, textUnit = new GdiText('', gdiTextPos.CUSTOMIZE),
            mkrRects = this.calcMarkerRects(),
            figColor = new GdiColor(0, 0, 0, 0);
        textUnit.setFont(this.labelFont);
        if (mkrRects.length === 1) {
            this.calcTextPos(textUnit, mkrRects[0], -1);
            // 游标名称
            if (this.name.length) {
                textUnit.setColor(this.color);
                textUnit.text = this.name;
                textUnit.draw(context);
                textUnit.position.y += me.labelFont.height;
                textUnit.position.y += 6;// 标注间隔
            }
            // 图形标注
            if (this.viewLabel) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    if (this.labelData[i].labels.length) {
                        figColor.parseColor(this.labelData[i].color);
                        textUnit.setBkgndColor(figColor);// 背景颜色
                        figColor.reverse();
                        textUnit.setColor(this.labelTextColor);// 文字颜色
                        for (j = 0; j < this.labelData[i].labels.length; j += 1) {
                            if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                                textUnit.text = this.labelData[i].labels[j];
                                textUnit.draw(context);
                                textUnit.position.y += me.labelFont.height;
                            }
                        }
                        textUnit.position.y += 6;// 标注间隔
                    }
                }
            }
        } else if (mkrRects.length === this.labelData.length) {
            for (i = 0; i < this.labelData.length; i += 1) {
                this.calcTextPos(textUnit, mkrRects[i], i);
                // 游标名称
                if (this.name.length &&
                    instance.isSubMarkVisible(this.labelData[i].figure)) {
                    figColor.alpha = 0;
                    textUnit.setColor(this.color);
                    textUnit.setBkgndColor(figColor);
                    textUnit.text = this.name;
                    textUnit.draw(context);
                    textUnit.position.y += me.labelFont.height;
                    textUnit.position.y += 6;// 标注间隔
                }
                // 图形标注
                if (this.viewLabel && this.labelData[i].labels.length) {
                    figColor.parseColor(this.labelData[i].color);
                    textUnit.setBkgndColor(figColor);// 背景颜色
                    figColor.reverse();
                    textUnit.setColor(this.labelTextColor);// 文字颜色
                    for (j = 0; j < this.labelData[i].labels.length; j += 1) {
                        if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                            textUnit.text = this.labelData[i].labels[j];
                            textUnit.draw(context);
                            textUnit.position.y += me.labelFont.height;
                        }
                    }
                    textUnit.position.y += 6;// 标注间隔
                }
            }
        }
    };
    this.calcMarkerRects = function () {// 计算游标区域
        return [new GdiRect(0, 0, 0, 0)];
    };
    this.calcTextPos = function (textUnit, mkrRect, labelIndex) {
        var labelHeight = 0;

        if (this.viewLabel) {
            labelHeight = this.calcLabelHeight(labelIndex);
        } else if (this.name.length) {
            labelHeight = me.labelFont.height;
        }

        switch (this.textPos) {
        case gdiTextPos.OUTER_LEFTTOP:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'right';
            textUnit.position.y = mkrRect.top;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_LEFTMIDDLE:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'right';
            textUnit.position.y = (mkrRect.top + mkrRect.bottom - labelHeight) / 2;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_LEFTBOTTOM:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'right';
            textUnit.position.y = mkrRect.bottom - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_BOTTOMLEFT:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'left';
            textUnit.position.y = mkrRect.bottom;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_BOTTOMCENTER:
            textUnit.position.x = (mkrRect.left + mkrRect.right) / 2;
            textUnit.position.align = 'center';
            textUnit.position.y = mkrRect.bottom;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_BOTTOMRIGHT:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'right';
            textUnit.position.y = mkrRect.bottom;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_RIGHTBOTTOM:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'left';
            textUnit.position.y = mkrRect.bottom - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_RIGHTMIDDLE:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'left';
            textUnit.position.y = (mkrRect.top + mkrRect.bottom - labelHeight) / 2;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_RIGHTTOP:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'left';
            textUnit.position.y = mkrRect.top;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_TOPRIGHT:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'right';
            textUnit.position.y = mkrRect.top - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_TOPCENTER:
            textUnit.position.x = (mkrRect.left + mkrRect.right) / 2;
            textUnit.position.align = 'center';
            textUnit.position.y = mkrRect.top - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.OUTER_TOPLEFT:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'left';
            textUnit.position.y = mkrRect.top - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.CORNER_LEFTTOP:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'right';
            textUnit.position.y = mkrRect.top - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.CORNER_LEFTBOTTOM:
            textUnit.position.x = mkrRect.left;
            textUnit.position.align = 'right';
            textUnit.position.y = mkrRect.bottom;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.CORNER_RIGHTBOTTOM:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'left';
            textUnit.position.y = mkrRect.bottom;
            textUnit.position.baseline = 'top';
            break;
        case gdiTextPos.CORNER_RIGHTTOP:
            textUnit.position.x = mkrRect.right;
            textUnit.position.align = 'left';
            textUnit.position.y = mkrRect.top - labelHeight;
            textUnit.position.baseline = 'top';
            break;
        default:
            return false;
        }
        // 设置标注位置偏移量
        textUnit.position.x += this.textOffset.x;
        textUnit.position.y += this.textOffset.y;
        return true;
    };
    this.calcLabelHeight = function (index) {// 计算标注高度
        var i, height = 0;
        // 游标名字
        if (this.name.length) {
            height += me.labelFont.height;
        }
        // 图形标注
        if (index >= 0 && index < this.labelData.length) {
            if (this.labelData[index].labels.length) {
                height += 6;
                height += me.labelFont.height * this.labelData[index].labels.length;
            }
        } else {
            for (i = 0; i < this.labelData.length; i += 1) {
                if (this.labelData[i].labels.length) {
                    height += 6;
                    height += me.labelFont.height * this.labelData[i].labels.length;
                }
            }
        }
        return height;
    };

    // 类公共成员
    // 接口函数
    instance.setColor = function (color) {
        me.color.parseColor(color);
    };
    instance.getColor = function () {
        return me.color.toString();
    };
    instance.setlabelTextColor = function (color) {
        me.labelTextColor.parseColor(color);
    };
    instance.setVisible = function (visible) {
        me.visible = visible;
    };
    instance.getVisible = function () {
        return me.visible;
    };
    instance.setPosition = function (pos) {
        me.position = pos;
    };
    instance.getPosition = function () {
        return me.position;
    };
    instance.setObjDir = function (objDir) {
        me.objDir = objDir;
    };
    instance.getObjDir = function () {
        return me.objDir;
    };
    instance.setLabelData = function (labelData) {// 设置标注数据
        me.labelData = labelData;
    };
    instance.getLabelData = function () {// 获取标注数据
        return me.labelData;
    };
    instance.setLabelFont = function (font) {// 设置标注字体
        me.labelFont.parseFont(font);
    };
    instance.getLabelFont = function () {// 获得标注字体
        return me.labelFont.toString();
    };
    instance.setTextPos = function (txtPos) {
        me.textPos = txtPos;
    };
    instance.getTextPos = function () {
        return me.textPos;
    };
    instance.setTextOffset = function (point) {
        if (point.isKindOf && point.isKindOf(GdiPoint)) {
            me.textOffset.x = point.x;
            me.textOffset.y = point.y;
        }
    };
    instance.getTextOffset = function () {
        return new GdiPoint(
            me.textOffset.x,
            me.textOffset.y
        );
    };
    instance.setFrameFns = function (frameFns) {// 设置框架函数
        if (frameFns.getInnerRect && frameFns.getOuterRect) {
            me.frameFns = frameFns;
        }
    };
    instance.setClipBound = function (enable) {// 设置剪切边界
        me.clipBound = enable;
    };
    instance.getClipBound = function () {// 获得剪切边界
        return me.clipBound;
    };
    instance.setViewLabel = function (viewLabel) {
        me.viewLabel = viewLabel;
    };
    instance.getViewLabel = function () {
        return me.viewLabel;
    };
    // 绘制函数
    instance.draw = function (context) {
        me.drawMarker(context);
    };
    // 操作函数
    instance.getMovingRange = function () {
        var rect = new GdiRect(0, 0, 0, 0);
        if (me.frameFns) {
            rect.setRect(me.frameFns.getInnerRect());
        }
        return rect;
    };
    // 获取某个figure对应的mark是否可见
    instance.isSubMarkVisible = function (figure) {
        var i = 0;

        for (i = 0; i < me.subMarkVisibleData.length; i += 1) {
            if (me.subMarkVisibleData[i].figure === figure) {
                return me.subMarkVisibleData[i].subMarkVisible;
            }
        }

        return true;
    };
    // 设置某个figure对应mark可见或隐藏
    instance.setSubMarkVisible = function (figure, visible) {
        var i = 0;

        for (i = 0; i < me.subMarkVisibleData.length; i += 1) {
            if (me.subMarkVisibleData[i].figure === figure) {
                return me.subMarkVisibleData[i].subMarkVisible = visible;
            }
        }
        me.subMarkVisibleData.push({
            "figure": figure,
            "subMarkVisible": visible
        });
    };

    return instance;
}
// 直线游标
function GdiMkrLine() {
    "use strict";

    // 类私有成员
    var instance = GdiMarker.call(this),        // 游标实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiMarker()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.width = 1;                             // 线宽
    this.length = 0;                            // 长度
    this.textPos = gdiTextPos.OUTER_RIGHTTOP;   // 标注位置
    this.alpha = 1;                             // 颜色透明度
    this.drawMkrShape = function (context) {// 绘制游标模型
        var i, offset, boundary, xPos, yPos;
        context.beginPath();
        context.lineWidth = this.width;
        this.color.alpha = this.alpha;
        context.strokeStyle = this.color.toString();
        offset = this.width % 2 ? 0.5 : 0;
        boundary = this.frameFns.getInnerRect();
        if (this.objDir === gdiObjDir.VER) {// 绘制纵向游标
            xPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                        yPos = this.labelData[i].crossPt.y;
                        context.moveTo(xPos, yPos - this.length / 2);
                        context.lineTo(xPos, yPos + this.length / 2);
                    }
                }
            } else {
                context.moveTo(xPos, boundary.top);
                context.lineTo(xPos, boundary.bottom);
            }
        } else if (this.objDir === gdiObjDir.HOR) {// 绘制横向游标
            yPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                        xPos = this.labelData[i].crossPt.x;
                        context.moveTo(xPos - this.length / 2, yPos);
                        context.lineTo(xPos + this.length / 2, yPos);
                    }
                }
            } else {
                context.moveTo(boundary.left, yPos);
                context.lineTo(boundary.right, yPos);
            }
        }
        context.stroke();
    };
    this.calcMarkerRects = function () {
        var rects = [], i, offset, boundary, xPos, yPos;
        offset = this.width % 2 ? 0.5 : 0;
        boundary = this.frameFns.getInnerRect();
        if (this.objDir === gdiObjDir.VER) {
            xPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    yPos = this.labelData[i].crossPt.y;
                    rects.push(new GdiRect(
                        xPos - this.width / 2,
                        yPos - this.length / 2,
                        xPos + this.width / 2,
                        yPos + this.length / 2
                    ));
                    rects[i].inflate(2);
                }
            } else {
                rects.push(new GdiRect(
                    xPos - this.width / 2,
                    boundary.top,
                    xPos + this.width / 2,
                    boundary.bottom
                ));
                rects[0].inflate(2);
                rects[0].limitToRect(boundary);
            }
        } else if (this.objDir === gdiObjDir.HOR) {
            yPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    xPos = this.labelData[i].crossPt.x;
                    rects.push(new GdiRect(
                        xPos - this.length / 2,
                        yPos - this.width / 2,
                        xPos + this.length / 2,
                        yPos + this.width / 2
                    ));
                    rects[i].inflate(2);
                }
            } else {
                rects.push(new GdiRect(
                    boundary.left,
                    yPos - this.width / 2,
                    boundary.right,
                    yPos + this.width / 2
                ));
                rects[0].inflate(2);
                rects[0].limitToRect(boundary);
            }
        }
        return rects;
    };

    // 类公共成员
    // 接口函数
    instance.setWidth = function (width) {
        me.width = width;
    };
    instance.getWidth = function () {
        return me.width;
    };
    instance.setLength = function (length) {
        if (length >= 0) {
            me.length = length;
        }
    };
    instance.getLength = function () {
        return me.length;
    };
    instance.setAlpha = function (alpha) {
        me.alpha = alpha;
    };
    instance.getAlpha = function () {
        return me.alpha;
    };

    return instance;
}

// 带标记块的直线游标
function GdiMkrLineWithMarkBlock() {
    "use strict";

    // 类私有成员
    var instance = GdiMkrLine.call(this),        // 游标实例
        me = this;                              // this指针

    this.markBlockWidth = 10;                // 游标色块的宽度
    this.markBlockHeight = 10;               // 游标色块的高度
    this.markBlockMargin = 2;                // 游标色块与其他元素的间隔
    this.markBlockOffset = {                 // 游标色块位置的偏移
        x: 0,
        y: 4
    };

    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiMkrLine()).isKindOf.call(me, type);
    };

    this.parentCalcTextPos = this.calcTextPos;    // 父类中的calcTextPos方法

    this.calcTextPos = function (textUnit, mkrRect, labelIndex) {
        var labelHeight = 0;

        if (this.viewLabel) {
            labelHeight = this.calcLabelHeight(labelIndex);
        } else if (this.name.length) {
            labelHeight = me.labelFont.height;
        }

        switch (this.textPos) {
            case gdiTextPos.OUTER_LEFTTOP:
                textUnit.position.x = mkrRect.left - me.markBlockWidth - me.markBlockMargin;
                textUnit.position.align = 'right';
                textUnit.position.y = mkrRect.top;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_LEFTMIDDLE:
                textUnit.position.x = mkrRect.left - me.markBlockWidth - me.markBlockMargin;
                textUnit.position.align = 'right';
                textUnit.position.y = (mkrRect.top + mkrRect.bottom - labelHeight) / 2;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_LEFTBOTTOM:
                textUnit.position.x = mkrRect.left - me.markBlockWidth - me.markBlockMargin;
                textUnit.position.align = 'right';
                textUnit.position.y = mkrRect.bottom - labelHeight;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_BOTTOMLEFT:
                textUnit.position.x = mkrRect.left;
                textUnit.position.align = 'left';
                textUnit.position.y = mkrRect.bottom + me.markBlockHeight + me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_BOTTOMCENTER:
                textUnit.position.x = (mkrRect.left + mkrRect.right) / 2;
                textUnit.position.align = 'center';
                textUnit.position.y = mkrRect.bottom + me.markBlockHeight + me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_BOTTOMRIGHT:
                textUnit.position.x = mkrRect.right;
                textUnit.position.align = 'right';
                textUnit.position.y = mkrRect.bottom + me.markBlockHeight + me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_RIGHTBOTTOM:
                textUnit.position.x = mkrRect.right + me.markBlockWidth + me.markBlockMargin;
                textUnit.position.align = 'left';
                textUnit.position.y = mkrRect.bottom - labelHeight;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_RIGHTMIDDLE:
                textUnit.position.x = mkrRect.right + me.markBlockWidth + me.markBlockMargin;
                textUnit.position.align = 'left';
                textUnit.position.y = (mkrRect.top + mkrRect.bottom - labelHeight) / 2;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_RIGHTTOP:
                textUnit.position.x = mkrRect.right + me.markBlockWidth + me.markBlockMargin;
                textUnit.position.align = 'left';
                textUnit.position.y = mkrRect.top;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_TOPRIGHT:
                textUnit.position.x = mkrRect.right;
                textUnit.position.align = 'right';
                textUnit.position.y = mkrRect.top - labelHeight - me.markBlockHeight  - me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_TOPCENTER:
                textUnit.position.x = (mkrRect.left + mkrRect.right) / 2;
                textUnit.position.align = 'center';
                textUnit.position.y = mkrRect.top - labelHeight - me.markBlockHeight - me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.OUTER_TOPLEFT:
                textUnit.position.x = mkrRect.left;
                textUnit.position.align = 'left';
                textUnit.position.y = mkrRect.top - labelHeight - me.markBlockHeight - me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.CORNER_LEFTTOP:
                textUnit.position.x = mkrRect.left - me.markBlockWidth - me.markBlockMargin;
                textUnit.position.align = 'right';
                textUnit.position.y = mkrRect.top - labelHeight - me.markBlockHeight  - me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.CORNER_LEFTBOTTOM:
                textUnit.position.x = mkrRect.left - me.markBlockWidth - me.markBlockMargin;
                textUnit.position.align = 'right';
                textUnit.position.y = mkrRect.bottom + me.markBlockHeight + me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.CORNER_RIGHTBOTTOM:
                textUnit.position.x = mkrRect.right + me.markBlockWidth + me.markBlockMargin;
                textUnit.position.align = 'left';
                textUnit.position.y = mkrRect.bottom + me.markBlockHeight + me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            case gdiTextPos.CORNER_RIGHTTOP:
                textUnit.position.x = mkrRect.right + me.markBlockWidth + me.markBlockMargin;
                textUnit.position.align = 'left';
                textUnit.position.y = mkrRect.top - labelHeight - me.markBlockHeight - me.markBlockMargin;
                textUnit.position.baseline = 'top';
                break;
            default:
                return false;
        }
        // 设置标注位置偏移量
        textUnit.position.x += this.textOffset.x;
        textUnit.position.y += this.textOffset.y;
        return true;
    };

    this.calcBlockPos = function (textPos, mkrRect, labelIndex) {
        var labelHeight = 0,
            blockPos = {
                x: 0,
                y: 0
            };

        if (this.viewLabel) {
            labelHeight = this.calcLabelHeight(labelIndex);
        } else if (this.name.length) {
            labelHeight = me.labelFont.height;
        }

        switch (this.textPos) {
            case gdiTextPos.OUTER_LEFTTOP:
            case gdiTextPos.OUTER_LEFTMIDDLE:
            case gdiTextPos.OUTER_LEFTBOTTOM:
                blockPos.x = mkrRect.left - this.markBlockWidth;
                blockPos.y = textPos.y;
                break;
            case gdiTextPos.OUTER_BOTTOMLEFT:
            case gdiTextPos.OUTER_BOTTOMCENTER:
            case gdiTextPos.OUTER_BOTTOMRIGHT:
                blockPos.x = textPos.x;
                blockPos.y = mkrRect.bottom;
                break;
            case gdiTextPos.OUTER_RIGHTBOTTOM:
            case gdiTextPos.OUTER_RIGHTMIDDLE:
            case gdiTextPos.OUTER_RIGHTTOP:
                blockPos.x = mkrRect.right;
                blockPos.y = textPos.y;
                break;
            case gdiTextPos.OUTER_TOPRIGHT:
            case gdiTextPos.OUTER_TOPCENTER:
            case gdiTextPos.OUTER_TOPLEFT:
                blockPos.x = textPos.x;
                blockPos.y = mkrRect.top - this.markBlockHeight;
                break;
            case gdiTextPos.CORNER_LEFTTOP:
                blockPos.x = mkrRect.left - this.markBlockWidth;
                blockPos.y = mkrRect.top - this.markBlockHeight;
                break;
            case gdiTextPos.CORNER_LEFTBOTTOM:
                blockPos.x = mkrRect.left - this.markBlockWidth;
                blockPos.y = mkrRect.bottom;
                break;
            case gdiTextPos.CORNER_RIGHTBOTTOM:
                blockPos.x = mkrRect.right;
                blockPos.y = mkrRect.bottom;
                break;
            case gdiTextPos.CORNER_RIGHTTOP:
                blockPos.x = mkrRect.right;
                blockPos.y = mkrRect.top - this.markBlockHeight;
                break;
            default:
                return blockPos;
        }

        blockPos.x += this.markBlockOffset.x;
        blockPos.y += this.markBlockOffset.y;

        return blockPos;
    };

    this.drawMkrText = function (context) {// 绘制游标文本
        var i, j, textUnit = new GdiText('', gdiTextPos.CUSTOMIZE),
            mkrRects = this.calcMarkerRects(),
            figColor = new GdiColor(0, 0, 0, 0),
            blockPos = null;

        textUnit.setFont(this.labelFont);
        if (mkrRects.length === 1) {
            this.parentCalcTextPos(textUnit, mkrRects[0], -1);
            // 游标名称
            if (this.name.length) {
                textUnit.setColor(this.color);
                textUnit.text = this.name;
                textUnit.draw(context);
            }
            // 图形标注
            if (this.viewLabel) {
                this.calcTextPos(textUnit, mkrRects[0], -1);
                textUnit.position.y += me.labelFont.height;
                textUnit.position.y += 6;// 标注间隔

                for (i = 0; i < this.labelData.length; i += 1) {
                    if (this.labelData[i].labels.length) {
                        blockPos = this.calcBlockPos(textUnit.position, mkrRects[0], i);

                        context.fillStyle = this.labelData[i].markBlockClr.toString();
                        context.fillRect(blockPos.x, blockPos.y, me.markBlockWidth, me.markBlockHeight);

                        figColor.parseColor(this.labelData[i].color);
                        textUnit.setColor(figColor);// 文字颜色

                        for (j = 0; j < this.labelData[i].labels.length; j += 1) {
                            if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                                textUnit.text = this.labelData[i].labels[j];
                                textUnit.draw(context);
                                textUnit.position.y += me.labelFont.height;
                            }
                        }
                        textUnit.position.y += 6;// 标注间隔
                    }
                }
            }
        } else if (mkrRects.length === this.labelData.length) {
            for (i = 0; i < this.labelData.length; i += 1) {
                this.parentCalcTextPos(textUnit, mkrRects[i], i);
                // 游标名称
                if (this.name.length &&
                    instance.isSubMarkVisible(this.labelData[i].figure)) {
                    figColor.alpha = 0;
                    textUnit.setColor(this.color);
                    textUnit.setBkgndColor(figColor);
                    textUnit.text = this.name;
                    textUnit.draw(context);
                }
                // 图形标注
                if (this.viewLabel && this.labelData[i].labels.length) {
                    this.calcTextPos(textUnit, mkrRects[i], i);
                    textUnit.position.y += me.labelFont.height;
                    textUnit.position.y += 6;// 标注间隔

                    context.fillStyle = this.labelData[i].markBlockClr.toString();
                    context.fillRect(blockPos.x, blockPos.y, me.markBlockWidth, me.markBlockHeight);

                    figColor.parseColor(this.labelData[i].color);
                    textUnit.setColor(figColor);// 文字颜色

                    for (j = 0; j < this.labelData[i].labels.length; j += 1) {
                        if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                            textUnit.text = this.labelData[i].labels[j];
                            textUnit.draw(context);
                            textUnit.position.y += me.labelFont.height;
                        }
                    }
                    textUnit.position.y += 6;// 标注间隔
                }
            }
        }
    };

    // 获取游标色块的宽和高
    instance.getMarkBlockSize = function () {
        return {
            "width": me.markBlockWidth,
            "height": me.markBlockHeight
        };
    };

    // 设置游标色块的宽和高
    instance.setMarkBlockSize = function (width, height) {
        me.markBlockWidth = width;
        me.markBlockHeight = height;
    };

    // 获取游标色块位置的偏移
    instance.getMarkBlockOffset = function () {
        return me.markBlockOffset;
    };

    // 设置游标色块位置的偏移
    instance.setMarkBlockOffset = function (point) {
        if (point.isKindOf && point.isKindOf(GdiPoint)) {
            me.markBlockOffset.x = point.x;
            me.markBlockOffset.y = point.y;
        }
    };

    return instance;
}

// 三角形游标
function GdiMkrTriangle() {
    "use strict";

    // 类私有成员
    var instance = GdiMarker.call(this),        // 游标实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiMarker()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.fillPath = false;                      // 填充路径
    this.textPos = gdiTextPos.OUTER_TOPCENTER;  // 标注位置
    this.drawMkrShape = function (context) {// 绘制游标模型
        var i, xPos, yPos;
        if (this.objDir === gdiObjDir.VER) {// 绘制纵向游标
            context.beginPath();
            context.lineWidth = 2;
            context.fillStyle = this.color.toString();
            context.strokeStyle = this.color.toString();
            for (i = 0; i < this.labelData.length; i += 1) {
                if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                    xPos = this.position;
                    yPos = this.labelData[i].crossPt.y;
                    context.moveTo(xPos, yPos);
                    context.lineTo(xPos - 5, yPos - 10);
                    context.lineTo(xPos + 5, yPos - 10);
                    context.closePath();
                }
            }
            if (me.fillPath) {
                context.fill();
            }
            context.stroke();
        } else if (this.objDir === gdiObjDir.HOR) {// 绘制横向游标
            // 此样式不支持横向游标
            alert('GdiMkrTriangle don\'t support HOR direction.');
        }
    };
    this.calcMarkerRects = function () {// 计算游标区域
        var rects = [], i, xPos, yPos;
        if (this.objDir === gdiObjDir.VER) {// 纵向游标
            for (i = 0; i < this.labelData.length; i += 1) {
                xPos = this.position;
                yPos = this.labelData[i].crossPt.y;
                rects.push(new GdiRect(
                    xPos - 6,
                    yPos - 11,
                    xPos + 6,
                    yPos + 1
                ));
                rects[i].inflate(2);
            }
        } else if (this.objDir === gdiObjDir.HOR) {// 横向游标
            // 此样式不支持横向游标
            alert('GdiMkrTriangle don\'t support HOR direction.');
        }
        return rects;
    };

    // 类公共成员
    // 接口函数
    instance.setFillPath = function (enable) {// 设置填充路径状态
        me.fillPath = enable;
    };
    instance.getFillPath = function () {// 获得填充路径状态
        return me.fillPath;
    };

    return instance;
}
// 菱形游标
function GdiMkrDiamond() {
    "use strict";

    // 类私有成员
    var instance = GdiMarker.call(this),        // 游标实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiMarker()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.fillPath = false;                      // 填充路径
    this.textPos = gdiTextPos.OUTER_TOPCENTER;  // 标注位置
    this.drawMkrShape = function (context) {// 绘制游标模型
        var i, xPos, yPos;
        if (this.objDir === gdiObjDir.VER) {// 绘制纵向游标
            context.beginPath();
            context.lineWidth = 2;
            context.fillStyle = this.color.toString();
            context.strokeStyle = this.color.toString();
            for (i = 0; i < this.labelData.length; i += 1) {
                if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                    xPos = this.position;
                    yPos = this.labelData[i].crossPt.y;
                    context.moveTo(xPos, yPos);
                    context.lineTo(xPos - 4, yPos - 7);
                    context.lineTo(xPos, yPos - 14);
                    context.lineTo(xPos + 4, yPos - 7);
                    context.closePath();
                }
            }
            if (me.fillPath) {
                context.fill();
            }
            context.stroke();
        } else if (this.objDir === gdiObjDir.HOR) {// 绘制横向游标
            // 此样式不支持横向游标
            alert('GdiMkrTriangle don\'t support HOR direction.');
        }
    };
    this.calcMarkerRects = function () {// 计算游标区域
        var rects = [], i, xPos, yPos;
        if (this.objDir === gdiObjDir.VER) {// 纵向游标
            for (i = 0; i < this.labelData.length; i += 1) {
                xPos = this.position;
                yPos = this.labelData[i].crossPt.y;
                rects.push(new GdiRect(
                    xPos - 5,
                    yPos - 15,
                    xPos + 5,
                    yPos + 1
                ));
                rects[i].inflate(2);
            }
        } else if (this.objDir === gdiObjDir.HOR) {// 横向游标
            // 此样式不支持横向游标
            alert('GdiMkrTriangle don\'t support HOR direction.');
        }
        return rects;
    };

    // 类公共成员
    // 接口函数
    instance.setFillPath = function (enable) {// 设置填充路径状态
        me.fillPath = enable;
    };
    instance.getFillPath = function () {// 获得填充路径状态
        return me.fillPath;
    };

    return instance;
}
// 箭头游标
function GdiMkrArrow() {
    "use strict";

    // 类私有成员
    var instance = GdiMarker.call(this),        // 游标实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiMarker()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.textPos = gdiTextPos.OUTER_TOPCENTER;  // 标注位置
    this.drawMkrShape = function (context) {// 绘制游标模型
        var xPos, yPos;
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = this.color.toString();
        if (this.objDir === gdiObjDir.VER) {// 绘制纵向游标
            xPos = parseInt(this.position, 10) + 0.5;
            yPos = this.frameFns.getOuterRect().top;
            context.moveTo(xPos, yPos);
            context.lineTo(xPos, yPos - 20);
            context.moveTo(xPos, yPos);
            context.lineTo(xPos - 5, yPos - 10);
            context.moveTo(xPos, yPos);
            context.lineTo(xPos + 5, yPos - 10);
        } else if (this.objDir === gdiObjDir.HOR) {// 绘制横向游标
            xPos = this.frameFns.getOuterRect().right;
            yPos = parseInt(this.position, 10) + 0.5;
            context.moveTo(xPos, yPos);
            context.lineTo(xPos + 20, yPos);
            context.moveTo(xPos, yPos);
            context.lineTo(xPos + 10, yPos - 5);
            context.moveTo(xPos, yPos);
            context.lineTo(xPos + 10, yPos + 5);
        }
        context.stroke();
    };
    this.calcMarkerRects = function () {// 计算游标区域
        var rects = [], xPos, yPos;
        if (this.objDir === gdiObjDir.VER) {// 纵向游标
            xPos = parseInt(this.position, 10) + 0.5;
            yPos = this.frameFns.getOuterRect().top;
            rects.push(new GdiRect(
                xPos - 7,
                yPos - 22,
                xPos + 7,
                yPos + 2
            ));
            rects[0].inflate(2);
        } else if (this.objDir === gdiObjDir.HOR) {// 横向游标
            xPos = this.frameFns.getOuterRect().right;
            yPos = parseInt(this.position, 10) + 0.5;
            rects.push(new GdiRect(
                xPos - 2,
                yPos - 7,
                xPos + 22,
                yPos + 7
            ));
            rects[0].inflate(2);
        }
        return rects;
    };

    // 类公共成员
    // 操作函数
    instance.getMovingRange = function () {
        var rect = new GdiRect(0, 0, 0, 0);
        if (me.frameFns) {
            if (me.objDir === gdiObjDir.VER) {
                rect.setRect(me.frameFns.getInnerRect());
                rect.bottom = me.frameFns.getOuterRect().top;
                rect.top = rect.bottom - 20 - me.labelFont.height;
            } else if (me.objDir === gdiObjDir.HOR) {
                rect.setRect(me.frameFns.getInnerRect());
                rect.left = me.frameFns.getOuterRect().right;
                rect.right = rect.left + 20 + me.labelFont.height;
            }
        }
        return rect;
    };

    return instance;
}
// OTDR事件
function GdiMkrOTDREvent() {
    "use strict";

    // 类私有成员
    var instance = GdiMkrLine.call(this),       // 游标实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiMkrLine()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.length = 50;                           // 默认长度
    this.textPos =
        gdiTextPos.OUTER_BOTTOMCENTER;          // 标注位置
    this.oriArrow = 0;                          // 方向箭头 0:不显示;1:向右/下显示;2:向左/上显示
    this.oriArrowLen = 10;                      // 方向箭头长度
    this.drawOriArrow = function (context, vtxX, vtxY) {
        if (this.objDir === gdiObjDir.VER) {
            if (this.oriArrow > 0) {
                context.moveTo(vtxX, vtxY);
                context.lineTo(vtxX + this.oriArrowLen, vtxY);
                context.moveTo(vtxX + this.oriArrowLen, vtxY);
                context.lineTo(vtxX + this.oriArrowLen - 5, vtxY + 3);
                context.lineTo(vtxX + this.oriArrowLen - 5, vtxY - 3);
                context.closePath();
            } else if (this.oriArrow < 0) {
                context.moveTo(vtxX, vtxY);
                context.lineTo(vtxX - this.oriArrowLen, vtxY);
                context.moveTo(vtxX - this.oriArrowLen, vtxY);
                context.lineTo(vtxX - this.oriArrowLen + 5, vtxY + 3);
                context.lineTo(vtxX - this.oriArrowLen + 5, vtxY - 3);
                context.closePath();
            }
        } else if (this.objDir === gdiObjDir.HOR) {
            if (this.oriArrow > 0) {
                context.moveTo(vtxX, vtxY);
                context.lineTo(vtxX, vtxY + this.oriArrowLen);
                context.moveTo(vtxX, vtxY + this.oriArrowLen);
                context.lineTo(vtxX + 3, vtxY + this.oriArrowLen - 5);
                context.lineTo(vtxX - 3, vtxY + this.oriArrowLen - 5);
                context.closePath();
            } else if (this.oriArrow < 0) {
                context.moveTo(vtxX, vtxY);
                context.lineTo(vtxX, vtxY - this.oriArrowLen);
                context.moveTo(vtxX, vtxY - this.oriArrowLen);
                context.lineTo(vtxX + 3, vtxY - this.oriArrowLen + 5);
                context.lineTo(vtxX - 3, vtxY - this.oriArrowLen + 5);
                context.closePath();
            }
        }
    };
    this.drawMkrShape = function (context) {// 绘制游标模型
        var i, offset, boundary, xPos, yPos;
        context.beginPath();
        context.lineWidth = this.width;
        context.fillStyle = this.color.toString();
        context.strokeStyle = this.color.toString();
        offset = this.width % 2 ? 0.5 : 0;
        boundary = this.frameFns.getInnerRect();
        if (this.objDir === gdiObjDir.VER) {// 绘制纵向游标
            xPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    if (instance.isSubMarkVisible(this.labelData[i].figure)) {
                        yPos = this.labelData[i].crossPt.y;
                        context.moveTo(xPos, yPos - this.length / 2);
                        context.lineTo(xPos, yPos + this.length / 2);
                        this.drawOriArrow(context, xPos, yPos - this.length / 2);
                        this.drawOriArrow(context, xPos, yPos + this.length / 2);
                    }
                }
            } else {
                context.moveTo(xPos, boundary.top);
                context.lineTo(xPos, boundary.bottom);
                this.drawOriArrow(context, xPos, boundary.top);
                this.drawOriArrow(context, xPos, boundary.bottom);
            }
        } else if (this.objDir === gdiObjDir.HOR) {// 绘制横向游标
            yPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    if (instance.isSubMarkVisible(this.label[i].figure)) {
                        xPos = this.labelData[i].crossPt.x;
                        context.moveTo(xPos - this.length / 2, yPos);
                        context.lineTo(xPos + this.length / 2, yPos);
                        this.drawOriArrow(context, xPos - this.length / 2, yPos);
                        this.drawOriArrow(context, xPos + this.length / 2, yPos);
                    }
                }
            } else {
                context.moveTo(boundary.left, yPos);
                context.lineTo(boundary.right, yPos);
                this.drawOriArrow(context, boundary.left, yPos);
                this.drawOriArrow(context, boundary.right, yPos);
            }
        }
        context.fill();
        context.stroke();
    };
    this.calcMarkerRects = function () {
        var rects = [], i, offset, boundary, xPos, yPos;
        offset = this.width % 2 ? 0.5 : 0;
        boundary = this.frameFns.getInnerRect();
        if (this.objDir === gdiObjDir.VER) {
            xPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    yPos = this.labelData[i].crossPt.y;
                    rects.push(new GdiRect(
                        xPos - this.width / 2,
                        yPos - this.length / 2,
                        xPos + this.width / 2,
                        yPos + this.length / 2
                    ));
                }
            } else {
                rects.push(new GdiRect(
                    xPos - this.width / 2,
                    boundary.top,
                    xPos + this.width / 2,
                    boundary.bottom
                ));
            }
            for (i = 0; i < rects.length; i += 1) {
                if (this.oriArrow > 0) {
                    rects[i].right += this.oriArrowLen;
                    rects[i].top -= 3;
                    rects[i].bottom += 3;
                } else if (this.oriArrow < 0) {
                    rects[i].left -= this.oriArrowLen;
                    rects[i].top -= 3;
                    rects[i].bottom += 3;
                }
                rects[i].inflate(2);
                if (this.length > 0 && this.length < boundary.getHeight()) {
                    rects[i].limitToRect(boundary);
                }
            }
        } else if (this.objDir === gdiObjDir.HOR) {
            yPos = parseInt(this.position, 10) + offset;
            if (this.length > 0 && this.length < boundary.getHeight()) {
                for (i = 0; i < this.labelData.length; i += 1) {
                    xPos = this.labelData[i].crossPt.x;
                    rects.push(new GdiRect(
                        xPos - this.length / 2,
                        yPos - this.width / 2,
                        xPos + this.length / 2,
                        yPos + this.width / 2
                    ));
                }
            } else {
                rects.push(new GdiRect(
                    boundary.left,
                    yPos - this.width / 2,
                    boundary.right,
                    yPos + this.width / 2
                ));
            }
            for (i = 0; i < rects.length; i += 1) {
                if (this.oriArrow > 0) {
                    rects[i].bottom += this.oriArrowLen;
                    rects[i].left -= 3;
                    rects[i].right += 3;
                } else if (this.oriArrow < 0) {
                    rects[i].top -= this.oriArrowLen;
                    rects[i].left -= 3;
                    rects[i].right += 3;
                }
                rects[i].inflate(2);
                if (this.length > 0 && this.length < boundary.getHeight()) {
                    rects[i].limitToRect(boundary);
                }
            }
        }
        return rects;
    };

    // 类公共成员
    // 接口函数
    instance.setOriArrow = function (oriArrow) {
        me.oriArrow = oriArrow;
    };
    instance.getOriArrow = function () {
        return me.oriArrow;
    };

    return instance;
}

// 游标管理器
function GdiMarkerManager() {
    "use strict";

    // 类私有成员
    var instance = {},                          // 管理器实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    this.mkrData = [];                          // 游标[{mkrGrp, mkrClr, markers[{mkr, stopPos, stopAny, stopGrp, viewLabel, labelTextClrData[{figure, clr, markBlockClr}]}, ...]}, ...]
    this.stopData = [];                         // 停靠点[{stopGrp, stops[{pos, figures[figure, ...]}, ...]}, ...]
    this.actMkrData = [];                       // 活动游标[{mkrGrp, actClr, actMkrs[{index, origClr}, ...]}, ...]
    this.defaultMkrClr =
        new GdiColor(0, 255, 255, 1.0);         // 默认游标颜色
    this.defaultActClr =
        new GdiColor(255, 255, 255, 1.0);       // 默认活动游标颜色
    this.frameFns = null;                       // 框架函数
    this.limitToBoundary = true;                // 限制到边界内

    // 绘制函数
    instance.draw = function (context) {
        var i, j, k, marker, labelData, labels, figLabel, stop, boundary;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                marker = me.mkrData[i].markers[j];
                if (marker.mkr.getVisible()) {
                    if (marker.stopAny !== true) {// 非任意停靠
                        if (me.limitToBoundary) {
                            if (marker.stopPos < 0) {
                                marker.stopPos = 0;
                            } else if (marker.stopPos >= me.getStopCount(marker.stopGrp)) {
                                marker.stopPos = me.getStopCount(marker.stopGrp) - 1;
                            }
                        }
                        labelData = [];
                        stop = me.getStopAt(marker.stopGrp, marker.stopPos);
                        if (stop !== null) {
                            for (k = 0; k < stop.figures.length; k += 1) {
                                labels = [];
                                if (marker.viewLabel) {
                                    figLabel = stop.figures[k].getStopLabel(marker.stopGrp, stop.pos);
                                    if (figLabel.xLabel) {
                                        labels.push(figLabel.xLabel);
                                    }
                                    if (figLabel.yLabel) {
                                        labels.push(figLabel.yLabel);
                                    }
                                    if (figLabel.customs) {
                                        labels = labels.concat(figLabel.customs);
                                    }
                                }
                                var bgclr = me.mkrData[i].mkrClr;
                                bgclr.alpha = 0.5;
                                labelData.push({
                                    "color": bgclr,//instance.getMkrLabelTextClr(marker.mkr, stop.figures[k]),
                                    "markBlockClr": instance.getMkrBlockClr(marker.mkr, stop.figures[k]),
                                    "crossPt": stop.figures[k].getStopCoord(marker.stopGrp, stop.pos),
                                    "labels": labels,
                                    "figure": stop.figures[k]
                                });
                            }
                            marker.mkr.setLabelData(labelData);
                            marker.mkr.setPosition(stop.pos);
                            marker.mkr.draw(context);
                        }
                    } else {
                        if (me.limitToBoundary) {
                            if (me.frameFns === null) {
                                alert("Please call setFrameFns first!");
                                return;
                            }
                            boundary = me.frameFns.getInnerRect();
                            if (marker.mkr.getObjDir() === gdiObjDir.VER) {// 纵向游标
                                if (marker.stopPos < boundary.left) {
                                    marker.stopPos = boundary.left;
                                } else if (marker.stopPos > boundary.right - gdiLmtBndDist) {
                                    marker.stopPos = boundary.right - gdiLmtBndDist;
                                }
                            } else if (marker.mkr.getObjDir() === gdiObjDir.HOR) {// 横向游标
                                if (marker.stopPos > boundary.bottom - gdiLmtBndDist) {
                                    marker.stopPos = boundary.bottom - gdiLmtBndDist;
                                } else if (marker.stopPos < boundary.top) {
                                    marker.stopPos = boundary.top;
                                }
                            }
                        }
                        marker.mkr.setPosition(marker.stopPos);
                        marker.mkr.draw(context);
                    }
                }
            }
        }
    };

    // 类公共成员
    // 接口函数
    instance.setFrameFns = function (frameFns) {// 设置框架函数
        if (frameFns.getInnerRect && frameFns.getOuterRect) {
            var i, j;
            me.frameFns = frameFns;
            for (i = 0; i < me.mkrData.length; i += 1) {
                for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                    me.mkrData[i].markers[j].mkr.setFrameFns(frameFns);
                }
            }
        }
    };
    instance.setLimitToBoundary = function (enable) {// 设置限制到边界内启用状态
        me.limitToBoundary = enable;
    };
    instance.getLimitToBoundary = function () {// 获得限制到边界内启用状态
        return me.limitToBoundary;
    };

    // 游标函数
    instance.addMarker = function (mkrGrp, marker) {
        if (!marker.isKindOf || !marker.isKindOf(GdiMarker)) {
            return -1;
        }
        var i, j;
        // 判断marker是否已经存在 确保marker的唯一性
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    return -1;
                }
            }
        }
        // 确定合适的位置并增加marker对象
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (me.frameFns) {
                    marker.setFrameFns(me.frameFns);
                }
                marker.setColor(me.mkrData[i].mkrClr);
                me.mkrData[i].markers.push({
                    "mkr": marker,
                    "stopPos": 0,
                    "stopAny": false,
                    "stopGrp": undefined,
                    "viewLabel": true
                });
                return me.mkrData[i].markers.length - 1;
            }
        }
        // mkrGrp不存在时增加游标组
        if (me.frameFns) {
            marker.setFrameFns(me.frameFns);
        }
        marker.setColor(me.defaultMkrClr);
        me.mkrData.push({
            "mkrGrp": mkrGrp,
            "mkrClr": new GdiColor(0, 255, 255, 1.0),
            "markers": [{
                "mkr": marker,
                "stopPos": 0,
                "stopAny": false,
                "stopGrp": undefined,
                "viewLabel": true
            }]
        });
        return 0;
    };
    instance.insertMarkerAt = function (mkrGrp, index, marker) {
        if (!marker.isKindOf || !marker.isKindOf(GdiMarker)) {
            return -1;
        }
        var i, j;
        // 判断marker是否已经存在 确保marker的唯一性
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    return -1;
                }
            }
        }
        // 确定合适的位置并增加marker对象
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (me.frameFns) {
                    marker.setFrameFns(me.frameFns);
                }
                marker.setColor(me.mkrData[i].mkrClr);
                if (me.mkrData[i].markers.length >= index) {
                    me.mkrData[i].markers.splice(index, 0, {
                        "mkr": marker,
                        "stopPos": 0,
                        "stopAny": false,
                        "stopGrp": undefined,
                        "viewLabel": true
                    });
                    return index;
                }
                me.mkrData[i].markers.add({
                    "mkr": marker,
                    "stopPos": 0,
                    "stopAny": false,
                    "stopGrp": undefined,
                    "viewLabel": true
                });
                return me.mkrData[i].markers.length - 1;
            }
        }
        // mkrGrp不存在时增加游标组
        if (me.frameFns) {
            marker.setFrameFns(me.frameFns);
        }
        marker.setColor(me.defaultMkrClr);
        me.mkrData.push({
            "mkrGrp": mkrGrp,
            "mkrClr": me.defaultMkrClr,
            "markers": [{
                "mkr": marker,
                "stopPos": 0,
                "stopAny": false,
                "stopGrp": undefined,
                "viewLabel": true
            }]
        });
        return 0;
    };
    instance.getMarkerAt = function (mkrGrp, index) {
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    return me.mkrData[i].markers[index].mkr;
                }
            }
        }
        return null;
    };
    instance.getMkrGroupAt = function (index) {// 获得游标组
        if (index >= 0 && index < me.mkrData.length) {
            return me.mkrData[index].mkrGrp;
        }
        return null;
    };
    instance.removeMarkerAt = function (mkrGrp, index) {// 移除游标
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    this.setInactMkrByIndex(mkrGrp, index);
                    me.mkrData[i].markers.splice(index, 1);
                    break;
                }
            }
        }
    };
    instance.removeMkrGroupAt = function (index) {// 移除游标组
        if (index >= 0 && index < me.mkrData.length) {
            var i;
            for (i = 0; i < me.mkrData[index].markers.length; i += 1) {
                this.setInactMkrByIndex(me.mkrData[index].mkrGrp, i);
            }
            for (i = 0; i < me.actMkrData.length; i += 1) {
                if (me.actMkrData[i].mkrGrp === me.mkrData[index].mkrGrp) {
                    me.actMkrData.splice(i, 1);
                    break;
                }
            }
            me.mkrData.splice(index, 1);
        }
    };
    instance.removeMkrGroup = function (mkrGrp) {
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                this.removeMkrGroupAt(i);
                break;
            }
        }
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                me.actMkrData.splice(i, 1);
                break;
            }
        }
    };
    instance.getMkrGroup = function (mkrGrp) {
        var i = 0,
            j = 0,
            mkrGroup = [];
        
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                    mkrGroup.push(me.mkrData[i].markers[j].mkr);
                }
                break;
            }
        }

        return mkrGroup;
    };
    instance.getMarkerCount = function (mkrGrp) {// 获得游标个数
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                return me.mkrData[i].markers.length;
            }
        }
        return 0;
    };
    instance.getMkrGroupCount = function () {// 获得游标组个数
        return me.mkrData.length;
    };
    instance.getMarkersByName = function (mkrGrp, name) {
        var i = 0,
            j = 0,
            mkrGroup = [];

        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                    if (name === me.mkrData[i].markers[j].mkr.getName()) {
                        mkrGroup.push(me.mkrData[i].markers[j].mkr);
                    }
                }
                break;
            }
        }
        
        return mkrGroup;
    };

    // 游标操作
    instance.setMkrStopPos = function (marker, stopPos) {// 设置游标停靠位置
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    me.mkrData[i].markers[j].stopPos = stopPos;
                    break;
                }
            }
        }
    };
    instance.getMkrStopPos = function (marker) {// 获得游标停靠位置
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    return me.mkrData[i].markers[j].stopPos;
                }
            }
        }
        return undefined;
    };
    instance.setMkrStopPosAt = function (mkrGrp, index, stopPos) {// 通过索引设置游标停靠位置
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    me.mkrData[i].markers[index].stopPos = stopPos;
                    break;
                }
            }
        }
    };
    instance.getMkrStopPosAt = function (mkrGrp, index) {// 通过索引获得游标停靠位置
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    return me.mkrData[i].markers[index].stopPos;
                }
            }
        }
        return undefined;
    };
    instance.setMkrStopAny = function (marker, stopAny) {// 设置游标任意停靠状态
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    me.mkrData[i].markers[j].stopAny = stopAny;
                    break;
                }
            }
        }
    };
    instance.getMkrStopAny = function (marker) {// 获得游标任意停靠状态
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    return me.mkrData[i].markers[j].stopAny;
                }
            }
        }
        return null;
    };
    instance.setMkrStopAnyAt = function (mkrGrp, index, stopAny) {// 通过索引设置游标任意停靠状态
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    me.mkrData[i].markers[index].stopAny = stopAny;
                    break;
                }
            }
        }
    };
    instance.getMkrStopAnyAt = function (mkrGrp, index) {// 通过索引获得游标任意停靠状态
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    return me.mkrData[i].markers[index].stopAny;
                }
            }
        }
        return null;
    };
    instance.setMkrStopGrp = function (marker, stopGrp) {// 设置游标停靠点组
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    me.mkrData[i].markers[j].stopGrp = stopGrp;
                    break;
                }
            }
        }
    };
    instance.getMkrStopGrp = function (marker) {// 获得游标停靠点组
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    return me.mkrData[i].markers[j].stopGrp;
                }
            }
        }
        return null;
    };
    instance.setMkrStopGrpAt = function (mkrGrp, index, stopGrp) {// 通过索引设置游标停靠点组
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    me.mkrData[i].markers[index].stopGrp = stopGrp;
                    break;
                }
            }
        }
    };
    instance.getMkrStopGrpAt = function (mkrGrp, index) {// 通过索引获得游标停靠点组
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    return me.mkrData[i].markers[index].stopGrp;
                }
            }
        }
        return null;
    };
    instance.setMkrViewLabel = function (marker, viewLabel) {// 设置游标标注显示状态
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    me.mkrData[i].markers[j].viewLabel = viewLabel;
                    break;
                }
            }
        }
        marker.setViewLabel(viewLabel);
    };
    instance.getMkrViewLabel = function (marker) {// 获得游标标注显示状态
        var i, j;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    return me.mkrData[i].markers[j].viewLabel;
                }
            }
        }
        return null;
    };
    instance.setMkrViewLabelAt = function (mkrGrp, index, viewLabel) {// 通过索引设置游标标注显示状态
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    me.mkrData[i].markers[index].viewLabel = viewLabel;
                    me.mkrData[i].markers[index].mkr.setViewLabel(viewLabel);
                    break;
                }
            }
        }
    };
    instance.getMkrViewLabelAt = function (mkrGrp, index) {// 通过索引获得游标标注显示状态
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    return me.mkrData[i].markers[index].viewLabel;
                }
            }
        }
        return null;
    };

    // 活动游标
    instance.setActiveMkrByIndex = function (mkrGrp, index, addition) {// 通过索引设置活动游标
        var i, j, k;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    if (addition !== true) {
                        // 还原活动游标颜色
                        for (j = 0; j < me.actMkrData.length; j += 1) {
                            if (me.actMkrData[j].mkrGrp === mkrGrp) {
                                for (k = 0; k < me.actMkrData[j].actMkrs.length; k += 1) {
                                    if (me.actMkrData[j].actMkrs[k].index >= 0 &&
                                        me.actMkrData[j].actMkrs[k].index < me.mkrData[i].markers.length
                                    ) {
                                        me.mkrData[i].markers[me.actMkrData[j].actMkrs[k].index].mkr.setColor(
                                            me.actMkrData[j].actMkrs[k].origClr
                                        );
                                    }
                                }
                                me.actMkrData[j].actMkrs.length = 0;
                                // 设置活动游标
                                me.actMkrData[j].actMkrs.push({
                                    "index": index,
                                    "origClr": me.mkrData[i].markers[index].mkr.getColor()
                                });
                                me.mkrData[i].markers[index].mkr.setColor(me.actMkrData[j].actClr);
                                break;
                            }
                        }
                        if (j === me.actMkrData.length) {
                            me.actMkrData.push({
                                "mkrGrp": mkrGrp,
                                "actClr": me.defaultActClr,
                                "actMkrs": [{
                                    "index": index,
                                    "origClr": me.mkrData[i].markers[index].mkr.getColor()
                                }]
                            });
                            me.mkrData[i].markers[index].mkr.setColor(me.defaultActClr);
                        }
                    } else {
                        for (j = 0; j < me.actMkrData.length; j += 1) {
                            if (me.actMkrData[j].mkrGrp === mkrGrp) {
                                for (k = 0; k < me.actMkrData[j].actMkrs.length; k += 1) {
                                    if (me.actMkrData[j].actMkrs[k].index === index) {
                                        break;
                                    }
                                }
                                if (k === me.actMkrData[j].actMkrs.length) {
                                    me.actMkrData[j].actMkrs.push({
                                        "index": index,
                                        "origClr": me.mkrData[i].markers[index].mkr.getColor()
                                    });
                                    me.mkrData[i].markers[index].mkr.setColor(me.actMkrData[j].actClr);
                                }
                                break;
                            }
                        }
                        if (j === me.actMkrData.length) {
                            me.actMkrData.push({
                                "mkrGrp": mkrGrp,
                                "actClr": me.defaultActClr,
                                "actMkrs": [{
                                    "index": index,
                                    "origClr": me.mkrData[i].markers[index].mkr.getColor()
                                }]
                            });
                            me.mkrData[i].markers[index].mkr.setColor(me.defaultActClr);
                        }
                    }
                }
                break;
            }
        }
    };
    instance.setActiveMkrByPoint = function (mkrGrps, point, span, incHidden, addition) {// 通过点设置活动游标
        // 默认参数设置
        if (span === undefined || span === null) {
            span = 10;
        }
        if (incHidden === undefined || incHidden === null) {
            incHidden = false;
        }
        // 设置点坐标到有效的范围
        var i, j, k, movingRange, mkrUnit, pos, mkrGrp = null, index = -1, minDist = null;
        for (i = 0; i < mkrGrps.length; i += 1) {
            for (j = 0; j < me.mkrData.length; j += 1) {// 找到距离最近的游标
                if (me.mkrData[j].mkrGrp === mkrGrps[i]) {
                    for (k = 0; k < me.mkrData[j].markers.length; k += 1) {
                        mkrUnit = me.mkrData[j].markers[k].mkr;
                        if (incHidden === true || mkrUnit.getVisible()) {
                            movingRange = mkrUnit.getMovingRange();
                            movingRange.inflate(span);
                            if (movingRange.ptInRect(point)) {
                                if (mkrUnit.getObjDir() === gdiObjDir.VER) {// 纵向游标
                                    pos = point.x;
                                } else if (mkrUnit.getObjDir() === gdiObjDir.HOR) {// 横向游标
                                    pos = point.y;
                                }
                                if (minDist === null || minDist > Math.abs(pos - mkrUnit.getPosition())) {
                                    index = k;
                                    mkrGrp = mkrGrps[i];
                                    minDist = Math.abs(pos - mkrUnit.getPosition());
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (index !== -1 && minDist <= span) {// 判断是否超过游标临界区
            this.setActiveMkrByIndex(mkrGrp, index, addition);
            return {
                "mkrGrp": mkrGrp,
                "index": index
            };
        }
        return null;
    };
    instance.getActiveMkrIndexes = function () {// 获得全部活动游标索引
        var mkrIndexes = [], i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                mkrIndexes.push({
                    "mkrGrp": me.actMkrData[i].mkrGrp,
                    "index": me.actMkrData[i].actMkrs[j].index
                });
            }
        }
        return mkrIndexes;
    };
    instance.getActiveMkrIndexesByGroup = function (mkrGrp) {// 获得游标组活动游标索引
        var mkrIndexes = [], i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    mkrIndexes.push(me.actMkrData[i].actMkrs[j].index);
                }
                break;
            }
        }
        return mkrIndexes;
    };
    instance.setInactMkrByIndex = function (mkrGrp, index) {// 通过索引设置非活动游标
        var i, j, marker;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    if (me.actMkrData[i].actMkrs[j].index === index) {
                        marker = this.getMarkerAt(mkrGrp, index);
                        if (marker !== null) {
                            marker.setColor(me.actMkrData[i].actMkrs[j].origClr);
                        }
                        me.actMkrData[i].actMkrs.splice(j, 1);
                        break;
                    }
                }
                break;
            }
        }
    };
    instance.isActiveMkr = function (mkrGrp, index) {// 判断是否是活动游标
        var i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    if (me.actMkrData[i].actMkrs[j].index === index) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // 游标颜色
    instance.setDefaultMkrColor = function (color) {// 设置默认游标颜色
        me.defaultMkrClr.parseColor(color);
    };
    instance.getDefaultMkrColor = function () {// 获得默认游标颜色
        return me.defaultMkrClr.toString();
    };
    instance.setDefaultActiveMkrColor = function (color) {// 设置默认活动游标颜色
        me.defaultActClr.parseColor(color);
    };
    instance.getDefaultActiveMkrColor = function () {// 活动默认活动游标颜色
        return me.defaultActClr.toString();
    };
    instance.setMkrColor = function (mkrGrp, color) {// 设置游标组游标颜色
        var i, j, gdiClr;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                me.mkrData[i].mkrClr.parseColor(color);
                for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                    me.mkrData[i].markers[j].mkr.setColor(color);
                }
                break;
            }
        }
        if (i === me.mkrData.length) {
            gdiClr = new GdiColor(0, 0, 0, 0);
            gdiClr.parseColor(color);
            me.mkrData.push({
                "mkrGrp": mkrGrp,
                "mkrClr": gdiClr,
                "markers": []
            });
        }
    };
    instance.getMkrColor = function (mkrGrp) {// 获得游标组游标颜色
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                return me.mkrData[i].mkrClr.toString();
            }
        }
        return me.defaultMkrClr.toString;
    };
    instance.setActiveMkrColor = function (mkrGrp, color) {// 设置游标组活动游标颜色
        var i, j, marker, gdiClr;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                me.actMkrData[i].actClr.parseColor(color);
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    marker = this.getMarkerAt(mkrGrp, me.actMkrData[i].actMkrs[j].index);
                    if (marker !== null) {
                        marker.setColor(color);
                    }
                }
                break;
            }
        }
        if (i === me.actMkrData.length) {
            gdiClr = new GdiColor(0, 0, 0, 0);
            gdiClr.parseColor(color);
            me.actMkrData.push({
                "mkrGrp": mkrGrp,
                "actClr": gdiClr,
                "actMkrs": []
            });
        }
    };
    instance.getActiveMkrColor = function (mkrGrp) {// 获得游标组活动游标颜色
        var i;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                return me.actMkrData[i].actClr.toString();
            }
        }
        return me.defaultActClr.toString();
    };
    instance.setMkrLabelTextClr = function (marker, figure, labelTextClr) {
        var i, j, k, clrData, clr;

        clr = new GdiColor();
        clr.parseColor(labelTextClr);

        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    if (!me.mkrData[i].markers[j].hasOwnProperty("labelTextClrData")) {
                        me.mkrData[i].markers[j].labelTextClrData = [];
                        me.mkrData[i].markers[j].labelTextClrData[0] = {
                            figure: figure,
                            clr: clr,
                            markBlockClr: clr
                        };
                        return;
                    }

                    clrData = me.mkrData[i].markers[j].labelTextClrData;

                    for (k = 0; k < clrData.length; k += 1) {
                        if (clrData[k].figure === figure) {
                            clrData[k].clr = clr;
                            break;
                        }
                    }
                    if (k === clrData.length) {
                        clrData.push({
                            figure: figure,
                            clr: clr,
                            markBlockClr: clr
                        });
                    }
                    break;
                }
            }
        }
    };
    instance.getMkrLabelTextClr = function (marker, figure) {
        var i, j, k, clrData, clr;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    if (me.mkrData[i].markers[j].hasOwnProperty("labelTextClrData")) {
                        clrData = me.mkrData[i].markers[j].labelTextClrData;
                        for (k = 0; i < clrData.length; k += 1) {
                            if (clrData[k].figure === figure) {
                                return clrData[k].clr.toString();
                            }
                        }
                    }
                    break;
                }
            }
        }
        return figure.getColor().toString();
    };

    instance.setMkrBlockClr = function (marker, figure, blockClr) {
        var i, j, k, clrData, clr;

        clr = new GdiColor();
        clr.parseColor(blockClr);

        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    if (!me.mkrData[i].markers[j].hasOwnProperty("labelTextClrData")) {
                        me.mkrData[i].markers[j].labelTextClrData = [];
                        me.mkrData[i].markers[j].labelTextClrData[0] = {
                            figure: figure,
                            clr: clr,
                            markBlockClr: clr
                        };
                        return;
                    }

                    clrData = me.mkrData[i].markers[j].labelTextClrData;

                    for (k = 0; k < clrData.length; k += 1) {
                        if (clrData[k].figure === figure) {
                            clrData[k].markBlockClr = clr;
                            break;
                        }
                    }
                    if (k === clrData.length) {
                        clrData.push({
                            figure: figure,
                            clr: clr,
                            markBlockClr: clr
                        });
                    }
                    break;
                }
            }
        }
    };
    instance.getMkrBlockClr = function (marker, figure) {
        var i, j, k, clrData;
        for (i = 0; i < me.mkrData.length; i += 1) {
            for (j = 0; j < me.mkrData[i].markers.length; j += 1) {
                if (me.mkrData[i].markers[j].mkr === marker) {
                    if (me.mkrData[i].markers[j].hasOwnProperty("labelTextClrData")) {
                        clrData = me.mkrData[i].markers[j].labelTextClrData;
                        for (k = 0; i < clrData.length; k += 1) {
                            if (clrData[k].figure === figure) {
                                return clrData[k].markBlockClr.toString();
                            }
                        }
                    }
                    break;
                }
            }
        }
        return figure.getColor().toString();
    };

    // 移动游标
    instance.moveMkrTo = function (mkrGrp, index, stopPos) {// 移动游标到指定停靠位置
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    me.mkrData[i].markers[index].stopPos = stopPos;
                }
            }
        }
    };
    instance.moveActiveMkrTo = function (mkrGrp, stopPos) {// 移动活动游标到指定停靠位置
        var i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    this.moveMkrTo(mkrGrp, me.actMkrData[i].actMkrs[j].index, stopPos);
                }
                break;
            }
        }
    };
    instance.moveMkrByOffset = function (mkrGrp, index, offset) {// 通过偏移量移动游标
        var i;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    me.mkrData[i].markers[index].stopPos += offset;
                }
                break;
            }
        }
    };
    instance.moveActiveMkrByOffset = function (mkrGrp, offset) {// 通过偏移量移动活动游标
        var i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    this.moveMkrByOffset(mkrGrp, me.actMkrData[i].actMkrs[j].index, offset);
                }
                break;
            }
        }
    };
    instance.moveMkrByPoint = function (mkrGrp, index, point, ignoreOuter) {// 通过点移动游标
        var i, j, marker, ptPos, stopPos, minDist = null;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    marker = me.mkrData[i].markers[index];
                    if (ignoreOuter && !marker.mkr.getMovingRange().ptInRect(point)) {
                        return;
                    }
                    if (marker.mkr.getObjDir() === gdiObjDir.VER) {// 纵向游标
                        ptPos = point.x;
                    } else if (marker.mkr.getObjDir() === gdiObjDir.HOR) {// 横向游标
                        ptPos = point.y;
                    }
                    if (marker.stopAny !== true) {// 非任意停靠
                        for (j = 0; j < me.getStopCount(marker.stopGrp); j += 1) {// 找到距离最近的停靠点
                            stopPos = me.getStopAt(marker.stopGrp, j).pos;
                            if (minDist === null || minDist > Math.abs(stopPos - ptPos)) {
                                minDist = Math.abs(stopPos - ptPos);
                                marker.stopPos = j;
                            }
                        }
                    } else {// 任意停靠
                        marker.stopPos = ptPos;
                    }
                }
                break;
            }
        }
    };
    instance.moveActiveMkrByPoint = function (mkrGrp, point) {// 通过点移动活动游标
        var i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    this.moveMkrByPoint(mkrGrp, me.actMkrData[i].actMkrs[j].index, point);
                }
                break;
            }
        }
    };
    instance.moveMkrByLabel = function (mkrGrp, index, label, axis) {// 通过坐标轴标注移动游标
        var i, marker, mvRange, point;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    marker = me.mkrData[i].markers[index];
                    mvRange = marker.mkr.getMovingRange();
                    point = new GdiPoint(undefined, undefined);
                    if (axis.getPosition() === "left" ||
                            axis.getPosition() === "right") {
                        point.x = mvRange.left + mvRange.getWidth() / 2;
                        point.y = axis.transform(label, me.limitToBoundary);
                    } else if (axis.getPosition() === "bottom" ||
                            axis.getPosition() === "top") {
                        point.x = axis.transform(label, me.limitToBoundary);
                        point.y = mvRange.top + mvRange.getHeight() / 2;
                    }
                    if (point.x !== undefined && point.y !== undefined) {
                        this.moveMkrByPoint(mkrGrp, index, point);
                    }
                }
                break;
            }
        }
    };
    instance.moveActiveMkrByLabel = function (mkrGrp, label, axis) {// 通过坐标轴标注移动活动游标位置
        var i, j;
        for (i = 0; i < me.actMkrData.length; i += 1) {
            if (me.actMkrData[i].mkrGrp === mkrGrp) {
                for (j = 0; j < me.actMkrData[i].actMkrs.length; j += 1) {
                    this.moveMkrByLabel(mkrGrp, me.actMkrData[i].actMkrs[j].index, label, axis);
                }
                break;
            }
        }
    };

    // 停靠点管理
    this.addStop = function (stopGrp, pos, figure) {// 增加停靠点
        var i, j, k;
        for (i = 0; i < me.stopData.length; i += 1) {
            if (me.stopData[i].stopGrp === stopGrp) {
                for (j = 0; j < me.stopData[i].stops.length; j += 1) {
                    if (me.stopData[i].stops[j].pos >= pos) {
                        if (me.stopData[i].stops[j].pos === pos) {// 同一位置对应多场频谱
                            for (k = 0; k < me.stopData[i].stops[j].figures.length; k += 1) {
                                if (me.stopData[i].stops[j].figures[k] === figure) {
                                    break;
                                }
                            }
                            if (k === me.stopData[i].stops[j].figures.length) {
                                me.stopData[i].stops[j].figures.push(figure);
                            }
                        } else {// 插入新停靠点
                            me.stopData[i].stops.splice(j, 0, {
                                "pos": pos,
                                "figures": [figure]
                            });
                        }
                        break;
                    }
                }
                if (j === me.stopData[i].stops.length) {
                    me.stopData[i].stops.splice(j, 0, {
                        "pos": pos,
                        "figures": [figure]
                    });
                }
                break;
            }
        }
        if (i === me.stopData.length) {
            me.stopData.push({
                "stopGrp": stopGrp,
                "stops": [{
                    "pos": pos,
                    "figures": [figure]
                }]
            });
        }
    };
    this.removeStop = function (stopGrp, pos, figure) {
        var i, j, k;
        for (i = 0; i < me.stopData.length; i += 1) {
            if (me.stopData[i].stopGrp === stopGrp) {
                for (j = 0; j < me.stopData[i].stops.length; j += 1) {
                    if (me.stopData[i].stops[j].pos === pos) {
                        for (k = 0; k < me.stopData[i].stops[j].figures.length; k += 1) {
                            if (me.stopData[i].stops[j].figures[k] === figure) {
                                me.stopData[i].stops[j].figures.splice(k, 1);
                                break;
                            }
                        }
                        if (me.stopData[i].stops[j].figures.length === 0) {
                            me.stopData[i].stops.splice(j, 1);
                        }
                        break;
                    }
                }
                break;
            }
        }
    };
    this.removeStopByFigure = function (figure) {// 删除停靠点
        var i, j, k;
        for (i = 0; i < me.stopData.length; i += 1) {
            for (j = 0; j < me.stopData[i].stops.length; j += 1) {
                for (k = 0; k < me.stopData[i].stops[j].figures.length; k += 1) {
                    if (me.stopData[i].stops[j].figures[k] === figure) {
                        me.stopData[i].stops[j].figures.splice(k, 1);
                        break;
                    }
                }
                if (me.stopData[i].stops[j].figures.length === 0) {
                    me.stopData[i].stops.splice(j, 1);
                    j -= 1;// 删除后修改循环变量
                }
            }
        }
    };
    this.getStopAt = function (stopGrp, index) {// 获得停靠点
        var i;
        for (i = 0; i < this.stopData.length; i += 1) {
            if (this.stopData[i].stopGrp === stopGrp) {
                if (index >= 0 && index < this.stopData[i].stops.length) {
                    return this.stopData[i].stops[index];
                }
            }
        }
        return null;
    };
    this.getStopCount = function (stopGrp) {// 获得停靠点个数
        var i;
        for (i = 0; i < this.stopData.length; i += 1) {
            if (this.stopData[i].stopGrp === stopGrp) {
                return this.stopData[i].stops.length;
            }
        }
        return 0;
    };
    instance.getMkrStopInfo = function (mkrGrp, index) {// 获得游标所在停靠点信息
        var i, marker, stop;
        for (i = 0; i < me.mkrData.length; i += 1) {
            if (me.mkrData[i].mkrGrp === mkrGrp) {
                if (index >= 0 && index < me.mkrData[i].markers.length) {
                    marker = me.mkrData[i].markers[index];
                    if (marker.stopAny !== true) {// 非任意停靠
                        if (marker.stopPos >= 0 &&
                                marker.stopPos < me.getStopCount(marker.stopGrp)) {
                            stop = me.getStopAt(marker.stopGrp, marker.stopPos);
                            return {
                                "index": marker.stopPos,
                                "stopGrp": marker.stopGrp,
                                "pos": stop.pos
                            };
                        }
                    }
                }
                break;
            }
        }
        return null;
    };

    // 停靠点接口函数
    instance.assignIntf = function (figure) {// 分配停靠点接口
        if (figure.isKindOf && figure.isKindOf(GdiFigure)) {
            figure.setStopFns({
                "addStop": me.addStop,
                "removeStop": me.removeStop,
                "removeStopByFigure": me.removeStopByFigure
            });
        }
    };

    return instance;
}

// 图案类
function GdiPattern() {
    "use strict";

    // 类私有成员
    var instance = GdiObject.call(this),        // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiObject()).isKindOf.call(me, type);
    };

    // 类保护成员                           // 名称
    this.drawPattern = function (context) {
        // 子类实现
    };

    // 类公共成员
    // 绘制函数
    instance.draw = function (context) {
        me.drawPattern(context);
    };

    return instance;
}
// 直线图案类
function GdiPatnLine() {
    "use strict";

    // 类私有成员
    var instance = GdiPattern.call(this),       // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiPattern()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.start = new GdiPoint(0, 0);            // 起点坐标
    this.stop = new GdiPoint(0, 0);             // 终点坐标
    this.width = 1;                             // 线条宽度
    this.color =
        new GdiColor(255, 255, 255, 1.0);       // 线条颜色
    this.drawLine = function (context) {
        context.save();
        context.beginPath();
        context.lineWidth = me.width;
        context.strokeStyle = me.color.toString();
        context.moveTo(me.start.x, me.start.y);
        context.lineTo(me.stop.x, me.stop.y);
        context.closePath();
        context.stroke();
        context.restore();
    };

    // 类公共成员
    instance.setStartPt = function (start) {// 设置起点坐标
        if (start.isKindOf && start.isKindOf(GdiPoint)) {
            me.start.x = start.x;
            me.start.y = start.y;
        }
    };
    instance.getStartPt = function () {// 获得起点坐标
        return new GdiPoint(
            me.start.x,
            me.start.y
        );
    };
    instance.setStopPt = function (stop) {// 设置终点坐标
        if (stop.isKindOf && stop.isKindOf(GdiPoint)) {
            me.stop.x = stop.x;
            me.stop.y = stop.y;
        }
    };
    instance.getStopPt = function () {// 获得终点坐标
        return new GdiPoint(
            me.stop.x,
            me.stop.y
        );
    };
    instance.setLineWidth = function (width) {// 设置线条宽度
        me.width = width;
    };
    instance.getLineWidth = function () {// 获得线条宽度
        return me.width;
    };
    instance.setLineColor = function (color) {// 设置线条颜色
        me.color.parseColor(color);
    };
    instance.getLineColor = function () {// 获得线条颜色
        return me.color.toString();
    };

    // 绘制函数
    instance.draw = function (context) {
        me.drawLine(context);
    };

    return instance;
}
// 矩形图案类
function GdiPatnRect() {
    "use strict";

    // 类私有成员
    var instance = GdiPattern.call(this),       // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
            (new GdiPattern()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.rect = new GdiRect(0, 0, 0, 0);        // 矩形区域
    this.lineWidth = 1;                         // 线条宽度
    this.lineColor =
        new GdiColor(255, 255, 255, 1.0);       // 线条颜色
    this.fillColor = new GdiColor(0, 0, 0, 0);  // 填充颜色
    this.drawRect = function (context) {
        context.save();
        var offset = me.lineWidth / 2;
        context.lineWidth = me.lineWidth;
        context.fillStyle = me.fillColor.toString();
        context.strokeStyle = me.lineColor.toString();
        context.fillRect(me.rect.left - offset, me.rect.top - offset,
            me.rect.getWidth() + me.lineWidth, me.rect.getHeight() + me.lineWidth);
        context.strokeRect(me.rect.left - offset, me.rect.top - offset,
            me.rect.getWidth() + me.lineWidth, me.rect.getHeight() + me.lineWidth);
        context.restore();
    };

    // 类公共成员
    instance.setRect = function (rect) {// 设置矩形区域
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            me.rect.setRect(rect);
        }
    };
    instance.getRect = function () {// 获得矩形区域
        return new GdiRect(
            me.rect.left,
            me.rect.top,
            me.rect.right,
            me.rect.bottom
        );
    };
    instance.setLineWidth = function (width) {// 设置线条宽度
        me.lineWidth = width;
    };
    instance.getLineWidth = function () {// 获得线条宽度
        return me.lineWidth;
    };
    instance.setLineColor = function (color) {// 设置线条颜色
        me.lineColor.parseColor(color);
    };
    instance.getLineColor = function () {// 获得线条颜色
        return me.lineColor.toString();
    };
    instance.setFillColor = function (color) {// 设置填充颜色
        me.fillColor.parseColor(color);
    };
    instance.getFillColor = function () {// 获得填充颜色
        return me.fillColor.toString();
    };

    // 绘制函数
    instance.draw = function (context) {
        me.drawRect(context);
    };

    return instance;
}
// 颜色图例图案类
function GdiPatnClrLegend() {
    "use strict";

    // 类私有成员
    var instance = GdiPattern.call(this),       // 图案实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type ||
        (new GdiPattern()).isKindOf.call(me, type);
    };

    // 类保护成员
    this.rect = new GdiRect(0, 0, 0, 0);        // 矩形区域
    this.objDir = gdiObjDir.HOR;                // 绘制方向
    this.colorStops = [];                       // 颜色点[{color,offset}]
    this.labels = [];                           // 标注[GdiText]
    this.drawClrLegend = function (context) {
        context.save();
        var gradient, lineWidth, sPt, ePt, i;
        if (me.objDir === gdiObjDir.HOR) {
            gradient = context.createLinearGradient(
                me.rect.left, me.rect.top, me.rect.right, me.rect.top
            );
            lineWidth = me.rect.getHeight();
            sPt = new GdiPoint(me.rect.left, (me.rect.top + me.rect.bottom) / 2);
            ePt = new GdiPoint(me.rect.right, (me.rect.top + me.rect.bottom) / 2);
        } else if (me.objDir === gdiObjDir.VER) {
            gradient = context.createLinearGradient(
                me.rect.left, me.rect.top, me.rect.left, me.rect.bottom
            );
            lineWidth = me.rect.getWidth();
            sPt = new GdiPoint((me.rect.left + me.rect.right) / 2, me.rect.top);
            ePt = new GdiPoint((me.rect.left + me.rect.right) / 2, me.rect.bottom);
        }
        for (i = 0; i < me.colorStops.length; i += 1) {
            gradient.addColorStop(me.colorStops[i].offset, me.colorStops[i].color.toString());
        }
        context.lineWidth = lineWidth;
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(sPt.x, sPt.y);
        context.lineTo(ePt.x, ePt.y);
        context.closePath();
        context.stroke();
        context.restore();

        // 绘制标注
        for (i = 0; i < me.labels.length; i += 1) {
            me.labels[i].draw(context);
        }
    };

    // 类公共成员
    instance.setRect = function (rect) {// 设置矩形区域
        if (rect.isKindOf && rect.isKindOf(GdiRect)) {
            var i;
            me.rect.setRect(rect);
            for (i = 0; i < me.labels.length; i += 1) {
                me.labels[i].recalcPos(me.rect, me.rect, null);
            }
        }
    };
    instance.getRect = function () {// 获得矩形区域
        return new GdiRect(
            me.rect.left,
            me.rect.top,
            me.rect.right,
            me.rect.bottom
        );
    };
    instance.setObjDir = function (objDir) {// 设置对象绘制方向
        me.objDir = objDir;
    };
    instance.getObjDir = function () {// 获得对象绘制方向
        return me.objDir;
    };
    instance.addColorStop = function (offset, color) {// 添加颜色点
        if (offset >= 0 && offset <= 1) {
            var gdiColor = new GdiColor(0, 0, 0, 0);
            gdiColor.parseColor(color);
            me.colorStops.push({
                "offset": offset,
                "color": gdiColor.toString()
            });
            return me.colorStops.length - 1;
        }
        return -1;
    };
    instance.getColorStopAt = function (index) {// 通过索引位置获得颜色点
        if (index >= 0 && index < me.colorStops.length) {
            return me.colorStops[index];
        }
        return null;
    };
    instance.removeColorStopAt = function (index) {// 删除指定索引位置的颜色点
        if (index >= 0 && index < me.colorStops.length) {
            me.colorStops.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.getColorStopCount = function () {// 获得颜色点对象个数
        return me.colorStops.length;
    };
    instance.addLabel = function (text) {// 添加标注
        if (text.isKindOf && text.isKindOf(GdiText)) {
            var outerRect = this.getRect();
            outerRect.inflate(5);
            me.labels.push(text);
            text.recalcPos(me.rect, outerRect, null);
            return me.labels.length - 1;
        }
        return -1;
    };
    instance.getLabelAt = function (index) {// 通过索引位置获得标注
        if (index >= 0 && index < me.labels.length) {
            return me.labels[index];
        }
        return null;
    };
    instance.removeLabelAt = function (index) {// 删除指定索引位置的标注
        if (index >= 0 && index < me.labels.length) {
            me.labels.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.getLabelCount = function () {// 获得标注对象个数
        return me.labels.length;
    };

    // 绘制函数
    instance.draw = function (context) {
        me.drawClrLegend(context);
    };

    return instance;
}


// JS HTML5 绘图类
function JsGdi2(canvas) {
    "use strict";

    // 类私有成员
    var instance = {},                          // 绘图类实例
        me = this;                              // this指针
    instance.isKindOf = function (type) {// 类标识
        return me instanceof type;
    };

    // 类保护成员
    this.canvas = canvas;                       // canvas对象
    this.frame = null;                          // 绘图框架
    this.mkrMgr = new GdiMarkerManager();       // 游标管理
    this.figures = [];                          // 图形数组
    this.texts = [];                            // 文本数组
    this.patterns = [];                         // 图案数组

    // 类接口函数
    instance.draw = function () {// 绘制函数
        var i, context;
        context = me.canvas.getContext("2d");

        if (me.frame) {
            me.frame.draw(context);
        }
        for (i = 0; i < me.figures.length; i += 1) {
            me.figures[i].draw(context);
        }
        me.mkrMgr.draw(context);
        for (i = 0; i < me.texts.length; i += 1) {
            me.texts[i].draw(context);
        }
        for (i = 0; i < me.patterns.length; i += 1) {
            me.patterns[i].draw(context);
        }
    };
    instance.toDataURL = function (type) {// 返回绘图数据
        return me.canvas.toDataURL(type);
    };

    // 框架函数
    instance.setFrame = function (frame) {
        if (frame.isKindOf && frame.isKindOf(GdiFrame)) {
            var i;
            me.frame = frame;
            me.frame.assignIntf(me.mkrMgr);
            for (i = 0; i < me.figures.length; i += 1) {
                me.frame.assignIntf(me.figures[i]);
            }
            this.recalcTextPos();
        }
    };
    instance.getFrame = function () {
        return me.frame;
    };

    // 游标
    instance.getMarkerManager = function () {
        return me.mkrMgr;
    };

    // 图形函数
    instance.addFigure = function (figure) {
        if (figure.isKindOf && figure.isKindOf(GdiFigure)) {
            if (me.frame) {
                me.frame.assignIntf(figure);
            }
            me.mkrMgr.assignIntf(figure);
            me.figures.push(figure);
            return me.figures.length - 1;
        }
        return -1;
    };
    instance.insertFigureAt = function (index, figure) {// 插入图形到指定索引位置
        if (figure.isKindOf && figure.isKindOf(GdiFigure)) {
            if (me.frame) {
                me.frame.assignIntf(figure);
            }
            me.mkrMgr.assignIntf(figure);
            me.figures.splice(index, 0, figure);
        }
    };
    instance.getFigureAt = function (index) {// 通过索引获得图形
        if (index >= 0 && index < me.figures.length) {
            return me.figures[index];
        }
        return null;
    };
    instance.getFigureByName = function (name) {// 通过名字获得图形
        var i;
        for (i = 0; i < me.figures.length; i += 1) {
            if (me.figures[i].getName() === name) {
                return me.figures[i];
            }
        }
        return null;
    };
    instance.removeFigureAt = function (index) {// 删除指定索引位置的图形
        if (index >= 0 && index < me.figures.length) {
            me.figures[index].resetStops();
            me.figures.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.removeFigure = function (figure) {// 删除图形对象
        var i;
        for (i = 0; i < me.figures.length; i += 1) {
            if (me.figures[i] === figure) {
                me.figures[i].resetStops();
                this.removeFigureAt(i);
                return true;
            }
        }
        return false;
    };
    instance.removeAllFigure = function () {// 删除所有图形
        var i;
        for (i = 0; i < me.figures.length; i += 1) {
            me.figures[i].resetStops();
        }
        me.figures.length = 0;
    };
    instance.getFigureCount = function () {
        return me.figures.length;
    };
    // 文本函数
    instance.addText = function (text) {// 添加文本对象
        if (text.isKindOf && text.isKindOf(GdiText)) {
            if (me.frame) {
                text.recalcPos(me.frame.getInnerRect(), me.frame.getOuterRect(), null);
            }
            me.texts.push(text);
            return me.texts.length - 1;
        }
        return -1;
    };
    instance.getTextAt = function (index) {// 通过索引位置获得文本
        if (index >= 0 && index < me.texts.length) {
            return me.texts[index];
        }
        return null;
    };
    instance.getTextByName = function (name) {// 通过名字获得文本
        var i;
        for (i = 0; i < me.texts.length; i += 1) {
            if (me.texts[i].getName() === name) {
                return me.texts[i];
            }
        }
        return null;
    };
    instance.removeText = function (text){
        var i;
        for (i = 0; i < me.texts.length; i += 1) {
            if (me.texts[i] === text) {
                this.removeTextAt(i);
                return true;
            }
        }
        return false;
    };
    instance.removeTextAt = function (index) {// 删除指定索引位置的文本
        if (index >= 0 && index < me.texts.length) {
            me.texts.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.removeAllText = function () {// 删除所有文本对象
        me.texts.length = 0;
    };
    instance.getTextCount = function () {// 获得文本对象个数
        return me.texts.length;
    };
    instance.recalcTextPos = function () {
        if (me.frame) {
            var i;
            for (i = 0; i < me.texts.length; i += 1) {
                me.texts[i].recalcPos(me.frame.getInnerRect(), me.frame.getOuterRect(), null);
            }
        }
    };
    // 图案函数
    instance.addPattern = function (pattern) {// 增加图案
        if (pattern.isKindOf && pattern.isKindOf(GdiPattern)) {
            me.patterns.push(pattern);
            return me.patterns.length - 1;
        }
        return -1;
    };
    instance.getPatternAt = function (index) {// 通过索引位置获得图案
        if (index >= 0 && index < me.patterns.length) {
            return me.patterns[index];
        }
        return null;
    };
    instance.getPatternByName = function (name) {// 通过名称获得图案
        var i;
        for (i = 0; i < me.patterns.length; i += 1) {
            if (me.patterns[i].getName() === name) {
                return me.patterns[i];
            }
        }
        return null;
    };
    instance.removePattern = function(pattern){//删除图案对象
        var i;
        for (i = 0; i < me.patterns.length; i += 1) {
            if (me.patterns[i] === pattern) {
                this.removePatternAt(i);
                return true;
            }
        }
        return false;
    };
    instance.removePatternAt = function (index) {// 删除指定索引位置的图案
        if (index >= 0 && index < me.patterns.length) {
            me.patterns.splice(index, 1);
            return true;
        }
        return false;
    };
    instance.removeAllPattern = function () {// 删除所有图案
        me.patterns.length = 0;
    };
    instance.getPatternCount = function () {// 获得图案个数
        return me.patterns.length;
    };

    return instance;
}


//////////////////////////////////////////////////
//频谱类
function Spectrum(canvasid, type){
    var instance = {}, me = this;
    instance.canvasid = canvasid;
    var pillarFreqFig = new GdiFigPillar();//柱状图
    me.canvas = $('#' + canvasid)[0],
    me.jsGdi = new JsGdi2(me.canvas),
    me.unit = 'dbm',
    me.clickPeakNum = 0,
    me.changeReverseColor = false;//默认不改变颜色
    //me.bFirstDrawMark = true;//设置变量表明是第一次绘制游标
    me.left =0; me.top =0; me.right =10; me.bottom =50; //边距
    me.showXaxis = true; //X轴坐标
    me.showYaxis = true; //Y轴坐标
    me.gridRows = 10;   //行数
    me.gridCols = 10;   //列数
    me.waveColor = ['#CCCC00', '#FF0000', '#00EEFF', '#00FFFF'];  //曲线颜色
    me.limitColor = ['#FF7E1F','#FB9AFF','#FF9C00','#FF9C00','#FF9C00','#FF9C00'];  //合格线颜色
    me.limitSelColor = '#FFFF00';
    me.scanLableTop = true; //scan的标注是top的还是bottom的
    me.sweepHold = false;
    me.sweepHoldData = [];//存储点击扫描下的保持按钮时的频谱数据
    me.traceHoldData = [];
    me.bSetPeak = false, me.bSetNextPeak = false;
    me.callbackFn = null;
    me.bSetMrkToCenter = false, me.bSetRef = false;
    me.resetTrace = false; //重置扫迹过程中的最大最小平均值
    me.maxData = []; me.minData = []; me.avgData = []; me.times = [0, 0, 0, 0];//最大/最小/平均;求平均得需要频谱总的场数，times为场数
    for(var n = 0; n < 4; n++){
        me.maxData[n] = [];
        me.minData[n] = [];
        me.avgData[n] = [];
    }
    me.trace = 0;//默认是扫迹1
    me.mkrManager = me.jsGdi.getMarkerManager();
    me.mkrName = ['','','','','','']; //游标名
    me.mkrEnable = [false,false,false,false,false,false]; //游标使能
    me.mkrPos = [undefined,undefined,undefined,undefined,undefined,undefined]; //游标位置
    //将选中按钮将执行的动作描述写入到数组中
    me.addGraphs = [
        {'sample': true, 'traceHold': false, 'blank': false,'maxHold': false, 'minHold': false, 'avgHold': false},
        {'sample': false, 'traceHold': false, 'blank': false,'maxHold': false, 'minHold': false, 'avgHold': false},
        {'sample': false, 'traceHold': false, 'blank': false,'maxHold': false, 'minHold': false, 'avgHold': false},
        {'sample': false, 'traceHold': false, 'blank': false,'maxHold': false, 'minHold': false, 'avgHold': false}];
    //合格线
    me.limits = [];
    var limit1 = new GdiFigPolyline(),limit2 = new GdiFigPolyline(),limit3 = new GdiFigPolyline(),
        limit4 = new GdiFigPolyline(),limit5 = new GdiFigPolyline(),limit6 = new GdiFigPolyline();
    me.limitshandler = [limit1,limit2,limit3,limit4,limit5,limit6];

    var line0 = new GdiFigPolyline(),
        line1 = new GdiFigPolyline(),
        line2 = new GdiFigPolyline(),
        line3 = new GdiFigPolyline();
    //将所有的折线对象组成数组
    me.lines = [line0, line1, line2, line3];
    if(type === 2){
        var ployLine = new GdiFigPolyline();
        var figure0 = new GdiFigBlock();//用于余辉的绘图句柄
        me.currenthandler = figure0;
    }else{
        me.currenthandler = line0;//当前操作的对象
    }
    var pillar0 = new GdiFigPillar(),
        pillar1 = new GdiFigPillar(),
        pillar2 = new GdiFigPillar(),
        pillar3 = new GdiFigPillar();
    me.pillars = [pillar0, pillar1, pillar2, pillar3];
    me.pillarRatio = 0.002;
    me.drawSpecShape = 'line';//频谱默认以曲线的形状显示
    me.removeFig = false;//切换curve和solid时需要将之前的图形删除，默认为不删除--点击curve时删除solid的图像，点击solid时删除curve的图像
    me.space = 'full';//默认占满屏幕--如果职为part表示占一部分屏幕
    me.grid = new GdiFrmGrid();
    me.counts = [0, 0, 0, 0];
    me.gridAmplAs = [0, 0, 0, 0];
    me.gridAmplBs = [0, 0, 0, 0];
    //hsx
    instance.getPillarsHanlder = function(){
        return me.pillars;
    };
    instance.setPillarRation = function(value){
        me.pillarRatio = value;
    }
    //hsx
    //获取当前图形的句柄
    instance.getFigHanlder = function(){
        return me.currenthandler;
    };
    //重置
    instance.resetTrace = function(){
        me.resetTrace = true;
    };
    //获取canvas
    instance.getCanvas = function(){
        return me.canvas;
    };
    //获取jsGdi
    instance.getJsGdi = function(){
        return me.jsGdi;
    };
    //获取框架
    instance.getFrame = function(){
        return me.grid;
    };
    //重绘
    instance.redraw = function(){
        var specGraph = $("#" + canvasid);
        me.canvas.width = specGraph.width();
        me.canvas.height = specGraph.height();
        me.grid.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
        me.jsGdi.draw();
    };
    //重绘扫描图
    instance.redrawScan = function(){
        var specGraph = $("#" + canvasid);
        me.canvas.width = specGraph.width();
        me.canvas.height = specGraph.height();
        me.grid.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
        if(canvasid == 'scanCanvas2'){
            instance.drawScanLabelX();
        }
        me.jsGdi.draw();
    };
    //获取mkrManager
    instance.getMkrManager = function(){
        return me.mkrManager;
    };
    //设置边距
    instance.setMargin = function(left,top,right,bottom){
        me.left = left; me.top = top; me.right = right; me.bottom = bottom;
    };
    //设置是否显示X Y标注
    instance.setEnableXYaxis = function(enableX,enableY){
        me.showXaxis = enableX; me.showYaxis = enableY;
    };
    //设置表格行列
    instance.setGridRowsCols = function(rows, columns){
        me.gridRows = rows;
        me.gridCols = columns;
    };
    //设置曲线颜色
    instance.setWaveColor = function(index, color){
        me.waveColor[index] = color;
    };
    //设置scan的标注是top的还是bottom的 scanLableTop
    instance.setScanLableTop = function(enable){
      me.scanLableTop = enable;
    };
    //获取频谱图形是否显示
    instance.isShow = function(){
        if(me.canvas.style.display === 'block'){
            return true;
        }else{
            return false;
        }
    };
    //设置频谱图像的显示或者隐藏
    instance.setShow = function(value, space){
        if(value){
            $('#' + canvasid).css('display', 'block');
            me.space = space;
            if(space === 'full'){
                $('#' + canvasid).css({'height': '474px'});
                me.canvas.height = $('#' + canvasid).height();
                me.grid.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
                me.jsGdi.draw();
            }else{
                $('#' + canvasid).css({'height': '248px'});
                me.canvas.height = $('#' + canvasid).height();
                me.grid.setBorderRect(new GdiRect(87, 20, me.canvas.width - 10, me.canvas.height - 20));
                me.jsGdi.draw();
            }
        }else{
            me.space = 'none';
            $('#' + canvasid).css('display', 'none');
        }
    };
    //设置x，y轴坐标
    instance.setXYAxis = function(startx, stopx, starty, stopy){
        me.startx = startx;
        me.stopx = stopx;
        me.starty = starty;
        me.stopy = stopy;
        me.axisX = me.grid.getAxis('bottom');
        me.axisX.setSpan(startx, stopx);
        me.axisX.setUnit(xUnit);
        me.axisX.setLineVisible(true);
        me.axisX.setLabelVisible(false);
        me.axisX.setSplit(1);
        me.axisX.setLabelPrecision(3);
        me.axisX.setLabelFont("10px 微软雅黑");
        me.axisX.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showXaxis){
            me.axisX.genLabels();
        }

        me.axisY = me.grid.getAxis('left');
        me.axisY.setUnit(' ');
        me.axisY.setSpan(starty, stopy);
        me.axisY.setLineVisible(false);
        me.axisY.setSplit(me.gridRows);
        me.axisY.setLabelPrecision(1);
        me.axisY.setLabelFont('10px');
        me.axisY.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showYaxis){
            me.axisY.genLabels();
            var len = me.axisY.getLabelCount();
            me.axisY.removeLabelAt(len-1);
            me.axisY.addLabel(me.unit+' ');
        }
    };
    //设置丢包率x，y轴坐标
    instance.setLostXYAxis = function(startx, stopx, starty, stopy){
      me.axisLostX = me.grid.getAxis('bottom');
      me.axisLostX.setSpan(startx, stopx);
      me.axisLostX.setUnit('');
      me.axisLostX.setLineVisible(true);
      me.axisLostX.setSplit(me.splitX);
      me.axisLostX.removeAllLabel();

      me.axisLostY = me.grid.getAxis('right');
      me.axisLostY.setUnit(' ');
      me.axisLostY.setSpan(starty, stopy);
      me.axisLostY.setLineVisible(false);
      me.axisLostY.setSplit(me.splitY);
      me.axisLostY.setLabelPrecision(0);
      me.axisLostY.setLabelFont('12px');
      me.axisLostY.setLabelColor(colorSet.AXIS_LABEL_COLOR);
      me.axisLostY.removeAllLabel();
      me.axisLostY.genLabels();
      var len = me.axisLostY.getLabelCount();
      me.axisLostY.removeLabelAt(len-1);
      me.axisLostY.addLabel('%');

    };
    //hsx
    //设置x，y轴坐标,其中x,y的坐标都是人为可以自己去设置的
    instance.setXYAutoAxis = function(startx, stopx, starty, stopy, xunit , yunit){
        //me.startx = startx;
        //me.stopx = stopx;
        //me.starty = starty;
        //me.stopy = stopy;
        me.axisX = me.grid.getAxis('bottom');
        me.axisX.setSpan(startx, stopx);
        //me.axisX.setUnit(xUnit);
        me.axisX.setUnit(xunit);
        me.axisX.setLineVisible(false);
        //me.axisX.setSplit(1);
        //me.axisX.setLabelPrecision(3);
        me.axisX.setLabelFont("12px 微软雅黑");
        me.axisX.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showXaxis){
            //me.axisX.addLabel(startx);
            //me.axisX.addLabel(stopx);
            me.axisX.genLabels();
            var len = me.axisX.getLabelCount();
            me.axisX.removeLabelAt(len-1);
            me.axisX.removeLabelAt(len-2);
            me.axisX.addLabel(startx);
            me.axisX.addLabel(stopx);
        }

        me.axisY = me.grid.getAxis('left');
        me.axisY.setUnit(' ');
        me.axisY.setSpan(starty, stopy);
        me.axisY.setLineVisible(false);
        me.axisY.setSplit(me.gridRows);
        me.axisY.setLabelPrecision(1);
        me.axisY.setLabelFont('12px');
        me.axisY.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showYaxis){
            me.axisY.genLabels();
            var len = me.axisY.getLabelCount();
            me.axisY.removeLabelAt(len-1);
            //me.axisY.addLabel(me.unit+' ');
            me.axisY.addLabel(yunit+' ');
        }
    };
    /*instance.setXYAuto2Axis = function(startx, stopx, starty, stopy, xunit , yunit){
        me.axisX = me.grid.getAxis('bottom');
        me.axisX.setSpan(startx, stopx);
        //me.axisX.setUnit(xUnit);
        me.axisX.setUnit(xunit);
        me.axisX.setLineVisible(false);
        //me.axisX.setSplit(1);
        //me.axisX.setLabelPrecision(3);
        me.axisX.setLabelFont("14px 微软雅黑");
        me.axisX.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showXaxis){
            me.axisX.addLabel(startx);
            me.axisX.addLabel(stopx);
        }

        me.axisY = me.grid.getAxis('left');
        me.axisY.setUnit(' ');
        me.axisY.setSpan(starty, stopy);
        me.axisY.setLineVisible(false);
        me.axisY.setSplit(me.gridRows);
        me.axisY.setLabelPrecision(1);
        me.axisY.setLabelFont('14px');
        me.axisY.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showYaxis){
            me.axisY.genLabels();
            var len = me.axisY.getLabelCount();
            me.axisY.removeLabelAt(len-1);
            me.axisY.addLabel(yunit+' ');
        }
    };*/
    //hsx
    //设置x，y轴坐标 Scan
    instance.setXYAxisScan = function(startx, stopx, starty, stopy){
        me.startx = startx;
        me.stopx = stopx;
        me.starty = starty;
        me.stopy = stopy;
        me.axisX = me.grid.getAxis('bottom');
        me.axisX.setLabelPosition(-5);
        me.axisX.setSpan(startx, stopx);
        me.axisX.setUnit(xUnit);
        me.axisX.setLineVisible(false);
        me.axisX.setSplit(1);
        me.axisX.setLabelPrecision(0);
        me.axisX.setLabelFont("10px 微软雅黑");
        me.axisX.setLabelColor(colorSet.AXIS_LABEL_COLOR);
        if(me.showXaxis){
            me.axisX.genLabels();
        }

        me.axisY = me.grid.getAxis('left');
        me.axisY.setUnit(me.unit);
        me.axisY.setSpan(starty, stopy);
        me.axisY.setLineVisible(false);
        me.axisX.setLabelPrecision(1);
        me.axisY.setLabelFont("10px 微软雅黑");
        if(me.showYaxis){
            if(me.scanLableTop){
                me.axisY.setLabelColor('#00ff00');
                me.axisY.addLabel('');
                me.axisY.addLabel('电 台 ');
                me.axisY.addLabel('合 法 ');
                me.axisY.addLabel('');
            }
            else{
                me.axisY.setLabelColor('#ff0000');
                me.axisY.addLabel('');
                me.axisY.addLabel('疑 似 ');
                me.axisY.addLabel('非 法 ');
                me.axisY.addLabel('');
            }

        }
    };
    //画扫描图的坐标值
    instance.drawScanLabelX = function(){
        me.jsGdi.removeAllText();
        var freqStart = new GdiText(me.startx+'MHz', gdiTextPos.INNER_LEFTTOP);
        me.jsGdi.addText(freqStart);
        var freqStop = new GdiText(me.stopx+'MHz', gdiTextPos.INNER_RIGHTTOP);
        me.jsGdi.addText(freqStop);
    };
    //绘制网格线:参数分别表示x，y轴的起始终止坐标
    instance.drawXYAxis = function(){
        {//若为正向/反向频谱
            me.grid.setGridNum(me.gridRows, me.gridCols);
            me.grid.setFrameColor(colorSet.FRAME_GRID);//设置网格线的颜色
            me.grid.setBkgndColor(new GdiColor(245,245,245,0.9));//设置背景图
            var specGraph = $("#" + canvasid);
            me.canvas.width = specGraph.width();
            me.canvas.height = specGraph.height();
            me.grid.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
            me.jsGdi.setFrame(me.grid);
            me.jsGdi.removeFigure(me.currenthandler);
            me.jsGdi.addFigure(me.currenthandler);
            me.currenthandler.setYAxis(me.axisY);
        }
    };
    //设置游标名
    instance.setMkrName = function(index, name){
        me.mkrName[index] = name;
    };
    //设置游标使能
    instance.setMkrEnable = function(enAarr){
        for(var i=0; i<me.mkrEnable.length; i++){
            enAarr[i] && (me.mkrEnable[i] = enAarr[i]);
        }
    };
    //获取游标使能
    instance.getMkrEnable = function(){
        return me.mkrEnable;
    };
    //绘制游标
    instance.drawMarks = function(){
        if(me.mkrPos[0] === undefined){
            me.mkrPos[0] = 180;
        }
        if(me.mkrPos[1] === undefined){
            me.mkrPos[1] = 280;
        }
        if(me.mkrPos[2] === undefined){
            me.mkrPos[2] = 70;
        }
        if(me.mkrPos[3] === undefined){
            me.mkrPos[3] = 70;
        }
        //游标一 蓝
        if(me.mkrEnable[0]){
            me.mkrManager.addMarker(MARK1, new GdiMkrLine());
            me.mkrManager.getMarkerAt(MARK1, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
            me.mkrManager.getMarkerAt(MARK1, 0).setVisible(true);
            me.mkrManager.setMkrViewLabelAt(MARK1, 0, true);
            me.mkrManager.moveMkrTo(MARK1, 0, me.mkrPos[0]);//游标的初始位置
            me.mkrManager.setMkrColor(MARK1, colorSet.MARK1);
            me.mkrManager.setActiveMkrColor(MARK1, colorSet.ACTIVE_MARK);
            me.mkrManager.getMarkerAt(MARK1, 0).setName(me.mkrName[0]);
        }
        //游标二 绿
        if(me.mkrEnable[1]){
            me.mkrManager.addMarker(MARK2, new GdiMkrLine());
            me.mkrManager.getMarkerAt(MARK2, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
            me.mkrManager.getMarkerAt(MARK2, 0).setVisible(true);
            me.mkrManager.setMkrViewLabelAt(MARK2, 0, true);
            me.mkrManager.moveMkrTo(MARK2, 0, me.mkrPos[1]);//游标的初始位置
            me.mkrManager.setMkrColor(MARK2, colorSet.MARK2);
            me.mkrManager.setActiveMkrColor(MARK2, colorSet.ACTIVE_MARK);
            me.mkrManager.getMarkerAt(MARK2, 0).setName(me.mkrName[1]);
        }
        //游标三 紫
        if(me.mkrEnable[2]){
            me.mkrManager.addMarker(MARK3, new GdiMkrLine());
            me.mkrManager.getMarkerAt(MARK3, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
            me.mkrManager.getMarkerAt(MARK3, 0).setVisible(true);
            me.mkrManager.setMkrViewLabelAt(MARK3, 0, false);
            me.mkrManager.moveMkrTo(MARK3, 0,  me.mkrPos[2]);//游标的初始位置
            me.mkrManager.setMkrColor(MARK3, colorSet.MARK3);
            me.mkrManager.setActiveMkrColor(MARK3, colorSet.MARK3);
            me.mkrManager.getMarkerAt(MARK3, 0).setWidth(8);
            me.mkrManager.getMarkerAt(MARK3, 0).setAlpha(0.5);
        }
        //游标四 黄
        if(me.mkrEnable[3]){
            me.mkrManager.addMarker(MARK4, new GdiMkrLine());
            me.mkrManager.getMarkerAt(MARK4, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
            me.mkrManager.getMarkerAt(MARK4, 0).setVisible(true);
            me.mkrManager.setMkrViewLabelAt(MARK4, 0, false);
            me.mkrManager.moveMkrTo(MARK4, 0,  me.mkrPos[3]);//游标的初始位置
            me.mkrManager.setMkrColor(MARK4, colorSet.MARK4);
            me.mkrManager.setActiveMkrColor(MARK4, colorSet.MARK4);
            me.mkrManager.getMarkerAt(MARK4, 0).setName(me.mkrName[3]);
        }

    };

    //获取游标的备注信息
    function getShowMkrValue(pos, selectIndex){
        var value, unit, showValue = [], horValue;
        for(var i = 0; i < 4; i++){
            instance.setMrkInActivate(i);
        }
        switch(selectIndex){
            case 0://垂直游标
                value = parseFloat(getPerX(pos) + me.startx).toFixed(3);
                unit = UNIT;
                instance.setMrkActivate(2);
                showValue.push({'ver': value + unit});
                break;
            case 1://垂直游标
                value = parseFloat(getPerX(pos) + me.startx).toFixed(3);
                unit = UNIT;
                instance.setMrkActivate(3);
                showValue.push({'ver': value + unit});
                break;
            case 2://水平游标
                value = parseFloat(me.stopy - getPerY(pos)).toFixed(1) ;
                unit = me.unit;
                instance.setMrkActivate(0);
                showValue.push({'ver': value + unit});
                break;
            case 3://水平游标
                value = parseFloat(me.stopy - getPerY(pos)).toFixed(1) ;
                unit = me.unit;
                instance.setMrkActivate(1);
                showValue.push({'ver': value + unit});
                break;
            default:
                break;

        }
        return showValue;
    }

    //计算峰值，并将游标移动到峰值处
    instance.setPeak = function(){
        me.bSetPeak = true;
    };
    //计算下一个峰值
    instance.setNextPeak = function(){
        ++me.clickPeakNum;
        me.bSetNextPeak = true;
    };
    //设置当前的单位
    instance.setUnit = function(unit){
        me.unit = unit;
    };
    //获取当前单位
    instance.getUnit = function(){
        return me.unit;
    };
    //设置游标到中心位置
    instance.setMrkToCenter = function(){
        me.bSetMrkToCenter = true;
    };
    //设置当前颜色的相反颜色
    instance.setReverseColor = function(value){
        me.changeReverseColor = value;
    };

    //绘制频谱波形
    instance.drawSpecFig = function(data){
        var endSpecData = data;
        for(i=0; i<6; i++){
            me.mkrPos[i] = me.mkrManager.getMkrStopPosAt(i, 0);
        }

        if(me.sweepHold){
            data = me.sweepHoldData;
        }
        else{
            me.sweepHoldData = data;
        }

        if(me.drawSpecShape === 'line'){
            me.graphs = me.addGraphs;
            me.spechandler = me.lines;
        }else if(me.drawSpecShape === 'solid'){
            me.graphs = me.addGraphs;
            me.spechandler = me.pillars;
        }else if(me.drawSpecShape === 'crv'){
            me.graphs = [{'sample': true, 'traceHold': false, 'blank': false,'maxHold': false, 'minHold': false, 'avgHold': false}];
            me.spechandler = [me.lines[0]];
            for(var z = 0; z < 4; z++){
                instance.showMkrInfo(z, '--', '--', '--', '--');
            }
            crvHandler.drawCrv(data);
            crvHandler.sweepHold(me.sweepHold);//设置光谱图的hold
        }else if(me.drawSpecShape === 'line_crv'){
            me.graphs = [{'sample': true, 'traceHold': false, 'blank': false,'maxHold': false, 'minHold': false, 'avgHold': false}];
            me.spechandler = [me.lines[0]];
            crvHandler.drawCrv(data);
            crvHandler.sweepHold(me.sweepHold);//设置光谱图的hold
        }
        var bMax = false, bSample = false, bAvg = false, bMin = false;
        var maxdata, avgdata, mindata;
        var maxk, samplek, avgk, mink;
        var maxHandler, sampleHandler, avgHandler, minHandler;
        //最大/最小保持
        for(var k = 0; k < me.graphs.length; k++){
            if(me.graphs[k]['traceHold']){
                me.drawFigs(me.traceHoldData[k], me.spechandler[k], k, type);
            }else{
                me.traceHoldData[k] = data;
            }
            if(me.graphs[k]['blank']){
                me.jsGdi.removeFigure(me.spechandler[k]);
                me.jsGdi.draw();
                //在表格中显示游标的所有值，包括幅度和频率值
                //instance.showMkrInfo(k, '--', '--', '--', '--');
            }
            if(me.resetTrace){
                me.maxData[k] = [];
                me.minData[k] = [];
                me.avgData[k] = [];
                me.times[k] = 0;
                me.resetTrace = false;
            }
            if(me.graphs[k]['maxHold']){
                bMax = true;
                me.maxData[k] = me.getMaxData(me.maxData[k], data);
                maxdata = me.maxData[k];
                maxk = k;
                maxHandler = me.spechandler[k];
            }
            if(me.graphs[k]['sample']){
                bSample = true;
                samplek = k;
                sampleHandler = me.spechandler[k];
            }
            if(me.graphs[k]['avgHold']){
                bAvg = true;
                avgk = k;
                avgHandler = me.spechandler[k];

                //计算频谱各点的平均值，传统方法：(1+2+3)/3 = 2,
                //通过console.log得出1秒钟获取19场数据，1分钟(60s)得到60*19=1140场数据，1小时得到1140*60=68400场,4个小时得到4*68400=273600场
                //超出273600场数据后将不再计算平均值
                if(me.times[k] <= 273600){
                    me.avgData[k] = me.getAvgData(me.avgData[k], data, me.times[k]);
                    ++me.times[k];
                }else{
                }
                avgdata = me.avgData[k];
            }
            if(me.graphs[k]['minHold']){
                bMin = true;
                me.minData[k] = me.getMinData(me.minData[k], data);
                mindata = me.minData[k];
                mink = k;
                minHandler = me.spechandler[k];
            }
            if(bMax){
                bMax = false;
                me.drawFigs(maxdata, maxHandler, maxk, 'max');
            }
            if(bSample){
                bSample = false;
                me.drawFigs(data, sampleHandler, samplek, 'sample');
            }
            if(bAvg){
                bAvg = false;
                me.drawFigs(avgdata, avgHandler, avgk, 'avg');
            }
            if(bMin){
                bMin = false;
                me.drawFigs(mindata, minHandler, mink, 'min');
            }
        }
        //合格线
        for(var m=0; m<me.limits.length; m++){
            if(me.limits[m].enable){
                if(me.limits[m].sel){
                    me.drawFigs(me.limits[m].data, me.limitshandler[m], m, 'limitSel');
                }
                else{
                    me.drawFigs(me.limits[m].data, me.limitshandler[m], m, 'limit');
                }
            }
            else{
                me.jsGdi.removeFigure(me.limitshandler[m]);
            }
        }

        if(me.bSetPeak){
            var peaks = computePeak(10, data);
            setMarkMoveByStop(peaks[0], me.jsGdi, 'specCanvas');
            me.bSetPeak = false;
            return;
        }
        if(me.bSetNextPeak){
            peaks = computePeak(10, data);
            if (me.clickPeakNum >= peaks.length) {
                me.clickPeakNum = 0;
            }
            setMarkMoveByStop(peaks[me.clickPeakNum], me.jsGdi, 'specCanvas');//根据频谱峰值点移动游标
            me.bSetNextPeak = false;
            return;
        }
        if(me.bSetRef){
            var max = getMaxInArr(data);//获取该场数据的最大值
            me.bSetRef = false;
            if(me.callbackFn){
                me.callbackFn(max);
            }
            return;
        }
        if(me.bSetMrkToCenter){
            me.bSetMrkToCenter = false;
            if(data.length%2 === 0){
                var endPoint = data[data.length - 1];
                data.push(endPoint);//因为传回来是500个点，计算中心位置需要奇数数据，为此将频谱数据最后的点补到频谱数据中
            }
            var index = Math.floor(data.length/2);
            var mkr = me.jsGdi.getMarkerManager();
            mkr.moveActiveMkrTo(MARK1, index);//将游标移动到中心点索引的位置
            me.jsGdi.draw();
            return;
        }
        for(var i=0; i<6; i++){
            if(undefined !== me.mkrPos[i]){
                me.mkrManager.moveMkrTo(i, 0, me.mkrPos[i]);
            }
        }
    };
    //设置扫迹
    instance.setTraceType = function(value){
        me.trace = value;
    };
    //清空绘制的频谱图像
    instance.clearFig = function(trace){
        me.setAddGraphs(trace, 'blank');
    };
    //采样绘图
    instance.sample = function(trace){
        me.setAddGraphs(trace, 'sample');
    };
    //点击扫描下的保存(Hold)按钮
    instance.traceHold = function(trace){
        me.setAddGraphs(trace, 'traceHold');
    };
    instance.sweepHold = function(value){
        me.sweepHold = value;
    };
    //点击最大保持按钮
    instance.maxHold = function(trace){
        me.setAddGraphs(trace, 'maxHold');
    };
    //点击最小保持按钮
    instance.minHold = function(trace){
        me.setAddGraphs(trace, 'minHold');
    };
    //点击平均值
    instance.avgHold = function(trace){
        me.setAddGraphs(trace, 'avgHold');
    };
    //获取数组中最大的值
    instance.setRef = function(callbackfn){
        if(callbackfn){
            me.callbackFn = callbackfn;
        }
        me.bSetRef = true;
    };
    //设置频谱显示的形状（display功能下的curve/solid）
    instance.setSpecShape = function(value){
        me.drawSpecShape = value;
        me.removeFig = true;
    };
    instance.setCount = function(){
        me.counts = [0, 0, 0, 0];
        me.gridAmplAs = [0, 0, 0, 0];
        me.gridAmplBs = [0, 0, 0, 0];
    };
    //设置合格线
    instance.setLimits = function(limits){
        me.limits = limits;
    };
    //获取保持曲线的值
    instance.getHoldLineData = function(type,trace){
        var dataArr = [];
        if(type == 'max'){
            for(var i=0; i<me.maxData[trace].length; i++){
                dataArr[i] = me.maxData[trace][i];
            }
        }
        else if(type == 'min'){
            for(i=0; i<me.minData[trace].length; i++){
                dataArr[i] = me.minData[trace][i];
            }
        }
        return dataArr;
    };
    //*****功能函数*****
    //在表格中显示游标的所有值,k--第几条扫迹；data--频谱数据，mkra--游标a的值，mkrb--游标b的值
    instance.showMkrInfo = function(index, freqa, ampla, freqb, amplb){
        var difffreq, diffampl;
        if(ampla == '--' || amplb == '--'){
            difffreq = '--';
            diffampl = '--';
        }else{
            var amplUnitLen = unitArr[unitInitIndex].length;
            var freqUnitLen = UNIT.length;
            var fa = freqa.substr(0, freqa.length - freqUnitLen);
            var fb = freqb.substr(0, freqb.length - freqUnitLen);
            var aa = ampla.substr(0, ampla.length - amplUnitLen);
            var ab = amplb.substr(0, amplb.length - amplUnitLen);
            diffampl = (aa - ab).toFixed(1) +  ' ' + unitArr[unitInitIndex];
            difffreq = (fa - fb).toFixed(1) + ' ' + UNIT;
        }

        mkrInfo.getBodyTable().setCellHTML(0, index+1 , '<div>'+uiText['amp']+':&nbsp;'+ampla+
            '&nbsp;'+uiText['FREQ']+':&nbsp;'+freqa+'</div>');
        mkrInfo.getBodyTable().setCellHTML(1, index+1, '<div>'+uiText['amp']+':&nbsp;'+amplb+
            '&nbsp;'+uiText['FREQ']+':&nbsp;'+freqb+'</div>');
        mkrInfo.getBodyTable().setCellHTML(2, index+1 , '<div>'+uiText['difamp']+':&nbsp;'+diffampl+
            '&nbsp;'+uiText['diffreq']+':&nbsp;'+difffreq+'</div>');
    };
    this.drawFigs = function(data, figure, k, type){
        if(me.removeFig){
            me.jsGdi.removeAllFigure();
            me.removeFig = false;
        }
        {//上行/下行频谱
            me.currenthandler = figure;
            figure.setXAxis(me.axisX);
            figure.setYAxis(me.axisY);
            var color;
            if(type == 'limit'){
                color = me.limitColor[k];
            }
            else if(type == 'limitSel'){
                color = me.limitSelColor;
            }
            else{
                color = me.waveColor[k];
            }

            me.jsGdi.removeFigure(figure);
            me.jsGdi.addFigure(figure);
            figure.clearData();
            for(var i = 0; i < data.length; i++){
                var datumLevlY = new GdiDatumOneDim();
                datumLevlY.value = changeToUnit(parseFloat(data[i]), me.unit);
                figure.addDatum(datumLevlY);
            }
            if(me.drawSpecShape === 'solid'){
                //figure.setWidthRatio(0.002);
                figure.setWidthRatio(me.pillarRatio);
            }
            if(type != 'min' && type != 'max' && type != 'limit'){
                figure.genStop();//设置游标的停靠点
            }
            figure.setColor(color);
        }

        if(me.bFirstDrawMark){
            instance.drawMarks(); //添加游标
            me.bFirstDrawMark = false;
        }

        me.jsGdi.draw();
    };
    //设置me.addGraphs的值
    this.setAddGraphs = function(trace, key){
        me.addGraphs[trace]['sample'] = false;
        me.addGraphs[trace]['blank'] = false;
        me.addGraphs[trace]['traceHold'] = false;
        me.addGraphs[trace]['maxHold'] = false;
        me.addGraphs[trace]['minHold'] = false;
        me.addGraphs[trace]['avgHold'] = false;
        me.addGraphs[trace][key] = true;
        me.counts[trace] = 0;
        me.gridAmplAs[trace] = 0;
        me.gridAmplBs[trace] = 0;
        switch(key){
            case 'maxHold':
                me.maxData[trace] = [];
                break;
            case 'minHold':
                me.minData[trace] = [];
                break;
            case 'avgHold':
                me.avgData[trace] = [];
                me.times[trace] = 0;
                break;
            default:
                break;
        }
    };
    //获取当前的按钮是否被禁用
    this.isDisabled = function(id){
        return $('#' + id).hasClass('disfuncBtn');
    };
    this.getMaxData = function(data1, data2){
        if(!data1.length){
            data1 = data2;
        }else{
            for(var i = 0; i < data1.length; i++){
                data1[i] = Math.max(parseFloat(data1[i]), parseFloat(data2[i]));
            }
        }
        return data1;
    };
    this.getMinData = function(data1, data2){
        if(!data1.length){
            data1 = data2;
        }else{
            for(var i = 0; i < data1.length; i++){
                data1[i] = Math.min(parseFloat(data1[i]), parseFloat(data2[i]));
            }
        }
        return data1;
    };
    this.getAvgData = function(data1, data2, times){
        if(times === 0){
            data1 = data2;
        }else if(times === 1){
            for(var i = 0; i < data1.length; i++){
                data1[i] = ((parseFloat(data1[i]) + parseFloat(data2[i]))/2).toFixed(1);
            }
        }else{// 现在可以前两个数的值与第三个数求平均，算法如下
            for(i = 0; i < data1.length; i++){
                data1[i] = ((parseFloat(data1[i])*times  + parseFloat(data2[i]))/(times+1)).toFixed(1);
            }
        }
        return data1;
    };
    return instance;
}
//光谱图
function Crv(id){
    var me = this, instance = {};
    me.unit = 'dBm';
    me.firstMark = false;//true
    me.bSetPeak = false, me.bSetNextPeak = false, me.clickPeakNum = 0;
    me.sweepHoldData = [];
    me.bSetMrkToCenter = false, me.bSetRef = false;
    me.changeReverseColor = false;//默认不改变背景颜色
    me.canvas = $('#' + id)[0];
    me.jsgdi = new JsGdi2(me.canvas);
    me.canvas.width = $('#' + id).width();//document.documentElement.clientWidth - 300;
    me.canvas.height = $('#' + id).height();
    me.space = 'full';
    me.left =0; me.top =30; me.right =0; me.bottom =0; //边距
    me.delCrvFig = false;//默认不删除光谱图
    me.frmGrid = new GdiFrmGrid();
    me.endCrvData = [];
    var gdiText0, gdiText1;

    //设置边距
    instance.setMargin = function(left,top,right,bottom){
        me.left = left; me.top = top; me.right = right; me.bottom = bottom;
    };
    //重绘
    instance.redraw = function(){
        var Graph = $("#" + id);
        me.canvas.width = Graph.width();
        me.canvas.height = Graph.height();
        me.frmGrid.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
        me.legend.setRect(new GdiRect(160, me.canvas.height-30, me.canvas.width- 175, me.canvas.height - 10));        
        instance.drawCrv(me.endCrvData);
        me.jsgdi.draw();
    };
    //画坐标轴
    instance.drawXYAxis = function(startx, stopx, starty, stopy,legendShow){
        me.startx = startx;
        me.stopx = stopx;
        me.starty = starty;
        me.stopy = stopy;
        me.frmGrid.setFrameColor(colorSet.FRAME_GRID);
        me.frmGrid.setBkgndColor(new GdiColor(245,245,245,0));
        me.frmGrid.setGridNum(1, 1);
        me.axisX = me.frmGrid.getAxis('bottom');
        me.axisX.setSpan(startx, stopx);
        me.axisX.setLineVisible(false);
        me.axisX.setUnit('MHz');
        me.axisX.setLabelPrecision(3);
        me.axisX.setSplit(2);
        me.axisY = me.frmGrid.getAxis('left');
        me.axisY.setSpan(starty, stopy);
        me.axisY.setLineVisible(false);
        me.axisY.setUnit(me.unit);
        me.axisY.setLabelPrecision(1);

        me.jsgdi.setFrame(me.frmGrid);

        me.jsgdi.removeAllPattern();
        me.legend = new GdiPatnClrLegend();

        if(me.space === 'full'){
            me.frmGrid.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
            if(legendShow){
              me.legend.setRect(new GdiRect(160, me.canvas.height-30, me.canvas.width- 175, me.canvas.height - 10)); 
            }
            
        }
        if(legendShow){
          me.legend.addColorStop(0, '#0000FF');//255-- 蓝
          me.legend.addColorStop(0.25, '#00FFFF');//--浅绿--61440+3840+240+15
          me.legend.addColorStop(0.5, '#00FF00');//绿
          me.legend.addColorStop(0.75, '#FFFF00');//黄色
          me.legend.addColorStop(1, '#FF0000');//红-16*16*16*16*16*15+16*16*16*16*15=16*16*16*16*15*17=65536*15*17=16711680

          starty = starty.toFixed(1);
          gdiText0 = new GdiText(starty+me.unit, gdiTextPos.OUTER_LEFTMIDDLE);
          gdiText0.setColor('#222222');
          gdiText0.setFont('80');
          me.legend.addLabel(gdiText0);

          stopy = stopy.toFixed(1);
          gdiText1 = new GdiText(stopy+me.unit, gdiTextPos.OUTER_RIGHTMIDDLE);
          gdiText1.setColor('#222222');
          me.legend.addLabel(gdiText1);
          me.jsgdi.addPattern(me.legend);
        }
    };

    me.crvFigure = new GdiFigSpectrogram();//动态光谱图

    me.jsgdi.draw();

    //获取jsgdi对象
    instance.getJsGdi = function(){
        return me.jsgdi;
    };
    instance.getCanvas = function(){
        return me.canvas;
    };
    instance.getFigure = function(){
        return me.crvFigure;
    };
    //获取光谱图形是否显示
    instance.isShow = function(){
        if(me.canvas.style.display === 'block'){
            return true;
        }else{
            return false;
        }
    };
    //设置频谱图像的显示或者隐藏,value--是否显示；space--所占空间
    instance.setShow = function(value, space){
        if(value){
            me.delCrvFig = value;
            $('#' + id).css('display', 'block');
            me.space = space;
        }else{
            me.space = 'none';
            $('#' + id).css('display', 'none');
        }
    };
    //设置单位
    instance.setUnit = function(value){
        me.unit = value;
    };
    //计算峰值，并将游标移动到峰值处
    instance.setPeak = function(){
        me.bSetPeak = true;
    };
    //计算下一个峰值
    instance.setNextPeak = function(){
        ++me.clickPeakNum;
        me.bSetNextPeak = true;
    };
    //设置游标到中心位置
    instance.setMrkToCenter = function(){
        me.bSetMrkToCenter = true;
    };
    //获取数组中最大的值
    instance.setRef = function(callbackfn){
        if(callbackfn){
            me.callbackFn = callbackfn;
        }
        me.bSetRef = true;
    };
    //设置绘图颜色的相反颜色
    instance.setReverseColor = function(value){
        me.changeReverseColor = value;
    };
    instance.sweepHold = function(value){
        me.sweepHold = value;
    };
    //绘制光谱图
    instance.drawCrv = function(data){
        me.endCrvData = data;
        if($('#' + id).css('display') === 'none'){
            return;
        }
        if(me.sweepHold){
            me.delCrvFig = false;
            data = me.sweepHoldData;
            me.crvFigure.setUpdateFigure(false);
        }else{
            me.sweepHoldData = data;
            me.crvFigure.setUpdateFigure(true);
        }
        if(me.delCrvFig){
            me.crvFigure = new GdiFigSpectrogram();
            me.jsgdi.removeAllFigure();
            //var mkrMgr = me.jsgdi.getMarkerManager();
            //mkrMgr.removeMkrGroup(NORMAL_MARK_GROUP);
            me.firstMark = false;//true;
            me.delCrvFig = false;
        }

        me.crvFigure.setXAxis(me.axisX);
        me.crvFigure.setYAxis(me.axisY);
        me.jsgdi.removeFigure(me.crvFigure);
        me.jsgdi.addFigure(me.crvFigure);
        me.crvFigure.clearData();

        me.crvFigure.setMaxAccumNum(500);

        //var stopY = 100, startY = 0;
        //将颜色分为4段，即：0000FF->00FFFF->00FF00->FFFF00->FF0000
        me.crvFigure.setValue2Clr(function(value) {
            if(value < me.starty){
                return '#0000FF';
            }
            if(value > me.stopy){
                return '#FF0000';
            }
            var avg = (me.stopy - me.starty)/ 4, color;//将颜色分为四段，分段进行处理
            if(value >= me.starty && value < avg+me.starty){//第一段
                value = value - me.starty;
                color = Math.round(value * 255/avg).toString(16).toLocaleUpperCase();
                if(color.length === 1){
                    color = '0' + color;
                }
                color = '#00' + color + 'FF';
            }else if(value >= avg+me.starty && value < 2 * avg+me.starty){//第二段
                value = value - me.starty;
                color = Math.round(255 - (value - avg) * 255/avg).toString(16).toLocaleUpperCase();
                if(color.length === 1){
                    color = '0' + color;
                }
                color = '#00FF' + color;
            }else if(value >= 2 * avg+me.starty && value < 3 * avg+me.starty){//第三段
                value = value - me.starty;
                color = Math.round((value - 2 * avg) * 255/avg).toString(16).toLocaleUpperCase();
                if(color.length === 1){
                    color = '0' + color;
                }
                color = '#' + color + 'FF00';
            }else if(value >= 3 * avg+me.starty && value <= me.stopy){//第四段
                value = value - me.starty;
                color = Math.round(255 - (value - 3 * avg) * 255/avg).toString(16).toLocaleUpperCase();
                if(color.length === 1){
                    color = '0' + color;
                }
                color = '#FF'+ color + '00';
            }
            return color;
        });
        //装载数据
        for (var i = 0; i < data.length; i += 1) {
            var dataum = new GdiDatumOneDim();//一维数组类
            dataum.value = changeToUnit(parseFloat(data[i]), me.unit);
            me.crvFigure.addDatum(dataum);
        }

        me.crvFigure.genStop();
        me.jsgdi.draw();

        if(me.bSetPeak){
            var peaks = computePeak(10, data);
            setMarkMoveByStop(peaks[0], me.jsgdi,'crvCanvas');
            me.bSetPeak = false;
            return;
        }
        if(me.bSetNextPeak){
            var peaks = computePeak(10, data);
            if (me.clickPeakNum >= peaks.length) {
                me.clickPeakNum = 0;
            }
            setMarkMoveByStop(peaks[me.clickPeakNum], me.jsgdi, 'crvCanvas');//根据频谱峰值点移动游标
            me.bSetNextPeak = false;
            return;
        }
        if(me.bSetRef){
            var max = getMaxInArr(data);//获取该场数据的最大值
            me.bSetRef = false;
            if(me.callbackFn){
                me.callbackFn(max);
            }
            return;
        }
        if(me.bSetMrkToCenter){
            me.bSetMrkToCenter = false;
            if(data.length%2 === 0){
                var endPoint = data[data.length - 1];
                data.push(endPoint);//因为传回来是500个点，计算中心位置需要奇数数据，为此将频谱数据最后的点补到频谱数据中
            }
            var index = Math.floor(data.length/2);
            var mkr = me.jsgdi.getMarkerManager();
            mkr.moveActiveMkrTo(NORMAL_MARK_GROUP, index);//将游标移动到中心点索引的位置
            me.jsgdi.draw();
        }
    };
    return instance;
}

//设置横坐标的单位
function setXunit(startf, stopf){
    if(startf.indexOf('KHz') != -1 && stopf.indexOf('GHz') != -1){
        xUnit = 'MHz';
    }
    else if(startf.indexOf('GHz') != -1 || stopf.indexOf('GHz') != -1){
        xUnit = 'GHz';
    }else if(startf.indexOf('MHz') != -1 || stopf.indexOf('MHz') != -1){
        xUnit = 'MHz';
    }else if(startf.indexOf('KHz') != -1 || stopf.indexOf('KHz') != -1){
        xUnit = 'KHz';
    }else if(startf.indexOf('Hz') != -1 || stopf.indexOf('Hz') != -1){
        xUnit = 'Hz';
    }else{
        xUnit = 'MHz';
    }
}
//将Hz转换为MHz单位
function freqToMHz(value){
    if(isNaN(value)){
        return '';
    }
    var freq = parseFloat(value);
    if(freq < 1000){
        return freq.toFixed(3) + 'Hz';
    }
    freq = parseFloat(freq/1000);
    if(freq < 1000){
        return freq.toFixed(3) + 'KHz';
    }
    freq = parseFloat(freq/1000);
    if(freq < 1000){
        return freq.toFixed(3) + 'MHz';
    }
    freq = parseFloat(freq/1000);
    if(freq < 1000){
        return freq.toFixed(3) + 'GHz';
    }

}
//将Hz转换为合适的单位
function freqToFit(value){
    if(isNaN(value)){
        return '';
    }
    var freq = parseFloat(value);
    if(freq < 1000){
        return freq.toFixed(3) + 'Hz';
    }
    freq = freq/1000;
    if(freq < 1000){
        return freq.toFixed(3) + 'KHz';
    }
    freq = freq/1000;
    if(freq < 1000){
        return freq.toFixed(3) + 'MHz';
    }
    freq = freq/1000;
    return freq.toFixed(3) + 'GHz';
}

// 更改电平/功率单位，由dBuV改为目标单位
function changeToUnit(value, unit) {
    'use strict';
    if (unit === 'dBmV') {
        value = value - 60;
    } else if (unit === 'dBm') {
        value = value;// - 108.8;
    }
    return value;
}
//频谱图
function spectrogramLine(canvasid){
  var instance = {}, me = this;
  //颜色
  me.colorSet = {
    BACKGROUND: new GdiColor(245,245,245, 0), //背景颜色
    LINE1: "#2976FF", //电平
    GRID: "#c1c1c1", //表格
    AXIS_LABEL: "#000000"
  };
  //通用
  me.canvas = $('#' + canvasid)[0];
  var graph = $("#" + canvasid);
  me.jsGdi = new JsGdi2(me.canvas);
  me.frame = new GdiFrmGrid();
  me.left =50; me.top =10; me.right =50; me.bottom =30; //边距
  me.gridRows = 2;   //行数
  me.gridCols = 2;   //列数
  me.showXaxis = true; //X轴坐标
  me.showYaxis = true; //Y轴坐标
  me.axisX = undefined;
  me.axisY = undefined;
  me.axisLostX = undefined;
  me.axisLostY = undefined;
  me.splitX = 2;
  me.splitY = 3;
  me.startx = 0;
  me.stopx = 0;
  me.starty = 0;
  me.stopy = 0;
  me.canvas.width = $('#' + canvasid).width();//document.documentElement.clientWidth - 300;
  me.canvas.height = $('#' + canvasid).height();

  //频谱图
  me.leftFig = new GdiFigPolyline();
  
  me.figWeight = me.canvas.weight - me.left - me.right;
  me.figHeight = me.canvas.height - me.top - me.bottom;
  

  me.trace = 0;//默认是扫迹1
  me.mkrManager = me.jsGdi.getMarkerManager();
  me.mkrName = ['','','','','','']; //游标名
  me.mkrEnable = [false,false,false,false,false,false]; //游标使能
  me.mkrPos = [undefined,undefined,undefined,undefined,undefined,undefined]; //游标位置
  //获取canvas
  instance.getCanvas = function(){
    return me.canvas;
  };
  //获取jsGdi
  instance.getJsGdi = function(){
    return me.jsGdi;
  };
  //获取句柄
  instance.getFigHanlder = function(){
    return me.leftFig;
  };
  //获取frame
  instance.getFrame = function(){
    return me.frame;
  };
  //重绘
  instance.redraw = function(){
    me.jsGdi.removeAllPattern();
    me.jsGdi.removeAllText();
    var graph = $("#" + canvasid);
    me.canvas.width = graph.width();
    me.canvas.height = graph.height()/1.6;
    me.frame.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
    instance.drawSpeedFig();
    me.jsGdi.draw();
  };
  //设置边距
  instance.setMargin = function(left,top,right,bottom){
    me.left = left; me.top = top; me.right = right; me.bottom = bottom;
  };
    //设置表格行列
  instance.setGridRowsCols = function(rows, columns){
    me.gridRows = rows;
    me.gridCols = columns;
  };
  //设置XY分割线
  instance.setSplitXY = function(splitx,splity){
    me.splitX = splitx;
    me.splitY = splity;
  };
  instance.setSplitWidth = function(width){
    me.frame.setGridWidth(width);
  };
  //设置x，y轴坐标
  instance.setXYAxis = function(startx, stopx, starty, stopy,xLableShow,yLabelShow){
    me.startx = startx;
    me.stopx = stopx;
    me.starty = starty;
    me.stopy = stopy;
    me.axisX = me.frame.getAxis('bottom');
    me.axisX.setSpan(startx, stopx);
    me.axisX.setUnit('MHz');
    me.axisX.setLineVisible(false);
    me.axisX.setSplit(2);
    me.axisX.setLabelPrecision(3);
    me.axisX.setLabelFont("12px normal");
    me.axisX.setLabelColor(me.colorSet['AXIS_LABEL']);
    me.axisX.removeAllLabel();
    if(xLableShow){
      me.axisX.genLabels();  
    }
    
    /*for(var i=0;i<=me.splitX; i++){
      me.axisX.addLabel(i+':00');
    }*/

    me.axisY = me.frame.getAxis('left');
    me.axisY.setUnit(' ');
    me.axisY.setSpan(starty, stopy);
    me.axisY.setLineVisible(false);
    me.axisY.setSplit(me.splitY);
    me.axisY.setLabelPrecision(0);
    me.axisY.setLabelFont('12px normal');
    me.axisY.setLabelColor(me.colorSet['AXIS_LABEL']);
    me.axisY.removeAllLabel();
    me.axisY.genLabels();
    var len = me.axisY.getLabelCount();
    me.axisY.removeLabelAt(len-1);
    if(yLabelShow){
      me.axisY.addLabel('dBm');  
    }
    
  };
 
  //获取X、Y坐标
  instance.getStartX = function(){
    return me.startx;
  };
  instance.getStopX = function(){
    return me.stopx;
  };
  instance.getStartY = function(){
    return me.starty;
  };
  instance.getStopY = function(){
    return me.stopy;
  };
  //画背景和表格
  instance.drawFrame = function(){
    me.frame.setBkgndColor(me.colorSet['BACKGROUND']);
    me.frame.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
    me.frame.setGridNum(3,1);
    me.frame.enableBorder(true);
    me.frame.setFrameColor(me.colorSet['GRID']);//设置网格线的颜色
    me.jsGdi.setFrame(me.frame);
  };
  //画网速图
  instance.drawSpectFig = function(){
    me.leftFig.setColor(me.colorSet['LINE1']);
    me.leftFig.setXAxis(me.axisX);
    me.leftFig.setYAxis(me.axisY);

    me.jsGdi.removeFigure(me.leftFig);
    me.jsGdi.addFigure(me.leftFig);
  };
    //更新网速图 lostRcvFig
  instance.updateSpectFig = function(data1Arr){
    me.leftFig.clearData();
    for(var i = 0; i < data1Arr.length; i++){
      var dataY = new GdiDatumOneDim();
      dataY.value = data1Arr[i];
      me.leftFig.addDatum(dataY);
    }
    me.jsGdi.draw();
  };
  //清空图像
  instance.clearSpeedFig = function(){
    me.leftFig.clearData();
    me.jsGdi.draw();
  };
  
  //设置游标名
  instance.setMkrName = function(index, name){
    me.mkrName[index] = name;
  };
  //设置游标使能
  instance.setMkrEnable = function(enAarr){
    for(var i=0; i<me.mkrEnable.length; i++){
      enAarr[i] && (me.mkrEnable[i] = enAarr[i]);
    }
  };
  //获取游标使能
  instance.getMkrEnable = function(){
    return me.mkrEnable;
  };
  //绘制游标
  instance.drawMarks = function(){
    if(me.mkrPos[0] === undefined){
      me.mkrPos[0] = 180;
    }
    if(me.mkrPos[1] === undefined){
      me.mkrPos[1] = 280;
    }
    if(me.mkrPos[2] === undefined){
      me.mkrPos[2] = 70;
    }
    if(me.mkrPos[3] === undefined){
      me.mkrPos[3] = 70;
    }
    //游标一 蓝
    if(me.mkrEnable[0]){
      me.mkrManager.addMarker(MARK1, new GdiMkrLine());
      me.mkrManager.getMarkerAt(MARK1, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
      me.mkrManager.getMarkerAt(MARK1, 0).setVisible(true);
      me.mkrManager.setMkrViewLabelAt(MARK1, 0, true);
      me.mkrManager.moveMkrTo(MARK1, 0, me.mkrPos[0]);//游标的初始位置
      me.mkrManager.setMkrColor(MARK1, colorSet.MARK1);
      me.mkrManager.setActiveMkrColor(MARK1, colorSet.ACTIVE_MARK);
      me.mkrManager.getMarkerAt(MARK1, 0).setName(me.mkrName[0]);
    }
      //游标二 绿
    if(me.mkrEnable[1]){
      me.mkrManager.addMarker(MARK2, new GdiMkrLine());
      me.mkrManager.getMarkerAt(MARK2, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
      me.mkrManager.getMarkerAt(MARK2, 0).setVisible(true);
      me.mkrManager.setMkrViewLabelAt(MARK2, 0, true);
      me.mkrManager.moveMkrTo(MARK2, 0, me.mkrPos[1]);//游标的初始位置
      me.mkrManager.setMkrColor(MARK2, colorSet.MARK2);
      me.mkrManager.setActiveMkrColor(MARK2, colorSet.ACTIVE_MARK);
      me.mkrManager.getMarkerAt(MARK2, 0).setName(me.mkrName[1]);
    }
    //游标三 紫
    if(me.mkrEnable[2]){
      me.mkrManager.addMarker(MARK3, new GdiMkrLine());
      me.mkrManager.getMarkerAt(MARK3, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
      me.mkrManager.getMarkerAt(MARK3, 0).setVisible(true);
      me.mkrManager.setMkrViewLabelAt(MARK3, 0, false);
      me.mkrManager.moveMkrTo(MARK3, 0,  me.mkrPos[2]);//游标的初始位置
      me.mkrManager.setMkrColor(MARK3, colorSet.MARK3);
      me.mkrManager.setActiveMkrColor(MARK3, colorSet.MARK3);
      me.mkrManager.getMarkerAt(MARK3, 0).setWidth(8);
      me.mkrManager.getMarkerAt(MARK3, 0).setAlpha(0.5);
    }
    //游标四 黄
    if(me.mkrEnable[3]){
      me.mkrManager.addMarker(MARK4, new GdiMkrLine());
      me.mkrManager.getMarkerAt(MARK4, 0).setTextPos(gdiTextPos.OUTER_RIGHTTOP);
      me.mkrManager.getMarkerAt(MARK4, 0).setVisible(true);
      me.mkrManager.setMkrViewLabelAt(MARK4, 0, false);
      me.mkrManager.moveMkrTo(MARK4, 0,  me.mkrPos[3]);//游标的初始位置
      me.mkrManager.setMkrColor(MARK4, colorSet.MARK4);
      me.mkrManager.setActiveMkrColor(MARK4, colorSet.MARK4);
      me.mkrManager.getMarkerAt(MARK4, 0).setName(me.mkrName[3]);
    }
  };
  //获取游标的备注信息
  function getShowMkrValue(pos, selectIndex){
    var value, unit, showValue = [], horValue;
    for(var i = 0; i < 4; i++){
      instance.setMrkInActivate(i);
    }
    switch(selectIndex){
      case 0://垂直游标
        value = parseFloat(getPerX(pos) + me.startx).toFixed(3);
        unit = UNIT;
        instance.setMrkActivate(2);
        showValue.push({'ver': value + unit});
        break;
      case 1://垂直游标
        value = parseFloat(getPerX(pos) + me.startx).toFixed(3);
        unit = UNIT;
        instance.setMrkActivate(3);
        showValue.push({'ver': value + unit});
        break;
      case 2://水平游标
        value = parseFloat(me.stopy - getPerY(pos)).toFixed(1) ;
        unit = me.unit;
        instance.setMrkActivate(0);
        showValue.push({'ver': value + unit});
        break;
      case 3://水平游标
        value = parseFloat(me.stopy - getPerY(pos)).toFixed(1) ;
        unit = me.unit;
        instance.setMrkActivate(1);
        showValue.push({'ver': value + unit});
        break;
      default:
        break;
    }
    return showValue;
  }
    //在表格中显示游标的所有值,k--第几条扫迹；data--频谱数据，mkra--游标a的值，mkrb--游标b的值
  instance.showMkrInfo = function(index, freqa, ampla, freqb, amplb){
    var difffreq, diffampl;
    if(ampla == '--' || amplb == '--'){
      difffreq = '--';
      diffampl = '--';
    }else{
      var amplUnitLen = unitArr[unitInitIndex].length;
      var freqUnitLen = UNIT.length;
      var fa = freqa.substr(0, freqa.length - freqUnitLen);
      var fb = freqb.substr(0, freqb.length - freqUnitLen);
      var aa = ampla.substr(0, ampla.length - amplUnitLen);
      var ab = amplb.substr(0, amplb.length - amplUnitLen);
      diffampl = (aa - ab).toFixed(1) +  ' ' + unitArr[unitInitIndex];
      difffreq = (fa - fb).toFixed(1) + ' ' + UNIT;
    }

    mkrInfo.getBodyTable().setCellHTML(0, index+1 , '<div>'+uiText['amp']+':&nbsp;'+ampla+
        '&nbsp;'+uiText['FREQ']+':&nbsp;'+freqa+'</div>');
    mkrInfo.getBodyTable().setCellHTML(1, index+1, '<div>'+uiText['amp']+':&nbsp;'+amplb+
        '&nbsp;'+uiText['FREQ']+':&nbsp;'+freqb+'</div>');
    mkrInfo.getBodyTable().setCellHTML(2, index+1 , '<div>'+uiText['difamp']+':&nbsp;'+diffampl+
        '&nbsp;'+uiText['diffreq']+':&nbsp;'+difffreq+'</div>');
  };
  return instance;
}

//电平图
function voltageLine(canvasid){
  var instance = {}, me = this;
  //颜色
  me.colorSet = {
    BACKGROUND: new GdiColor(245,245,245, 0), //背景颜色
    LINE1: "#2976FF", //电平
    LINE2: "#31FF24", //调制度
    LINE3: "#EA39FF", //载噪比
    GRID: "#c1c1c1", //表格
    AXIS_LABEL: "#000000"
  };
  //通用
  me.canvas = $('#' + canvasid)[0];
  var graph = $("#" + canvasid);
  me.jsGdi = new JsGdi2(me.canvas);
  me.frame = new GdiFrmGrid();
  me.left =50; me.top =10; me.right =50; me.bottom =30; //边距
  me.gridRows = 2;   //行数
  me.gridCols = 2;   //列数
  me.showXaxis = true; //X轴坐标
  me.showYaxis = true; //Y轴坐标
  me.axisX = undefined;
  me.axisY = undefined;
  me.axisLostX = undefined;
  me.axisLostY = undefined;
  me.splitX = 2;
  me.splitY = 3;
  me.startx = 0;
  me.stopx = 0;
  me.starty = 0;
  me.stopy = 0;
  me.canvas.width = $('#' + canvasid).width();//document.documentElement.clientWidth - 300;
  me.canvas.height = $('#' + canvasid).height();

  //网速图
  me.leftFig = new GdiFigPolyline();
  me.rightFig = new GdiFigPolyline();
  me.right2Fig = new GdiFigPolyline();

  me.figWeight = me.canvas.weight - me.left - me.right;
  me.figHeight = me.canvas.height - me.top - me.bottom;
  //获取canvas
  instance.getCanvas = function(){
    return me.canvas;
  };
  //获取jsGdi
  instance.getJsGdi = function(){
    return me.jsGdi;
  };
  //获取句柄
  instance.getFigHanlder = function(){
    return me.rightFig;
  };
  //获取frame
  instance.getFrame = function(){
    return me.frame;
  };
  //重绘
  instance.redraw = function(){
    me.jsGdi.removeAllPattern();
    me.jsGdi.removeAllText();
    var graph = $("#" + canvasid);
    me.canvas.width = graph.width();
    me.canvas.height = graph.height()/1.6;
    me.frame.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
    instance.drawSpeedFig();
    me.jsGdi.draw();
  };
  //设置边距
  instance.setMargin = function(left,top,right,bottom){
    me.left = left; me.top = top; me.right = right; me.bottom = bottom;
  };
    //设置表格行列
  instance.setGridRowsCols = function(rows, columns){
    me.gridRows = rows;
    me.gridCols = columns;
  };
  //设置XY分割线
  instance.setSplitXY = function(splitx,splity){
    me.splitX = splitx;
    me.splitY = splity;
  };
  instance.setSplitWidth = function(width){
    me.frame.setGridWidth(width);
  };
  //设置x，y轴坐标
  instance.setXYAxis = function(startx, stopx, starty, stopy){
    me.startx = startx;
    me.stopx = stopx;
    me.starty = starty;
    me.stopy = stopy;
    me.axisX = me.frame.getAxis('bottom');
    me.axisX.setSpan(startx, stopx);
    me.axisX.setUnit('s');
    me.axisX.setLineVisible(false);
    me.axisX.setSplit(me.splitX);
    me.axisX.setLabelPrecision(0);
    me.axisX.setLabelFont("12px normal");
    me.axisX.setLabelColor(me.colorSet['AXIS_LABEL']);
    me.axisX.removeAllLabel();
    for(var i=0;i<=me.splitX; i++){
      me.axisX.addLabel(i+':00');
    }

    me.axisY = me.frame.getAxis('left');
    me.axisY.setUnit(' ');
    me.axisY.setSpan(starty, stopy);
    me.axisY.setLineVisible(false);
    me.axisY.setSplit(me.splitY);
    me.axisY.setLabelPrecision(0);
    me.axisY.setLabelFont('12px normal');
    me.axisY.setLabelColor(me.colorSet['AXIS_LABEL']);
    me.axisY.removeAllLabel();
    me.axisY.genLabels();
    var len = me.axisY.getLabelCount();
    me.axisY.removeLabelAt(len-1);
    me.axisY.addLabel('dBm');
  };
  //设置丢包率x，y轴坐标
  instance.setLostXYAxis = function(startx, stopx, starty, stopy){
    me.axisLostX = me.frame.getAxis('bottom');
    me.axisLostX.setSpan(startx, stopx);
    me.axisLostX.setUnit('s');
    me.axisLostX.setLineVisible(false);
    me.axisLostX.setSplit(me.splitX);
    me.axisLostX.removeAllLabel();

    me.axisLostY = me.frame.getAxis('right');
    me.axisLostY.setUnit(' ');
    me.axisLostY.setSpan(starty, stopy);
    me.axisLostY.setLineVisible(false);
    me.axisLostY.setSplit(me.splitY);
    me.axisLostY.setLabelPrecision(0);
    me.axisLostY.setLabelFont('12px normal');
    me.axisLostY.setLabelColor(me.colorSet['AXIS_LABEL']);
    me.axisLostY.removeAllLabel();
    me.axisLostY.genLabels();
    var len = me.axisLostY.getLabelCount();
    me.axisLostY.removeLabelAt(len-1);
    me.axisLostY.addLabel('%');
  };
  //获取X、Y坐标
  instance.getStartX = function(){
    return me.startx;
  };
  instance.getStopX = function(){
    return me.stopx;
  };
  instance.getStartY = function(){
    return me.starty;
  };
  instance.getStopY = function(){
    return me.stopy;
  };
  //画背景和表格
  instance.drawFrame = function(){
    me.frame.setBkgndColor(me.colorSet['BACKGROUND']);
    me.frame.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.canvas.height-me.bottom));
    me.frame.setGridNum(3,1);
    me.frame.enableBorder(true);
    me.frame.setFrameColor(me.colorSet['GRID']);//设置网格线的颜色
    me.jsGdi.setFrame(me.frame);
  };
  //画网速图
  instance.drawSpeedFig = function(){
    me.leftFig.setColor(me.colorSet['LINE1']);
    me.leftFig.setXAxis(me.axisX);
    me.leftFig.setYAxis(me.axisY);

    me.rightFig.setColor(me.colorSet['LINE2']);
    me.rightFig.setXAxis(me.axisLostX);
    me.rightFig.setYAxis(me.axisLostY);
    
    me.right2Fig.setColor(me.colorSet['LINE3']);
    me.right2Fig.setXAxis(me.axisLostX);
    me.right2Fig.setYAxis(me.axisLostY);

    me.jsGdi.removeFigure(me.leftFig);
    me.jsGdi.addFigure(me.leftFig);
    me.jsGdi.removeFigure(me.rightFig);
    me.jsGdi.addFigure(me.rightFig);
    me.jsGdi.removeFigure(me.right2Fig);
    me.jsGdi.addFigure(me.right2Fig);
  };
    //更新网速图 lostRcvFig
  instance.updateSpeedFig = function(data1Arr,data2Arr,data3Arr){
    me.leftFig.clearData();
    me.rightFig.clearData();
    for(var i = 0; i < data1Arr.length; i++){
      var dataY = new GdiDatumOneDim();
      dataY.value = data1Arr[i];
      me.leftFig.addDatum(dataY);

      var dataY2 = new GdiDatumOneDim();
      dataY2.value = data2Arr[i];
      me.rightFig.addDatum(dataY2);

      var dataY3 = new GdiDatumOneDim();
      dataY3.value = data3Arr[i];
      me.right2Fig.addDatum(dataY3);
    }
    me.jsGdi.draw();
  };
  //清空图像
  instance.clearSpeedFig = function(){
    me.leftFig.clearData();
    me.rightFig.clearData();
    me.right2Fig.clearData();
    me.jsGdi.draw();
  };
  return instance;
}

//音量图
function VolumePillar(canvasid){
  var instance = {}, me = this;
  //颜色
  me.colorSet = {
    BACKGROUND: new GdiColor(72, 72, 72,0), //背景颜色
    CUR: "#00FF00", //当前值
    MAX: "#FF0000"  //最大值
  };
  //通用
  me.canvas = $('#' + canvasid)[0];
  var graph = $("#" + canvasid);
  me.canvas.width = graph.width();
  me.canvas.height = graph.height();
  me.jsGdi = new JsGdi2(me.canvas);
  me.frame = new GdiFrmGrid();
  me.left =10; me.top =10; me.right =10; me.bottom =10; //边距
  //音量图
  me.volumeFigArr = [];
  me.figWidth = 0.8; //80%的宽
  me.figHeight = me.canvas.height - me.top - me.bottom;
  me.volumeCur = 0;
  me.volumeMax = 0;

  //获取canvas
  instance.getCanvas = function(){
    return me.canvas;
  };
  //获取jsGdi
  instance.getJsGdi = function(){
    return me.jsGdi;
  };
  //获取句柄
  instance.getFigsHanlder = function(){
    return me.volumeFigArr;
  };
  //获取frame
  instance.getFrame = function(){
    return me.frame;
  };
  //重绘
  instance.redraw = function(){
    me.jsGdi.removeAllPattern();
    me.jsGdi.removeAllText();
    var graph = $("#" + canvasid);
    me.canvas.width = graph.width();
    me.canvas.height = graph.height();
    me.frame.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.top+me.scaleHeight));
    instance.drawVolumeFigs();
    me.jsGdi.draw();
  };
  //初始化图形
  instance.initFigs = function(counts){
    for(var i=0; i<counts; i++){
        var myFig = new GdiVolumePatn('volume'+i);
        me.volumeFigArr.push(myFig);
    }
  };
  //设置边距
  instance.setMargin = function(left,top,right,bottom){
    me.left = left; me.top = top; me.right = right; me.bottom = bottom;
  };
  //设置每个音柱图的宽
  instance.setFigWidth = function(width){
    me.figWidth = width;
  };
  //画背景和坐标轴
  instance.drawFrame = function(){
    me.frame.setBkgndColor(me.colorSet['BACKGROUND']);
    me.frame.setBorderRect(new GdiRect(me.left, me.top, me.canvas.width-me.right, me.top+me.scaleHeight));
    me.frame.setGridNum(1, 1);
    me.frame.enableBorder(true);
    me.jsGdi.setFrame(me.frame);
  };
  //画音量图
  instance.drawVolumeFigs = function(){
    var counts = me.volumeFigArr.length;
    var splitWid1 = me.canvas.width / counts;
    var splitWid2 = (splitWid1 * (1-me.figWidth)) / 2;
    for(var i=0; i<counts; i++){
        me.volumeFigArr[i].setOffsetXY(i*splitWid1+splitWid2,me.top);
        me.volumeFigArr[i].setWidth(splitWid1*me.figWidth);
        me.figHeight = me.canvas.height - me.top - me.bottom;
        me.volumeFigArr[i].setHeight(me.figHeight);
        me.volumeFigArr[i].setValueHeight(0);
        me.volumeFigArr[i].setFontSize(15);
        me.volumeFigArr[i].setUnit('');
        me.volumeFigArr[i].setCurValue(me.volumeCur);
        me.volumeFigArr[i].setMaxVaulue(me.volumeMax);
        me.volumeFigArr[i].setSpan(0,100);
        me.volumeFigArr[i].setBarColor('#00FF00');
        me.jsGdi.removePattern(me.volumeFigArr[i]);
        me.jsGdi.addPattern(me.volumeFigArr[i]);
    }
  };
  //更新音量图
  instance.updateVolumeFig = function(textArr,curArr,maxArr){
    var counts = me.volumeFigArr.length;
    for(var i=0; i<counts; i++){
        me.volumeFigArr[i].setCurValue(curArr[i]);
        me.volumeFigArr[i].setMaxVaulue(maxArr[i]);
        me.volumeFigArr[i].setFreq(textArr[i]);
    }
    me.jsGdi.draw();
  };

  return instance;
}
export{
    VolumePillar,Spectrum,spectrogramLine,Crv,voltageLine,GdiPoint,MARK1,MARK2,MARK3
}