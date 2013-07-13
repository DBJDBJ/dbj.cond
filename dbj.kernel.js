/*
(c) dbj.org
The absolute core of the cores ... perhaps called "a kernel"
*/
var /*module*/dbj = (function (undefined) {

    /*
    additions to ES5 intrinsics
    */
    /* moot point: what happens in the presence of another "".format() ? */
    if ("function" != typeof "".format)
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
                var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
            }
            );
        }

    var oprot = Object.prototype, aprot = Array.prototype, sprot = String.prototype;

    var /*implementation*/imp_ = {
        /* coercion to Int32 as required by asm.js */
        toInt32: function (v_) {
            return v_ | 0;
        },
        isEven: function (value) { return (imp_.toInt32(value) % 2 == 0); },
        /* dbj's type system */
        type: (function () {
        var rx = /\w+/g, tos = oprot.toString;
        return function (o) {
            if (typeof o === "undefined") return "undefined";
            if (o === null) return "null";
            if ("number" === typeof (o) && isNaN(o)) return "nan";
            return (tos.call(o).match(rx)[1]).toLowerCase();
        }
    }()),
        isObject: function (o) { return "object" === imp_.type(o); },
        isFunction: function (o) { return "function" === imp_.type(o); },
        isArray: function (o) { return "array" === imp_.type(o); },
        isString: function (o) { return "string" === imp_.type(o); }
    };

    return/*interface*/ {

        toString: function () { return "dbj(); kernel 1.2.0"; },
        /* 
        coercion to Int32 
        also required by asm.js
        */
        toInt32 : imp_.toInt32 ,
        isEven: imp_.isEven,

        "oprot" : oprot,
        "aprot" : aprot,
        "sprot" : sprot,

        type : imp_.type,
        isObject: imp_.isObject,
        isFunction: imp_.isFunction,
        isArray: imp_.isArray,
        isString: imp_.isString
    };

}());