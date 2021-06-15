<h1> dbj.cond() user manual </h1>

(c) 2009-2021 .. and beyond, by dbj@dbj.org  
Licensed under the Apache License, Version 2.0 

- [What is dbj.cond ?](#what-is-dbjcond-)
- [Installation and usage](#installation-and-usage)
  - [ESLINT note](#eslint-note)
- [Browser installation and usage](#browser-installation-and-usage)
- [Basic behaviour explained](#basic-behaviour-explained)
- [Beyond the basics: complex comparators](#beyond-the-basics-complex-comparators)
  - [Comparators are plugins](#comparators-are-plugins)
- [Few swappable comparators examples](#few-swappable-comparators-examples)
  - [Complex comparators usage](#complex-comparators-usage)
  - [API recap](#api-recap)
- [END NOTE](#end-note)
  - [CONTACT](#contact)
- [Appendix A: Short release log](#appendix-a-short-release-log)
  - [&copy; 2018-2021 dbj at dbj dot org&trade;](#-2018-2021-dbj-at-dbj-dot-org)

Note: to require particular version please use the required (pun intended) require syntax:
```javascript 
   // example: require a version 4.0.1
   const dbj = require('dbj.cond@4.0.1').dbj ;
```
## What is dbj.cond ?
 
Invented as an effective defence from real life attacks of unmanageable if-then-else cascades. A coding idiom (and abstraction) inspired with [LISP (cond ... ) and (case ...)](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) statements.

Using this idiom delivers <a href="https://dbj.org/javascript-with-no-ifs/" target="_blank"> non-trival conditional logic </a>, but still clean source with no complex if/else cascades and with no switch(). 

Just try it. The more you use it, the more it becomes clear why and how it is so useful. Essentially it replaces `if() else` and `switch`. It is simple, clean, and effective. It also has an obvious outcome (or returned value) vs the `if/else` cascades and a `switch` statement, who don't.

The call syntax:  

 ```javascript
var answer = dbj.cond( 
   input_val,
   42, "You guessed it!", /* first  pair */
   13, "A miss", /* second pair */
   "Try again" 
  ) ;
/*
Same as:

var answer = if (compare(input_val,42)) 
    "You guessed it!";
else if (compare(input_val,13)) 
    "A miss";
else 
    "Try again" ;   
*/
```
Simple rules
- Any legal JavaScript values or expressions are allowed as arguments 
- comparators are decoupled and swappable 
- processing stops on the first comparison yielding true
- There can be any number of input/check pairs  

 ## Installation and usage

 From [npm](https://docs.npmjs.com/cli/v6/commands/npm):

 ```npm install dbj.cond```

### [ESLINT](https://eslint.org/) note

dbj packages are all clustered under the dbj "namespace" which is an javascriptObject. To pacify ESLINT please use the `/*global dbj:true*/` as in the examples(s) bellow.

 ```javascript
/* pacify eslint about dbj global object */
/*global dbj:true*/
require("dbj.cond") ;
//
var answer = 
dbj.cond("found one","one","found one!","none found!") 
//returns => "found one!"
 ```
 ## Browser installation and usage
 ```html
 <script src="my/script/location/dbj.cond.js" >
 </script>
 ```
First include dbj.cond.js, then use it:
 ```javascript
//
alert(
dbj.cond(
    "two",
    "one","found one!",
    "none found!") 
) ;
 ```

## Basic behaviour explained

dbj.cond might be also described as an tiny front to the usage of various comparator functions. Comparator is a simple function. It has two arguments and returns true or false.

Comparator in use is `dbj.cond.comparator`. Default comparator is always available:
```javascript
// show the  standard default comparator
console.log( dbj.cond.comparator ) ;
// shows: function (a, b) {return a === b; }
```
AS you can see, the default comparison used is one of strict equality. 

Reminder: Processing stops on the first match found.

 ## Beyond the basics: complex comparators  

User-defined comparators are probably the most powerful feature of dbj.cond(). It is easy to change the comparator function.

NOTE: As from version 3.0.0 we do not package complex/deep comparators with dbj.cond. Complex comparators are powerful but seldom used. Thus for a very fast and comfortable usage, you do not need them and you do not need complex code behind them.

> If an when needed complex comparators are still feasible, and available. 

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
dbj NPM comparators expose 3 comparators: standard, arr and lookup. They are clustered under a dbj 'namespace' like this:
```javascript
dbj  // object
    core // object deprecated in the next release
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
    Can compare two arrays AND single value to array AND array to a single value
    NOTE: if a comparator is given it will be used 
    otherwise, the 'standard' aka strict_eq() is used.
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
That is a bit more complex and feature. If and when you need it, it is a potential saviour. That is our experience.

### Comparators are plugins

Beside our own complex comparators please feel free to use any other available on npm or elsewhere. 
As an example we often use well known 
<a href="https://www.npmjs.com/package/fast-deep-equal">'fast-deep-equal'</a> comparator. 

Switchable deep/complex comparators are a very powerful feature requiring some caution. To avoid the "foot and gun" situation, please be sure to understand what is each one doing; plan how to use it, and then test before putting it in production code.

## Few swappable comparators examples

 > API : To change the default comparator to your own simple comparator please use the `dbj.cond.setcmp` function :   
 ```javascript
/*global dbj:true*/
require('dbj.cond');
const assert = require("assert");
// switching to user defined comparator 
dbj.cond.setcmp(
    function strictly_not_equal(a, b) { return a !== b; }
);
// quick test
let R1 = dbj.cond("one", "two", "two !== one", "none found!");
assert(R1 === "two !== one");
```
Switching back to a default comparator:
```javascript
dbj.cond.reset();
// quick test
let R2 = dbj.cond("one", "one", "one === one", "none found!");
assert(R2 === "one === one");
```
*NOTE: For reasons of performance dbj.cond.comparators are not comprehensively checked for validity.*
### Complex comparators usage

> JavaScript runtime can contain clusters of object hierarchies. Array is one ot them. Fully Comparing this hierarchical clusters is "Deep Comparison".

As we have explained (just a moment before) for using dbj.cond() with complex types (arrays of 'anything' etc.), two non-standard comparators are provided, "arr" and "lookup" (was "multi"). 

One can also use third-party complex comparators.

Usage is this:   
 ```javascript
/*global dbj:true*/
 require('dbj.cond');
// dbj complex comparators 
 require('dbj.cond.comparators.js');
// third party complex comparator  
// from https://www.npmjs.com/package/fast-deep-equal
const deepEqual = require('fast-deep-equal');
```
> API: Function `dbj.cond.setcmp ( primary, secondary )`
sets primary and optional secondary comparator.

Example: switch to dbj two way lookup comparator,
and give `deepEqual` comparator as secondary to deep compare elements of arrays.
```javascript
dbj.cond.set(dbj.compare.lookup, deepEqual ) ;

// deep array to array comparisons

dbj.cond(
	[1,2], 
	[3,2], false, 
	[1,2], "Works!"
		, false 
	); // => returns "Works!"
```
That is easy and readily available array comparison.
Lookup into the array also works:
```javascript
// input val array is 'looked up' 
dbj.cond(
/* input*/	[1,2], 
/* pair 1 */	[3,2]        , false, 
/* pair 2 */	['2d', [1,2]], "Works!"
/* default*/	, false 
	); // => "Works!"  
```
Above `[1,2]` is found in `['2d', [1,2]]`, because we used `deepEqual`, as the secondary comparator. That is slower but in that scenario we need it, and it works. And that works "both ways":
```javascript
var answer = dbj.cond(
	['2d', [1,2]], 
	[3,2]         , false, 
	[1,2]         , "Works!"
	, false 
	); // => "Works!"
```

**Why the Secondary comparator**

As evident above, the secondary comparator is used internally by the primary one for 'drilling down' into the properties of complex objects. 

It is also possible to change it. Above we have made a powerful combination of the dbj 'lookup' and 'fast-deep-equal' as an example.  If the second comparator is not used the standard one is. Thus reverting to so-called 'shallow' comparisons.

By exposing the secondary operator we have allowed users to fine-tune the power of `dbj.cond`, and the usage of deep comparators. 

In the last example, we have assembled together: `dbj.compare.lookup` and 'deeply equal' so that we can execute deep comparisons of arrays and their elements, objects, and such.


### API recap

`dbj.cond.setcmp ( primary, secondary )`, sets primary and optional secondary comparator.
```javascript
dbj.cond.setcmp(dbj.compare.lookup, deepEqual ) ;
```
Function `dbj.cond.reset( )`,resets both comparators to default ones. Default comparator is: `function (a,b) { return a === b ; }`. 

## END NOTE
 
This is somewhat minimal documentation and we are aware of that. 

There are many more real-life examples proving the quality of this idiom. Please do feel free to send us your code. We might publish it and discuss it on https://dbj.org alongside our own articles on the usability and feasibility of dbj.cond in real-life projects.

### CONTACT

- Please do not hesitate to suggest, comment or ask for a support by mailing <a href="mailto:info@dbj.org" target="_blank">info@dbj.org</a>
- The good old GitHub issues mechanism is available <a href="https://github.com/DBJDBJ/dbj.cond/issues" target="_blank">here</a>.
  
---  

## Appendix A: Short release log

**Version 4.0.1 is the latest**

Please install from [NPM](https://www.npmjs.com/package/dbj.cond).

**Version 3.1.0 and above**

- deep (aka complex) comparators are streamlined and moved from here to a separate npm module
   <a href="https://www.npmjs.com/package/dbj.cond.comparators" target="_blank">**dbj.cond.comparators**</a>

- For a testing project please go to <a href="https://github.com/DBJDBJ/dbj.cond.test" target="_blank">**dbj.cond.test**</a> on the GitHub.

**Versions 3.0.3 and above**

- `dbj.compare.deep` has been removed as of 3.0.3, please use <a href="https://www.npmjs.com/package/deep-equal" target="_blank">'deep-equal'</a> or <a href="https://www.npmjs.com/package/fast-deep-equal" target="_blank">'fast-deep-equal'</a> or any other comparators you might preffer.
-  `dbj.cond.comparators.js` contains `dbj.compare.arr` and `dbj.compare.multi`. These are meant primarily for arrays comparisons.
- Secondary comparator feature added. See the usage of 'multi' on the bottom. 

**Versions 3.0.0 and above**
  
Note: for tests and the rest please always visit the <a href="https://github.com/DBJDBJ/dbj.cond" target="_blank">project on the Github</a>. 

**Version 2.0.1**

The first NPM version

---
### &copy; 2018-2021 [dbj at dbj dot org&trade;](http://www.dbj.org "dbj")  
