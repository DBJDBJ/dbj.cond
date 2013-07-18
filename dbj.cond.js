/*
(c) dbj.org
The absolute core of the dbj cores ... perhaps we can call it a "kernel"
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
        isObject: function (o)   { return "object" === imp_.type(o);   },
        isFunction: function (o) { return "function" === imp_.type(o); },
        isArray: function (o)    { return "array" === imp_.type(o);    },
        isString: function (o)   { return "string" === imp_.type(o);   }
    };

    return/*interface*/ {

        toString: function () { return "dbj(); kernel 1.2.0"; },
        /* 
        coercion to Int32 
        also required by asm.js
        */
        toInt32: imp_.toInt32,
        isEven: imp_.isEven,

        "oprot": oprot,
        "aprot": aprot,
        "sprot": sprot,

        type: imp_.type,
        isObject: imp_.isObject,
        isFunction: imp_.isFunction,
        isArray: imp_.isArray,
        isString: imp_.isString
    };

}());

/*
(c) 2011 by DBJ.ORG
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.

 depends on dbj.kernel
*/

(function (dbj,undefined) {

    /*
    Terminology and arguments requirements:

            dbj.cond( input_value,
                      check_val, out_val, // any number of check/out values
                      default_val ) ;

    Number of arguments must be even. 
	Standard  cond allows users to handle values with other values of the same type.
    Standard comparator is '==='. Order is "first found, first served". Example:

	         dbj.cond( 1, 1, "A", 2, "B", "C") //=> "A"

Arrays as arguments are not part of standard dbj.cond() functionality:  

	         dbj.cond( 1, [3,2,1],"A", 2, "B", "C") 
             //=> "C" , single and array can not be compared 
             // 1 === [1,2,3] => false

	Only intrinsic scalar types can be compared meaningfully. For example
	dbj.cond( /./, /./, "A", /$/, "B", "C") 
    //=> "C",  /./ === /./ => false

	*/
	dbj.cond = (function () {
		return function (v) {
			if (!dbj.isEven(arguments.length)) throw "dbj.cond() not given even number of arguments";
		    var comparator = dbj.cond.comparator || dbj.EQ.standard_comparator,
			    j = 1, L = arguments.length;
			for (; j < L; j += 2) {
				if (comparator(v, arguments[j])) return arguments[j + 1];
			}
			return arguments[L - 1];
		};
	} ());
	/* see the usage in dbj.cond */
	dbj.cond.comparator = null;



/*
--------------------------------------------------------------------------------------------
comparators in essence define the behaviour of the cond()
comples tests are slower and simple tests are faster
--------------------------------------------------------------------------------------------
*/
	var EQ = dbj.EQ = {};

	dbj.EQ.standard_comparator = function (a, b) {
	    "use strict";
	    return a === b ;
	};

/*
find value of any type in the array of values of the same type
*/
	var index_of = function (array, searchElement, comparator ) {
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
default_comparator works for all types, because it uses function dbj.EQ.rathe(b, a) 
defualt comparator allows arrays to singles to be compared 
Examples:
default_comparator( 1, [3,2,1] ) --> true
default_comparator( [3,2,1], 1 ) --> true
default_comparator( function (){ return 1;}, [3,2,1] ) --> false
default_comparator( [3,2,1], [3,2,1] ) --> true
*/
	dbj.EQ.multi_comparator = function (a, b) {
	    if (dbj.EQ.rathe( a, b )) return true;         /* covers arr to arr too */
	    if (dbj.isArray(b)) return index_of(b, a, dbj.EQ.rathe ) > -1; /* sing to arr */
	    if (dbj.isArray(a)) return index_of(a, b, dbj.EQ.rathe ) > -1; /* arr to sing */
	    return false;
	};

// Test for equality any JavaScript type. Also used in QUnit
// equiv({a:1},{b:2}) --> true
//
// Discussions and reference: http://philrathe.com/articles/equiv
// Test suites: http://philrathe.com/tests/equiv
// Author: Philippe Rathé <prathe@gmail.com>
EQ.rathe = function () {

	var innerEquiv, // the real equiv function
		callers = [], // stack to decide between skip/abort functions
		parents = []; // stack to avoiding loops from circular referencing

	// Call the o related callback with the given arguments.
	function bindCallbacks(o, callbacks, args) {
		var prop = dbj.type(o);
		if (prop) {
			if (dbj.type(callbacks[prop]) === "function") {
				return callbacks[prop].apply(callbacks, args);
			} else {
				return callbacks[prop]; // or undefined
			}
		}
	}

	var callbacks = function () {

	    // expose it to be used by dbj.cond's default comparator
		// for string, boolean, number and null
		EQ.useStrictEquality = function (b, a) {
			if (b instanceof a.constructor || a instanceof b.constructor) {
				// to catch short annotaion VS 'new' annotation of a
				// declaration
				// e.g. var i = 1;
				// var j = new Number(1);
				return a == b;
			} else {
				return a === b;
			}
		}

		// TODO! Check that dbj.type() returns these strings
		return {
			"string" : EQ.useStrictEquality,
			"boolean" : EQ.useStrictEquality,
			"number" : EQ.useStrictEquality,
			"null" : EQ.useStrictEquality,
			"undefined" : EQ.useStrictEquality,

			"nan" : function(b) {
				return isNaN(b);
			},

			"date" : function(b, a) {
				return dbj.type(b) === "date"
						&& a.valueOf() === b.valueOf();
			},

			"regexp" : function(b, a) {
				return dbj.type(b) === "regexp"
						&& a.source === b.source && // the regex itself
						a.global === b.global && // and its modifers
													// (gmi) ...
						a.ignoreCase === b.ignoreCase
						&& a.multiline === b.multiline;
			},

			// - skip when the property is a method of an instance (OOP)
			// - abort otherwise,
			// initial === would have catch identical references anyway
			"function" : function() {
				var caller = callers[callers.length - 1];
				return caller !== Object && typeof caller !== "undefined";
			},

			"array" : function(b, a) {
				var i, j, loop;
				var len;

				// b could be an object literal here
				if (!(dbj.type(b) === "array")) {
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

			"object" : function(b, a) {
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

	innerEquiv = function() { // can take multiple arguments
		var args = dbj.aprot.slice.apply(arguments);
		if (args.length < 2) {
			return true; // end transition
		}

		return (function(a, b) {
			if (a === b) {
				return true; // catch the most you can
			} else if (a === null || b === null || typeof a === "undefined"
					|| typeof b === "undefined"
					|| dbj.type(a) !== dbj.type(b)) {
				return false; // don't lose time with error prone cases
			} else {
				return bindCallbacks(a, callbacks, [ b, a ]);
			}

			// apply transition with (1..n) arguments
		})(args[0], args[1])
				&& arguments.callee.apply(this, args.splice(1,
						args.length - 1));
	};

	return innerEquiv;

}(); // eof EQ.rathe

/*--------------------------------------------------------------------------------------------*/
} (dbj ));
/*--------------------------------------------------------------------------------------------*/
