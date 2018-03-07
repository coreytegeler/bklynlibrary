/*
==========================================================================================
BROOKLYN PUBLIC LIBRARY | 2015-2016 - flat.com
==========================================================================================
==========================================================================================
scripts-1.0.js


/*
==========================================================================================
CORE JAVASCRIPT
==========================================================================================
*/
// ---------------------------------------------------------------------------------------
// GLOBAL VARIABLES
// ---------------------------------------------------------------------------------------
var $body = jQuery("body");		// <body> is set
var $scrollspy;				// <body> is tracked for ScrollSpy
var $timer = 400;			// set default timing to be used Globally, where needed
var $nav_queue, 			// Tracks the Navigation Menu in the Drawer that is open
	$modal_queue, 			// Tracks the Modal-type that is being opened, and is used to apply and toggle a 'modal-open' class to the body
	$mobile_view = null;	// boolean:true => the site is < 568px wide; used for director reels
	
	
// need to use drupal behavior for carousels loaded by ajax

// add dots for page/image slideshows
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// CAROUSELS
(function($) {
	
document.addEventListener('DOMContentLoaded', function () {
  if ( $('body').hasClass('front') ) {
	  BackgroundCheck.init({
		targets: '.nav-item',
		  images: '#fwpromo',
		  threshold: 60,
		  minOverlap: 50
	  });
  }
});

Drupal.behaviors.carouselBehavior = {
   attach: function () {

	var carousels = [1, 2, 4, 5, 6, 8],
		carouselCols = [];
		
	// Initialize Carousels for all specified column variations
	carousels.forEach(function(i) {
		carouselCols[i] = $('.carousel.col-'+ i).not('.slick-applied').slick({
			nextArrow: '<div class="carousel-nav next"><span class="icon-arrow-right"></span></div>',
			prevArrow: '<div class="carousel-nav prev"><span class="icon-arrow-left"></span></div>',
			lazyLoad: 'anticipated',
			slidesToShow: i
		}).addClass('slick-applied');
		
		if ( $('body').hasClass('page-node-134971') || $('body').hasClass('page-node-134972') || $('body').hasClass('page-node-134974') || $('body').hasClass('page-node-134975')  || $('body').hasClass('page-node-134977') ){
			$(carouselCols[i]).slick("slickSetOption", "autoplay", true, true);
			$(carouselCols[i]).slick("slickSetOption", "autoplaySpeed", 5000, true);
		}
		
		if ( $('body').hasClass('page-node-156452') ){ // stratplan report page
			$(carouselCols[i]).slick("slickSetOption", "variableWidth", true, true);
		}
		
		if (i >= 4){
			$(carouselCols[i]).slick(
				'slickSetOption',
				'responsive', [{
					breakpoint: 768,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4
					}
				},{
					breakpoint: 480,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},{
					breakpoint: 330,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}], true);
		}
		if (i == 2){
			$(carouselCols[i]).slick(
				'slickSetOption',
				'responsive', [{
					breakpoint: 1020,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}], true);
		}
	});
	
	// Carousel Filtering
	$('.carousel-wrapper .list-horizontal li').once().on('click', function() {
		var $filter = $(this).data('filter'),
			$carousel = '#'+ $(this).closest('.carousel-wrapper').attr('id') +' .carousel';
			$(this).addClass('selected')
				.siblings()
				.removeClass('selected');
			$($carousel)
				.slick('slickUnfilter')
				.slick('slickFilter', "."+$filter); // Add a '.' to acknowledge filters are ClassNames
	});
	
	$('.carousel-wrapper').once('filter', function() {
		//if ( !$('body').hasClass('front') ) {
		//	$('.carousel-wrapper.booklist .list-horizontal li:first').trigger('click');
		//} else {
			var numElements = $('.booklist .list-horizontal li').length+1;
			var randomNum = Math.floor(Math.random()*numElements);
			$('.booklist .list-horizontal li:nth-child(' + randomNum + ')').trigger('click');
			$('.front #carousel-ev .list-horizontal li:first, .front #carousel-lr .list-horizontal li:first').trigger('click');
		//}
	});
   
   }
};

Drupal.behaviors.bplGeneral = {
	//attach: function(context, settings)
	attach: function(context, settings)
	{
	 // if (context == document) {
		// ---------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------
		//modal click was here - caused dupe search box
		
		// MODALS, ATTACH TO LINKS AND BUTTONS WITH [role='modal']
		//$("[role='modal']").once('modal', function() {
			//$("[role='modal']", context).once('mymodule').on( 'click',  function( e ) {
			$("[role='modal']", context).on( 'click',  function( e ) {
				e.preventDefault();
				$modal_queue = $(this).data('modal');
				console.log('modal');
				if( !$('body').hasClass('modal-open') ) {
				//console.log( $modal_queue );
					if( $(this).data('amenity') ) {
						$(body).addClass('amenity-init');
					}
					if( $modal_queue == 'search' && $('body').hasClass('mobile') && $('body').hasClass('drawer-open') ) { // If on Mobile, and the search is hit, we need to Toggle the DRAWER
						DRAWER.hideDrawerMenu();
					}
					MODAL.modalShow(); // open the sliding menu
				} else {
					MODAL.modalHide();
					return true;
				}
			});
		
		//});
	 // }
	}
};

	$(document).ajaxError(function() {
	   // prevent ajax errors alerts
	});
  
})(jQuery);
	
	
	
	


