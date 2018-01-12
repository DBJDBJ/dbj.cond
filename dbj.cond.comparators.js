
/*
(c) dbj.org
The absolute core of dbj cores ... perhaps we can call it dbj.core
*/
(function (undefined) {

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
        isObject: function (o)   { return "object" === imp_.type(o);   },
        isFunction: function (o) { return "function" === imp_.type(o); },
        isArray: function (o)    { return "array" === imp_.type(o);    },
        isString: function (o)   { return "string" === imp_.type(o);   }
    };

    dbj.core = {

        "toString": function () { return "dbj(); kernel 1.2.0"; },
        /* 
        coercion to Int32 
        also required by asm.js
        */
        "toInt32": imp_.toInt32,
        "isEven": imp_.isEven,

        "oprot": oprot,
        "aprot": aprot,
        "sprot": sprot,

        "type": imp_.type,
        "isObject": imp_.isObject,
        "isFunction": imp_.isFunction,
        "isArray": imp_.isArray,
        "isString": imp_.isString
    };

    // we do not export it to node from here
    /*
        if ('undefined' != typeof module ) module['exports'] = dbj ;
    */

}(
    function () {
        // for dom env this creates window.dbj
        // for node env this creates module local var
        if ("undefined" == typeof dbj)
            dbj = {};
        return dbj;
    }()
));

