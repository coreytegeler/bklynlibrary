var $;

$ = jQuery;

$(function() {
  $('body').on('click', '.accordion a', function(e) {
    var $accordion, $inside, $li, $link, $opened, insideHeight, linkHeight, newHeight;
    e.preventDefault();
    $link = $(this);
    $li = $link.parents('li');
    $inside = $li.find('.inside');
    $accordion = $li.parents('.accordion');
    linkHeight = $link.innerHeight();
    insideHeight = $inside.find('.content').innerHeight();
    console.log($inside);
    if ($li.is('.opened')) {
      newHeight = 0;
    } else {
      newHeight = insideHeight;
      if ($opened = $accordion.find('.opened')) {
        $opened.removeClass('opened');
        $opened.find('.inside').css({
          height: 0
        });
      }
    }
    $inside.css({
      height: newHeight
    });
    return $li.toggleClass('opened');
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
