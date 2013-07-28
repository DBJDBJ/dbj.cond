
var test = require("tape");
var colors = require('colors');
var dbj = require("../dbj.cond.js").dbj ;


function testera(call_, exp, msg) {

        multi_test.TAPE.deepEqual(
            eval(call_), exp,
            msg || (call_ + " // => " + exp)
            );
    }

test.x = test.v = null;
    /*
    precondition: x !== v
    */
    function test_for_not_equality(x, v) {

        test.x = x; test.v = v;

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

        testera('dbj.cond(test.x, test.v, "EQ", "!")', "EQ");
        testera('dbj.cond(true, test.x != test.v, "neq","!")', "!");
        testera('dbj.cond(true, 1 == 2, "NEQ", test.v)', test.v);
        testera('dbj.cond(true, 1 == 1, test.x, "!")', test.x);
    }

    function multi_test(x, v) {
        multi_test.TAPE.plan(8);
                test_for_not_equality(x, v);
                test_for_equality(x);
        multi_test.TAPE.end();
    }
    multi_test.TAPE = null;

    test(" presence of the library ".yellow, function (T) {
        T.plan(2);
                T.ok(!!dbj, "dbj is defined".green );
                T.ok(!!dbj.cond, "dbj.cond is defined".green );
        T.end();
    });

    test(" dbj.cond.comparator => standard ".yellow, function (T) {

        multi_test.TAPE = T;
            /* standard is used by default */
            multi_test(1, 2);
            multi_test("Alpha", "Beta");
            multi_test(true, false);
            multi_test(3.14, 2.34);
    });

    dbj.cond.comparator = dbj.compare.deep;

    test(" dbj.cond.comparator => dbj.compare.deep ".yellow, function (T) {

        multi_test.TAPE = T;
        multi_test({}, { 1: 2 });
        multi_test({ "Alpha": 1 }, { "Beta": 2 });
        multi_test([true, true], [false, false]);
        multi_test([3, 2], [2, 3]);

    });

    dbj.cond.comparator = dbj.compare.multi;

    test(" dbj.cond.comparator => dbj.compare.multi ".yellow, function (T) {

        multi_test.TAPE = T;
        multi_test({}, [{ 1: 2 }]);
        multi_test([{ "Alpha": 1 }], { "Beta": 2 });
        multi_test([[true, true], 3], [false, false]);
        multi_test([3, 2], [true, [3, 2]]);

    });
