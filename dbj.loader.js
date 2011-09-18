/**
 * dbjLOADER - A ridiculously simple and effective javascript dynamic loader
 *
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

	global.crazyLoader = function () {
		var args = Array.prototype.slice.call(arguments), arlen = args.length >>> 0, args_idx = 0;
		args.push("dummy.js");
		global.loader = function () {
			next_script(
					args[args_idx],
					(args_idx += 1) < arlen ? loader : args[0] || default_finale
				);
		};
		loader(args_idx = 1);
	};

} (window));
