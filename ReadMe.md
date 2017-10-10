## dbj.cond()  
  
(c) 2009-2017 .. and beyond, by dbj.org  
 Licensed under the MIT (MIT-LICENSE.txt)  
   
 An conditional coding abstraction inspired with [LISP (cond ... ) and (case ...)](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) statements.
 Non-trival conditional logic coding, but still clean code with no complex if/else cascades and with no switch(). Call syntax:  
 ```javascript
       dbj.cond( input_val,
	             chechk_val_1, outcome_1,
	             chechk_val_2, outcome_2,
				 default_outcome ) ;
      /*
	  returns outcome_1 if input_val === check_val_1
	  returns outcome_2 if input_val === check_val_2
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
        var dbj = require("dbj.cond").dbj ;
				dbj.cond(1,1,"1","!") //=> "1"
 ```
 ### Browser usage  
 ```javascript
                // include dbj.cond.js
				dbj.cond(1,1,"1","!"); //=> "1"
 ```
 Standard comparison is one of strict equality. 
 ### Beyond basic usage  
 User defined comparators are probably the most powerfull feature of dbj.cond(). JS switch() stement uses "===" as the only possible comparator. Using dbj.cond() it is easy to change the comparator used.
 To change the standard (strict equality) comparator:   
 ```javascript
        // switching to user defined comparator
        dbj.cond.comparator = function myComparator (a,b ) { return a != b ; };
				dbj.cond(1,1,"1","!") //=> "!"

		// switching back to standard comparator
        dbj.cond.comparator = dbj.compare.standard ;
				dbj.cond(1,1,"1","!") //=> "1"
 ```
 For reasons of performance dbj.cond.comparator is not checked for validity. 
 For using dbj.cond() with complex JS types two powerfull non-standard comparators are provided, "deep" and "multi". Usage:   
 ```javascript
       // use dbj deep equality comparator
       dbj.cond.comparator = dbj.compare.deep;
	   // compare objects
	   	   dbj.cond({ "Alpha": 1 }, 
		            { "Beta": 2 }, false, 
					{ "Alpha": 1 }, "Works!", 
					false ); //=> "Works!"

           // use dbj single to/from array comparator
		   // which also does deep equality comparisons
	       dbj.cond.comparator = dbj.compare.multi;
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
 ### NOTE  
 It is to be the reference source and knowledge base, but right now Wiki is work-in-progress, mainly to sync it with a code 
 after numerous changes and re-thinking sessions. 
 After this note is removed, Wiki will be released as the reference text on dbj.cond()

 
 
  
  
---------------------------------------------------------------------  
### &copy; 2017 [![dbj();](http://dbj.org/wp-content/uploads/2015/12/cropped-dbj-icon-e1486129719897.jpg)](http://www.dbj.org "dbj")  
