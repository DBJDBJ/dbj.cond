(c) 2009-2013 .. and beyond, by dbj  

 <h1>Project :: dbj.cond  </h1>

 Licensed under the MIT (MIT-LICENSE.txt)  


 <h2>node.js version</h2>
 
     npm install dbj.cond

 ```javascript
        var dbj = require("dbj.cond").dbj ;
		
		dbj.cond(1,1,"1","!") //=> "1"
 ```
 To change the standard strict equality comparator:   
 ```javascript
        dbj.cond.comparator = function myComparator (a,b ) { return a != b ; };
 ```
 Two powerfull non-standard comparators are provided. Usage:   
 ```javascript
       dbj.cond.comparator = dbj.compare.deep;
	   	   dbj.cond({ "Alpha": 1 }, { "Beta": 2 }, false, { "Alpha": 1 }, "Works!", false ); //=> "Works!"

	    dbj.cond.comparator = dbj.compare.multi;
		   // compare arrays
	   	   dbj.cond([1,2], [3,2], false, [1,2], "Works!", false ); //=> "Works!"
		   // lookup into the array
	   	   dbj.cond([1,2], [3,2], false, ['2d', [1,2]], "Works!", false ); //=> "Works!"
		   // lookup from the array
	   	   dbj.cond(['2d', [1,2]], [3,2], false, [1,2], "Works!", false ); //=> "Works!"
```
 <h4>NOTE</h4> Wiki is work-in-progress, mainly to sync it with a code 
 after numerous changes and re-thinking sessions. 
 When this note is removed, Wiki will be the reference text on dbj.cond() et. all

 
