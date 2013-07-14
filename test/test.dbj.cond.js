/*
tests for defauly.htm + dbj.qunit.js
*/
top.tests = {
/*
    "Basic dbj.condxx()" : {
		"dbj.condeq() for the simplest native equality comparisons":
		[
		    [function () { return dbj.condeq(1, 1, "A", 2, "B", "C"); }, "A"],
            [function () { return dbj.condeq(7, 1, "A", 2, "B", "C"); }, "C"],
        ],
		"dbj.condnq() for the simplest native non-equality comparisons":
		[
		    [function () { return dbj.condnq(1, 1, "A", 2, "B", "C"); }, "B"],
            [function () { return dbj.condnq(1, 1, "A", 1, "B", "C"); }, "C"],
        ],
		"dbj.condgt() for the simplest native greater than comparisons":
		[
		    [function () { return dbj.condgt(1, 1, "A", 2, "B", "C"); }, "C"],
            [function () { return dbj.condgt(7, 7, "A", 2, "B", "C"); }, "B"],
        ],
		"dbj.condlt() for the simplest native less than comparisons":
		[
		    [function () { return dbj.condlt(1, 1, "A", 2, "B", "C"); }, "B"],
            [function () { return dbj.condlt(7, 7, "A", 4, "B", "C"); }, "C"],
        ]
	},
*/
	"dbj.cond() by default uses complex comparator for equality comparisons of any types": {  
		"dbj.cond() simpler uses": [
                [function () { return dbj.cond(1, [3, 2, 1], "A", 7, "B", "C"); }, "A"],
                [function () { return dbj.cond(7, [3, 2, 1], "A", 7, "B", "C"); }, "B"],
                [function () { return dbj.cond(9, [3, 2, 1], "A", 7, "B", "C"); }, "C"],
                [function () { return dbj.cond([4, 3, 2, 1], [3, 2, 1], "A", 7, "B", "C"); }, "C"]
            ],
		"dbj.cond() more complex usage": [
           [function () {
               /* dates comparison */
               var d0 = new Date(1959,6,3), d1 = new Date(1959,6,3), d2 = new Date(1959, 7, 3);
           	return dbj.cond(d0, d1, "A", d2, "B", "C");
           }, "A"],
           [function () {
               /* regex to regex comparison */
               return dbj.cond(/./, /./, "A", /.[a,A]?/, "B", "C");
           }, "A"],
           [function () {
               /* simple array to array comparison */
               return dbj.cond([1, 2, 3], [1, 2, 3], "A", 7, "B", "C");
           }, "A"],
           [function () {
               /* input array lookup in multidimensional array */
               return dbj.cond([1, 2, 3], [1, [2, 3], [1, 2, 3]], "A", 7, "B", "C");
           }, "A"],
           [function () {
               /* comparing objects */
               return dbj.cond({ a: 7 }, [1, 2, 3], "A", { a: 7 }, "B", "C");
           }, "B"],
		]
	}, // eof module
	"Simple cond() :: ": {
		" basic usage": [
                [function () { return dbj.scond(1,1,"123","0"); }, "123"],
                [function () { return dbj.scond(true, true, "123", "0"); }, "123"],
                [function () {
                    /* this switch() can not do */
                    var x = 1;
                    return dbj.scond(false, x > 2, "x > 2", x < 1, "x < 1", "0");
                }, "x > 2"],
                [function () {
                    /* simple cond can not compare arrays/singulars pairs */
                    return dbj.scond(1, [1, 2, 3], "OK", "0");
                }, "0"],
                [function () {
                    return dbj.scond([1, 2, 3], 1, "OK", "0");
                }, "0"],
                [function () {
                    return dbj.scond([1, 2, 3], [1, 2, 3], "OK", "0");
                }, "0"]
		],
		" using user defined comparator ": [
                [function () {
                    dbj.scond.comparator = dbj.EQ.rathe;
                    return  dbj.scond([1, 2, 3], [1, 2, 3],                 "1", "0") +
                            dbj.scond([[1], [1, 2, 3]], [[1], [1, 2, 3]],   "2", "0") +
                            dbj.scond(/\w+/, /\w+/,                         "3", "0") +
                            dbj.scond(new Date(1959,6,3), new Date(1959,6,3),"4", "0") +
                            dbj.scond({ "a": 1 }, { "a": 1 },               "5", "0");
                   
                }, "12345" ]
		],
		" array vs single use cases": [
                [function () { return dbj.scond(true, dbj.EQ.default_comparator(1, [1, 2, 3]), "OK", "0"); }, "OK"],
                [function () { return dbj.scond(true, dbj.EQ.default_comparator([1, 2, 3], 1), "OK", "0"); }, "OK"],
                [function () { return dbj.scond(true, dbj.EQ.default_comparator([1, 2, 3], [1,2,3]), "OK", "0"); }, "OK"]
		],
		" multi arguments comparator usage": [
                [function () { return dbj.scond(true, dbj.EQ.rathe([1,2,3],[1, 2, 3], [3, 2, 3]), "OK", "0"); }, "0"],
                [function () { return dbj.scond(true, dbj.EQ.rathe(/./, /./, /./), "OK", "0"); }, "OK"],
                [function () { return dbj.scond(true, dbj.EQ.rathe(new Date(1959, 6, 3), new Date(1959, 6, 3), new Date(1959, 6, 3)), "OK", "0"); }, "OK"],
                [function () { return dbj.scond(true, dbj.EQ.rathe({"a":1}, { "a": 1 }, { "a": 1 }), "OK", "0"); }, "OK"]
		]
	}
}         // eof tests
