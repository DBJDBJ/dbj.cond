module("dbj.cond() tests");

test("singulars", function () {

    ok(!!dbj, "dbj is defined");

    function testera(call, exp, msg) {
        strictEqual(
            eval(call), exp,
            msg || ('PASSED :: ' + call + " // => " + exp)
            );
    }

    var x = 1;
    testera('dbj.cond(1, 1, "1", "!")', '1');
    testera('dbj.cond(1, 0, "1", "!")', '!');
    testera('dbj.cond(true, false, "1", "!")', '!');
    testera('dbj.cond(true, 1 == 2, "1", "!")', '!');
    testera('dbj.cond(true, 1 == 1, "1", "!")', '1');

});

