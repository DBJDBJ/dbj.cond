
const cfg = require('../package.json');
const test = require("tape");
const colors = require('colors');
const dbj = require("../dbj.cond.js") ;
const dbj_comparators = require("../dbj.cond.comparators.js") ;

colors.setTheme({
    silly: 'rainbow',    input: 'grey',    verbose: 'cyan',    prompt: 'grey',    info: 'green',    data: 'grey',
    help: 'cyan',    warn: 'yellow',    debug: 'blue',    error: 'red'
});

test(("\t" + cfg.name + " VERSION ").red, function (T) {
    T.plan(1);
    T.ok('undefined' != typeof cfg, ("\t\t\t" + cfg.version + "\n").warn);
});

function testera(call_, exp, msg) {

    function evalInContext(js, context) {
        //# Return the results of the in-line anonymous function we .call with the passed context
        return function () { return eval(js); }.call(context);
    }

    try {
        testera.TAPE.deepEqual(
            evalInContext(call_, testera.context ), exp,
            (msg || (call_ + " // => " + exp)).info
        );
    } catch (x) {
        testera.TAPE.comment(("\nEXCEPTION while evaluating: \n" + call_ + "\n" + x.message).yellow);
    }
};

testera.TAPE = null;
// this allows var's created on the level of this module to be used
// for eval expressions
testera.context = module;

    /*
    precondition: x !== v
    */
function test_for_not_equality(x, v) {
    /* we make arguments globaly reachable so that eval can use them */
    module.x = x;
    module.v = v;
    testera('dbj.cond(module.x, module.v, "x eq v", "!")', "!");
    testera('dbj.cond(true, module.x != module.v, "neq","!")', "neq");
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

    test("\npresence of the library ".yellow, function (T) {
        T.plan(2);
        T.ok('undefined' != typeof dbj, "dbj is defined".green);
        T.ok('undefined' != typeof dbj.cond, "dbj.cond is defined".green );
    });

    /* standard is used by default */

    test("\nGoing to use dbj.cond.comparator standard \n test for equality ".yellow, function (T) {

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
const deepEqual = require('deep-equal');

test("\nGoing to use node js assert deep-equal module\n Testing for inequality".yellow, function (T) {
    dbj.cond.comparator = deepEqual; // swap
    testera.TAPE = T;
        T.plan(9);
        T.ok(dbj.cond.comparator == deepEqual, "Switched to comparator deepEqual ".cyan );
    test_for_not_equality({}, { 1: 2 });
    test_for_not_equality({ "Alpha": 1 }, { "Beta": 2 });
    test_for_not_equality([true, true], [false, false]);
    test_for_not_equality([3, 2], [2, 3]);

    });
/*
NOTE: dbj.compare.deep; has been removed as of 3.0.3, use 'deep-equal'

dbj.compare.arr and dbj.compar.multi are for arrays only
*/
    test(" \nArray comparator testing".yellow, function (T) {

     dbj.cond.comparator = dbj.compare.arr;
     T.plan(4);
     T.ok(
          deepEqual(
                dbj.cond.comparator, dbj.compare.arr
    ), "Switched to dbj.compare.arr".cyan);

    T.comment("\nBoth the input and the value to check against the input should be arrays\n");

    T.comment('\ndbj.cond([{}], [{}], "found", [], "empty", "otherwise") ===  "found"'.cyan);
    T.ok(dbj.cond([{}], [{}], "found", [], "empty", "otherwise"),
            "found", " returned " );

    T.comment('\ndbj.cond([], [[[]]], "found", [], "empty", "otherwise") ==  "empty"'.cyan);
    T.ok(dbj.cond([], [[[]]], "found", [], "empty", "otherwise"),
        "empty", " returned " );

    T.comment('\ndbj.cond([], [[[]]], "found", [13], "empty", "otherwise") == "otherwise"'.cyan);
    T.ok(dbj.cond([{}], [[[]]], "found", [13], "empty", "otherwise"),
        "otherwise", " returned " );

    });
/* EOF */