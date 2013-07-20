(function (undefined) {

    module("dbj.cond() ");

    function testera(call_, exp, msg) {
        strictEqual(
            eval(call_), exp,
            msg || ('PASSED :: ' + call_ + " // => " + exp)
            );
    }

    function test_for_not_equality(x, v) {

        test.x = x; test.v = v;

        ok(x !== v, "-------------------------------------------------------------| Test with: "
            + JSON.stringify(x) + ", and " + JSON.stringify(v));

        testera('dbj.cond(test.x, test.v, "x eq v", "!")', "!");
        testera('dbj.cond(test.x, 0, "1", 2, 3, 4, 5, 6, 7, "!")', "!");
        testera('dbj.cond(true, test.x != test.v, "neq","!")', "neq");
        testera('dbj.cond(true, 1 == 2, "1", test.v)', test.v);
        testera('dbj.cond(true, 1 == 1, test.x, "!")', test.x);
    }

    test(" presence of the library ", function () {
        ok(!!dbj, "dbj is defined");
        ok(!!dbj.cond, "dbj.cond is defined");
    });

    test(" dbj.cond.comparator => standard ", function () {

        test_for_not_equality(1, 2);
        test_for_not_equality("Alpha", "Beta");
        test_for_not_equality(true, false);
        test_for_not_equality(3.14, 2.34);

    });

    dbj.cond.comparator = dbj.compare.deep ;

    test(" dbj.cond.comparator => dbj.compare.deep ", function () {

        test_for_not_equality({}, {1:2});
        test_for_not_equality({ "Alpha": 1 }, { "Beta": 2 } );
        test_for_not_equality([true,true], [false,false]);
        test_for_not_equality([3, 2], [2, 3]);

    });

    dbj.cond.comparator = dbj.compare.multi ;

    test(" dbj.cond.comparator => dbj.compare.multi ", function () {

        test_for_not_equality({}, [{ 1: 2 }]);
        test_for_not_equality([{ "Alpha": 1 }], { "Beta": 2 });
        test_for_not_equality([[true, true],3], [false, false]);
        test_for_not_equality([3, 2], [true,[3, 2]]);

    });

}());