// ---------------------------------------------------------------------------------------
// MOBILE - simple functions for checking breakpoints
// ---------------------------------------------------------------------------------------
var MOBILE = (function($) {
	
	var $body, $mobile_view;
	var $breakpoint = 568;
	
	var init = function() { // init() will run, when layout detection yields non-mobile flag
		initMobile();
		checkMobile();
	},
	destroy = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
	},
	initMobile = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
	},
	setAsMobile = function() {
		$mobile_view = true;
		$body.addClass( "mobile" );
		if( $body.hasClass( "drawer-open") ) {
			DRAWER.destroy();		// disable drawer
		}
	},
	setAsNotMobile = function() {
		$mobile_view = false;
		$( "body.mobile" ).removeClass( "mobile" );
		$( "#body" ).hide().show();	// trigger a display reload
		DRAWER.init(); 				// enable drawer
	},
	checkMobile = function() {
		/*
		NOTE: Breakpoints can be converted to an array, and looped over to apply classNames and other attributes...
		*/
		var $pageWidth = $body.width();
		if( parseInt( $pageWidth ) <= parseInt( $breakpoint ) ) {
			if( $mobile_view !== 'true' ) {
				setAsMobile();		// If this was already mobile, do nothing. Otherwise set the page as mobile
				return;
			}
		}
		else {
			setAsNotMobile();		// If this page is wide
		}
	};
	
	return {
		init: init,
		destroy: destroy,
		setAsMobile: setAsMobile,
		setAsNotMobile: setAsNotMobile,
		checkMobile: checkMobile
	};
})(jQuery);
	
	
// ---------------------------------------------------------------------------------------
// DRAWER - slides in from the left & locks the <body>; most attributes are defined in CSS
// ---------------------------------------------------------------------------------------
var DRAWER = (function($) {
	
	var $body, $bodyFog; 			// Pass in Globals
	var contentWidth,				//
		contentWidthNav = 450,		// 200+250 == $( "nav.main" ).width() + slide out nav tray;
		displacementValue = 450,	// 200+250 == $( "nav.main" ).width() + slide out nav tray;
		timer = $timer; 			//
		
	var init = function() { // init() will run, when layout detection yields non-mobile flag
		setWidths();
		initBodyFog();
	},
	destroy = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
		$.debounce( 100, hideDrawerMenu() );
	},
	initBodyFog = function() {
		$bodyFog = (typeof $bodyFog === 'undefined') ? $( "#bodyfog" ): $bodyFog;
	},
	initScrollSpy = function() {
		$scrollspy = (typeof $scrollspy === 'undefined') ? $( "body" ): $scrollspy;
	},
	setWidths = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
		// Set the width of primary content container content should not scale while animating
		contentWidth = $body.width();
		initScrollSpy(); 
	},
	showDrawerMenu = function() {
		setWidths();
		$body.switchClass("drawer-closed", "drawer-open", timer, "easeOutCubic", function() {
			$('.navigation-section').each( function() {
				if( !$(this).hasClass('hide') ) {
					$(this).addClass('hide');
				}
			});
			$nav_queue.delay( timer/2 ).fadeIn( timer/2, function() {
				$(this).removeClass('hide');
			});
			$('#drawer>nav').show();
		});
		
		// Prevent Scaling of the Header, when the drawer slides back in
		var $_header_height = $("#HEADER").height();
		var $_header_width	= $("#HEADER").width();
		showFog();
		
		// Disable all scrolling on mobile devices while menu is shown
		$scrollspy.bind( 'touchmove', function( e ) {
			e.preventDefault();
		});
		
		// Enable the close button on the drawer
		$( "#drawer .close-button" ).on( 'click', function( e ) {
			e.preventDefault();
			hideDrawerMenu();
		});
		$body.on( 'resize', $.debounce( 200, function() {
				$body.attr({'style':''});
			})
		);
	},
	hideDrawerMenu = function() {
		// Enable all scrolling on mobile devices when menu is closed
		$('#drawer>nav').fadeOut( 0, function() {
			$body.unbind( 'touchmove' ).switchClass("drawer-open", "drawer-closed", timer, "easeOutCubic", function() {
				$body.attr({'style':''});
				hideFog();
			});
			$('.navigation-section').each( function() {
				if( !$(this).hasClass('hide') ) {
					$(this).addClass('hide').hide();
				}
			});
		 });
		// http://stackoverflow.com/questions/11284194/css3-transition-event-listener-with-jquery
		$body.bind( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
			$(this).off(e);
		});
		$( "#drawer .close-button" ).off( 'click' );
	},
	showSubMenu = function() {
		$('.navigation-section').each( function() {
			if( !$(this).hasClass('hide') ) {
				$(this).addClass('hide').hide();
			}
		});
		$nav_queue.fadeIn( timer/2, function() {
			$(this).removeClass('hide');
		});
	},
	showFog = function() {
		// Display a layer to disable clicking and scrolling on the content while menu is shown
		initBodyFog();
		$bodyFog.on( 'click', function( e ) {
			e.preventDefault();
			hideDrawerMenu();		// close the sliding menu
		});
		$bodyFog
			.css( {"left":"0px", "margin-left":"0px"})
			.fadeIn('fast', function() {
				$bodyFog.css( "display","block" );
			});
	},
	hideFog = function() {
		// Hide a layer that disables clicking and scrolling on the content while menu is shown
		initBodyFog();
		$bodyFog
			.fadeOut('fast', function() {
			//	$bodyFog.css( {"display":"none","z-index":"-1"});
			if ( $('body').hasClass('front') ) { BackgroundCheck.refresh(); }
			});
		$bodyFog.off();
	},
	toggleMenu = function() {
		if ( !$('body').hasClass('drawer-open') ) {
			$('body').addClass('drawer-open');
			showDrawerMenu();
		} else {
			$('body').removeClass('drawer-open');
			showSubMenu(); // should this be removed ?? - Tom
			hideDrawerMenu(); // added this otherwise user cannot scroll the page after closing upper left X - menu close button - Tom
		}
	};

	return {
		init: init,
		destroy: destroy,
		showDrawerMenu: showDrawerMenu,
		hideDrawerMenu: hideDrawerMenu,
		showSubMenu: showSubMenu,
		toggleMenu: toggleMenu
	};
})(jQuery);


