# dbj.cond() user manual

(c) 2009-2018 .. and beyond, by dbj.org  
Licensed under the Apache License, Version 2.0 

### Short release log

**Version 4.0.1 is the latest**

Please install from [NPM](https://www.npmjs.com/package/dbj.cond).

**Version 3.1.0 and above**

- our own deep (aka complex) comparatos are streamlined and moved from here to a separate npm module
   <a href="https://www.npmjs.com/package/dbj.cond.comparators" target="_blank">**dbj.cond.comparators**</a>

- For a testing project please go to <a href="https://github.com/DBJDBJ/dbj.cond.test" target="_blank">**dbj.cond.test**</a> on the GitHub.

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
   // example: get version 2.0.1
   const dbj = require('dbj.cond@2.0.1').dbj ;
```
# What is dbj.cond ?
 
Invented as an effective defense from real life attacks of unmanageable if-then-else cascades. **dbj.cond** is a coding idiom (and abstraction) inspired with [LISP (cond ... ) and (case ...)](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) statements.

Using this idiom delivers <a href="https://dbj.org/javascript-with-no-ifs/" target="_blank"> non-trival conditional logic </a>, but still clean source with no complex if/else cascades and with no switch(). 

The more you use it, the more it becomes clear why and how it is so usefull. Essentialy it replaces ```if() else``` and ```switch```. It is simple, clean and effective. It also has an obvious outcome (or returned value) vs the ```if/else``` cascades and a ```switch``` statements, who don't.

Call syntax:  

 ```javascript
dbj.cond( 
   input_val,
   compare_1_to_val, outcome_1, /* first  pair */
   compare_2_to_val, outcome_2, /* second pair */
   default_outcome 
  ) ;
/*
returns outcome_1 if input_val given to compare_1_to_val yields true
returns outcome_2 if input_val given to compare_2_to_val yields true
otherwise returns default_outcome
*/
```
- Any legal JavaScript values or expressions are allowed as arguments 
      - with appropriate comparator used
      - standard comparison of input vs compare vals is one of strict equality, aka "==="
- there are comparators available
      - decoupled and changeable 
      - there are some quite good ones on npm already
- processing stops on first comparison yielding true
- There can be any number of input/check pairs  

 ### node.js instalation and usage

 ```npm install dbj.cond```

ESLINT note: dbj packages are all clustered unde the dbj "namespace" which in javascript
is a Object. To pacify ESLINT please use the ```/*global dbj:true*/``` as in the examples(s) bellow.

 ```javascript
/* pacify eslint about dbj global object */
/*global dbj:true*/
require("dbj.cond") ;
//
dbj.cond("one","one","found one!","none found!") 
//returns => "found one!"
 ```
 ### Browser instalation and usage
 ```javascript
//
// first include dbj.cond.js
// then use
dbj.cond("one","one","found one!","none found!") 
//returns => "found one!"
// it has stopped on the first match to the input value
// that was strict equal to "one"
//
 ```

### Basic behaviour explained

dbj.cond might be also described as an tiny front to the usage of various comparator functions. Comparator is a function used internaly, it has two arguments and returns true or false.
```javascript
// show the  standard default comparator
console.log( dbj.cond.comparator ) ;
// shows: function (a, b) {return a === b; }
```
Default comparison used is one of strict equality. This is the function used to compare the first dbj.cond 
argument to the first element of the pairs that might follow. The last argument is the fallback value, used if there is no match. 
Processing stops on the first match found.

 ## Beyond the basics: complex comparators  

 User defined comparators are probably the most powerfull feature of dbj.cond().
Using dbj.cond() it is easy to change the comparator function.

As from version 3.0.0 we do not package complex/deep comparators with dbj.cond. 
Complex comparators are powerfull but seldom used. Thus for a very fast and comfortable usage you 
do not need them and you do not need complex code behind.

### Complex comparators are still feasible, powefull and available. 

They are in the separate NPM package: 
<a href="https://www.npmjs.com/package/dbj.cond.comparators" target="_blank">'dbj.cond.comparators'</a>.


To obtain the `dbj.cond.comparators.js` file, please obtain it from npm:
```
npm install dbj.cond.comparators
```
Then "just use".
```javascript
/* pacify eslint about dbj global object */
/*global dbj:true*/
require('dbj.cond.comparators.js');
//
```
dbj NPM comparators expose 3 comparators: standard, arr and lookup. They are clustered 
under a dbj 'namespace' like this:
```javascript
    dbj  // object
        core // object -- dbj core lib, probably deprecated in the next release
        compare   // object
             standard // comparator functions
             arr  
             multi // deprecated
             lookup
```

Here is the code explaining dbj.compare a bit more. 
For the details off course please feel free to look into the 
<a href="https://github.com/DBJDBJ/dbj.cond.comparators/blob/master/dbj.cond.comparators/index.js" 
target="_blank">source</a>.

```javascript
/* dbj.compare object approx source */
{
    standard: strict_eq , /* function (a,b){ return a == b; }*/
    /* 
    compare two arrays 
    if comparator is given dbj.cond uses it otherwise uses strict_eq().
    NOTE: this method is in here because it might prove faster than 
        lookup()
    */
    arr: function (a, b, /* optional */ comparator) {  },
    /*
    Can compare two arrays AND single value to array AND array to single value
    NOTE: if comparator is given it will be used 
    otherwise the 'standard' aka strict_eq() is used.
    */
    lookup: function (a, b, comparator) {},
};

// one can use
dbj.compare.standard(a,b) ;
// or
dbj.compare.arr(a,b) ;
// or
dbj.compare.lookup(a,b, my_comparator ) ;
```
That is complex usage and powerfull feature. If and when you need it, it is a potential saviour. That is our experience.

### Comparators are plugins

Beside our own complex comparators please feel free to use any other available on npm or elsewhere. 
As an example we often use well known 
<a href="https://www.npmjs.com/package/fast-deep-equal">'fast-deep-equal'</a> comparator. 

Switchable deep/complex comparators are very powerfull dbj.cond feature. 
To avoid the "foot and gun" situation, please be sure to understand what is each one doing; plan how to use it and then test before puting it in production code.

## Few examples

 How to change the standard (strict equality) comparator to your own simple comparator:   
 ```javascript
/*global dbj:true*/
require('dbj.cond');
const assert = require("assert");
// switching to user defined primary comparator 
dbj.cond.setcmp(
    function strictly_not_equal(a, b) { return a !== b; }
);
// quick test
let R1 = dbj.cond("one", "two", "two !== one", "none found!");
assert(R1 === "two !== one");

// switching back to standard strict equality
// function strict_eq(a, b) { return a === b; };
dbj.cond.reset();
// quick test
let R2 = dbj.cond("one", "one", "one === one", "none found!");
assert(R2 === "one === one");
```
For reasons of performance dbj.cond.comparators are not comprehensivley checked for validity. 
As we have explained (just a moment before) for using dbj.cond() with complex types (arrays of 'anything' etc.)
for dealing with arrays, two powerfull non-standard comparators are provided, "arr" and "lookup" (ex 'multi'). 

Usage is this:   
 ```javascript
/*global dbj:true*/
 require('dbj.cond');
 require('dbj.cond.comparators.js');
// from https://www.npmjs.com/package/fast-deep-equal
const deepEqual = require('fast-deep-equal');
//
// method
// dbj.cond.setcmp ( primary, secondary )
// sets primary and optional seconday comparator
// returns an array of current comparator pair
dbj.cond.set(dbj.compare.lookup, deepEqual ) ;
// switch to dbj two way lookup comparator
// give  deepEqual comparator as secondary
// to compare elements of arrays
//
// at this moment dbj.cond is capable of deep array vs array comparisons
//
dbj.cond(
	[1,2], 
	[3,2], false, 
	[1,2], "Works!"
		, false 
	); // => returns "Works!"

// lookup into the array also works
// input val array is 'looked up' 
dbj.cond(
/* input*/	[1,2], 
/* pair 1 */	[3,2]        , false, 
/* pair 2 */	['2d', [1,2]], "Works!"
/* default*/	, false 
	); // => "Works!"  
// [1,2] is found in ['2d', [1,2]]

// lookup from the array too
// aka 'reverse' lookup
dbj.cond(
	['2d', [1,2]], 
	[3,2]         , false, 
	[1,2]         , "Works!"
	, false 
	); // => "Works!"
```

**Why the Secondary comparator**

Secondary comparator is used internaly by the primary one for 'drillin down' into the properties of complex objects to compare. 
As above it is also possible to change it. Above we have made a powerfull combination 
of the dbj 'lookup' and 'fast-deep-equal' as an example.  
If secondary comparator is not used the standard one is. Thus reverting to so called 'shallow' comparisons.

By exposing the secondary operator we have allowed users to fine tune the power of dbj.cond, and the usage of deep comparators. 
In the last example we have assembled together: dbj.compare.lookup and 'deep-equal' 
so that we can execute deep comparisons of arrays and their elements, objects and a such.

<span id="setreset" ></span>
What is **comparator set/reset**

Method
```dbj.cond.setcmp ( primary, secondary )```
Sets primary and optional secondary comparator. Returns an array of current comparator pair.
```javascript
dbj.cond.setcmp(dbj.compare.lookup, deepEqual ) ;
```
Method
```javascript
dbj.cond.reset( )
``` 
Resets both comparators to default aka strict equality aka `function (a,b) { return a === b ; }`. It returns both of them in an array.


## END NOTE
 
This is very minimal documentation and we are aware of that. 
There are many more real life examples proving the quality of this idiom. 
Please do feel free to send us your code. 
We might publish it and discuss it on https://dbj.org alongside our own artricles on the usability and feasibility of dbj.cond.

**CONTACT**

Please do not hesitate to suggest, comment or ask for a suport by mailing <a href="mailto:info@dbj.org" target="_blank">info@dbj.org</a>
And of course the good old GitHub issues mechanism is available 
<a href="https://github.com/DBJDBJ/dbj.cond/issues" target="_blank">here</a>.


---------------------------------------------------------------------  
### &copy; 2018-2021 [![dbj();](http://dbj.org/wp-content/uploads/2015/12/cropped-dbj-icon-e1486129719897.jpg)](http://www.dbj.org "dbj")  
