var $;

$ = jQuery;

$(function() {
  var $header;
  $header = $('header#HEADER');
  $('body').on('click', '.nn-accordion .nn-toggle-title', function(e) {
    var $accordion, $inside, $opened, $title, $wrapper, insideHeight, linkHeight, newHeight;
    e.preventDefault();
    $title = $(this);
    $wrapper = $title.parents('.nn-content-wrapper');
    $inside = $wrapper.find('.nn-inside');
    $accordion = $wrapper.parents('.nn-accordion');
    linkHeight = $title.innerHeight();
    insideHeight = $inside.find('.nn-hidden-content').innerHeight();
    if ($wrapper.is('.nn-opened')) {
      newHeight = 0;
    } else {
      newHeight = insideHeight;
      if ($opened = $accordion.find('.nn-opened')) {
        $opened.removeClass('nn-opened');
        $opened.find('.nn-inside').css({
          height: 0
        });
      }
    }
    $inside.css({
      height: newHeight
    });
    return $wrapper.toggleClass('nn-opened');
  });
  $('#nn-toc a').on('click', function(e) {
    var hash, target, top;
    hash = this.hash.slice(1);
    target = $('.chapter#' + hash);
    if (!target.length) {
      return;
    }
    event.preventDefault();
    top = target.offset().top;
    return $('html, body').animate({
      scrollTop: top
    }, 500);
  });
  $(window).on('scroll', function() {
    var $toc, headerBottom, scrolled;
    headerBottom = $header.offset().top + $header.innerHeight();
    scrolled = $(window).scrollTop();
    $toc = $('#toc');
    if (scrolled >= headerBottom) {
      return $toc.addClass('fixed');
    } else {
      return $toc.removeClass('fixed');
    }
  });
  return $(window).on('resize', function() {
    var $inside, $opened_wrapper, insideHeight;
    $('.nn-carousel').each(function(i, carousel) {
      var $carousel, $placer, $wrapper;
      $carousel = $(carousel);
      $placer = $carousel.parents('.nn-carousel-placer');
      $wrapper = $carousel.parents('.carousel-wrapper');
      return setTimeout(function() {
        var carousel_height;
        carousel_height = $carousel.innerHeight();
        return $placer.css({
          height: carousel_height
        });
      }, 100);
    });
    if ($opened_wrapper = $('.nn-content-wrapper.nn-opened')) {
      $inside = $opened_wrapper.find('.nn-inside');
      insideHeight = $inside.find('.nn-hidden-content').innerHeight();
      console.log(insideHeight);
      return $inside.css({
        height: insideHeight
      });
    }
  }).resize();
});
