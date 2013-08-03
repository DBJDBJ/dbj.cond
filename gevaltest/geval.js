
(function (dbj,undefined) {

    var    odd = function (n) { return (n == parseFloat(n)) && (n % 2 == 1); },
    
    hotpo = function (x, steps) {
        return eval(dbj.cond(true,
            x == 1, "steps",
            odd(x), "hotpo( 1 + ( x * 3 ), 1 + steps )",
                    "hotpo ( x / 2, 1 + steps)"
        ));
    },

    /* can't make this work as eval() does. i.e. can't make it to execute in the context of the caller */
        evil = function (x) {
            try {
                return "string" == typeof x ? eval("(" + x + ")") : x;
            } catch (xx) {
                alert(xx.stack);
                return undefined;
            }
        },

        dbj_condeval = function (v) {
            var j = 1, L = arguments.length;
            for (; j < L; j += 2) {
                if (EQ(
                        eval(v),
                        eval(arguments[j])
                )
              ) return eval(arguments[j + 1]);
            }
            return eval(arguments[j - 2]) || undefined;
        },

        EQ = function (a, b) { return a == b; },
        x = 7;

    module(" ");

    test(" hotpo(" + x + ", 0) ", function () {
        ok(hotpo(x, 0), 16);
    });


    module(" ");

    test("dbj_condeval('true', 'odd(x)', 'hotpo(x,0)', '\"EVEN!\"') ", function () {
        ok(dbj_condeval('true', 'odd(x)', 'hotpo(x,0)', '"EVEN!"'), 16);
    });


}(dbj || {}));

    function hidden_stuff() {
        /* http://perfectionkills.com/global-eval-what-are-the-options/ */
        var geval = function (expression) {
            return (1, eval)(expression);
        };
        /* http://osteele.com/javascripts/functional */
        String.prototype.lambda = function () { var e = [], t = this, n = t.ECMAsplit(/\s*->\s*/m); if (n.length > 1) { while (n.length) { t = n.pop(); e = n.pop().split(/\s*,\s*|\s+/m); n.length && n.push("(function(" + e + "){return (" + t + ")})") } } else if (t.match(/\b_\b/)) { e = "_" } else { var r = t.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m), i = t.match(/[+\-*\/%&|\^\.=<>!]\s*$/m); if (r || i) { if (r) { e.push("$1"); t = "$1" + t } if (i) { e.push("$2"); t = t + "$2" } } else { var s = this.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, "").match(/([a-z_$][a-z_$\d]*)/gi) || []; for (var o = 0, u; u = s[o++];) e.indexOf(u) >= 0 || e.push(u) } } return new Function(e, "return (" + t + ")") }; String.prototype.lambda.cache = function () { var e = String.prototype, t = {}, n = e.lambda, r = function () { var e = "#" + this; return t[e] || (t[e] = n.call(this)) }; r.cached = function () { }; r.uncache = function () { e.lambda = n }; e.lambda = r }; String.prototype.apply = function (e, t) { return this.toFunction().apply(e, t) }; String.prototype.call = function () { return this.toFunction().apply(arguments[0], Array.prototype.slice.call(arguments, 1)) }; String.prototype.toFunction = function () { var e = this; if (e.match(/\breturn\b/)) return new Function(this); return this.lambda() }; Function.prototype.toFunction = function () { return this }; Function.toFunction = function (e) { return e.toFunction() }; String.prototype.ECMAsplit = "ab".split(/a*/).length > 1 ? String.prototype.split : function (e, t) { if (typeof t != "undefined") throw "ECMAsplit: limit is unimplemented"; var n = this.split.apply(this, arguments), r = RegExp(e), i = r.lastIndex, s = r.exec(this); if (s && s.index == 0) n.unshift(""); r.lastIndex = i; return n }

        function print(s) { setTimeout(function () { document.body.innerHTML += "<li>" + s + "</li>"; }, 1); };
        function printerr(x) { console.error(x); print("<span style='color:red;'>" + x + "</span>") };
        function prints(x) { var rez; try { rez = eval.call(this, x); } catch (xx) { printerr(xx); }; print(x + " => " + rez); };
        function isNumber(n) { return n == parseFloat(n); };
        function even(n) { return isNumber(n) && (n % 2 == 0); };
        function odd(n) { return isNumber(n) && (n % 2 == 1); }
    }
