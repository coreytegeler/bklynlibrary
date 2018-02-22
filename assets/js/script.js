var $;

$ = jQuery;

$(function() {
  var $header, $linkedChapter, $toc, chapterPadding, hash, top;
  $header = $('header#HEADER');
  $toc = $('#nn-toc');
  chapterPadding = 32;
  $('body').on('click', '.nn-accordion .nn-toggle-title', function(e) {
    var $accordion, $inside, $title, $wrapper, insideHeight, linkHeight, newHeight;
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
    }
    $inside.css({
      height: newHeight
    });
    return $wrapper.toggleClass('nn-opened');
  });
  $('#nn-toc a').on('click', function(e) {
    var hash, target, top;
    hash = this.hash.slice(1);
    target = $('.nn-chapter#' + hash);
    if (!target.length) {
      return;
    }
    event.preventDefault();
    top = target.offset().top - chapterPadding + 5;
    return $('html, body').animate({
      scrollTop: top
    }, 500);
  });
  $('a.nn-sl-link').on('click', function(e) {
    var $modal, sid;
    e.preventDefault();
    sid = $(this).attr('data-spotlight');
    $modal = $('.nn-sl-modal[data-spotlight="' + sid + '"]');
    $('body').addClass('nn-sl-modal-open');
    return $modal.addClass('show');
  });
  $('.nn-sl-modal .nn-sl-close').on('click', function(e) {
    var $modal;
    $modal = $(this).parents('.nn-sl-modal');
    $('body').removeClass('nn-sl-modal-open');
    return $modal.removeClass('show');
  });
  $(window).on('scroll', function() {
    var $currentChapter, $currentLink, headerBottom, passedChapters, scrolled, thisId;
    headerBottom = $header.offset().top + $header.innerHeight();
    scrolled = $(window).scrollTop();
    if (scrolled >= headerBottom) {
      $toc.addClass('nn-fixed');
    } else {
      $toc.removeClass('nn-fixed');
    }
    passedChapters = [];
    $('.nn-chapter').each(function(i, chapter) {
      var chapterDistance, chapterTop;
      chapterTop = $(chapter).offset().top;
      chapterDistance = chapterTop - chapterPadding - scrolled;
      if (chapterDistance <= 0) {
        return passedChapters.push(chapter);
      }
    });
    if (passedChapters.length) {
      $currentChapter = $(passedChapters[passedChapters.length - 1]);
      thisId = $currentChapter.attr('id');
      if (location.hash.substr(1) !== thisId) {
        history.replaceState(void 0, void 0, '#' + thisId);
      }
      $currentLink = $toc.find('li.' + thisId);
      if (!$currentLink.is('.current')) {
        $toc.find('li.current').removeClass('current');
        return $currentLink.addClass('current');
      }
    } else {
      return history.replaceState(void 0, void 0, '#');
    }
  });
  if (location.hash && location.hash.length) {
    hash = location.hash;
    if ($linkedChapter = $('.nn-chapter' + hash)) {
      top = $linkedChapter.offset().top - chapterPadding + 5;
      setTimeout(function() {
        return $('html, body').animate({
          scrollTop: top
        }, 500);
      }, 100);
    }
  } else {
    $(window).scroll();
  }
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
      return $inside.css({
        height: insideHeight
      });
    }
  }).resize();
});
