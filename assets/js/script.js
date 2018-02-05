var $;

$ = jQuery;

$(function() {
  $('body').on('click', '.accordion a', function(e) {
    var $accordion, $inside, $link, $opened, $wrapper, insideHeight, linkHeight, newHeight;
    e.preventDefault();
    $link = $(this);
    $wrapper = $link.parents('.content_wrapper');
    $inside = $wrapper.find('.inside');
    $accordion = $wrapper.parents('.accordion');
    linkHeight = $link.innerHeight();
    insideHeight = $inside.find('.hidden_content').innerHeight();
    if ($wrapper.is('.opened')) {
      newHeight = 0;
    } else {
      newHeight = insideHeight;
      if ($opened = $accordion.find('.opened')) {
        console.log($opened);
        $opened.removeClass('opened');
        $opened.find('.inside').css({
          height: 0
        });
      }
    }
    $inside.css({
      height: newHeight
    });
    console.log($wrapper);
    return $wrapper.toggleClass('opened');
  });
  return $('.inline_nav.toc a').on('click', function(e) {
    var $header, $nav, hash, target, top;
    hash = this.hash.slice(1);
    target = $('.chapter#' + hash);
    console.log(target);
    if (!target.length) {
      return;
    }
    event.preventDefault();
    top = target.offset().top;
    if ($header = $('header#HEADER')) {
      top -= $header.innerHeight();
    }
    if ($nav = $('nav.page-list')) {
      top -= $nav.innerHeight();
    }
    return $('html, body').animate({
      scrollTop: top
    }, 500);
  });
});
