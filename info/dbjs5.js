
/*
(c) 2011-2013 by DBJ.ORG

DBJQS5 DBJ QS5 

Inspired with S5 and JQS5 Copyright 2008 Steve Pomeroy <steve@staticfree.info>
Dual licensed under the MIT (MIT-LICENSE.txt)
and GPL (GPL-LICENSE.txt) licenses.
*/
(function ($, undefined) {
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

	var cur, slideCount, $body = $(document.body), $head = $("head"), $document = $(document);

	/* initialize the jqs5 rendering */
	var jqs5 = {
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
			// fontScale();

			// load the key/mouse bindings
			$document.keyup(keys);
			$document.click(function (E) {
			    dbj.cond(
                    E.which,
                    1, function () { go("next"); },
                    2, function () { go("prev"); },
                    function () { }
                    )();
			    return false;
			});

			// start the presentation
			go('first');
		}
	};

	/* go to either a numbered slide, 'next', 'prev', 'last, or 'first' */
	function go(n) {
		if (dbj.isString(n)) {
			n = dbj.cond(n,
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

	function keys(key) {
		dbj.cond(key.which,
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
				function () { go('first'); },
			35, // end
				function () { go(slideCount - 1); },
			67, // c
				function () { },
			79, // o
				function () { $('.outline').toggle(); },
                // otherwise
				function () { }
		)();
		return false;
	}
	/* self ignition */
	$(function () {
	    try {
	        $body.hide();
	        jqs5.init();
	    } catch (x) {
	        alert("dbjS5 initialization ERROR\n\n"+x);
	    }
		finally {
			$body.show();
		}
	});

} ( $ || jQuery));