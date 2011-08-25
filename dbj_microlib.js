
/*
(c) 2011 by DBJ.ORG
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.
*/

(function (undefined) {

	/*--------------------------------------------------------------------------------------------*/
	// The following can be used for mega functional comparator
	//
	// compare contents of two objects and return a list of differences
	// returns an array where each element is also an array in the form:
	// [accessor, diffType, leftValue, rightValue ]
	//
	// diffType is one of the following:
	//   value: when primitive values at that index are different
	//   undefined: when values in that index exist in one object but don't in 
	//              another; one of the values is always undefined
	//   null: when a value in that index is null or undefined; values are
	//         expressed as boolean values, indicated wheter they were nulls
	//   type: when values in that index are of different types; values are 
	//         expressed as types
	//   length: when arrays in that index are of different length; values are
	//           the lengths of the arrays
	//

	function differ(o1, o2) {
		// choose a map() impl.
		// you may use $.map from jQuery if you wish
		var map = Array.prototype.map ?
        function (a) { return Array.prototype.map.apply(a, Array.prototype.slice.call(arguments, 1)); } :
        function (a, f) {
        	var ret = new Array(a.length), value;
        	for (var i = 0, length = a.length; i < length; i++)
        		ret[i] = f(a[i], i);
        	return ret.concat();
        };

		// shorthand for push impl.
		var push = Array.prototype.push;

		// check for null/undefined values
		if ((o1 === null) || (o2 === null)) {
			if (o1 != o2)
				return [["", "null", o1 !== null, o2 !== null]];

			return undefined; // both null
		}
		// compare types
		if ((o1.constructor != o2.constructor) ||
        (typeof o1 != typeof o2)) {
			return [["", "type", Object.prototype.toString.call(o1), Object.prototype.toString.call(o2)]]; // different type

		}

		// compare arrays
		if (Object.prototype.toString.call(o1) == "[object Array]") {
			if (o1.length != o2.length) {
				return [["", "length", o1.length, o2.length]]; // different length
			}
			var diff = [];
			for (var i = 0; i < o1.length; i++) {
				// per element nested diff
				var innerDiff = differ(o1[i], o2[i]);
				if (innerDiff) { // o1[i] != o2[i]
					// merge diff array into parent's while including parent object name ([i])
					push.apply(diff, map(innerDiff, function (o, j) { o[0] = "[" + i + "]" + o[0]; return o; }));
				}
			}
			// if any differences were found, return them
			if (diff.length)
				return diff;
			// return nothing if arrays equal
			return undefined;
		}

		// compare object trees
		if (Object.prototype.toString.call(o1) == "[object Object]") {
			var diff = [];
			// check all props in o1
			for (var prop in o1) {
				// the double check in o1 is because in V8 objects remember keys set to undefined 
				if ((typeof o2[prop] == "undefined") && (typeof o1[prop] != "undefined")) {
					// prop exists in o1 but not in o2
					diff.push(["[" + prop + "]", "undefined", o1[prop], undefined]); // prop exists in o1 but not in o2

				}
				else {
					// per element nested diff
					var innerDiff = differ(o1[prop], o2[prop]);
					if (innerDiff) { // o1[prop] != o2[prop]
						// merge diff array into parent's while including parent object name ([prop])
						push.apply(diff, map(innerDiff, function (o, j) { o[0] = "[" + prop + "]" + o[0]; return o; }));
					}

				}
			}
			for (var prop in o2) {
				// the double check in o2 is because in V8 objects remember keys set to undefined 
				if ((typeof o1[prop] == "undefined") && (typeof o2[prop] != "undefined")) {
					// prop exists in o2 but not in o1
					diff.push(["[" + prop + "]", "undefined", undefined, o2[prop]]); // prop exists in o2 but not in o1

				}
			}
			// if any differences were found, return them
			if (diff.length)
				return diff;
			// return nothing if objects equal
			return undefined;
		}
		// if same type and not null or objects or arrays
		// perform primitive value comparison
		if (o1 != o2)
			return [["", "value", o1, o2]];

		// return nothing if values are equal
		return undefined;
	};

	function comprehensive_comparator(a, b) {
		// a and b are equal if difference is undefined 
		return undefined === differ(a, b);
	};

	cond = (function () {
		var default_comparator = function (a, b) {
			if (!role.isArray(b)) 
					return a === b;
			return default_comparator(a, b[b.indexOf(a)]);
		};
		return function (v) {
			var j = 1, L = arguments.length,
            cmpr = "function" !== typeof cond.comparator ? default_comparator : cond.comparator;
			for (; j < L; j += 2) {
				if (cmpr(v, arguments[j])) return arguments[j + 1];
			}
			return (!arguments[j - 2]) ? undefined : arguments[j - 2];
		};
	} ());
	cond.comparator = null;

	condex = function () {
		try {
			cond.comparator = comprehensive_comparator;
			return cond.apply(arguments);
		} finally {
			cond.comparator = null;
		}
	}

	role = function (o) {
		/// NOTE: for DOM objects function bellow will return "object"
		///       in IE < 9. example: window.alert returns "object"
		return o === undefined
                ? "undefined" : o === null
                ? "null" : (Object.prototype.toString.call(o).match(/\w+/g)[1]).toLowerCase();
	};
	role.isFunction = function (o) {
		return "function" === role(o);
	}
	role.isArray = function (o) {
		return "array" === role(o);
	}
	role.isString = function (o) {
		return "string" === role(o);
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