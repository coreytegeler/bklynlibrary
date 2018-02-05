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
  $('body').on('click', '.accordion a', function (e) {
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
  return $('.inline_nav.toc a').on('click', function (e) {
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

/***/ })
/******/ ]);