/*--------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
/*
(c) dbj 2013 -2018 
place for dbj comparators
dependancy: dbj.kernel (above) and ES5
NOTE: since 2013 quite a few comparators have been implemented please be sure which
comparator you need and use the ones bellow after that.
*/
(function (dbj, undefined) {
    "use strict";

    // also defines what is a comparator : 
    function strict_eq(a, b) { return a === b; }
    // as per ES5 spec this returns false on different types

    /*
    find single in the array
    only same types allowed to be compared 
    (as customary) returns -1 , on not found
    */
    var index_of = function (array, searchElement, comparator) {
        var found = -1;
        array.every(
            function (e, i) {
                if (comparator(e, searchElement)) {
                    found = i; return false;
                };
                return true;
            });
        return found;
    };

    /*
    multi_comparator  allows arrays v.s. singles to be compared 
    
    Examples:
    
    multi_comparator( 1, [3,2,1] ) --> true
    multi_comparator( [3,2,1], 1 ) --> true
    multi_comparator( function (){ return 1;}, [3,2,1] ) --> false
    multi_comparator( [3,2,1], ["x",[3,2,1]] ) --> true
    
    if some complex comparator is used then multi_comparator works for all types
    */
    var multi_comparator = function (a, b, comparator) {

        if (!Array.isArray(a)) a = [a]; // 
        if (!Array.isArray(b)) b = [b]; // 

        if (comparator(a, b)) return true;          /* covers arr to arr too */
        if (index_of(b, a, comparator) > -1) return true;            /* sing to arr */
        if (index_of(a, b, comparator) > -1) return true;            /* arr to sing */

        return false;
    };

    // Test for equality any JavaScript type. Also used in QUnit
    // equiv({a:1},{b:2}) --> true
    //
    // Discussions and reference: http://philrathe.com/articles/equiv
    // Test suites: http://philrathe.com/tests/equiv
    // Author: Philippe Rathé <prathe@gmail.com>
    /*
            LEGACY -- REMOVED -- does not worj in presence of "use strict"

    var rathe = function () {

        var innerEquiv, // the real equiv function
            callers = [], // stack to decide between skip/abort functions
            parents = []; // stack to avoiding loops from circular referencing

        // Call the o related callback with the given arguments.
        function bindCallbacks(o, callbacks, args) {
            var prop = dbj.core.type(o);
            if (prop) {
                if (dbj.core.type(callbacks[prop]) === "function") {
                    return callbacks[prop].apply(callbacks, args);
                } else {
                    return callbacks[prop]; // or undefined
                }
            }
        }

        var callbacks = function () {

            // expose it to be used by dbj.cond's default comparator
            // for string, boolean, number and null
            var useStrictEquality = function (b, a) {
                if (b instanceof a.constructor || a instanceof b.constructor) {
                    //  to catch short annotaion VS 'new' annotation of a
                    //  declaration
                    //  var k = 1, j = new Number(1); 
                    //  k would ne not equal to j without this function in use
                    return a == b;
                } else {
                    return a === b;
                }
            }

            // TODO! Check that dbj.type() returns these strings
            return {
                "string": useStrictEquality,
                "boolean": useStrictEquality,
                "number": useStrictEquality,
                "null": useStrictEquality,
                "undefined": useStrictEquality,

                "nan": function (b) {
                    return isNaN(b);
                },

                "date": function (b, a) {
                    return dbj.core.type(b) === "date"
                            && a.valueOf() === b.valueOf();
                },

                "regexp": function (b, a) {
                    return dbj.core.type(b) === "regexp"
                            && a.source === b.source && // the regex itself
                            a.global === b.global && // and its modifers
                                                        // (gmi) ...
                            a.ignoreCase === b.ignoreCase
                            && a.multiline === b.multiline;
                },

                // - skip when the property is a method of an instance (OOP)
                // - abort otherwise,
                // initial === would have catch identical references anyway
                "function": function () {
                    var caller = callers[callers.length - 1];
                    return caller !== Object && typeof caller !== "undefined";
                },

                "array": function (b, a) {
                    var i, j, loop;
                    var len;

                    // b could be an object literal here
                    if (!(dbj.core.type(b) === "array")) {
                        return false;
                    }

                    len = a.length;
                    if (len !== b.length) { // safe and faster
                        return false;
                    }

                    // track reference to avoid circular references
                    parents.push(a);
                    for (i = 0; i < len; i++) {
                        loop = false;
                        for (j = 0; j < parents.length; j++) {
                            if (parents[j] === a[i]) {
                                loop = true;// dont rewalk array
                            }
                        }
                        if (!loop && !innerEquiv(a[i], b[i])) {
                            parents.pop();
                            return false;
                        }
                    }
                    parents.pop();
                    return true;
                },

                "object": function (b, a) {
                    var i, j, loop;
                    var eq = true; // unless we can proove it
                    var aProperties = [], bProperties = []; // collection of
                    // strings

                    // comparing constructors is more strict than using
                    // instanceof
                    if (a.constructor !== b.constructor) {
                        return false;
                    }

                    // stack constructor before traversing properties
                    callers.push(a.constructor);
                    // track reference to avoid circular references
                    parents.push(a);

                    for (i in a) { // be strict: don't ensures hasOwnProperty
                        // and go deep
                        loop = false;
                        for (j = 0; j < parents.length; j++) {
                            if (parents[j] === a[i])
                                loop = true; // don't go down the same path
                            // twice
                        }
                        aProperties.push(i); // collect a's properties

                        if (!loop && !innerEquiv(a[i], b[i])) {
                            eq = false;
                            break;
                        }
                    }

                    callers.pop(); // unstack, we are done
                    parents.pop();

                    for (i in b) {
                        bProperties.push(i); // collect b's properties
                    }

                    // Ensures identical properties name
                    return eq
                            && innerEquiv(aProperties.sort(), bProperties
                                    .sort());
                }
            };
        }();

        innerEquiv = function () { // can take multiple arguments
            var args = dbj.core.aprot.slice.apply(arguments);
            if (args.length < 2) {
                return true; // end transition
            }

            return (function (a, b) {
                if (a === b) {
                    return true; // catch the most you can
                } else if (a === null || b === null || typeof a === "undefined"
                        || typeof b === "undefined"
                        || dbj.core.type(a) !== dbj.core.type(b)) {
                    return false; // don't lose time with error prone cases
                } else {
                    return bindCallbacks(a, callbacks, [b, a]);
                }

                // apply transition with (1..n) arguments
            })(args[0], args[1])
                    && arguments.callee.apply(this, args.splice(1,
                            args.length - 1));
        };

        return innerEquiv;

    }(); // eof rathe()
    */

    /*
    Two arrays are considered equal when all their elements 
    fulfill the following conditions:

    1.  types are equal
    2.  positions are equal
    3. values are equal

    Sparse arrays are also compared for equality

    Solution using every() is fast because it uses native method for iteration
    but it requires two way check since every will 'skip' over undefined entries
    this checking [1,,2] vs [1,2] will be considered true.
    
    this is the tough test, that has to be satisfied:

                 equal_arrays([1, 2, , 3], [1, 2, 3]); // => false
    
    function has(element, index) {
        return this[index] === element;
    }

    function equal_arrays(a, b) {
        return (a.length === b.length) && a.every(has, b) && b.every(has, a);
    }
    
    optimised version of the above, also using the comparator
    */
    function equal_arrays(a, b, comparator) {

        return (a.length === b.length) &&
        a.every(function (e, i) { return comparator(e, b[i]); }) &&
        b.every(function (e, i) { return comparator(e, a[i]); });
    }

    /* interface */
    dbj.compare = {
                'standard': strict_eq ,
        /* 
        compare two arrays 
       if comparator is given uses it otherwise uses strict_eq().

       NOTE: this method is in here because it might prove faster than 
       dbj.compare.multi()
        */
        'arr': function (a, b, /* optional */ comparator) {

            if (!Array.isArray(a)) a = [a]; // throw TypeError("First argument must be array");
            if (!Array.isArray(b)) b = [b]; // throw TypeError("Second argument must be array");

            if (!!comparator && "function" != typeof comparator)
                throw TypeError("Third argument is given but is not a function");

            return equal_arrays(
                a, b, comparator || strict_eq
                )
        },
        /*
        Can compare two arrays AND single to array AND array to single value
        NOTE: if comparator is given use it otherwise use strict_eq().
        */
        'multi': function (a, b, comparator) {
            return multi_comparator(a, b, comparator || strict_eq);
        },
        /*

        LEGACY -- REMOVED -- does not work in presence of "use strict"
        perform deep comparison of two objects or scalars
        NOTE: to construct multi+deep comparator, end users will do this :

         dbj.compare(a,b,dbj.compare.deep) ;

        'deep': function (a, b) {
            return rathe(a, b);
        }

        */
    };

    /*
    export to Node.JS
    (also works in the presence of qUnit "module")
    */
    if ("undefined" != typeof module) {
        module['exports'] = dbj;  // for node js usage
    }

}(function () {
    // for dom env this creates window.dbj
    // for node env this creates module local var
    if ("undefined" == typeof dbj)
        dbj = {};
    return dbj;
    }()
)
);

