var $;

$ = jQuery;

$(function() {
  var $header, $linkedChapter, $toc, chapterPadding, hash, isSize, top;
  $header = $('header#HEADER');
  $toc = $('#nn-toc');
  chapterPadding = 32;

  /** TOGGLES ACCORDION TEXT OPEN/CLOSE */
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

  /** CHECKS WHICH MEDIA QUERIES ARE IN USE */
  isSize = function(check) {
    var size;
    size = $('body').css('content').replace(/['"]+/g, '');
    if (size === check) {
      return true;
    } else {
      return false;
    }
  };

  /** ANIMATE SCROLL TO CHAPTER OR CITATION */
  $('#nn-toc a, .nn-cite').on('click', function(e) {
    var $toggle, $wrapper, hash, target, top;
    hash = this.hash;
    target = $(hash);
    if (!target.length) {
      return;
    }
    event.preventDefault();

    /** OPENS ACCORDION IF CITATION IS INSIDE */
    if ($wrapper = target.parents('.nn-content-wrapper:not(.nn-opened)')) {
      $toggle = $wrapper.find('.nn-toggle-title');

      /** ADDS CLASS TO OPEN ACCORDION W/O ANIMATION */
      $wrapper.addClass('nn-static');
      $toggle.click();
    }
    top = target.offset().top - chapterPadding + 5;
    return $('html, body').animate({
      scrollTop: top
    }, 500, function() {
      if ($wrapper.length) {
        return $wrapper.removeClass('nn-static');
      }
    });
  });

  /** TOGGLES MOBILE NAV */
  $('#nn-toc').on('click', function(e) {
    return $(this).toggleClass('nn-opened');
  });

  /**  OPENS SPOTLIGHT MODAL */
  $('a.nn-sl-link').on('click', function(e) {
    var $modal, sid;
    e.preventDefault();
    sid = $(this).attr('data-spotlight');
    $modal = $('.nn-sl-modal[data-spotlight="' + sid + '"]');
    $('body').addClass('nn-sl-modal-open');
    return $modal.addClass('show');
  });

  /**  CLOSES SPOTLIGHT MODAL */
  $('.nn-sl-modal .nn-sl-close').on('click', function(e) {
    var $modal;
    $modal = $(this).parents('.nn-sl-modal');
    $('body').removeClass('nn-sl-modal-open');
    return $modal.removeClass('show');
  });
  $(window).on('scroll', function() {
    var $currentChapter, $currentLink, headerBottom, nextChapters, passedChapters, scrolled, thisId;
    headerBottom = $header.offset().top + $header.innerHeight();
    scrolled = $(window).scrollTop();

    /**  FIXES RIGHT SIDE NAVIGATION AFTER IT HITS PAGE TOP */
    if (scrolled >= headerBottom) {
      $toc.addClass('nn-fixed');
      if (isSize('tablet') || isSize('mobile')) {
        $('#CONTENT').css({
          paddingTop: $toc.innerHeight()
        });
      }
    } else {
      $toc.removeClass('nn-fixed');
      if (isSize('tablet') || isSize('mobile')) {
        $('#CONTENT').css({
          paddingTop: 0
        });
      }
    }
    passedChapters = [];
    nextChapters = [];

    /**  FINDS CURRENT CHAPTER TO ADD STYLE TO RIGHT SIDE NAV AND UPDATES URL HASH */
    $('.nn-chapter').each(function(i, chapter) {
      var chapterDistance, chapterTop;
      chapterTop = $(chapter).offset().top;
      chapterDistance = chapterTop - chapterPadding - scrolled;
      if (chapterDistance <= 0) {
        passedChapters.push(chapter);
      }
      if (chapterDistance <= $(window).innerWidth() / 2) {
        return nextChapters.push(chapter);
      }
    });
    if (passedChapters.length) {
      $currentChapter = $(passedChapters[passedChapters.length - 1]);
      thisId = $currentChapter.attr('id');
      if (location.hash.substr(1) !== thisId) {
        history.replaceState(void 0, void 0, '#' + thisId);
      }
      $currentLink = $toc.find('li.nn-' + thisId);
      if (!$currentLink.is('.nn-current')) {
        $toc.find('li.nn-current').removeClass('nn-current');
        return $currentLink.addClass('nn-current');
      }
    } else {
      return history.replaceState(void 0, void 0, '#');
    }
  });

  /**  CHECKS FOR URL HASH ON PAGE LOAD */
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

    /**  FIXES HEIGHT OF CAROUSEL SPACER TO ALLOW FOR FULL WIDTH BEYOND CONTENT COLUMN */
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

    /**  RESIZES ACCORDION CONTENT WRAPPER HEIGHT */
    if ($opened_wrapper = $('.nn-content-wrapper.nn-opened')) {
      $inside = $opened_wrapper.find('.nn-inside');
      insideHeight = $inside.find('.nn-hidden-content').innerHeight();
      return $inside.css({
        height: insideHeight
      });
    }
  }).resize();
});
