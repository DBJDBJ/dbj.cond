/*

MIT,GPL (c) 2011 by dbj.org 

A little front-end to qunit, depends on:
http://github.com/jquery/qunit/raw/master/qunit/qunit.css
http://github.com/jquery/qunit/raw/master/qunit/qunit.js

*/
/* ensure no dependancy on dbj.lib.js */
    (function () {
        var HOP = Object.prototype.hasOwnProperty;
        dbj = {
        toString : function () { return "tiny dbj  lib for qunit testing. $Revision: 6 $" },
        try_n_times: function (callback, times_, delay_) {
            /*
            try N times with delay between, 
            break if callback returns true
            defaults:    
            no of times : 10     
            uSec between times : 1 
            */
            var tid, times = times_ || 10, delay = delay_ || 1;
            function _internal() {
                if (tid) clearInterval(tid); tid = null;
                if ((times_--) < 1) {
                    return;
                }
                if (false === callback()) {
                    return tid = setInterval(_internal, delay);
                }
                return;
            }
            return _internal();
        },
        "addListener": (function (eventName, handler, control) {
            function fetch_element(el) {
                if (el === String(control)) return document.getElementById(el);
                else
                    return el || window;
            }

            if (window.addEventListener) //Standard W3C
                return function (eventName, handler, control) { return fetch_element(control).addEventListener(eventName, handler, false); }

            if (window.attachEvent) //IExplore
                return function (eventName, handler, control) { return fetch_element(control).attachEvent("on" + eventName, handler); }

            return false;
        } ()),
       /*
        return undefined on any object that is not "object" or "function"
        also ignore the possible prototype chain
        */
        "isEmpty": function(object) {
            if (typeof object !== 'object' && typeof object !== 'function') return true;
            for (var name in object) {
                if (HOP.call(object, name)) {
                    return false;
                }
            }
            return true;
        }
    }
}());
//-------------------------------------------------------------------------------------
// DBJ qunit front-end
    (function (window, undefined) {

        var call_in_loop = function (fp, howlong) {
            var retval = null, j = howlong || 1000;
            while (j--) { retval = fp(); } return retval;
        }

        window.TEST = {
            test: function (title, tar) {
                if (!tar || !tar.length || (!tar[0].length)) {
                    throw "TEST.test() second argument has to be : [[function, expected_value,loop_length],...]";
                }
                test(
                  title + ", " + tar.length + " tests.",
                  function () {
                      expect(tar.length);
                      for (var fun, expected, looplen, L = 0; L < tar.length; L++) {
                          looplen = tar[L][2] || 1;
                          expected = tar[L][1];
                          fun = tar[L][0];
                          if (undefined === expected) throw "TEST.test(): expected retval not found in a input where it should be?";
                          if ("function" !== typeof fun) throw "TEST.test(): function not found in a input where it should be?";
                          equals(
                             call_in_loop(function () {
                                 return fun();
                             }, looplen),
                             expected,
                             (looplen > 1 ? looplen + " x " : "") + ("" + fun)/*.replace(/^.+\{/, "").replace(/\}.*$/, "")*/ + " "
                         );
                      }
                  }
                 );
            },
            normalize_input: function (bad_arr) {
                /* 
                transform INTO this  :
                [ [function () {}, expected, loopsize ],[function () {}, expected, loopsize ] ]
                from this format :
                [ [function_body_string, expected, loopsize ],[function_body_string, expected, loopsize ] ]
                Why ? 
                TEST.test second argument is NOT a legal JSON.
                It is much easier to write tests in this format, but that is bad JSON since it contains functions.
                in the future we might receive test input as a JSON  string from the server side. 
                And bad JSON will not be accepted by JSON.parse()
                Purpose of this method is to normalize input  from the legal JSON format
                */

                var retval = [], L = bad_arr.length, fun, expected, looplen;
                while (L--) {
                    fun = bad_arr[L][0];
                    expected = bad_arr[L][1];
                    looplen = bad_arr[L][2] || 1;
                    if (!fun || "string" !== typeof fun) throw "TEST.normalize_input(): function source not found where it should be ?";
                    if (!expected) throw "TEST.normalize_input(): expected retval not found where it should be ?";
                    // transform the function source into the function
                    // only no-argument anonimous functions are dealt with
                    fun = new Function(fun);
                    if (!fun || "function" !== typeof fun) throw "TEST.normalize_input(): function transformation went wrong.";
                    retval.push(
                         [fun, expected, looplen]
                    );
                }
                return retval;
            },
            load: function (tests) {
                for (var module_name in tests) {
                    module(module_name);
                    for (var test_name in tests[module_name]) {
                        this.test(test_name, tests[module_name][test_name]);
                    }
                }
            }
        };
    })(window);
    //-------------------------------------------------------------------------------------
    // tests have to be assigned to "tests" global var
    dbj.addListener("load", function () {

        dbj.try_n_times(function () { return ! dbj.isEmpty(window.QUnit); });

        if (dbj.isEmpty(window.QUnit)) {
            return alert("dbj.qunit TEST object needs QUnit to work");
        }
        if (dbj.isEmpty(window.TEST)) {
            return alert("dbj.qunit TEST object needs global 'TEST' object to work");
        }
        if (dbj.isEmpty(top.tests)) {
            return alert("dbj.qunit TEST object needs global 'tests' object to work");
        }
        try {
            TEST.load(top.tests);
        } catch (x) {
            top.alert("ERROR! from dbj.qunit.js TEST.onload(): " + x + "\n\n" + x.message);
        }
    });
