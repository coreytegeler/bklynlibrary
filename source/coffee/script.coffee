$ = jQuery
$ ->
	$header = $('header#HEADER')
	$toc = $('#nn-toc')
	chapterPadding = 32
	###* TOGGLES ACCORDION TEXT OPEN/CLOSE ###
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


	###* CHECKS WHICH MEDIA QUERIES ARE IN USE  ###
	isSize = (check) ->
		size = $('body').css('content').replace(/['"]+/g, '')
		if size == check
			return true
		else
			return false

	isMobile = () ->
		if isSize('tablet') || isSize('mobile')
			return true
		else
			return false

	###* ANIMATE SCROLL TO CHAPTER OR CITATION ###
	scrollToSection = (hash) ->
		console.log hash
		$target = $(hash)
		id = hash.replace('#','')
		###* OPENS ACCORDION IF CITATION IS INSIDE ###
		if $wrapper = $target.parents('.nn-content-wrapper:not(.nn-opened)')
			$toggle = $wrapper.find('.nn-toggle-title')
			###* ADDS CLASS TO OPEN ACCORDION W/O ANIMATION ###
			$wrapper.addClass('nn-static')
			$toggle.click()

		top = $target.offset().top - chapterPadding + 5	
		if isMobile()
			$newTarget = $target.find('.nn-chapter-title')
			if ['now','next'].indexOf(id) < 0 && $newTarget.length
				top = $newTarget.offset().top
		
		$('html, body').animate
			scrollTop: top
		, 500, () ->
			if $wrapper.length
				$wrapper.removeClass('nn-static')


	###* LISTENER FOR INTERNAL NAVIGATION OR CITATION ###
	$('#nn-toc a, .nn-cite').on 'click', (e) ->
		hash = $(this).attr('href')
		$target = $(hash)
		if !$target.length
			return
		event.preventDefault()
		scrollToSection(this.hash)

	###* CHECKS FOR URL HASH ON PAGE LOAD ###
	$(document).ready () ->
		if location.hash && location.hash.length
			setTimeout () ->
				scrollToSection(location.hash)
			, 100

	###* TOGGLES MOBILE NAV ###
	$('#nn-toc').on 'click', (e) ->
		$(this).toggleClass('nn-opened')

	###* OPENS SPOTLIGHT MODAL ###
	$('a.nn-sl-link').on 'click', (e) ->
		e.preventDefault()
		sid = $(this).attr('data-spotlight')
		$modal = $('.nn-sl-modal[data-spotlight="'+sid+'"]')
		$('body').addClass('nn-sl-modal-open')
		$modal.addClass('show')

	###* CLOSES SPOTLIGHT MODAL ###
	$('.nn-sl-modal .nn-sl-close').on 'click', (e) ->
		$modal = $(this).parents('.nn-sl-modal')
		$('body').removeClass('nn-sl-modal-open')
		$modal.removeClass('show')

	
	$(window).on 'scroll', () ->
		headerBottom = $header.offset().top + $header.innerHeight()
		scrolled = $(window).scrollTop()
		###* FIXES RIGHT SIDE NAVIGATION AFTER IT HITS PAGE TOP ###
		if scrolled >= headerBottom
			$toc.addClass('nn-fixed')
			if isMobile()
				$('#CONTENT').css
					paddingTop: $toc.innerHeight()
		else
			$toc.removeClass('nn-fixed')
			if isMobile()
				$('#CONTENT').css
					paddingTop: 0

		passedChapters = []
		nextChapters = []
		###* FINDS CURRENT CHAPTER TO ADD STYLE TO RIGHT SIDE NAV AND UPDATES URL HASH ###
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
			$currentLink = $toc.find('li.nn-'+thisId)
			if !$currentLink.is('.nn-current')
				$toc.find('li.nn-current').removeClass('nn-current')
				$currentLink.addClass('nn-current')
		else
			history.replaceState(undefined, undefined, '#')


	$(window).on 'resize', () ->
		###* FIXES HEIGHT OF CAROUSEL SPACER TO ALLOW FOR FULL WIDTH BEYOND CONTENT COLUMN ###
		$('.nn-carousel').each (i, carousel) ->
			$carousel = $(carousel)
			$placer = $carousel.parents('.nn-carousel-placer')
			$wrapper = $carousel.parents('.carousel-wrapper')
			setTimeout () ->
				carousel_height = $carousel.innerHeight()
				$placer.css
					height: carousel_height
			, 100

		###* RESIZES ACCORDION CONTENT WRAPPER HEIGHT ###
		if $opened_wrapper = $('.nn-content-wrapper.nn-opened')
			$inside = $opened_wrapper.find('.nn-inside')
			insideHeight = $inside.find('.nn-hidden-content').innerHeight()
			$inside.css
				height: insideHeight
	.resize()
