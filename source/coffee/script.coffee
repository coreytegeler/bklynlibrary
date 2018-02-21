$ = jQuery
$ ->
	$header = $('header#HEADER')
	$toc = $('#nn-toc')
	chapterPadding = 32

	$('body').on 'click', '.nn-accordion .nn-toggle-title', (e) ->
		e.preventDefault()
		$title = $(this)
		$wrapper = $title.parents('.nn-content-wrapper')
		$inside = $wrapper.find('.nn-inside')
		$accordion = $wrapper.parents('.nn-accordion')

		linkHeight = $title.innerHeight()
		insideHeight = $inside.find('.nn-hidden-content').innerHeight()
		if $wrapper.is('.nn-opened')
			newHeight = 0
		else
			newHeight = insideHeight
				
		$inside.css
			height: newHeight
		$wrapper.toggleClass('nn-opened')

	$('#nn-toc a').on 'click', (e) ->
		hash = this.hash.slice(1)
		target = $('.nn-chapter#'+hash)
		if !target.length
			return
		event.preventDefault()
		top = target.offset().top - chapterPadding + 5
		$('html, body').animate
			scrollTop: top
		, 500

	$('a.nn-sl-link').on 'click', (e) ->
		e.preventDefault()
		sid = $(this).attr('data-spotlight')
		$popup = $('.nn-sl-popup[data-spotlight="'+sid+'"]')
		$('body').addClass('nn-sl-popup-open')
		$popup.addClass('show')

	$('.nn-sl-popup .nn-sl-close').on 'click', (e) ->
		$popup = $(this).parents('.nn-sl-popup')
		$('body').removeClass('nn-sl-popup-open')
		$popup.removeClass('show')

	
	$(window).on 'scroll', () ->
		headerBottom = $header.offset().top + $header.innerHeight()
		scrolled = $(window).scrollTop()
		if scrolled >= headerBottom
			$toc.addClass('nn-fixed')
		else
			$toc.removeClass('nn-fixed')

		passedChapters = []
		$('.nn-chapter').each (i, chapter) ->
			chapterTop = $(chapter).offset().top
			chapterDistance = chapterTop - chapterPadding - scrolled
			# if $(chapter).attr('id') == 'intro'
			if chapterDistance <= 0
				passedChapters.push(chapter)
		if passedChapters.length
			$currentChapter = $(passedChapters[passedChapters.length-1])
			thisId = $currentChapter.attr('id')
			if location.hash.substr(1) != thisId
				history.replaceState(undefined, undefined, '#'+thisId)
			$currentLink = $toc.find('li.'+thisId)
			if !$currentLink.is('.current')
				$toc.find('li.current').removeClass('current')
				$currentLink.addClass('current')
		else
			history.replaceState(undefined, undefined, '#')
	.scroll()


	$(window).on 'resize', () ->
		$('.nn-carousel').each (i, carousel) ->
			$carousel = $(carousel)
			$placer = $carousel.parents('.nn-carousel-placer')
			$wrapper = $carousel.parents('.carousel-wrapper')
			setTimeout () ->
				carousel_height = $carousel.innerHeight()
				$placer.css
					height: carousel_height
			, 100

		if $opened_wrapper = $('.nn-content-wrapper.nn-opened')
			$inside = $opened_wrapper.find('.nn-inside')
			insideHeight = $inside.find('.nn-hidden-content').innerHeight()
			$inside.css
				height: insideHeight
	.resize()