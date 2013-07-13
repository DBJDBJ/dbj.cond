
/*
(c) 2011 by DBJ.ORG
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.

 depends on dbj.kernel.js
*/

(function (dbj,undefined) {

	/*
	Defult cond allows users to compare initial values with other values of the same type
	or arrays of values of the same type. Order is "first found, first served". Example:
	dbj.cond( 1, 1, "A", 2, "B", "C") returns "A"
	dbj.cond( 1, [3,2,1],"A", 2, "B", "C") returns "A" , 1 is found first in [3,2,1]

	any types can be compared meaningfully. For example
	dbj.cond( /./, /./, "A", /$/, "B", "C") returns "A"

	function types are also compared and not called as functions
	dbj.cond( function() {return 1;}, function(){return 1}, "A", function(){return 1}, "B", "C") returns "A"

	this behavior allows for functions dispatching. Example: 

	function disptacher ( fx ) {
	return dbj.cond( fx, f1, f2, f3, f4, f5 ) ;
	// returns f2,f4 or f5 if neither f1 or f3 are equal to fx
	}
	*/
	dbj.cond = (function () {
		return function (v) {
			if (!dbj.isEven(arguments.length)) throw "dbj.cond() not given even number of arguments";
		    var comparator = dbj.cond.comparator || dbj.EQ.default_comparator,
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
	call dbj.cond() *once* with the the comparator of your choice. 
    Must be called with apply() in order to
    to pass the comparator to be used on top of usual arguments for dbj.cond
    example:
    var x = 2 ;
    dbj.cond.applicator(
       function (a,b) {return a != b ;}, // my comparator to be used just for this call
       [x,1,"OK",2] // array of required arguments for dbj.cond()
       ) ;

       will return "OK", since comparator given for this one call returned true because
       x != 1 so the first comparison was used to return a result value "OK".

	*/
	dbj.cond.applicator = function () {
		if (!dbj.isFunction(this)) throw "this in the applicator must be the comparator";
		try {
			dbj.cond.comparator = this;
			return dbj.cond.apply(null, dbj.aprot.slice.apply(arguments));
		} finally {
			dbj.cond.comparator = null;
		}
	}
	/*
	call dbj.cond() once, using native equals behavior
	*/
	dbj.condeq = function () {
		return dbj.cond.applicator.apply(
		function (a, b) { return a === b; }, dbj.aprot.slice.apply(arguments));
	}
	/*
	call dbj.cond() once, using native not equals behavior
	*/
	dbj.condnq = function () {
		return dbj.cond.applicator.apply(
			function (a, b) { return a !== b; }, dbj.aprot.slice.apply(arguments));
	}
	/*
	call dbj.cond() once, using native less than behavior
	*/
	dbj.condlt = function () {
	    return dbj.cond.applicator.apply(function (a, b) { return a < b; }, dbj.aprot.slice.apply(arguments));
	}
	/*
	call dbj.cond() once, using native greater than behavior
	*/
	dbj.condgt = function () {
	    return dbj.cond.applicator.apply(function (a, b) { return a > b; }, dbj.aprot.slice.apply(arguments));
	}

	/*
	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	changed so that it works for "everything" by using dbj.E.rathe() instead of "==="
	also not implemented as array extension but private function instead
	*/
	var find_index = function (arg) {
		"use strict";
		var array = arg["array"], searchElement = arg["searchElement"],
			fromIndex = arg["fromIndex"], comparator = arg["comparator"];

		if (!dbj.isArray(array)) {
			throw new Error(0xFF, "find_index() : bad array argument");
		}
		var t = Object(array), len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		// if fromIndex is used as 3-rd argument
		var n = 0;
		if (fromIndex) {
			n = Number(fromIndex);
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
			/* dbj 2011SEP11 replaced simple native '===' with dbj.EQ.rathe() */
			if (k in t && comparator(t[k], searchElement)) {
				return k;
			}
		}
		return -1;
	}

	/*--------------------------------------------------------------------------------------------*/
	var indexOfanything = function (array, searchElement /*, fromIndex */) {
		return find_index({ "array": array, "searchElement": searchElement,
			"fromIndex": typeof (fromIndex) !== "undefined" ? fromIndex : null,
			"comparator": dbj.EQ.rathe
		});
	}
	/*--------------------------------------------------------------------------------------------*/
	if (!dbj.isFunction(dbj.aprot.indexOf))
		dbj.aprot.indexOf = function (searchElement /*, fromIndex */) {
			return find_index({ "array": this, "searchElement": searchElement,
				"fromIndex": typeof (fromIndex) !== "undefined" ? fromIndex : null,
				"comparator": function (a, b) { return a === b; }
			});
		}
/*
--------------------------------------------------------------------------------------------
comparators in essence define the behaviour of the cond()
equvalence tests are simple to meter: full tests are slower and simple tests are faster
--------------------------------------------------------------------------------------------
*/
	var EQ = dbj.EQ = {};
/*
default_comparator works for all types, because it uses function dbj.EQ.rathe(b, a) 
defualt comparator allows arrays to singular values to be compared 
Examples:
default_comparator( 1, [3,2,1] ) --> true
default_comparator( [3,2,1], 1 ) --> true
default_comparator( function (){ return 1;}, [3,2,1] ) --> true
default_comparator( [3,2,1], [3,2,1] ) --> true
*/
	dbj.EQ.default_comparator = function (a, b) {
	    if (dbj.EQ.rathe(a, b)) return true;         /* covers arr to arr too */
	    if (dbj.isArray(b)) return indexOfanything(b, a) > -1; /* sing to arr */
	    if (dbj.isArray(a)) return indexOfanything(a, b) > -1; /* arr to sing */
	    return false;
	};

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

    /*
    simple cond
    */
dbj.scond = function (v) {
    ///<summary>
    /// the last argument (if given) is the default value
    ///<code>
    /// dbj.scond( input, case1, value1, case2, value2, ..... , value_for_default )
    ///</code>
    /// example :
    ///<code>
    /// dbj.scond(2, 1, "blue", 2, "red", /*default is*/"green");
    ///</code>
    /// returns "red"
    ///</summary>
    ///default comparator is 'exact match' aka "==="
    var j = 1, L = arguments.length;
    for (; j < L; j += 2) {
        if (dbj.scond.comparator(v,arguments[j])) return arguments[j + 1];
    }
    return (!arguments[j - 2]) ? undefined : arguments[j - 2];
};

dbj.scond.comparator = function (a, b) {

    if (a === b) return true; // most of the cases

    if ("function" == typeof a.indexOf) {
        return a.indexOf(b) > -1;
    }
    if ( "function" == typeof b.indexOf ) {
        return b.indexOf(a) > -1 ;
    }
    return false ;
};
/*--------------------------------------------------------------------------------------------*/
} (dbj ));
/*--------------------------------------------------------------------------------------------*/
