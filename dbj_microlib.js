
/*
(c) 2011 by DBJ.ORG
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.
*/

(function (undefined) {
	if (undefined === window.dbj)
		dbj = {};
	/*
	Defult cond allows users to compare initial values with other values of the same type
	or arrays of values of the same type. Order is "first found, first served". Example:

	dbj.cond( 1, 1, "A", 2, "B", "C") returns "A"

	dbj.cond( 1, [3,2,1],"A", 2, "B", "C") returns "A" , 1 is found first in [3,2,1]

	only intrinisc types can be compared meaningfully: that is arrays and objects can not be compared. 
	as in javascript this is the default behavior:

	[1,2] === [1,2] yields false
	{a:1} === {a:1 } yoelds false

	*/
	dbj.cond = (function () {
		/*
		defualt comparator allows for arrays of values to be compared 
		with the input value of the same type
		this works for all types, because it uses function dbj.EQ.rathe(b, a) 
		Example:
		default_comparator( 1, [3,2,1] ) --> true
		*/
		var default_comparator = function (a, b) {
			if (!dbj.type.isArray(a) && dbj.type.isArray(b))
			// try to find a in array b and then compare the values
			//TODO: this uses [].indexOf() which works only for scalar types
			// 
					return default_comparator(a, b[b.indexOf(a)]);
			return dbj.EQ.rathe(a, b);
		};

		return function (v) {
			for (var j = 1, L = arguments.length; j < L; j += 2) {
				if (default_comparator(v, arguments[j])) return arguments[j + 1];
			}
			return (!arguments[j - 2]) ? undefined : arguments[j - 2];
		};
	} ());
	/* see the usage in dbj.conex */
	var cond_comparator = null;
	/*
	condex allows for comparison of "anything to anything"

	condex( {a:1}, {a:1}, "A", {b:2}, "B", "C") returns "A"

	NOTE: "anything" but functions results that is
	*/
	dbj.condex = (function () {
		return function () {
			try {
				cond_comparator = dbj.EQ.rathe;
				return dbj.cond.call(Array.prototype.slice.apply(arguments));
			} finally {
				cond_comparator = null;
			}
		}
	} ());

	dbj.type = function (o) {
		/// NOTE: for DOM objects methods, js function bellow will return "object"
		///       in IE < 9. example: window.alert returns "object"
		return o === undefined
                ? "undefined" : o === null
                ? "null" : (Object.prototype.toString.call(o).match(/\w+/g)[1]).toLowerCase();
	};
	dbj.type.isObject = function (o) {
		return "object" === dbj.type(o);
	}
	dbj.type.isFunction = function (o) {
		return "function" === dbj.type(o);
	}
	dbj.type.isArray = function (o) {
		return "array" === dbj.type(o);
	}
	dbj.type.isString = function (o) {
		return "string" === dbj.type(o);
	}

	/*--------------------------------------------------------------------------------------------*/
	if ("function" != typeof "".format)
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
				var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
			}
            );
		}
	/*
	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	*/
	if ("function" !== typeof Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
			"use strict";
			if (this === void 0 || this === null) {
				throw new TypeError();
			}
			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0) {
				return -1;
			}
			var n = 0;
			if (arguments.length > 0) {
				n = Number(arguments[1]);
				if (n !== n) { // shortcut for verifying if it's NaN
					n = 0;
				} else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		}
	}
	/*--------------------------------------------------------------------------------------------*/

} ());

/*
--------------------------------------------------------------------------------------------
equvalence tests
full tests are slower
simple tests are fasters
--------------------------------------------------------------------------------------------
*/
(function (undefined) {
if ( undefined === window.dbj ) dbj = {} ;
var EQ = dbj.EQ = {} ;

// Test for equality any JavaScript type. Used in QUnit
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
		var args = Array.prototype.slice.apply(arguments);
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

}();


}());