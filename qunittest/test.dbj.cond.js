(function (undefined) {

    module("dbj.cond() ");

    function testera(call_, exp, msg) {
        strictEqual(
            eval(call_), exp,
            msg || ('PASSED :: ' + call_ + " // => " + exp)
            );
    }

    test.x = test.v = null;

    /*
    precondition: x !== v
    */
        function test_for_not_equality(x, v) {

        test.x = x; test.v = v;

        ok(x !== v, "-------------------------------------------------------------| Test with: "
            + JSON.stringify(x) + ", and " + JSON.stringify(v));

        testera('dbj.cond(test.x, test.v, "x eq v", "!")', "!");
        testera('dbj.cond(true, test.x != test.v, "neq","!")', "neq");
        testera('dbj.cond(true, 1 == 2, "1", test.v)', test.v);
        testera('dbj.cond(true, 1 == 1, test.x, "!")', test.x);
    }
    /*
    precondition: x === v
    */
        function test_for_equality(x) {

            test.x = test.v = x;

            ok(test.x === test.v, "-------------------------------------------------------------| Test with: "
                + JSON.stringify(test.x) + ", and " + JSON.stringify(test.v));

            testera('dbj.cond(test.x, test.v, "EQ", "!")', "EQ");
            testera('dbj.cond(true, test.x != test.v, "neq","!")', "!");
            testera('dbj.cond(true, 1 == 2, "NEQ", test.v)', test.v);
            testera('dbj.cond(true, 1 == 1, test.x, "!")', test.x);
        }

        function multi_test(x, v)
        {
            test_for_not_equality(x, v);
            test_for_equality(x);
        }

    test(" presence of the library ", function () {
        ok(!!dbj, "dbj is defined");
        ok(!!dbj.cond, "dbj.cond is defined");
    });

    test(" dbj.cond.comparator => standard ", function () {
        /* standard is used by default */
        multi_test(1, 2);
        multi_test("Alpha", "Beta");
        multi_test(true, false);
        multi_test(3.14, 2.34);

    });

    dbj.cond.comparator = dbj.compare.deep ;

    test(" dbj.cond.comparator => dbj.compare.deep ", function () {

        multi_test({}, { 1: 2 });
        multi_test({ "Alpha": 1 }, { "Beta": 2 });
        multi_test([true, true], [false, false]);
        multi_test([3, 2], [2, 3]);

    });

    dbj.cond.comparator = dbj.compare.multi ;

    test(" dbj.cond.comparator => dbj.compare.multi ", function () {

        multi_test({}, [{ 1: 2 }]);
        multi_test([{ "Alpha": 1 }], { "Beta": 2 });
        multi_test([[true, true], 3], [false, false]);
        multi_test([3, 2], [true, [3, 2]]);

    });

}());