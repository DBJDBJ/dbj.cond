
/*
(c) 2011 by DBJ.ORG

DBJQS5 DBJ QS5 

Inspired with S5 and JQS5 Copyright 2008 Steve Pomeroy <steve@staticfree.info>
Dual licensed under the MIT (MIT-LICENSE.txt)
and GPL (GPL-LICENSE.txt) licenses.
*/
(function (undefined) {
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
		if (role.isString(n)) {
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

	// causes layout problems in FireFox < 4, that get fixed if browser's Reload is used; 
	// same may be true of other Gecko-based browsers
	function fontScale() {
		var vScale = 1.5 * 22,  // both yield 32 (after rounding) at 1024x768
		    hScale = 1.5 * 32,  // perhaps should auto-calculate based on theme's declared value?
			vSize = $(document).height(), hSize = $(document).width(),
		    newSize = Math.min(Math.round(vSize / vScale), Math.round(hSize / hScale));

		$body.css("font-size", parseInt(newSize) + 'px');

		if (jQuery.browser['mozilla']) {  // hack to counter incremental reflow bugs
			$body.css("display", 'none').css("display", 'block');
		}
	}
	/*
	function fontSize(value) {
		var ssstr = "<style type='text/css' media='screen, projection' id='dbjs5_font_size'>body {font-size:{0} !important;}</style>";
		$("#dbjs5_font_size", $head).remove();
		$head.append($(ssstr.format(value)));
	}
	*/
	// 'keys' code adapted from MozPoint (http://mozpoint.mozdev.org/)
	function keys(key) {
		if (!key) {
			key = event;
			key.which = key.keyCode;
		}
		cond(key.which,
			[10 // return
			, 13 // enter
			, 32 // spacebar
			, 34 // page down
			, 39 // rightkey
			, 40], // downkey
			function () { go('next'); },
			[33 // page up
			, 37 // leftkey
			, 38 // upkey
			, 8], // backspace
			function () { go('prev'); },
			36, // home
				function () { go(0); },
			35, // end
				function () { go(slideCount - 1); },
			67, // c
				function () { },
			79, // o
				function () { $('.outline').toggle(); },
				function () { }
		)();
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

	/* self ignition */
	$(function () {
		jqs5.init();
	});

} ());