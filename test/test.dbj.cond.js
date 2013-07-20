(function (undefined) {

    module("dbj.cond() ");

    function testera(call_, exp, msg) {
        strictEqual(
            eval(call_), exp,
            msg || ('PASSED :: ' + call_ + " // => " + exp)
            );
    }

    function test_standard(x, v) {

        test.x = x; test.v = v;

        ok(x !== v, "-------------------------------------------------------------| Test with: "
            + JSON.stringify(x) + ", and " + JSON.stringify(v));

        testera('dbj.cond(test.x, test.v, "x eq v", "!")', "!");
        testera('dbj.cond(test.x, 0, "1", 2, 3, 4, 5, 6, 7, "!")', "!");
        testera('dbj.cond(true, test.x == test.v, "eq","!")', "!");
        testera('dbj.cond(true, 1 == 2, "1", "default outcome")', "default outcome");
        testera('dbj.cond(true, 1 == 1, test.x, "!")', test.x);
    }

    test(" presence of the library ", function () {
        ok(!!dbj, "dbj is defined");
        ok(!!dbj.cond, "dbj.cond is defined");
    });

    test(" dbj.cond.comparator => " + dbj.cond.comparator, function () {

        test_standard(1, 2);
        test_standard("Alpha", "Beta");
        test_standard(true, false);
        test_standard(Math.PI, Math.E);

    });

    dbj.cond.comparator = dbj.EQ.rathe;

    test(" dbj.cond.comparator => dbj.EQ.rathe " , function () {

        test_standard({}, {1:2});
        test_standard({ "Alpha": 1 }, { "Beta": 2 } );
        test_standard([true,true], [false,false]);
        test_standard([Math.PI, Math.E], [Math.E, Math.PI]);

    });

}());