/*
(c) dbj
place for generic comparatros
dependancy: dbj
*/
(function (dbj, undefined) {
    "use strict";
    /*
    following method is used to implement indexOf() with a user defined comparator

    https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    changed so that it works for "everything" by using user defined
    comparator isntead of "===". also not implemented as array extension 
    single obj argument

    example on how to use this to implement standard indexOf() 

    	if (!dbj.isFunction(dbj.aprot.indexOf))
		dbj.aprot.indexOf = function (searchElement ) {
			return find_index(
                { "array": this, 
                  "searchElement": searchElement,
			      "fromIndex": null,
			      "comparator": function (a, b) { return a === b; }
			});

  example of using user defined comparator

  	    return dbj.comparators.find_index(
            {
                "array": array,
                "searchElement": searchElement,
			    "fromIndex": null,
			    "comparator": dbj.EQ.rathe
		});

}
/*
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
            /* dbj 2011SEP11 replaced simple native '===' with comparator(a,b) */
            if (k in t && comparator(t[k], searchElement)) {
                return k;
            }
        }
        return -1;
    }

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
    
    this is the tough test
                 equal_arrays([1, 2, , 3], [1, 2, 3]); // => false
    that has to be satisfied
    
    function has(element, index) {
        return this[index] === element;
    }

    function equal_arrays(a, b) {
        return (a.length === b.length) && a.every(has, b) && b.every(has, a);
    }
    */
    /* optimised versions of the above */
    function equal_arrays_opt (a, b) {
        return
        (a.length === b.length) &&
        a.every(function (e, i) { return e === b[i]; }) &&
        b.every(function (e, i) { return e === a[i]; });
    }

    /* interface */
    dbj.comparators = {
        /// compare arrays without checking if params are arrays
        eq_arr: function (a, b) {
            return equal_arrays(a, b);
        },
        // compare everything as arrays thus making all single vs array 
        // comparisons with this single function
        any_as_arr: function (a, b) {
            return equal_arrays(
                Array.isArray(a) ? a : [a],
                Array.isArray(b) ? b : [b]
                )
        }
    };

}(dbj));