// ---------------------------------------------------------------------------------------
// MODALS
// ---------------------------------------------------------------------------------------
var MODAL = (function($) {
	
	var $body, $bodyModal; 			// Pass in Globals
	var contentWidth,				//
		timer = $timer; 			//
	
	var init = function() { // init() will run, when layout detection yields non-mobile flag
		initModal();
	},
	destroy = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
		$bodyModal = (typeof $bodyModal === 'undefined') ? $( "#bodymodal" ): $bodyModal;
		$.debounce( 100, modalHide() );
	},
	initModal = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
		$bodyModal = (typeof $bodyModal === 'undefined') ? $( "#bodymodal" ): $bodyModal;
	},
	modalShow = function() {
		if( $modal_queue ) {
			switch( $modal_queue ) {
				case 'search':
				qval = $('#HOMEPAGE-SEARCH input[type="text"]').val();
					$.ajax({
						url: Drupal.settings.basePath + Drupal.settings.pathToTheme+'/includes/modals/modal-search.php', // JS.APP_PATH + "modal/search",
						method: "GET",
						data: {query: qval},
						dataType: 'html',
						beforeSend: function() {
						},
					})
					.done( function( data ) {})
					.fail( function() {})
					.success( function( data ) {
						$bodyModal.prepend(data);
						$bodyModal.prepend( $('#sbox').html() );
						$bodyModal.find('#SITE-SEARCH input[type="text"]').val(qval);//.end().find('#SITE-SEARCH').submit();
					})
					.complete( function( response ) {
						$bodyModal.addClass('search-init');
					});
				break;

				default:
					hash = $modal_queue.substring($modal_queue.indexOf('#')+1);
					$.ajax({
						//url: Drupal.settings.basePath + Drupal.settings.pathToTheme+'/includes/modals/'+$modal_queue, // JS.APP_PATH + "modal/search",
						url: Drupal.settings.basePath + $modal_queue, // JS.APP_PATH + "modal/search",
						method: "GET",
						dataType: 'html',
						beforeSend: function() {},
					})
					.done( function( data ) {})
					.fail( function() {})
					.success( function( data ) {
						$bodyModal.prepend(data);
						if ($modal_queue.indexOf('branchamenities') > -1) {
							setTab(hash);
						}
					})
					.complete( function( response ) {});
				break;
			}
		}
		$body.switchClass("modal-closed", "modal-open", timer, "easeOutCubic", function() {
			$bodyModal.on( 'click', function( e ) {
				e.stopPropagation();
				if( !$(this).hasClass('search-init') && !$(body).hasClass('amenity-init') ) {
					modalHide();
				}
			});
		});
	},
	modalHide = function() {
		$body.unbind( 'touchmove' ).delay( timer/4 ).switchClass("modal-open", "modal-closed", timer/2, "easeOutCubic", function() {
			if( $modal_queue ) {
				$modal_queue = null;
			}
			$bodyModal.empty();
			$(body).removeClass('amenity-init');
		});
	};
	return {
		init: init,
		destroy: destroy,
		modalShow: modalShow,
		modalHide: modalHide
	};
})(jQuery);


// ---------------------------------------------------------------------------------------
// SEARCH
// ---------------------------------------------------------------------------------------
var SEARCH = (function($) {
	
	var $body, $bodyModal; 			// Pass in Globals
	var	timer = $timer; 			//
	
	var init = function() { // init() will run, when layout detection yields non-mobile flag
		initSearch();
	},
	destroy = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
		$bodyModal = (typeof $bodyModal === 'undefined') ? $( "#bodymodal" ): $bodyModal;
		$.debounce( 100, modalHide() );
	},
	initSearch = function() {
		$body = (typeof $body === 'undefined') ? $( "body" ): $body;
		$bodyModal = (typeof $bodyModal === 'undefined') ? $( "#bodymodal" ): $bodyModal;
	},
	fetchResults = function() {
		$bodyModal.find('#SEARCH-RETURN').empty();
		qval = $('#SITE-SEARCH input[type="text"]').val();
		console.log(qval);
		$.ajax({
			url: Drupal.settings.basePath + Drupal.settings.pathToTheme+'/includes/modals/modal-search-results.php', // JS.APP_PATH + "modal/search",
			method: "GET",
			data: { query: qval} ,
			dataType: 'html',
			beforeSend: function() {},
		})
		.done( function( data ) {})
		.fail( function() {})
		.success( function( data ) {
			$bodyModal.find('#SEARCH-RETURN').html(data);
		})
		.complete( function( response ) {});
	};
	return {
		init: init,
		destroy: destroy,
		fetchResults: fetchResults
	};
})(jQuery);


