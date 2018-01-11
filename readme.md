# dbj.cond()  
  
(c) 2009-2018 .. and beyond, by dbj.org  
 Licensed under the MIT (MIT-LICENSE.txt)  
 
 An conditional coding abstraction inspired with [LISP (cond ... ) and (case ...)](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) statements.
 Using this idiom delivers non-trival conditional logic coding, but still clean code with no complex if/else cascades and with no switch(). 
the more u use it. Call syntax:  
 ```javascript
dbj.cond( 
   input_val,
   compare_to_val, outcome_1,
   compare_to_val, outcome_2,
   default_outcome 
  ) ;
/*
returns outcome_1 if input_val === compare_to_val
returns outcome_2 if input_val === compare_to_val
otherwise returns default_outcome

there can be "any" number of check/outcome pairs
*/
```
- Any legal values or expressions are allowed as arguments
- standard comparison of input vs check vals is one of JS strict equality, aka "==="
- processing stops on first comparison yielding true
- There can be any number of check/outcome pairs  
 ### node.js usage  
      npm install dbj.cond
 ```javascript
var dbj = require("dbj.cond") ;
		dbj.cond(1,1,"1","!") //=> "1"
 ```
 ### Browser usage  
 ```javascript
// include dbj.cond.js
dbj.cond(1,1,"1","!"); //=> "1"
 ```
 Standard comparison is one of strict equality. 

 ## Beyond basic usage  

 User defined comparators are probably the most powerfull feature of dbj.cond(). JS switch() stement uses "===" as the only possible comparator. Using dbj.cond() it is easy to change the comparator used.

### Note on update 3.0.0
As from version 3.0.0 we do not package complex comparators with dbj.cond. Complex comparators are powerfull but seldom used. Thus for a very fast and comofrtable usage yuo do not need them and you do not need complaex code behind that is largely unused.
Our complex comparators are still here and working and we do use them indeed. They are just in the separate file (module): dbj.cond.comparators.js .

### Comparators are swappable extensions to dbj.con

Beside our own complex comparators please feel free to use any other available on npm or elsewhere. 
As an example in ./test/index.js we use well known 
<a href="https://github.com/substack/node-deep-equal">'deep-equal'</a> comparator. 

Swappable comparators are very powerfull feature. Just please be sure to understand what is each doing and plan to use it accordingly.

Here are few examples.

 To change the standard (strict equality) comparator:   
 ```javascript
        // switching to user defined comparator to myComparator
        dbj.cond.comparator = function myComparator (a,b ) { return a != b ; };
				dbj.cond(1,1,"1","!") //=> returns "!"

		// switching back to standard comparator
        dbj.cond.comparator = function (a,b ) { return a === b ; }; ;
				dbj.cond(1,1,"1","!") //=> returns "1"
 ```
 For reasons of performance dbj.cond.comparators are not checked for validity. 
 As we said for using dbj.cond() with complex JS types two powerfull non-standard comparators are provided, "deep" and "multi". 
 Usage is this:   
 ```javascript
//
const dbj_comparator = require('dbj.cond.comparators.js');_
// use dbj deep equality comparator
dbj.cond.comparator = dbj_compare.deep;
// compare objects
dbj.cond({ "Alpha": 1 }, 
		{ "Beta": 2 }, false, 
		{ "Alpha": 1 }, "Works!", 
		false ); //=> "Works!"

// use dbj single to/from array comparator
// which also does deep equality comparisons
dbj.cond.comparator = dbj_compare.multi;
// compare arrays for equality
dbj.cond(
	[1,2], 
	[3,2], false, 
	[1,2], "Works!"
		, false 
		); //=> "Works!"

// lookup into the array also works
// input val array is 'looked up' 
dbj.cond(
	[1,2], 
	[3,2]        , false, 
	['2d', [1,2]], "Works!"
				    , false 
		); //=> "Works!"  
	// [1,2] is found in ['2d', [1,2]]

// lookup from the array too
// aka 'reverse' lookup
dbj.cond(
	['2d', [1,2]], 
	[3,2]         , false, 
	[1,2]         , "Works!"
				    , false 
		); //=> "Works!"
```
#### NOTE  
 
This is very minimal documentation and we are aware of that. Please do not hesitate to ask for a suport by mailing to suport@dbj.org
 
---------------------------------------------------------------------  
### &copy; 2018 [![dbj();](http://dbj.org/wp-content/uploads/2015/12/cropped-dbj-icon-e1486129719897.jpg)](http://www.dbj.org "dbj")  
