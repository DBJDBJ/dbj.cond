/**
 * dbjLOADER - A ridiculously simple and effective javascript dynamic loader
 * usage example :
 
     dbjLOADER (
	function () { prettyPrint(); }
	, "prettify/prettify.js"
	, "http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"
	);
	
	First argument must be final calback or null. If null then default callback is used which shows
	alert with source urls of all scrpts dbjLOAD-ed
	
 * Copyright (c) 2011 DBJ.ORG
 * Dual licensed under the MIT or GPL licenses.
 */

(function (global, undefined) {
	var scripts_loaded = [],
	addprops = function (t) {
		var j = 1; while (arguments[j]) { t[arguments[j++]] = arguments[j++]; } return t;
	},
	next_script = function (src, next_cb_) {
		document.body.appendChild(addprops(
			document.createElement("script"),
				"type", "text/javascript",
				"id", escape(src),
				"src", src,
				"onload", next_cb_)
		);
		scripts_loaded.push(src);
	},
	default_finale = function () { alert(scripts_loaded.join("\n")); };

	global.dbjLOADER = function () {
		var args = Array.prototype.slice.call(arguments), arlen = args.length >>> 0, args_idx = 0;
		args.push("dummy.js");
		global.__dbj__loader__ = function () {
			next_script(
					args[args_idx],
					(args_idx += 1) < arlen ? __dbj__loader__ : args[0] || default_finale
				);
		};
		loader(args_idx = 1);
	};

} (window));
