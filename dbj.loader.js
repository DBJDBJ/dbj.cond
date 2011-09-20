/**
 * dbjLOADER - A ridiculously simple and effective javascript dynamic loader
 * usage example :
 
     dbjLOADER (
	function () { prettyPrint(); }
	, "prettify/prettify.js"
	, "http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"
	);
	
	If first argument is a function it is going to be used as final calback. 
	
 * Copyright (c) 2011 DBJ.ORG
 * Dual licensed under the MIT or GPL licenses.
 */

(function (global, undefined) {
	global.console || (global.console = {
		log: function () { }, error: function () { }, warn: function () { }
	});
	var addprops = function (t) {
		var j = 1; while (arguments[j]) { t[arguments[j++]] = arguments[j++]; } return t;
	},
	next_script = function (src, next_cb_) {
		document.body.appendChild(addprops(
			document.createElement("script"),
				"type", "text/javascript",
				"id", escape(src),
				"src", src,
				"onload", function (e) {
					e || (e = window.event);
					global.__dbj__loader__.scripts_loaded.push((e.target || e.srcElement).src);
					next_cb_();
					return false;
				},
				"onerror", function (e) {
					e || (e = window.event);
					global.__dbj__loader__.scripts_errored.push((e.target || e.srcElement).src);
					next_cb_();
					return false;
				}
			)
		);
	};

	global.dbjLOADER = function () {
		var args = Array.prototype.slice.call(arguments), arlen = args.length >>> 0, args_idx = 0,
		user_finale = "function" === typeof args[0] ? args[0] : false ,
		default_finale = function () {
			console.log(global.__dbj__loader__.scripts_loaded.join("\n"));
			console.error(global.__dbj__loader__.scripts_errored.join("\n"));
			if (user_finale) user_finale();
		};
		args.push("dummy.js");
		global.__dbj__loader__ = function () {
			next_script(
					args[args_idx],
					(args_idx += 1) < arlen ? __dbj__loader__ : default_finale
				);
		}
		global.__dbj__loader__.scripts_loaded = ["dbjLOADER :: loaded scripts"],
			global.__dbj__loader__.scripts_errored = ["dbjLOADER :: errored scripts"];

		__dbj__loader__( args_idx = !! user_finale ? 1 : 0 );
	};

} (window));
