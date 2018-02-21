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
  var $header, $toc, chapterPadding;
  $header = $('header#HEADER');
  $toc = $('#nn-toc');
  chapterPadding = 32;
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
  $('#nn-toc a').on('click', function (e) {
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
  $('a.nn-sl-link').on('click', function (e) {
    var $popup, sid;
    e.preventDefault();
    sid = $(this).attr('data-spotlight');
    $popup = $('.nn-sl-popup[data-spotlight="' + sid + '"]');
    $('body').addClass('nn-sl-popup-open');
    return $popup.addClass('show');
  });
  $('.nn-sl-popup .nn-sl-close').on('click', function (e) {
    var $popup;
    $popup = $(this).parents('.nn-sl-popup');
    $('body').removeClass('nn-sl-popup-open');
    return $popup.removeClass('show');
  });
  $(window).on('scroll', function () {
    var $currentChapter, $currentLink, headerBottom, passedChapters, scrolled, thisId;
    headerBottom = $header.offset().top + $header.innerHeight();
    scrolled = $(window).scrollTop();
    if (scrolled >= headerBottom) {
      $toc.addClass('nn-fixed');
    } else {
      $toc.removeClass('nn-fixed');
    }
    passedChapters = [];
    $('.nn-chapter').each(function (i, chapter) {
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
  }).scroll();
  return $(window).on('resize', function () {
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
    if ($opened_wrapper = $('.nn-content-wrapper.nn-opened')) {
      $inside = $opened_wrapper.find('.nn-inside');
      insideHeight = $inside.find('.nn-hidden-content').innerHeight();
      return $inside.css({
        height: insideHeight
      });
    }
  }).resize();
});

/***/ })
/******/ ]);