$ = jQuery
$ ->
	$('body').on 'click', '.accordion a', (e) ->
		e.preventDefault()
		$link = $(this)
		$li = $link.parents('li')
		$inside = $li.find('.inside')
		$accordion = $li.parents('.accordion')

		linkHeight = $link.innerHeight()
		insideHeight = $inside.find('.content').innerHeight()
		console.log $inside

		if $li.is('.opened')
			newHeight = 0
		else
			newHeight = insideHeight
			if $opened = $accordion.find('.opened')
				$opened.removeClass('opened')
				$opened.find('.inside').css
					height: 0
				
		$inside.css
			height: newHeight
		$li.toggleClass('opened')


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
