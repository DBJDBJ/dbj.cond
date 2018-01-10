
const test = require("tape");
const colors = require('colors');
const dbj = require("../dbj.cond.js") ;
// var dbj = require("../dbj.cond.comparators.js") ;

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});


function testera(call_, exp, msg) {
    try {
        testera.TAPE.deepEqual(
            eval(call_), exp,
            (msg || (call_ + " // => " + exp)).info
        );
    } catch (x) {
        console.log(("\nEXCEPTION while evaluating: \n" + call_ + "\n" + x.stack).error);
    }
};

testera.TAPE = null;

    /*
    precondition: x !== v
    */
function test_for_not_equality(x, v) {
    /* we make arguments globaly reachable so that eval can use them */
    testera.x = x;
    testera.v = v;
    testera('dbj.cond(testera.x, testera.v, "x eq v", "!")', "!");
    testera('dbj.cond(true, testera.x != testera.v, "neq","!")', "neq");
    }
    /*
    precondition: x === v
    */
    function test_for_equality(x, v) {
        testera.x = x;
        testera.v = v;
        testera('dbj.cond(testera.x, testera.v, "EQ", "!")', "EQ");
        testera('dbj.cond(true, testera.x != testera.v, "neq","!")', "!");
    }

    test(" presence of the library ".yellow, function (T) {
        T.plan(2);
                T.ok(!! dbj, "dbj is defined".green );
                T.ok(!! dbj.cond, "dbj.cond is defined".green );
       //  T.end();
    });

    console.log("\ndbj.cond.comparator => standard ".yellow);
            /* standard is used by default */

    test(" test for equality ".yellow, function (T) {

      testera.TAPE = T;
      T.plan(8);
      test_for_equality(2, 2);
      test_for_equality("Alpha", "Alpha");
      test_for_equality(true, true);
      test_for_equality(3.14, 3.14);
    });

    test(" test for inequality ".yellow, function (T) {

        testera.TAPE = T;
        T.plan(8);
        test_for_not_equality(1, 2);
        test_for_not_equality("Alpha", "Beta");
        test_for_not_equality(true, false);
        test_for_not_equality(3.14, 2.34);
    });


/*
must be able to use also https://github.com/substack/node-deep-equal
that means te test bellow must pass while using it too ...
*/
/*
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
*/