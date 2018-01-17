/**
 * (c) 2018 dbj.org
 * dbj.cond quick testing in the node environment
 */
const cfg = require('../package.json');
const test = require("tape");
const colors = require('colors');
const dbj = require("../dbj.cond.js") ;
const dbj_comparators = require("dbj.cond.comparators");
/*
   at this point the situation is:

   dbj = {
       core   : { ... },
       cond   : { ... },
       compare: { ... }
   }
*/

colors.setTheme({
    silly: 'rainbow',    input: 'grey',    verbose: 'cyan',    prompt: 'grey',    info: 'green',    data: 'grey',
    help: 'cyan',    warn: 'yellow',    debug: 'blue',    error: 'red'
});
/*
 * just show the pakckage versions
 */
test(("\t" + cfg.name + " VERSION ").red, function (T) {
    T.plan(1);
    T.ok('undefined' != typeof cfg, ("\t\t\t" + cfg.version + "\n").warn);
});
/**
 * Multi purpose test execution with showing the expression executed too
 * @param {any} call_ -- the javascript expression
 * @param {any} exp   -- expected outcome
 * @param {any} msg   -- message
 */
function testera(call_, exp, msg) {
    /**
     * Return the results of the in-line anonymous function we .call with the passed context
     * @param {any} js       -- code to be evaulated
     * @param {any} context  -- in which context
     */
    function evalInContext(js, context) {
        return function () { return eval(js); }.call(context);
    }

    try {
        /* uing the tape deep equal comparator */
        testera.TAPE.deepEqual(
            evalInContext(call_, testera.context ), exp,
            (msg || (call_ + " // => " + exp)).info
        );
    } catch (x) {
        testera.TAPE.comment(("\nEXCEPTION while evaluating: \n" + call_ + "\n" + x.message).yellow);
    }
};
// must set before using from inside tape tests
testera.TAPE = null;
// this allows var's created on the level of this module to be used
// for eval expressions
testera.context = module;

    /*
    precondition: x !== v
    */
function test_for_not_equality(x, v) {
    /*
        we must make arguments reachable so that internal eval can use them
        it might be cleaner to do  testera.context = test_for_not_equality;
    */
    module.x = x;
    module.v = v;
    testera('dbj.cond(module.x, module.v, "x eq v", "!")', "!");
    testera('dbj.cond(true, module.x != module.v, "neq","!")', "neq");
    }
    /*
    precondition: x === v
    */
    function test_for_equality(x, v) {
    /* we must make arguments reachable so that internal eval can use them */
        module.x = x;
        module.v = v;
        testera('dbj.cond(module.x, module.v, "EQ", "!")', "EQ");
        testera('dbj.cond(true, module.x != module.v, "neq","!")', "!");
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
dbj.cond must be able to use any comparator.
for example https://github.com/substack/node-deep-equal

NOTE: dbj.compare.deep; has been removed as of 3.0.3, use 'deep-equal' instead
*/
const deepEqual = require('deep-equal');

test("\nGoing to use node js assert 'deep-equal' module\n Testing for inequality".yellow, function (T) {
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
dbj.compare.arr and dbj.compare.multi , are meant for arrays only
they also use dbj.cond.secondary_comparator for actualy comparing the array elements
this allows for powerfull combinations that deliver powerfull comparison abilities
*/
    test(" \nArray comparator testing".yellow, function (T) {

        dbj.cond.comparator = dbj.compare.arr;
        // simple strict equality default is used
        // depending on more comples uses cases it might be needed here
        // for realy powerfull comparisons please see the usage of
        // 'multi' bellow
        // 
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

    test(" \nThe 'multi' array comparator testing".yellow, function (T) {

        dbj.cond.comparator = dbj.compare.multi;
        // use deepEqual for comparing array elements
        // which means 'anything' can be compared
        // like in the tests bellow
        dbj.cond.secondary_comparator = deepEqual;

        T.plan(3);
        T.ok(
            // compare arrays for equality
            dbj.cond(
                [1, 2],
                [3, 2], false,
                [1, 2], "Works!"
                , false
            ), "Works!" );

        T.ok(
            // lookup into the array also works
            // input val array is 'looked up' 
            dbj.cond(
                [1, 2],
                [3, 2], false,
                ['2d', [1, 2]], "Works!"
                , false
            ), "Works!"); 
        // [1,2] is found in ['2d', [1,2]]

        T.ok(
            // lookup from the array too
            // aka 'reverse' lookup
            dbj.cond(
                ['2d', [1, 2]],
                [3, 2], false,
                [1, 2], "Works!"
                , false
            ), "Works!");
    });

/* EOF */