
/*
(c) 2011 by DBJ.ORG

DBJQS5 DBJ QS5 

 Inspired with S5 and JQS5 Copyright 2008 Steve Pomeroy <steve@staticfree.info>
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.

*/

(function (undefined) {

	/*--------------------------------------------------------------------------------------------*/
	// quirky implementation, enough here
	if ("function" !== role(Array.prototype.indexOf))
		Array.prototype.indexOf = function (value) {
			var i = this.length;
			while (i-- && this[i] !== value) { };
			return i;
		};
	var cond = function (v) {
		var comparator = function (a, b) {
			if ("array" !== role(b))
				return a === b;
			return comparator(a, b[b.indexOf(a)]);
		};
		var j = 1, L = arguments.length;
		for (; j < L; j += 2) {
			if (comparator(v, arguments[j])) return arguments[j + 1];
		}
		return (!arguments[j - 2]) ? undefined : arguments[j - 2];
	},

    role = function (o) {
    	/// NOTE: for DOM objects function bellow will return "object"
    	///       in IE < 9. example: window.alert returns "object"
    	return o === undefined
                ? "undefined" : o === null
                ? "null" : (Object.prototype.toString.call(o).match(/\w+/g)[1]).toLowerCase();
    };
	if ("function" != typeof "".format)
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
				var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
			}
            );
		}
	/*--------------------------------------------------------------------------------------------*/
	/* extend jQuery with a new function */
	jQuery.fn.extend({
		// selects a node's sibling's until the sibling matches
		siblingsUntil: function (match) {
			var r = [];
			$(this).each(function (i) {
				for (var n = this.nextSibling; n; n = n.nextSibling) {
					if ($(n).is(match)) {
						break;
					}
					r.push(n);
				}
			});
			return this.pushStack(jQuery.unique(r));
		}
	});
	/*--------------------------------------------------------------------------------------------*/

	var cur, slideCount, $body = $(document.body), $head = $("head");

	/* initialize the jqs5 rendering */
	window.jqs5 = {
		init: function () {
			/* inject some elements to stylize each slide */
			var footer = $("<DIV/>").addClass('footer'),
			// a slide container that we'll be putting the content into
           s = $("<DIV/>").addClass('slide'),
			// create an outline container
           outline = $('<ul/>').prependTo('body').addClass('outline');

			$('h1, h2').each(function (idx, val) {
				var a = $("<a>{0}</a>".format(this.textContent)).attr('href', '#s' + idx);
				$("<li/>").appendTo(outline).append(a);
				$(a).click(function (e) { go(idx) });
			});

			// siblingsUntil is a custom selector that is added to jQuery by this library
			$('h1').each(function (idx, val) {
				$(this).add($(this).siblingsUntil('h2')).clone().prependTo('body').wrapAll(footer);
			});
			$('body > h1').each(function () {
				$(this).add($(this).siblingsUntil('h2')).wrapAll(s); $(this).parent().addClass('first')
			});
			$('body > h2').each(function () {
				$(this).add($(this).siblingsUntil('h2')).wrapAll(s);
			});

			$('.slide').each(function (idx, val) {
				$(this).addClass('slide-' + idx);
			});

			// initialize 
			$('.slide').hide();
			slideCount = $('.slide').length;
			fontScale();

			// load the key/mouse bindings
			$body.keyup(keys);
			$body.keypress(trap);
			$body.click(clicker);

			// var first_slide = Number(document.location.hash.substring(2));
			// start the presentation
			go(0);
		}
	};

	/* go to either a numbered slide, 'next', 'prev', 'last, or 'first' */
	function go(n) {
		if (typeof n == 'string') {
			n = cond(n,
					'next', cur < (slideCount - 1) ? cur + 1 : cur,
					'prev', cur > 0 ? cur - 1 : cur,
					'last', slideCount - 1,
					'first', 0,
					 undefined
					);
		}
		if (n == cur) return;
		var prev = cur;
		cur = n;
		var slides = $('.slide');
		slides.eq(prev).css('z-index', 0);
		slides.eq(cur).css('z-index', 100).fadeIn('medium', function () { slides.eq(prev).hide() });
		if (n == 0 || prev == 0)
			$('.footer').animate({ top: (n == 0 ? "100%" : "90%") });
		document.location.hash = "#s" + n;
	}



	/* the below code borrowed from S5 */

	function fontScale() {  // causes layout problems in FireFox that get fixed if browser's Reload is used; same may be true of other Gecko-based browsers
		var vScale = 22,  // both yield 32 (after rounding) at 1024x768
		    hScale = 32,  // perhaps should auto-calculate based on theme's declared value?
			vSize, hSize;
		if (window.innerHeight) {
			vSize = window.innerHeight;
			hSize = window.innerWidth;
		} else if (document.documentElement.clientHeight) {
			vSize = document.documentElement.clientHeight;
			hSize = document.documentElement.clientWidth;
		} else if (document.body.clientHeight) {
			vSize = document.body.clientHeight;
			hSize = document.body.clientWidth;
		} else {
			vSize = 700;  // assuming 1024x768, minus chrome and such
			hSize = 1024; // these do not account for kiosk mode or Opera Show
		}
		var newSize = Math.min(Math.round(vSize / vScale), Math.round(hSize / hScale));
		fontSize(newSize + 'px');
		if (jQuery.browser['mozilla']) {  // hack to counter incremental reflow bugs
			$body.css("display", 'none').css("display", 'block');
		}
	}

	function fontSize(value) {
		var ssstr = "<style type='text/css' media='screen, projection' id='s5ss'>body {font-size:{0} !important;}</style>";
		$("#s5ss", $head).remove();
		$head.append($(ssstr.format(value)));
	}

	// 'keys' code adapted from MozPoint (http://mozpoint.mozdev.org/)
	function keys(key) {
		if (!key) {
			key = event;
			key.which = key.keyCode;
		}
		switch (key.which) {
			case 10: // return
			case 13: // enter
			case 32: // spacebar
			case 34: // page down
			case 39: // rightkey
			case 40: // downkey
				go('next');
				break;
			case 33: // page up
			case 37: // leftkey
			case 38: // upkey
			case 8: // backspace
				go('prev');
				break;
			case 36: // home
				go(0);
				break;
			case 35: // end
				go(slideCount - 1);
				break;
			case 67: // c
				break;
			case 79: // o
				$('.outline').toggle();
		}
		return false;
	}
	// Key trap fix, new function body for trap()
	function trap(e) {
		if (!e) {
			e = event;
			e.which = e.keyCode;
		}
		try {
			modifierKey = e.ctrlKey || e.altKey || e.metaKey;
		}
		catch (e) {
			modifierKey = false;
		}
		return modifierKey || e.which == 0;
	}


	function clicker(e) {
		var target;
		if (window.event) {
			target = window.event.srcElement;
			e = window.event;
		} else target = e.target;
		if (target.getAttribute('href') != null) return true;
		if (!e.which || e.which == 1) {
			go('next');
		}
	}


} ());