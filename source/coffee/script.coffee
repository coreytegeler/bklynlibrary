$ = jQuery
$ ->

	$(window).on 'load', () ->
		$('body').addClass('nn-loaded')
		$('html').scroll()

	$header = $('header#HEADER')
	$logo = $('header.branding')
	$lang = $('#nn-lang')
	$toc = $('#nn-toc')
	chapterPadding = 64
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
		$target = $(hash)
		id = hash.replace('#','')
		###* OPENS ACCORDION IF CITATION IS INSIDE ###
		if $target.is('.nn-content-wrapper')
			$wrapper = $target
		else
			$wrapper = $target.parents('.nn-content-wrapper:not(.nn-opened)')
		if $wrapper.length
			$toggle = $wrapper.find('.nn-toggle-title')
			###* ADDS CLASS TO OPEN ACCORDION W/O ANIMATION ###
			$wrapper.addClass('nn-static')
			$toggle.click()

		top = $target.offset().top
		# if !$target.is('.nn-chapter:first-child')
		# 	top -= chapterPadding
		if isMobile()
			$newTarget = $target.find('.nn-chapter-title')
			if ['now','next'].indexOf(id) < 0 && $newTarget.length
				top = $newTarget.offset().top

		if $target.is('.nn-cite')
			top -= 32
		
		if $target.is('.nn-scroll-next') && top <= $(window).scrollTop()
			return
		disableScroll()
		$('html, body').stop().animate
			scrollTop: top
		, 500, () ->
			if $wrapper.length
				$wrapper.removeClass('nn-static')
			setTimeout () ->
				enableScroll()
			, 1000


	###* LISTENER FOR INTERNAL NAVIGATION OR CITATION ###
	$('#nn-toc a, .nn-cite').on 'click', (e) ->
		hash = $(this).attr('href')
		if !hash.length || hash.substr(0,1) != '#'
			return
		$target = $(hash)
		if !$target.length
			return
		e.preventDefault()
		scrollToSection(this.hash)

	###* CHECKS FOR URL HASH ON PAGE LOAD ###
	# $(document).ready () ->
		# if location.hash && location.hash.length
		# 	setTimeout () ->
		# 		scrollToSection(location.hash)
		# 	, 100

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

	prevScrollTop = 0
	$(window).on 'scroll', (e) ->
		if !$('body').is('.nn-loaded')
			return
		headerBottom = $header.offset().top + $header.innerHeight()
		scrollTop = $(window).scrollTop()
		###* FIXES RIGHT SIDE NAVIGATION AFTER IT HITS PAGE TOP ###
		if scrollTop >= headerBottom
			$toc.addClass('nn-fixed')
			if isMobile()
				$('#CONTENT').css
					paddingTop: $toc.innerHeight()
		else
			$toc.removeClass('nn-fixed')
			if isMobile()
				$('#CONTENT').css
					paddingTop: 0
			else
				$('#CONTENT').attr('styles','')

		###* FIXES LEFT SIDE LANGUAGE AFTER IT HITS PAGE TOP ###
		if scrollTop >= headerBottom - $logo.innerHeight()
			$lang.addClass('nn-fixed')
		else
			$lang.removeClass('nn-fixed')

		###* FINDS CURRENT CHAPTER TO ADD STYLE TO RIGHT SIDE NAV AND UPDATES URL HASH ###
		passedChapters = []
		nextChapters = []
		$('.nn-chapter').each (i, chapter) ->
			chapterTop = $(chapter).offset().top
			chapterDistance = chapterTop - chapterPadding - scrollTop
			if chapterDistance <= 0
				passedChapters.push(chapter)
			if chapterDistance <= 500 && i != 0
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
				if !$body.is('.nn-disabled-scroll')
					setTimeout () ->
						$('.nn-scroll-next').removeClass('nn-scroll-next')
					, 500
		else
			history.replaceState(undefined, undefined, '#')

		###* FIND NEXT CHAPTER WHEN SCROLLING DOWN ###
		if scrollTop > prevScrollTop && nextChapters.length && !$('body').is('.nn-disabled-scroll')
			$nextChapter = $(nextChapters[nextChapters.length-1])
			if !$('.nn-scroll-next').length
				$nextChapter.addClass('nn-scroll-next')
				nextId = $nextChapter.attr('id')
				scrollToSection('#'+nextId)
		prevScrollTop = scrollTop


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

	$('.nn-player').each () ->
		$player = $(this)
		$button = $player.find('button')
		audio = $player.find('audio')[0]
		$track = $player.find('.nn-track')
		$trackFill = $player.find('.nn-track-played-fill')

		$button.on 'click', () ->
			if $player.is('.nn-playing')
				$player.addClass('nn-paused')
				$player.removeClass('nn-playing')
				audio.pause()
			else
				$player.removeClass('nn-paused')
				$player.addClass('nn-playing')
				audio.play()

		audio.onended = () ->
			$player.addClass('nn-paused')
			$player.removeClass('nn-playing')

		$(audio).on 'canplaythrough', () ->
			duration = audio.duration
			$player.find('.nn-dur').html(getTime(duration))
			trackWidth = $track.innerWidth()
			$(audio).on 'timeupdate', () ->
				currentTime = audio.currentTime
				$player.find('.nn-played').html(getTime(currentTime))
				percentPlayed = currentTime/duration
				$trackFill.css
					width: $track.innerWidth() * percentPlayed

			$track.on 'click', (e) ->
				clickedTime = (e.clientX - $track[0].getBoundingClientRect().left) / trackWidth
				audio.currentTime = duration * clickedTime

	getTime = (time) ->
		durM = parseInt((time / 60) % 60)
		durS = parseInt(time % 60)
		if durM < 10
			durM = '0'+durM
		if durS < 10
			durS = '0'+durS
		return durM+':'+durS

	preventDefault = (e) ->
		e = e || window.event
		if (e.preventDefault)
			e.preventDefault()
		e.returnValue = false; 

	keys = [37, 38, 39, 40]
	keydown = (e) ->
		i = keys.length
		while i--
			if (e.keyCode == keys[i])
				preventDefault(e)
				return

	wheel = (e) ->
		preventDefault(e)

	disableScroll = () ->
		$body.addClass('nn-disabled-scroll')
		if window.addEventListener
			window.addEventListener('DOMMouseScroll', wheel, false)
		window.onmousewheel = document.onmousewheel = wheel
		document.onkeydown = keydown

	enableScroll = () ->
		$body.removeClass('nn-disabled-scroll')
		if window.removeEventListener
			window.removeEventListener('DOMMouseScroll', wheel, false)
		window.onmousewheel = document.onmousewheel = document.onkeydown = null

	if hash = window.location.hash
		if $(hash).is('.nn-content-wrapper')
			scrollToSection(hash)