// ---------------------------------------------------------------------------------------
// DOCUMENT READY
// ---------------------------------------------------------------------------------------
//jQuery(document).ready(function() {
(function($){
	
// main nav add phone to online chat link
$('#GLOBAL-navigation-sub .menu-mlid-1060 a').append('<br><small class="font-weight-normal">or call (718) 230-2100</small>');

// copy lang dropdown to top of immigrants learn page
if ( $('body.page-node-3048').length ) {
		var $clone_langdrp = $('#google_translate_element').clone(); 
		$clone_langdrp.prependTo('#HEADER-SHARE p');
}
	
$('#learning_resources').ajaxStart(function(){
   $('#view-filters-id').fadeTo(300, 0.5);
   console.log('got ajax start');
});
$('#learning_resources').ajaxSuccess(function(){
   $('#view-filters-id').fadeTo(300, 1.0);
});
	
	// check if user already closed alert
	//showalert = sessionStorage.getItem("alert")
	showalert = readCookie('alert');
	if (showalert !== null){
		$( ".site-alert" ).hide();
		$('body').removeClass('alert-open');
	} else {
		$( ".site-alert" ).show();
	}
	
	// set branch tabs - re-org this later | no longer necessary - Tom 11/10/2016
	/*
	var url_parts = location.href.split('/');
    var last_segment = url_parts[url_parts.length-1];
	var permalink_nodomain = window.location.pathname;
	$('.page-tabs a[href="'+permalink_nodomain+'"]').parents('li').addClass('active');
	//console.log(permalink_nodomain);
	*/
	
	// insert branch directions link - view does not like it to be hardcoded
	if ( $('.branch-details-banner').length & !$('#dirbtn').length ) {
		
		if ( $('.thoroughfare').length ) {
			var daddr = $('.thoroughfare').text() + '+Brooklyn+NY+' + $('.postal-code').text();
			$('.branch-details-banner .locality-block').append('<p><a id="dirbtn" href="http://maps.google.com/maps?saddr=&amp;daddr='+ daddr + '">Get Directions</a></p>');
			$('.contain-img').wrap('<a href="http://maps.google.com/maps?saddr=&amp;daddr='+ daddr + '"></a>');
		}
		// move nearby branches dropdown
		$('#edit-jump').addClass('selectpicker select-rounded').appendTo('.group.map').show();
		
	}
	
	if ( $('body').hasClass('node-type-event') ) {
		
		if ( $('.thoroughfare').length ) {
			var daddr = $('.thoroughfare').text() + '+Brooklyn+NY+' + $('.postal-code').text();
			$('.SIDEBAR .transportation').after('<h6 style="margin-top: 15px"><a id="dirbtn" href="http://maps.google.com/maps?saddr=&amp;daddr='+ daddr + '"><span class="icon-directions"></span> Get Directions</a></h6>');
		}
		
		$('#HEADER-SHARE').prependTo('.SIDEBAR .contain-img');
				
	}
	
	// config stuff for pagetabs generated by menu block
	$("ul.page-tabs li.expanded").each( function(i) {
			$(this).attr( "role", "dropdown" );
			$(this).find('a:first').attr( "href", "#" ).on( 'click',  function( e ) { e.preventDefault(); });
			$(this).find('a:first').append(' &nbsp; <span class="icon-drop"></span>');
	});
	
	// add icon to catalog link in main menu
	$("#launchcat").append('&nbsp;<span class="icon-open"></span>');
	
	// Create Body Mask, which is used for the Drawer manu to clip the document view
	if( typeof $( "#bodymask" ) === 'undefined' ) {
		$( "#body" ).wrap( '<div id="bodymask"></div>' );
	}
	// init() Functions:
	SEARCH.init(); MODAL.init(); MOBILE.init();
	


// ---------------------------------------------------------------------------------------
	// Main Menu and Drawer --------------------------------------------------------------
	$( ".menu-main li:not(.nav-styleguide) a" ).on( 'click',  function( e ) {
		e.preventDefault();
		$nav_queue = $(this).data('trigger');
		$nav_queue = $('#'+$nav_queue);
		
	$('.menu-main a').removeClass('active');
	$(this).addClass('active')
		if( !$('body').hasClass('drawer-open') ) {
			DRAWER.showDrawerMenu(); // open the sliding menu
		} else {
			DRAWER.showSubMenu();
			return true;
		}
	});
	
	// Sub-Navigation Menu links ---------------------------------------------------------
	// what is purpose of this...?? - Tom
	/*
	$('#drawer .menu-sub li a').on( 'click',  function( e ) {
		if( !$('body').hasClass('mobile') ) {
			e.preventDefault();
		}
	});
	*/
	
	// Mobile Menu Trigger ---------------------------------------------------------------
	$( ".mobile-nav-trigger" ).on( 'click',  function( e ) {
		e.preventDefault();
		$nav_queue = $(this).data('trigger');
		$('#nav-borrow-link').addClass('active');
		$nav_queue = $('#'+ $nav_queue);
		DRAWER.toggleMenu();
	});
	
	// Toggle visibility of account dropdown ---------------------------------------------
	/* 
	// disabled this and am using the toggle below - Tom
	$('#HEADER .avatar').click(function(e){
		if (e.target !== this)
			return;
		$(this).toggleClass('active');
	});
	*/
	
	$('#HEADER [role="dropdown"]').click(function(e) {
		$(this).toggleClass('active').siblings().removeClass('active');
	});
	
	// Toggle visibility of dropdown menus -----------------------------------------------
	$('[role="dropdown"]').click(function(e) {
		if( !$(this).hasClass('show-menu') ) {
			$(this).parent().find('[role="dropdown"].show-menu').toggleClass('show-menu');
		}
		$(this).toggleClass('show-menu');
	});
	
	// Toggle visibility of banners ------------------------------------------------------
	$('[role="close-banner"]').click(function(e) {
		$(this).parents('.banner').remove();
		if( $('body').hasClass('alert-open') ) {
			$('body').removeClass('alert-open');
		}
		//sessionStorage.setItem("alert", "hide");
		createCookie('alert', 'hide');
	});
	
	// Open external links in a new Tab/Window -------------------------------------------
	$('a').each(function() {
		var a = new RegExp('/' + window.location.host + '/');
		if( !a.test(this.href) && !$(this).hasClass('sticky-chat') && !$(this).hasClass('chat-widget') && !$(this).hasClass('nonewtab') ) {
		//if( !a.test(this.href) && ( !$(this).hasClass('sticky-chat') || !$(this).hasClass('chat-widget') ) ) {
			$(this).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				//window.open(this.href, '_blank');
				var newWnd = window.open(this.href, '_blank');
				newWnd.opener = null;
			});
		}
	});
	
    $('.sticky-chat, .chat-widget').on( "click", function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  //bplpop( $( this ).attr('href'), 320, 280 );
	  bplpop( Drupal.settings.basePath + 'chat/', 338, 420 );
    });
	
	

	
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// ACCORDION
/*
	var $accordion = $('.accordion .panel');
		$accordion.click(function(e) {
			e.preventDefault();
		
			// close siblings
			$(this).siblings().removeClass('panel-open').children('.panel-body').slideUp(300);
			
			if ( $(this).hasClass('panel-open') ) {
				$('.panel-body', this).slideUp(300);
			} else {
				$('.panel-body', this).slideDown(300);
			}
			$(this).toggleClass('panel-open');
		});
		// if a panel is open by default on load
		$('.accordion .panel.panel-open .panel-body').slideDown(300);
*/

	// new accordion code to allow links within panels to work
    var $accordion = $('.accordion .panel .panel-heading');
    $accordion.click(function(e) {
        e.preventDefault();
        if ($(this).parent().hasClass('panel-open')) {
            $(this).next('.panel-body').slideUp(300);
        } else {
            $(this).next('.panel-body').slideDown(300);
        }
        $(this).parent().toggleClass('panel-open');
    });
    $('.accordion .panel.panel-open .panel-body').slideDown(300);

	// add toggle to view/close all
	var $accordion_tog = $('.accordion .tog');
		$accordion_tog.click(function(e) {
			e.preventDefault();
			
			$('.panel').each( function() {
				if( !$(this).hasClass('panel-open') ) {
					$(this).addClass('panel-open');
					$('.panel-body', this).slideDown(300);
				} else {
					$(this).removeClass('panel-open');
					$('.panel-body', this).slideUp(300);
				}
			});
			
		});
	
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// TABS
	var $tabs = $('.nav-tabs .labels a');
		//$('.nav-tabs .labels li:first-child, .nav-tabs .content > div:first-child').addClass('active');
		
		//new code to grab hash from url and set active tab
		var hash = window.location.hash;
		if (hash.length){
			$(".nav-tabs .labels a[href="+hash+"]").parent('li').addClass('active');
			$('.nav-tabs .content > div'+hash).addClass('active');
		} else {
			$('.nav-tabs .labels li:first-child, .nav-tabs .content > div:first-child').addClass('active');
		}

		
		$tabs.click(function(e) {
			e.preventDefault();
			
			var $tab = $(this);
			// add active class to selected and remove from siblings
			$tab.parent('li')
				.addClass('active')
				.siblings()
				.removeClass('active');
				
			// show respective content
			$($tab.attr('href')).addClass('active')
				.siblings()
				.removeClass('active');
		});

// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// DROPDOWNS
	$('.selectpicker').selectpicker({
		dropupAuto: false, size: 10, width: 'fit'
	});
	
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// KEY COMMANDS - Capturing Escape to close Modals and the Navigation Drawer... More can be done ;)
// added ability to close utility bar dropdowns - mybpl and branch list
	$(document).on('keyup',function(e) { // KeyPres does not capture Escape
		switch( e.which ) {
			case 13: // Enter
				break;
			case 27: // Esc
				if( $('body').hasClass('drawer-open') ) {
					DRAWER.hideDrawerMenu();
				}
				else if( $('#HEADER [role="dropdown"]').hasClass('active') ) {
					$('#HEADER [role="dropdown"]').removeClass('active');
				}
				else if( $('body').hasClass('modal-open') ) {
					MODAL.modalHide();
				} else {
				}
			break;
		}
	});
	$( document ).keypress(function(e) {
		switch( e.which ) {
		}
	});
	
	// bpl - close dropdown (mybpl,locations) if click outside of it
	$(document).on('click', function (e) {
		if ($(e.target).closest('[role="dropdown"]').length === 0) {
			$('[role="dropdown"]').removeClass('active');
		}
	});
	

// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// SCROLLSPY - changes the navigation font-color from white to black when points are hit
	//alert( $('.scroll-spy li').length );
	if ($('.scroll-spy li').length ){
    var $branding = $('#bodynav .branding').height();
    var $spy_0 = parseInt( ($('.scroll-spy li:nth(0)').offset().top - $(window).scrollTop()) + ($('.scroll-spy li:nth(0)').height()/2) );
    var $spy_1 = parseInt( ($('.scroll-spy li:nth(1)').offset().top - $(window).scrollTop()) + ($('.scroll-spy li:nth(1)').height()/2) );
    var $spy_2 = parseInt( ($('.scroll-spy li:nth(2)').offset().top - $(window).scrollTop()) + ($('.scroll-spy li:nth(2)').height()/2) );
    var $spy_3 = parseInt( ($('.scroll-spy li:nth(3)').offset().top - $(window).scrollTop()) + ($('.scroll-spy li:nth(3)').height()/2) );
    $(window).scroll(function(){
      var $elem = $(".scroller");
      var $offset = $elem.offset().top - $(window).scrollTop();

      if( $offset <= 100 ) {
        $('.scroll-spy .branding').addClass('scrolled');
      }
      if( $offset <= $spy_0 ) {
        $('.scroll-spy li:nth(0)').addClass('scrolled');
      }
      if( $offset <= $spy_1 ) {
        $('.scroll-spy li:nth(1)').addClass('scrolled');
      }
      if( $offset <= $spy_2 ) {
        $('.scroll-spy li:nth(2)').addClass('scrolled');
      }
      if( $offset <= $spy_3 ) {
        $('.scroll-spy li:nth(3)').addClass('scrolled');
      }

      if( $offset > $branding ) {
        $('.scroll-spy .branding').removeClass('scrolled');
      }

      if( $offset > $spy_0 ) {
        $('.scroll-spy li:nth(0)').removeClass('scrolled');
      }
      if( $offset > $spy_1 ) {
        $('.scroll-spy li:nth(1)').removeClass('scrolled');
      }
      if( $offset > $spy_2 ) {
        $('.scroll-spy li:nth(2)').removeClass('scrolled');
      }
      if( $offset > $spy_3 ) {
        $('.scroll-spy li:nth(3)').removeClass('scrolled');
      }
    });
  }
  
	// link parent container of homepage hero title  
	if( $(".homepage #HEADER-TITLE .row").find('a').length > 0 ) {
		$(".homepage #HEADER-TITLE .row").css( "cursor", "pointer" ).click(function() {
		  $('a', this).click();
		});
		
		// link the adbox and ped box
		$(".full-width-module").on('click', function(e) {
		   if (e.ctrlKey){
				window.open( $(this).find("a:first").attr("href"), '_blank');
				
		   } else {
			   window.location = $(this).find("a:first").attr("href"); 
		   }
		});
		
	}
	
	// link event list row container
	$(".EVENT").on('click', function(e) {
	   if (!$(e.target).hasClass('btn-pill')) {
		   e.stopPropagation();
		   e.preventDefault();
		   if (e.ctrlKey){
				window.open( $(this).find("a:first").attr("href"), '_blank');
		   } else {
			   console.log($(this).find("a:first").attr("href"));
				window.location = $(this).find("a:first").attr("href"); 
		   }
	   }
	});
	
	
	$('.sharetip').tooltipster({
		theme: 'tooltipster-light',
		trigger: 'click',
		interactive: true
	});
	
	
	$(window).load( function() {

	//Button Label Change
	$("#google_translate_element a").find("span:first").text("Languages");

	//Button Classes Override
	$("#google_translate_element").find("a").removeClass("goog-te-menu-value").addClass("langLinks");
	$("#google_translate_element div").find("div").removeClass("goog-te-gadget-simple").addClass("langButton");
	$("#google_translate_element a").find("span").eq(2).text("").css('color', '#9B9B9B').addClass('langDropArrow icon-drop');
	
	// remove img and span seperator
	$("#google_translate_element img, #google_translate_element a span:nth-of-type(2)").remove();
	
	// try to switch label back  - not working
	$(".goog-close-link").on( "click", function() {
		console.log('close trans menu');
	  $("#google_translate_element .langLinks span:first").text("Languages");
	});
	
	});
	
	
})(jQuery);

