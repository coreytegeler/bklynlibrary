$ = jQuery
$ ->
	$('body').on 'click', '.accordion a', (e) ->
		e.preventDefault()
		$link = $(this)
		$wrapper = $link.parents('.content_wrapper')
		$inside = $wrapper.find('.inside')
		$accordion = $wrapper.parents('.accordion')

		linkHeight = $link.innerHeight()
		insideHeight = $inside.find('.hidden_content').innerHeight()
		if $wrapper.is('.opened')
			newHeight = 0
		else
			newHeight = insideHeight
			if $opened = $accordion.find('.opened')
				console.log $opened
				$opened.removeClass('opened')
				$opened.find('.inside').css
					height: 0
				
		$inside.css
			height: newHeight
		console.log $wrapper
		$wrapper.toggleClass('opened')


	$('.inline_nav.toc a').on 'click', (e) ->
		hash = this.hash.slice(1)
		target = $('.chapter#'+hash)
		console.log target
		if !target.length
			return
		event.preventDefault()
		top = target.offset().top
		if $header = $('header#HEADER')
			top -= $header.innerHeight()
		if $nav = $('nav.page-list')
			top -= $nav.innerHeight()
		$('html, body').animate
			scrollTop: top
		, 500
		# , () ->
			# // Callback after animation
			# // Must change focus!
			# $target = $(target)
			# $target.focus()
			# if $target.is(':focus')
			# 	# // Checking if the target was focused
			#   return false
			# else
			#   $target.attr('tabindex','-1') 
			#   # // Adding tabindex for elements not focusable
			#   $target.focus() 
				# // Set focus again
	
	$(window).on 'resize', () ->
		$('.carousel.full-width').each (i, carousel) ->
			$carousel = $(carousel)
			$placer = $carousel.parents('.carousel-placer')
			$wrapper = $carousel.parents('.carousel-wrapper')
			setTimeout () ->
				carousel_height = $carousel.innerHeight()
				$placer.css
					height: carousel_height
			, 100
	.resize()
			
