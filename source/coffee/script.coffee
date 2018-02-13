$ = jQuery
$ ->
	$header = $('header#HEADER')

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
			if $opened = $accordion.find('.nn-opened')
				$opened.removeClass('nn-opened')
				$opened.find('.nn-inside').css
					height: 0
				
		$inside.css
			height: newHeight
		$wrapper.toggleClass('nn-opened')


	$('#nn-toc a').on 'click', (e) ->
		hash = this.hash.slice(1)
		target = $('.chapter#'+hash)
		if !target.length
			return
		event.preventDefault()
		top = target.offset().top
		$('html, body').animate
			scrollTop: top
		, 500
	
	$(window).on 'scroll', () ->
		headerBottom = $header.offset().top + $header.innerHeight()
		scrolled = $(window).scrollTop()
		$toc = $('#toc')
		if scrolled >= headerBottom
			$toc.addClass('fixed')
		else
			$toc.removeClass('fixed')

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
			console.log insideHeight
			$inside.css
				height: insideHeight
	.resize()
			
