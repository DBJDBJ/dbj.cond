/*
(c) dbj
place for generic comparatros
dependancy: dbj
*/
(function (dbj, undefined) {
    "use strict";
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
    
    this this test
    equal_arrays([1, 2, , 3], [1, 2, 3]); // => false
    has to be satisfied
    */
    function has(element, index) {
        return this[index] === element;
    }

    function equal_arrays(a, b) {
        return (a.length === b.length) && a.every(has, b) && b.every(has, a);
    }

    /* optimised versions of the above */
    function equal_arrays_opt (a, b) {
        return
        (a.length === b.length) &&
        a.every(function (e, i) { return e === b[i]; }) &&
        b.every(function (e, i) { return e === a[i]; });
    }


}(dbj));