function bplpop(strURL, strWidth, strHeight) {
    var w = (window.open(strURL, 'popwin', 'width=' + strWidth + ',height=' + strHeight + ',status=no,scrollbars=no'));
    w.focus();
    return false;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString()
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/; domain=.bklynlibrary.org"
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

function eraseCookie(name) {
    createCookie(name, "", -1)
}


/* =================================================================
*  Keep focus on auto-submitted text-fields without surrounding block
*  ============================================================== */
// ref: https://www.drupal.org/node/1217948#comment-7736343

function SetCaretAtEnd(elem) {
  var elemLen = elem.value.length;
  // For IE Only
  if (document.selection) {
      // Set focus
      elem.focus();
      // Use IE Ranges
      var oSel = document.selection.createRange();
      // Reset position to 0 & then set at end
      oSel.moveStart('character', -elemLen);
      oSel.moveStart('character', elemLen);
      oSel.moveEnd('character', 0);
      oSel.select();
  }
  else if (elem.selectionStart || elem.selectionStart == '0') {
      // Firefox/Chrome
      elem.selectionStart = elemLen;
      elem.selectionEnd = elemLen;
      elem.focus();
  } // if
} // SetCaretAtEnd()

var textboxToFocus = {};

jQuery(function($) {
  var addFocusReminder = function(textbox) {
    textbox.bind('keypress keyup', function(e) {
      textboxToFocus.formid = $(this).closest('form').attr('id');
      textboxToFocus.name = $(this).attr('name');
      
      if(e.type == 'keypress') {
        if(e.keyCode != 8) { // everything except return
          textboxToFocus.value = $(this).val() + String.fromCharCode(e.charCode);
        } else {
          textboxToFocus.value = $(this).val().substr(0, $(this).val().length-1)
        }
      }
      else { // keyup
        textboxToFocus.value = $(this).val();
      }
    });
  }

  addFocusReminder($('.view-filters input:text.ctools-auto-submit-processed'));
  $(document).ajaxComplete(function(event,request, settings) {
    if(typeof textboxToFocus.formid !== 'undefined') {
      var textBox = $('#' + textboxToFocus.formid + ' input:text[name="' + textboxToFocus.name + '"]');
      textBox.val(textboxToFocus.value);
      SetCaretAtEnd(textBox[0]);
      addFocusReminder(textBox);
      //textboxToFocus = {}; // if you have other auto-submitted inputs as well
    }
  });
});


//LEARNING FOR KIDS ADBOX CONTROL

(function($) {
	var hash = window.location.hash;
	var nohash = hash.replace('#', '');
	var nodeID = $('body').hasClass('page-node-2813');
	var pathname = window.location.pathname;
	
	var kids = 'main-landing-promo';
	var littlekids = 'term-little-kids';
	
	//IMAGES HAVE TO LOAD FIRST OTHERWISE THE ADBOX WILL BE FUNKY WHEN KIDS LINK IS CLICKED
	if ((nodeID) &&  (!hash)) {
		
			document.getElementById(kids).style.visibility = 'hidden';
			window.onload = function() {
				document.getElementById(kids).style.display = 'none';
			}
			
	} else if ((nodeID) &&  (hash)) {

		document.getElementById(kids).style.visibility = 'hidden';
		document.getElementById(littlekids).style.visibility = 'hidden';
		
		window.onload = function() {
			switch (nohash) {
				case 'kids':
					enAdbox(nohash);
				break;
				case 'little-kids':
					enAdbox(nohash);
				break;
				default:
					enAdbox(nohash);
			}
		}
		
	}
	
})(jQuery);

function enAdbox(type) {	
	var hash = window.location.hash;
	var pathname = window.location.pathname;
	var nodeID = document.getElementsByClassName('page-node-2813');
	var kids = 'main-landing-promo';
	var littlekids = 'term-little-kids';

	if (nodeID) {
			
		switch (type) {
			case 'kids':
				document.getElementById('main-landing-promo').style.visibility = 'visible';
				document.getElementById('main-landing-promo').style.display = 'block';
				
				document.getElementById('term-little-kids').style.visibility = 'hidden';
				document.getElementById('term-little-kids').style.display = 'none';
			break;
			// case 'little-kids':

				// document.getElementById('term-little-kids').style.visibility = 'visible';
				// document.getElementById('term-little-kids').style.display = 'block';
				
				// document.getElementById('main-landing-promo').style.visibility = 'hidden';
				// document.getElementById('main-landing-promo').style.display = 'none';
			// break;
			default :

				document.getElementById('term-little-kids').style.visibility = 'visible';
				document.getElementById('term-little-kids').style.display = 'block';
		
				document.getElementById('main-landing-promo').style.visibility = 'hidden';
				document.getElementById('main-landing-promo').style.display = 'none';
		}
	}
}

(function($) {
	var nodeID = $('body').hasClass('page-node-3127');
	var eventsWidget = $('div').hasClass('pane-events-calendar-widgets');
	var nodeBody = $('div').hasClass('pane-node-body');
	
	
	
	
	if (nodeID) {
		
		var div = document.createElement('div');
		var content = document.createTextNode(document.getElementById('carousel-columns_test').innerHTML);
		
		div.className = 'row';
		div.innerHTML(content);
		
		
		document.querySelector('.pane-node-body').appendChild(div);
		
	}
	
})(jQuery);

//Event Advanced and PED Registration Guest Fixes
(function($) {
	var regForm = $('#registration-form');
	var guestWrapper = $('.tabledrag-toggle-weight-wrapper');
	var regSpacesDIV = $('.form-item-count');
	var regSpacesInput = $('#edit-count');
	var guestDIV = $('.form-item-field-registration-advance-guest-und');
	var guestField = $('#edit-field-registration-advance-guest-und');
	var guestEmailTB = $('#field-guest-email-values');
	var guestEmailLabel = $('th.field-label');
	var guestEmail01 = $('tr.odd');
	var guestEmail02 = $('tr.even');
	var guestEmailInput01 = $('#edit-field-guest-email-und-0-email');
	var guestEmailInput02 = $('#edit-field-guest-email-und-1-email');
	var guestDrag = $('td.field-multiple-drag');
	var guestPEDDiv = $('.form-item-field-registration-ped-guest-und');
	var guestPEDField = $('#edit-field-registration-ped-guest-und');
	var guestPEDEmailTB = $('#field-ped-guest-email-values');
	var guestPEDEmailInput01 = $('#edit-field-ped-guest-email-und-0-email');
	var guestPEDEmailInput02 = $('#edit-field-ped-guest-email-und-1-email');
	
	
	$(document).ready(function() {
		
		if ((regForm.length && guestDIV.length) || (regForm.length && guestPEDDiv.length)) {
			//console.log("Inside the Form");
			//disable the "show row weights div"
			$('.tabledrag-toggle-weight-wrapper').css("display", "none");
			$(regSpacesDIV).css("display", "none");
			
			//When window loads dont display the Guest Email Fields unless the bottom condition is true.
			$(guestEmailTB).removeClass('table').css("display", "none");
			$(guestPEDEmailTB).removeClass('table').css("display", "none");
			$(guestEmailLabel).css('text-align', 'left');
			$(guestDrag).remove();
			$(guestEmail01).css("display", "none").removeClass('draggable');
			$(guestEmail02).css("display", "none").removeClass('draggable');
			
			var guestFieldValue = $(guestField).find(":selected").val();
			
			
			//If registration displays an error and guest field is set to 1 or 2 as default - fix the inputs by displaying them and retaining user inputs
			$(guestField).ready(function(e) {
				switch (guestFieldValue) {
					case '1': 
					$(guestEmailTB).removeAttr("style");
					$(guestEmail01).removeAttr("style").removeClass('draggable');
					$(guestEmail02).css("display", "none").removeClass('draggable');
					$(regSpacesInput).attr("value", "2");
					break;
					
				 case '2': 
					$(guestEmailTB).removeAttr("style");
					$(guestEmail01).removeAttr("style").removeClass('draggable');
					$(guestEmail02).removeAttr("style").removeClass('draggable');
					$(regSpacesInput).attr("value", "3");
					break;
				}
			});
			
			var guestPEDFieldValue = $(guestPEDField).find(":selected").val();
			
			$(guestPEDField).ready(function(e) {
				switch (guestPEDFieldValue) {
					case '1': 
					$(guestPEDEmailTB).removeAttr("style");
					$(guestEmail01).removeAttr("style").removeClass('draggable');
					$(guestEmail02).css("display", "none").removeClass('draggable');
					$(regSpacesInput).attr("value", "2");
					break;
					
				 case '2': 
					$(guestPEDEmailTB).removeAttr("style");
					$(guestEmail01).removeAttr("style").removeClass('draggable');
					$(guestEmail02).removeAttr("style").removeClass('draggable');
					$(regSpacesInput).attr("value", "3");
					break;
				}
			});
			
			//On change of the Guest List show corresponding Textboxes
			$(guestField).on('change', function(e) {
				//console.log(e);
				
				var guestFieldValue = $(guestField).find(":selected").val();
				
				//console.log("Value: " + guestFieldValue);
				
				switch (guestFieldValue) {
					case '1':
						//display only first email field
						$(guestEmailTB).removeAttr("style");
						$(guestEmail01).removeAttr("style").removeClass('draggable');
						$(guestEmail02).css("display", "none").removeClass('draggable');
						//clear the second email field
						$(guestEmailInput02).attr("type", "reset");
						$(guestEmailInput02).attr("value", "");
						$(guestEmailInput02).attr("type", "text");
						//set the spaces hidden field to 2 for the count
						$(regSpacesInput).attr("value", "2");
						break;
					case '2':	
						//display both email fields
						$(guestEmailTB).removeAttr("style");
						$(guestEmail01).removeAttr("style").removeClass('draggable');
						$(guestEmail02).removeAttr("style").removeClass('draggable');
						//set the spaces hidden field to 3 for the count
						$(regSpacesInput).attr("value", "3");
						break;
					default:
						//hide all email fields
						$(guestEmailTB).css("display", "none");
						$(guestDrag).remove();
						//clear all email fields
						$(guestEmailInput01).attr("type", "reset");
						$(guestEmailInput01).attr("value", "");
						$(guestEmailInput01).attr("type", "text");
						$(guestEmailInput02).attr("type", "reset");
						$(guestEmailInput02).attr("value", "");
						$(guestEmailInput02).attr("type", "text");
						$(guestEmail01).val("").css("display", "none").removeClass('draggable');
						$(guestEmail02).val("").css("display", "none").removeClass('draggable');
						//set the spaces hidden field to 1 for the count
						$(regSpacesInput).attr("value", "1");
						
				}
				
			});
			
			$(guestPEDField).on('change', function(e) {
				//console.log(e);
				
				var guestPEDFieldValue = $(guestPEDField).find(":selected").val();
				
				//console.log("Value: " + guestFieldValue);
				
				switch (guestPEDFieldValue) {
					case '1':
						//display only first email field
						$(guestPEDEmailTB).removeAttr("style");
						$(guestEmail01).removeAttr("style").removeClass('draggable');
						$(guestEmail02).css("display", "none").removeClass('draggable');
						//clear the second email field
						$(guestPEDEmailInput02).attr("type", "reset");
						$(guestPEDEmailInput02).attr("value", "");
						$(guestPEDEmailInput02).attr("type", "text");
						//set the spaces hidden field to 2 for the count
						$(regSpacesInput).attr("value", "2");
						break;
					case '2':	
						//display both email fields
						$(guestPEDEmailTB).removeAttr("style");
						$(guestEmail01).removeAttr("style").removeClass('draggable');
						$(guestEmail02).removeAttr("style").removeClass('draggable');
						//set the spaces hidden field to 3 for the count
						$(regSpacesInput).attr("value", "3");
						break;
					default:
						//hide all email fields
						$(guestPEDEmailTB).css("display", "none");
						$(guestDrag).remove();
						//clear all email fields
						$(guestPEDEmailInput01).attr("type", "reset");
						$(guestPEDEmailInput01).attr("value", "");
						$(guestPEDEmailInput01).attr("type", "text");
						$(guestPEDEmailInput02).attr("type", "reset");
						$(guestPEDEmailInput02).attr("value", "");
						$(guestPEDEmailInput02).attr("type", "text");
						$(guestEmail01).val("").css("display", "none").removeClass('draggable');
						$(guestEmail02).val("").css("display", "none").removeClass('draggable');
						//set the spaces hidden field to 1 for the count
						$(regSpacesInput).attr("value", "1");
						
				}
				
			});
		}
	});
	
})(jQuery);

//Fixing the Cancellation Page Container
(function($) {
	var page = $('body.page-registration-cancel');
	var cancelForm = $('#bpl-registration-delete-confirm');
	var cancelSubmit = $('#edit-submit');

	if ((page.length) && (cancelForm)) {
		console.log('cancel page');
		cancelForm.addClass('container');
		cancelSubmit.css({
			'margin-right' : '10px'
		});
	}
})(jQuery);