/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $;

$ = jQuery;

$(function () {
  var $header, $toc, chapterPadding, disableScroll, enableScroll, getTime, isMobile, isSize, keydown, keys, prevScrollTop, preventDefault, scrollToSection, wheel;
  $(window).on('load', function () {
    $('body').addClass('nn-loaded');
    return $('html').scroll();
  });
  $header = $('header#HEADER');
  $toc = $('#nn-toc');
  chapterPadding = 64;

  /** TOGGLES ACCORDION TEXT OPEN/CLOSE */
  $('body').on('click', '.nn-accordion .nn-toggle-title', function (e) {
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
  isSize = function isSize(check) {
    var size;
    size = $('body').css('content').replace(/['"]+/g, '');
    if (size === check) {
      return true;
    } else {
      return false;
    }
  };
  isMobile = function isMobile() {
    if (isSize('tablet') || isSize('mobile')) {
      return true;
    } else {
      return false;
    }
  };

  /** ANIMATE SCROLL TO CHAPTER OR CITATION */
  scrollToSection = function scrollToSection(hash) {
    var $newTarget, $target, $toggle, $wrapper, id, top;
    $target = $(hash);
    id = hash.replace('#', '');

    /** OPENS ACCORDION IF CITATION IS INSIDE */
    if ($target.is('.nn-content-wrapper')) {
      $wrapper = $target;
    } else {
      $wrapper = $target.parents('.nn-content-wrapper:not(.nn-opened)');
    }
    if ($wrapper.length) {
      $toggle = $wrapper.find('.nn-toggle-title');

      /** ADDS CLASS TO OPEN ACCORDION W/O ANIMATION */
      $wrapper.addClass('nn-static');
      $toggle.click();
    }
    top = $target.offset().top;
    if (isMobile()) {
      $newTarget = $target.find('.nn-chapter-title');
      if (['now', 'next'].indexOf(id) < 0 && $newTarget.length) {
        top = $newTarget.offset().top;
      }
    }
    if ($target.is('.nn-cite')) {
      top -= 32;
    }
    if ($target.is('.nn-scroll-next') && top <= $(window).scrollTop()) {
      return;
    }
    disableScroll();
    return $('html, body').stop().animate({
      scrollTop: top
    }, 500, function () {
      if ($wrapper.length) {
        $wrapper.removeClass('nn-static');
      }
      return setTimeout(function () {
        return enableScroll();
      }, 1000);
    });
  };

  /** LISTENER FOR INTERNAL NAVIGATION OR CITATION */
  $('#nn-toc a, .nn-cite').on('click', function (e) {
    var $target, hash;
    hash = $(this).attr('href');
    if (!hash.length || hash.substr(0, 1) !== '#') {
      return;
    }
    $target = $(hash);
    if (!$target.length) {
      return;
    }
    e.preventDefault();
    return scrollToSection(this.hash);
  });

  /** CHECKS FOR URL HASH ON PAGE LOAD */

  /** TOGGLES MOBILE NAV */
  $('#nn-toc').on('click', function (e) {
    return $(this).toggleClass('nn-opened');
  });

  /** OPENS SPOTLIGHT MODAL */
  $('a.nn-sl-link').on('click', function (e) {
    var $modal, sid;
    e.preventDefault();
    sid = $(this).attr('data-spotlight');
    $modal = $('.nn-sl-modal[data-spotlight="' + sid + '"]');
    $('body').addClass('nn-sl-modal-open');
    return $modal.addClass('show');
  });

  /** CLOSES SPOTLIGHT MODAL */
  $('.nn-sl-modal .nn-sl-close').on('click', function (e) {
    var $modal;
    $modal = $(this).parents('.nn-sl-modal');
    $('body').removeClass('nn-sl-modal-open');
    return $modal.removeClass('show');
  });
  prevScrollTop = 0;
  $(window).on('scroll', function (e) {
    var $currentChapter, $currentLink, $nextChapter, headerBottom, nextChapters, nextId, passedChapters, scrollTop, thisId;
    if (!$('body').is('.nn-loaded')) {
      return;
    }
    headerBottom = $header.offset().top + $header.innerHeight();
    scrollTop = $(window).scrollTop();

    /** FIXES RIGHT SIDE NAVIGATION AFTER IT HITS PAGE TOP */
    if (scrollTop >= headerBottom) {
      $toc.addClass('nn-fixed');
      if (isMobile()) {
        $('#CONTENT').css({
          paddingTop: $toc.innerHeight()
        });
      }
    } else {
      $toc.removeClass('nn-fixed');
      if (isMobile()) {
        $('#CONTENT').css({
          paddingTop: 0
        });
      } else {
        $('#CONTENT').attr('styles', '');
      }
    }

    /** FINDS CURRENT CHAPTER TO ADD STYLE TO RIGHT SIDE NAV AND UPDATES URL HASH */
    passedChapters = [];
    nextChapters = [];
    $('.nn-chapter').each(function (i, chapter) {
      var chapterDistance, chapterTop;
      chapterTop = $(chapter).offset().top;
      chapterDistance = chapterTop - chapterPadding - scrollTop;
      if (chapterDistance <= 0) {
        passedChapters.push(chapter);
      }
      if (chapterDistance <= 500 && i !== 0) {
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
        $currentLink.addClass('nn-current');
        if (!$body.is('.nn-disabled-scroll')) {
          setTimeout(function () {
            return $('.nn-scroll-next').removeClass('nn-scroll-next');
          }, 500);
        }
      }
    } else {
      history.replaceState(void 0, void 0, '#');
    }

    /** FIND NEXT CHAPTER WHEN SCROLLING DOWN */
    if (scrollTop > prevScrollTop && nextChapters.length && !$('body').is('.nn-disabled-scroll')) {
      $nextChapter = $(nextChapters[nextChapters.length - 1]);
      if (!$('.nn-scroll-next').length) {
        $nextChapter.addClass('nn-scroll-next');
        nextId = $nextChapter.attr('id');
        scrollToSection('#' + nextId);
      }
    }
    return prevScrollTop = scrollTop;
  });
  $(window).on('resize', function () {

    /** FIXES HEIGHT OF CAROUSEL SPACER TO ALLOW FOR FULL WIDTH BEYOND CONTENT COLUMN */
    var $inside, $opened_wrapper, insideHeight;
    $('.nn-carousel').each(function (i, carousel) {
      var $carousel, $placer, $wrapper;
      $carousel = $(carousel);
      $placer = $carousel.parents('.nn-carousel-placer');
      $wrapper = $carousel.parents('.carousel-wrapper');
      return setTimeout(function () {
        var carousel_height;
        carousel_height = $carousel.innerHeight();
        return $placer.css({
          height: carousel_height
        });
      }, 100);
    });

    /** RESIZES ACCORDION CONTENT WRAPPER HEIGHT */
    if ($opened_wrapper = $('.nn-content-wrapper.nn-opened')) {
      $inside = $opened_wrapper.find('.nn-inside');
      insideHeight = $inside.find('.nn-hidden-content').innerHeight();
      return $inside.css({
        height: insideHeight
      });
    }
  }).resize();
  $('.nn-player').each(function () {
    var $button, $player, $track, $trackFill, audio;
    $player = $(this);
    $button = $player.find('button');
    audio = $player.find('audio')[0];
    $track = $player.find('.nn-track');
    $trackFill = $player.find('.nn-track-played-fill');
    $button.on('click', function () {
      if ($player.is('.nn-playing')) {
        $player.addClass('nn-paused');
        $player.removeClass('nn-playing');
        return audio.pause();
      } else {
        $player.removeClass('nn-paused');
        $player.addClass('nn-playing');
        return audio.play();
      }
    });
    audio.onended = function () {
      $player.addClass('nn-paused');
      return $player.removeClass('nn-playing');
    };
    return $(audio).on('canplaythrough', function () {
      var duration, trackWidth;
      duration = audio.duration;
      $player.find('.nn-dur').html(getTime(duration));
      trackWidth = $track.innerWidth();
      $(audio).on('timeupdate', function () {
        var currentTime, percentPlayed;
        currentTime = audio.currentTime;
        $player.find('.nn-played').html(getTime(currentTime));
        percentPlayed = currentTime / duration;
        return $trackFill.css({
          width: $track.innerWidth() * percentPlayed
        });
      });
      return $track.on('click', function (e) {
        var clickedTime;
        clickedTime = (e.clientX - $track[0].getBoundingClientRect().left) / trackWidth;
        return audio.currentTime = duration * clickedTime;
      });
    });
  });
  getTime = function getTime(time) {
    var durM, durS;
    durM = parseInt(time / 60 % 60);
    durS = parseInt(time % 60);
    if (durM < 10) {
      durM = '0' + durM;
    }
    if (durS < 10) {
      durS = '0' + durS;
    }
    return durM + ':' + durS;
  };
  preventDefault = function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    return e.returnValue = false;
  };
  keys = [37, 38, 39, 40];
  keydown = function keydown(e) {
    var i;
    i = keys.length;
    while (i--) {
      if (e.keyCode === keys[i]) {
        preventDefault(e);
        return;
      }
    }
  };
  wheel = function wheel(e) {
    return preventDefault(e);
  };
  disableScroll = function disableScroll() {
    $body.addClass('nn-disabled-scroll');
    if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
    return document.onkeydown = keydown;
  };
  return enableScroll = function enableScroll() {
    $body.removeClass('nn-disabled-scroll');
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    return window.onmousewheel = document.onmousewheel = document.onkeydown = null;
  };
});

/***/ })
/******/ ]);