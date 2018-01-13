# dbj.cond() 

(c) 2009-2018 .. and beyond, by dbj.org  
 Licensed under the MIT (MIT-LICENSE.txt) 

### Short release log

**Versions 3.0.3 and above**

- ```dbj.compare.deep;``` has been removed as of 3.0.3, please use <a href="https://www.npmjs.com/package/deep-equal" target="_blank">'deep-equal'</a> or a href="https://www.npmjs.com/package/fast-deep-equal" target="_blank">'fast-deep-equal'</a> or any other comparators you might preffer.
-  ```dbj.cond.comparators.js``` contains ```dbj.compare.arr``` and ```dbj.compare.multi```. These are meant primarily for arrays comparisons.
- Secondary comparator feature added. See the usage of 'multi' on the bottom. 

**Versions 3.0.0 and above**
  
Note: for tests and the rest please always visit the <a href="https://github.com/DBJDBJ/dbj.cond" target="_blank">project on the Github</a>. 

**Version 2.0.1**

The first NPM version

----------------------------------

Note: for particular version please use the required (pun intended) require syntax:
```javascript 
   // get version 2.0.1
   const dbj = require('dbj.cond@2.0.1').dbj ;
```
# What is dbj.cond ?
 
dbj.cond is an coding abstraction inspired with [LISP (cond ... ) and (case ...)](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) statements.
Using this idiom delivers <a href="https://dbj.org/javascript-with-no-ifs/" target="_blank"> non-trival conditional logic </a> coding, but still clean source with no complex if/else cascades and with no switch(). 
The more you use it, the more it becomes clear why you have choosen it. 
Call syntax:  

 ```javascript
dbj.cond( 
   input_val,
   compare_1_to_val, outcome_1,
   compare_2_to_val, outcome_2,
   default_outcome 
  ) ;
/*
returns outcome_1 if input_val === compare_1_to_val
returns outcome_2 if input_val === compare_2_to_val
otherwise returns default_outcome

there can be "any" number of input/compare pairs
*/
```
- Any legal values or expressions are allowed as arguments (with appropriate comparator used)
- standard comparison of input vs compare vals is one of strict equality, aka "==="
- processing stops on first comparison yielding true
- There can be any number of input/check pairs  

 ### node.js usage

 ```npm install dbj.cond```

 ```javascript
const dbj = require("dbj.cond") ;
const dbj_comparators = require('./node_modules/dbj.cond/dbj.cond.comparators.js');
//
dbj.cond("one","one","found one!","none found!") 
//returns => "found one!"
 ```
 ### Browser usage
 ```javascript
//
// include dbj.cond.js
// include dbj.cond.comparators.js
//
dbj.cond("one","one","found one!","none found!") 
//returns => "found one!"
// it has stopped on the first match to the input value
// that was strict equal to "one"
//
 ```

### Basic behaviour

dbj.cond might be described as an tiny front to the usage of a comparator function.
```javascript
// standard default comparator
function (a, b) {return a === b; }
```
Default comparison used is one of strict equality. This is the function used to compare the first dbj.cond 
argument to the first element of the pairs that follow. The last argument is the fallback value, used if there is no match. 
Processing stops on the first match found.

 ## Beyond the basics: complex comparators  

 User defined comparators are probably the most powerfull feature of dbj.cond().
Using dbj.cond() it is easy to change the comparator used.

As from version 3.0.0 we do not package complex comparators with dbj.cond. 
Complex comparators are powerfull but seldom used. Thus for a very fast and comfortable usage you 
do not need them and you do not need complex code behind.
Our complex comparators are still feasible, powefull and here. 
They are just in the separate file: dbj.cond.comparators.js.
This is not part of the dbj.cond.js module any more, it is in a separate module.
To obtain the ```dbj.cond.comparators.js``` file, please obtain it from ./node_modules like this:
```javascript
//
const dbj_comparators = require('./node_modules/dbj.cond/dbj.cond.comparators.js');
//
```
It exposes 3 comparators: standard, arr and multi. They are arranged like this:
```javascript
    dbj  // object
        core // object -- dbj core lib, probably deprecated in the next release
        compare   // object
             standard // coparator functions
             arr  
             multi
```

Here is the code explaining dbj.compare a bit more. For the details off course please feel free to look into the source.

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
};
```

### Comparators are plugins

Beside our own complex comparators please feel free to use any other available on npm or elsewhere. 
As an example in <a href="https://github.com/DBJDBJ/dbj.cond/tree/master/test" target="_blank">./test/index.js</a> we use well known 
<a href="https://github.com/substack/node-deep-equal">'deep-equal'</a> comparator. 

plugin comparators are very powerfull feature. Please be sure to understand what is each one doing; plan how to use it and then test before puting it in production code.

**Few examples**

 To change the standard (strict equality) comparator:   
 ```javascript
// switching to user defined comparator 
dbj.cond.comparator = function myComparator (a,b ) { return a != b ; };
//
dbj.cond("one","one","found one!","none found!") 
//returns => "none found!"

// switching back to standard comparator
dbj.cond.comparator = dbj.comparator.standard ;
//
dbj.cond("one","one","found one!","none found!") 
//returns => "found one!"
```
For reasons of performance dbj.cond.comparators are not comprehensivley checked for validity. As we have explained (just a moment before) for using dbj.cond() with complex types (arrays of 'anything')
for dealing with arrays, two powerfull non-standard comparators are provided, "arr" and "multi". 
Usage is this:   
 ```javascript
//
const dbj = require('dbj.cond');
const dbj_comparators = require('./node_modules/dbj.cond/dbj.cond.comparators.js');
const deepEqual = require('deep-equal');
// use dbj array comparator
dbj.cond.comparator = dbj.compare.multi;
// give  deepEqual comparator as secondary
// otherwise simple strict equality default is used
// to compare elements of arrays
dbj.cond.secondary_comparator = deepEqual;
// at this moment dbj.cond is capable of complex array vs array comparisons
//
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

### Secondary comparator
Is used internaly by the primary one. Above we have made a powerfull combination 
of the two as an example.  If secondary comparator is not used the standard one will be used.

By exposing the secondary operator we have allowef users to fine tune the power of dbj.cond. 
In the last example we have assembled together: dbj.compare.multi and deepEquality so that we can execute deep comparisons of arrays and their elements.

Future developments will focus also on making this easier to use by end users.

**END NOTE**  
 
This is very minimal documentation and we are aware of that. 
There are many more real life examples proving the quality of this idiom. 
Please do feel free to send us your code. 
We might publish it and discuss it on https://dbj.org alongside our own artricles on the usability and feasibility of dbj.cond.

Please do not hesitate to ask for a suport by mailing <a href="mailto:info@dbj.org" target="_blank">info@dbj.org</a>

---------------------------------------------------------------------  
### &copy; 2018 [![dbj();](http://dbj.org/wp-content/uploads/2015/12/cropped-dbj-icon-e1486129719897.jpg)](http://www.dbj.org "dbj")  
