/*
(c) 2011 - 2018 by DBJ.ORG
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.
*/
(function (dbj,undefined) {

    var /* coercion to Int32 as required by asm.js */
        toInt32 = function (v_) {
            return v_ | 0;
        } ,
        isEven = function (value) { return (toInt32(value) % 2 == 0); };

    /*
    Terminology and arguments requirements:

            dbj.cond( input_value,
                      check_val, out_val, // any number of check/out values
                      default_val ) ;

    Number of arguments must be even. 
	Standard  cond allows users to handle values with other values of the same type.
    Standard comparator is '==='. Order is "first found, first served". Example:

	         dbj.cond( 1, 1, "A", 2, "B", "C") //=> "A"

Arrays as arguments are not part of standard dbj.cond() functionality:  

	         dbj.cond( 1, [3,2,1],"A", 2, "B", "C") 
             //=> "C" , single and array can not be compared 
             // 1 === [1,2,3] => false

	Only intrinsic scalar types can be compared meaningfully. For example
	dbj.cond( /./, /./, "A", /$/, "B", "C") 
    //=> "C",  /./ === /./ => false

	*/
	dbj.cond = function ( v ) {

        var default_comparator_ = dbj.cond.comparator;
        var default_secondary_comparator_ = dbj.cond.secondary_comparator;

	    dbj.cond = function (v) {
            if (!isEven(arguments.length)) throw "dbj.cond() not given even number of arguments";

            var comparator = dbj.cond.comparator || default_comparator_;
            var secondary_comparator = dbj.cond.secondary_comparator || default_secondary_comparator_;

			 var  j = 1, L = arguments.length;
			for (; j < L; j += 2) {
                if (true === comparator(v, arguments[j], secondary_comparator )) return arguments[j + 1];
			}
			return arguments[L - 1];
	    };
	    /*
        be sure to pass all the arguments on the first run
        which is the only time the line bellow will be executed
        */
	    return dbj.cond.apply(this, Array.prototype.slice.call(arguments,0));
    };
    dbj.cond.strict_eq = function (a, b) { return a === b; };
    dbj.cond.comparator = dbj.cond.strict_eq;
    /* jokers can fiddle with the above and set it to null */
    dbj.cond.secondary_comparator = dbj.cond.strict_eq;

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
