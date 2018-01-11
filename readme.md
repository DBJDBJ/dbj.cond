<img src="http://dbj.org/wp-content/uploads/2013/07/comparator-e1373486780369.jpg" alt="dbj.cond() by dbj.org" width="100%" align="left" hspace="5px" />

# dbj.cond() 

## Versions 3.0.0 and above
  
(c) 2009-2018 .. and beyond, by dbj.org  
 Licensed under the MIT (MIT-LICENSE.txt) 

Note: for tests and the rest please always visit the <a href="https://github.com/DBJDBJ/dbj.cond" target="_blank">project on the Github</a>. 

Note: for version 2.0.1 please use the required (pun intended) require syntax:
```javascript 
   const dbj = require('dbj.cond@2.0.1').dbj ;
```
 
dbj.cond is an coding abstraction inspired with [LISP (cond ... ) and (case ...)](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) statements.
Using this idiom delivers <a href="https://dbj.org/javascript-with-no-ifs/" target="_blank"> non-trival conditional logic </a> coding, but still clean source with no complex if/else cascades and with no switch(). 
The more you use it, the more it becomes clear why you have choosen it. 
Call syntax:  

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

 **node.js usage**  

 **```npm install dbj.cond```**

 ```javascript
const dbj = require("dbj.cond") ;
dbj.cond(1,1,"1","!") //=> "1"
 ```
 **Browser usage**  
 ```javascript
//
// include dbj.cond.js
dbj.cond(1,1,"1","!"); 
//=> returns "1"
// it has stopped on the first match to the input value
// that was number 1
//
 ```

**Important: behaviour**

Standard and default comparison used is one of strict equality. This is the function used to compare this first 
argument to the first element of the pairs that follow. The last argument is the fallback value, used if there is no match. 
Processing stops on the first match found.

 ## Beyond basic usage: swappable comparators  

 User defined comparators are probably the most powerfull feature of dbj.cond(). JS switch() stement uses "===" as the only possible comparator. Using dbj.cond() it is easy to change the comparator used.

**Note on versions 3.0.0 and above**

As from version 3.0.0 we do not package complex comparators with dbj.cond. Complex comparators are powerfull but seldom used. Thus for a very fast and comofrtable usage yuo do not need them and you do not need complaex code behind that is largely unused.
Our complex comparators are still here and working and we do use them indeed. 
They are just in the separate file (module): dbj.cond.comparators.js.
This is not part of the NPM package any more, so that the package is small and fast.
To obtain the ```dbj.cond.comparators.js``` file, please go to the <a href="https://github.com/DBJDBJ/dbj.cond" target="_blank">GitHub project</a>.
Copy it to your project and include it as any other module:

```javascript
const dbj_comparators = require('dbj.cond.comparators.js');
```
It exposes 4 comparators: standard, arr, multi and deep. 

the will be a separate npm module and documented accordingly. Here is the code explaining them

```javascript
/* dbj.compare object */
{
    standard: strict_eq , /* function (a,b){ return a == b; }*/
    /* 
    compare two arrays 
    if comparator is given uses it otherwise uses strict_eq().
    NOTE: this method is in here because it might prove faster than 
        multi()
    */
    arr: function (a, b, /* optional */ comparator) {  },
    /*
    Can compare two arrays AND single to array AND array to single value
    NOTE: if comparator is given use it otherwise use strict_eq().
    */
    multi: function (a, b, comparator) {},
    /*
    perform deep comparison of two objects or scalars
    NOTE: to construct multi+deep comparator, end users will do this :
        multi( a, b, deep ) ;
    */
    deep: function (a, b) {}
};
```

**Comparators are swappable extensions to dbj.cond**

Beside our own complex comparators please feel free to use any other available on npm or elsewhere. 
As an example in ./test/index.js we use well known 
<a href="https://github.com/substack/node-deep-equal">'deep-equal'</a> comparator. 

Swappable comparators are very powerfull feature. 
Please be sure to understand what is each one doing and plan to use it accordingly.

**Here are few examples**

 To change the standard (strict equality) comparator:   
 ```javascript
// switching to user defined comparator to myComparator
dbj.cond.comparator = function myComparator (a,b ) { return a != b ; };
	dbj.cond(1,1,"1","!") //=> returns "!"

// switching back to standard comparator
dbj.cond.comparator = dbj_comparators.standard ;
	dbj.cond(1,1,"1","!") //=> returns "1"
```
 For reasons of performance dbj.cond.comparators are not checked for validity. 
 As we explained for using dbj.cond() with complex types (arrays and objects)
two powerfull non-standard comparators are provided, "deep" and "multi". 
 Usage is this:   
 ```javascript
//
const dbj_comparator = require('dbj.cond.comparators.js');
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
	); //=> return "Works!"

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

**NOTE**  
 
This is very minimal documentation and we are aware of that. 
Please do not hesitate to ask for a suport by mailing <a href="mailto:info@dbj.org" target="_blank">info@dbj.org</a>

For discussions and examples plese do visit https://dbj.org
 
---------------------------------------------------------------------  
### &copy; 2018 [![dbj();](http://dbj.org/wp-content/uploads/2015/12/cropped-dbj-icon-e1486129719897.jpg)](http://www.dbj.org "dbj")  
