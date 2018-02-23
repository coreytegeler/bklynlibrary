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


	#animate scroll to "chapter" if exists on current page
	$('#nn-toc a, .nn-cite').on 'click', (e) ->
		hash = this.hash
		target = $(hash)
		if !target.length
			return
		event.preventDefault()
		#if citation is in accordion, open w/o aniamtion
		if $wrapper = target.parents('.nn-content-wrapper:not(.nn-opened)')
			$toggle = $wrapper.find('.nn-toggle-title')
			$wrapper.addClass('nn-static')
			$toggle.click()
		top = target.offset().top - chapterPadding + 5
		$('html, body').animate
			scrollTop: top
		, 500, () ->
			if $wrapper.length
				$wrapper.removeClass('nn-static')

	#opens spotlight modal
	$('a.nn-sl-link').on 'click', (e) ->
		e.preventDefault()
		sid = $(this).attr('data-spotlight')
		$modal = $('.nn-sl-modal[data-spotlight="'+sid+'"]')
		$('body').addClass('nn-sl-modal-open')
		$modal.addClass('show')

	#closes spotlight modal
	$('.nn-sl-modal .nn-sl-close').on 'click', (e) ->
		$modal = $(this).parents('.nn-sl-modal')
		$('body').removeClass('nn-sl-modal-open')
		$modal.removeClass('show')

	
	$(window).on 'scroll', () ->
		headerBottom = $header.offset().top + $header.innerHeight()
		scrolled = $(window).scrollTop()
		if scrolled >= headerBottom
			$toc.addClass('nn-fixed')
		else
			$toc.removeClass('nn-fixed')

		passedChapters = []
		nextChapters = []
		$('.nn-chapter').each (i, chapter) ->
			chapterTop = $(chapter).offset().top
			chapterDistance = chapterTop - chapterPadding - scrolled
			if chapterDistance <= 0
				passedChapters.push(chapter)
			if chapterDistance <= $(window).innerWidth()/2
				nextChapters.push(chapter)

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

		# if nextChapters.length
		# 	console.log nextChapters



	if location.hash && location.hash.length
		hash = location.hash
		if $linkedChapter = $('.nn-chapter'+hash)
			top = $linkedChapter.offset().top - chapterPadding + 5
			setTimeout () ->
				$('html, body').animate
					scrollTop: top
				, 500
			, 100
	else
		$(window).scroll()


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