$(document).ready(function () {
	$(window).scroll(function () {
		if (scrollY > 45) {
			$('header').addClass('sticy');
		} else {
			$('header').removeClass('sticy');
		}
	});

	$('.faq1').click(function () {
		if ($('.faq1').click) {
			$('.faq1').addClass('none');
		} else {
			$('.faq1').removeClass('none');
		}
		$(this).next('.pra').slideToggle().siblings('.pra').slideUp();
	});

	$('.slider1').slick({
		infinite: true,
		autoplay: true,
		autoplaySpeed:4000,
	});
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#scroll').fadeIn();
		} else {
			$('#scroll').fadeOut();
		}
	});
	$('#scroll').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

	// headline js

	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;

	initHeadline();


	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function () {
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
			}
			var newLetters = letters.join('');
			word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function () {
			var headline = $(this);

			if (headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function () { headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')) {
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type')) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function () {
					var wordWidth = $(this).width();
					if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function () { hideWord(headline.find('.is-visible').eq(0)) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);

		if ($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');
			setTimeout(function () {
				parentSpan.removeClass('selected');
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function () { showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

		} else if ($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		} else if ($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width: '2px' }, revealDuration, function () {
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function () { hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function () { $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function () { hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if ($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		} else if ($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width': $word.width() + 10 }, revealDuration, function () {
				setTimeout(function () { hideWord($word) }, revealAnimationDelay);
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');

		if (!$letter.is(':last-child')) {
			setTimeout(function () { hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else if ($bool) {
			setTimeout(function () { hideWord(takeNext($word)) }, animationDelay);
		}

		if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		}
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');

		if (!$letter.is(':last-child')) {
			setTimeout(function () { showLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else {
			if ($word.parents('.cd-headline').hasClass('type')) { setTimeout(function () { $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200); }
			if (!$bool) { setTimeout(function () { hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}


	// product slider 

	$('.slider').slick({
		infinite: true,
		slidesToShow: 5,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});


	// pointer js


	// UPDATE: I was able to get this working again... Enjoy!

	var cursor = document.querySelector('.cursor');
	var cursorinner = document.querySelector('.cursor2');
	var a = document.querySelectorAll('a');

	document.addEventListener('mousemove', function (e) {
		var x = e.clientX;
		var y = e.clientY;
		cursorinner.style.left = x + 'px';
		cursorinner.style.top = y + 'px';
	});

	document.addEventListener('mousedown', function () {
		cursor.classList.add('click');
		cursorinner.classList.add('cursorinnerhover')
	});

	document.addEventListener('mouseup', function () {
		cursor.classList.remove('click')
		cursorinner.classList.remove('cursorinnerhover')
	});

	a.forEach(item => {
		item.addEventListener('mouseover', () => {
			cursor.classList.add('hover');
		});
		item.addEventListener('mouseleave', () => {
			cursor.classList.remove('hover');
		});
	})
	const updateProperties = (elem, state) => {
		elem.style.setProperty('--x', `${state.x}px`)
		elem.style.setProperty('--y', `${state.y}px`)
		elem.style.setProperty('--width', `${state.width}px`)
		elem.style.setProperty('--height', `${state.height}px`)
		elem.style.setProperty('--radius', state.radius)
		elem.style.setProperty('--scale', state.scale)
	}

	document.querySelectorAll('.cursor').forEach(cursor => {
		let onElement

		const createState = e => {
			const defaultState = {
				x: e.clientX,
				y: e.clientY,
				width: 40,
				height: 40,
				radius: '50%'
			}

			const computedState = {}

			if (onElement != null) {
				const { top, left, width, height } = onElement.getBoundingClientRect()
				const radius = window.getComputedStyle(onElement).borderTopLeftRadius

				computedState.x = left + width / 2
				computedState.y = top + height / 2
				computedState.width = width
				computedState.height = height
				computedState.radius = radius
			}

			return {
				...defaultState,
				...computedState
			}
		}

		document.addEventListener('mousemove', e => {
			const state = createState(e)
			updateProperties(cursor, state)
		})

		document.querySelectorAll('a,input,button').forEach(elem => {
			elem.addEventListener('mouseenter', () => (onElement = elem))
			elem.addEventListener('mouseleave', () => (onElement = undefined))
		})
	});


});
