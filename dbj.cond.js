
/*
Copyright 2018 dbj.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied.
See the License for the specific language governing permissions
and limitations under the License.
*/

(function (dbj, undefined) {

    const /* coercion to Int32 as required by asm.js */
        toInt32 = function (v_) {
            return v_ | 0;
        } ,
        isEven = function (value) { return (toInt32(value) % 2 == 0); },
        minArguments = 4 ,
        maxArguments = 512 ;

    /*
    Terminology and arguments requirements:

            dbj.cond( input_value,
                      check_val, out_val, // any number of check/out pairs
                       ...
                       ...
                      default_val ) ;

    Number of arguments must be even. 
	Standard  cond allows users to handle values with other values of the same type.
    Standard comparator is '==='. Order is "first found, first served". Example:

    dbj.cond( 1, 1, "A", 2, "B", "C") //=> "A"

    Arrays as arguments are not part of standard dbj.cond() functionality:  

	dbj.cond( 1, [3,2,1],"A", 2, "B", "C") 
    //=> "C" , single and array can not be ordinarily compared 
    // 1 === [1,2,3] => false

	Only intrinsic scalar types can be compared meaningfully. For example
	dbj.cond( /./, /./, "A", /$/, "B", "C") 
    //=> "C",  because (/./ === /./) yields => false

	*/
    dbj.cond = function (v) {
        if (!isEven(arguments.length)) throw "dbj.cond() not given even number of arguments";
        if (arguments.length < minArguments) throw "dbj.cond() minimal number of arguments is " + minArguments;
        if (arguments.length > maxArguments) throw "dbj.cond() minimal number of arguments is " + maxArguments;

        let comparator = dbj.cond.comparator || default_comparator_;
        let secondary_comparator = dbj.cond.secondary_comparator || default_secondary_comparator_;
        let j = 1;
        const LAST = arguments.length - 3;
        do {
            if (true === comparator(v, arguments[j], secondary_comparator ))
                return arguments[j + 1];
            j += 2;
        } while (!(j > LAST));
            return arguments[arguments.length - 1];
	};
	/*
    */
    dbj.cond.strict_eq = function (a, b) { return a === b; };
    dbj.cond.comparator = dbj.cond.strict_eq;
    // secondary comparator is simply ignored by shallow primary comparators
    dbj.cond.secondary_comparator = dbj.cond.strict_eq;
    /* 
    jokers can fiddle with the above and set it to null
    so we will preserve what we need
    */
    const default_comparator_ = dbj.cond.comparator;
    const default_secondary_comparator_ = dbj.cond.secondary_comparator;

    /* v3.1.3 added */
    dbj.cond.setcmp = function set_return_comparators_ (primary, secondary) {
        if ('function' === typeof primary )
            dbj.cond.comparator = primary;
        if ('function' === typeof secondary)
            dbj.cond.secondary_comparator = secondary;
        return [dbj.cond.comparator, dbj.cond.secondary_comparator];
    };
    /* v3.1.3 added */
    dbj.cond.reset = function reset_comparators() {
        return dbj.cond.setcmp(
            default_comparator_, default_secondary_comparator_
        );
    };

    /*
    export to Node.JS
    (also works in the presence of qUnit "module")
    */
    if ("undefined" != typeof module) {
        module['exports'] = dbj;  // for node js usage
    }

/*--------------------------------------------------------------------------------------------*/
}(function () {
        // for dom env this creates window.dbj
        // for node env this creates module local var
        if ("undefined" == typeof dbj)
            dbj = {}; 
        return dbj;
    }()
  )
);
