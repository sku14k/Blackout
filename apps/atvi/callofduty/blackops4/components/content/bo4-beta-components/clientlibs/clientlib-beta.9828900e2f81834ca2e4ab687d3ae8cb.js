/*
* A library that enables parallax perspective animation on mouseover/mouseout event.
*/

(function($) {
    var exp = {};
	var perspX = 0, perspY = 0, mouseX = 0, mouseY = 0;
	var transformProp, perspectiveOriginProp, perspectiveProp;
    var perspectiveOriginY = 80;
    var zoomedOutPerspective = 155;
	var zoomedInPerspective = 170;
    var zoomTime = 12;
	var eyePulseRate = .27, eyePulseSizeIncrease = 1.25;
	var TWO_PI = Math.PI * 2;

    var init = function() {
        transformProp = findProp("transform");
        perspectiveProp = findProp("perspective");
        perspectiveOriginProp = findProp("perspectiveOrigin", "perspective-origin");
        setupFrameMonitor();
        setupHeroPerspective();
    };

    var setupHeroPerspective = function() {

        var background = $(".hero-background");
		var mobileLayer = background.find(".mobile.layer");
        var mobileMode = mobileLayer.is(":visible");

        if(ATVI.browser.isPhone || ATVI.browser.isTablet || ATVI.pageMode == "edit") return;

        $('body').on("mousemove mouseenter", function(e) {
			mouseX = 2 * e.clientX / frameData.width - 1;
            mouseY = 2 * e.clientY / frameData.height - 1;
            if(mouseX > 1) mouseX = 1;
            if(mouseX < -1) mouseX = -1;

            if(mouseY > 1) mouseY = 1;
            if(mouseY < -1) mouseY = -1;
        });

        onFrame(function(data) {
            var mob = mobileLayer.is(":visible");
            if(mob) {
                if(!mobileMode) {
                    background[0].style[perspectiveOriginProp.js] = "50% 50%";
                    background[0].style[transformProp.js] = "translate3d(0,0,0)";
                }
                mobileMode = true;
                return;
            }
            mobileMode = false;

			var dx = (mouseX - perspX) * 6;
            var dy = (mouseY - perspY) * 6;
			var md = Math.sqrt(dx * dx + dy * dy);
            if(md < .001) {
                perspX = mouseX;
                perspY = mouseY;
            } else {
                var rat = md == 0 ? 1 : 4 / Math.max(4, md);
                var vx = dx * rat;
                var vy = dy * rat;
                var dt = (data.dt || 0) / 1000;
                perspX += vx * dt;
                perspY += vy * dt;
                if(perspX > 1) perspX = 1;
                if(perspX < -1) perspX = -1;
				if(perspY > 1) perspY = 1;
                if(perspY < -1) perspY = -1;

            }

			background[0].style[perspectiveOriginProp.js] = (50 + 3 * perspX) + "% " + (perspectiveOriginY + 3 * perspY) + "%";
            background[0].style[transformProp.js] = "translate3d(" + (perspX * -2) + "%, " + (perspY * -2) + "%, " + 0 + ")";
        });

        $(window).on("load", zoomIn);
    };

    var zoomIn = function() {
        var bg = $(".hero-background");
        var done, t = 0;

        //bg.find('.bg').css('transform', 'translate3d(0,-140%,-1200px) scale(9)');
        //bg.find('.bg').css('transform', 'translate3d(0,-200%,-1200px) scale(7)');
        bg.find('.bg').css('transform', 'translate3d(0,-180%,-1200px) scale(9)');

        onFrame(function(data) {
			if(done) return;

            t += (data.dt || 0)  / 1000;
            var x, cos;
            if(t > zoomTime) {
				cos = 1;
                done = true;
            } else {
                x = t / zoomTime * Math.PI;
                cos = (Math.cos(x) - 1) * -.5;
            }
            var p = zoomedOutPerspective + (zoomedInPerspective - zoomedOutPerspective) * cos;
			bg[0].style[perspectiveProp.js] = p + "px";

        });
    };

    // frame stuff

    var frameData = exp.frameData = {
        scroll: window.pageYOffset || document.documentElement.scrollTop
    };

    var frameHandlers = [];
    var onFrame = exp.onFrame = function(f) {
		frameHandlers.push(f);
    };

    var setupFrameMonitor = function() {
        var currTime = -1;
        var $w = $(window);

        var doFrame = function(t) {
            var delta = currTime == -1 ? 0 : t - currTime;
            currTime = t;

            var width = $w.width();
            var height = $w.height();
			var scroll = window.pageYOffset || document.documentElement.scrollTop;

			frameData.widthChanged = width != frameData.width;
			frameData.heightChanged = height != frameData.height;
			frameData.scrollChanged = scroll != frameData.scroll;

			frameData.width = width;
            frameData.height = height;
            frameData.scroll = scroll;

            frameData.dt = delta;

            for(var i = 0; i < frameHandlers.length; i++) {
				frameHandlers[i](frameData);
            }

			requestAnimationFrame(doFrame);
        };
		doFrame();
    };

    var findProp = function(prop, cssProp) {
        cssProp = cssProp || prop;
		var tp, jstp, prefixes = ["ms", "webkit", "moz"];
		var tester = document.createElement("div");
		var s = tester.style;
        if(prop in s) {
            jstp = tp = prop;
        }
		else {
            var upperCased = prop[0].toUpperCase() + prop.substring(1);
            for(var i = 0; i < prefixes.length; i++) {
				var n = prefixes[i] + "Transform";
                if(n in s) {
                    jstp = n;
                    tp = "-" + prefixes[i] + cssProp;
                }
			}
		}
        return {
            css: tp,
            js: jstp
        };
    };

    $(init);


})(jQuery);

(function ($) {
    var init = function () {
		var $video = $('.home-hero .video');
        var $videoCloseBtn = $video.find('.close-btn');
        var $pauseBtn = $video.find('.pause');
        var $playBtn = $('.home-hero .cta-btn');
        var toggleVideoVisibility = function (e) {

            e.stopPropagation();
			$video.fadeToggle();

            //if the agegate has already been met, play video
            if(!ATVI.browser.isPhone && !ATVI.browser.isTablet){
                if($video.find(".atvi-agegate").css("display") == "none") {
                    $video.find(".atvi-instrument-video-play").click();
                }
            }
        };
        var pauseVideo = function (e) {
			$pauseBtn.click();
        };

        $playBtn.add($videoCloseBtn).on('click', toggleVideoVisibility);
        $videoCloseBtn.on('click', pauseVideo);
    };

    $(init);
}(jQuery));

var BO4 = BO4 || {};

(function ($, BO4) {

    var init = function () {
		var links = $('.home-hero .links .link a');
        var scrollToTarget = function (e) {
            var $link = $(this);
            var $scrollTarget = $($link.data('target'));
            var offset = $link.data('scroll-offset') || 0;

            BO4.core.scrollToTarget($scrollTarget, offset);
        };

        links.on('click', scrollToTarget);
    };

    $(init);

}(jQuery, BO4));


var BO4 = BO4 || {};

BO4.betaHero = {};


(function($, BO$){

    var init = function(){

		clickHandlers();
    }

    var clickHandlers = function(){
		openModal();
    }

    var openModal = function(){

        $(".home-hero .play-btn").on("click", toggleVideoVisibility)

    }

    var toggleVideoVisibility = function (e) {
        e.stopPropagation();
        var $video = $('.home-hero .video');
        $video.fadeToggle();

        if(!ATVI.browser.isPhone && !ATVI.browser.isTablet){
            if($video.find(".atvi-agegate").css("display") == "none") {
                $video.find(".atvi-instrument-video-play").click();
            }
        }

    };
    
    $(init);



})(jQuery, BO4);

var BO4 = BO4 || {};
BO4.betaHeroScroll = {};


(function($, BO4){

    var init = function(){
		clickHandler();
    };

    var clickHandler = function(){

		var $scrollButton = $("#date-scroll");

		$scrollButton.on("click", scrollToTarget);

    }

    var scrollToTarget = function(event){

        event.preventDefault();
        var $schedule = $(".bo4-beta-dates");

        if(!(ATVI.browser.isPhone) && !(ATVI.browser.isTablet)) {
            BO4.core.scrollToTarget($schedule, -75);
        } else {
            BO4.core.scrollToTarget($schedule, -200);
        }
    }


    $(init);


})(jQuery, BO4);


//bo4 flex carousel js

var BO4 = BO4 || {};
BO4.flexCarousel = {};

(function($, BO4) {

    var init = function() {

        initCarousel();
        arrowHandlers();
        //carouselTouchHandlers();
    }

    var initCarousel = function() {

		var $carouselContainers = $(".flex-carousel-container .flex-container");

        for(var i=0; i < $carouselContainers.length; i++) {							//iterate through carousels

            var $slides = $carouselContainers.eq(i).find(".flex-cell");				//find slides
            goToSlide($slides.eq(0));												//set active slide

        }




    }



    /**********************
	CAROUSEL EVENT HANDLERS
    **********************/

    /*var carouselTouchHandlers = function() { //touchwipe library

        $(".specialist-hero-container .specialist-carousel").touchwipe({

            wipeRight: function(){ //stop rotation, move to prev slide
				var $prevSlide = getPrevSlide();

                goToSlide($prevSlide);

            },

            wipeLeft: function() { //stop rotation move to next slide
				var $nextSlide = getNextSlide();

                goToSlide($nextSlide);

            },


            min_move_x: 20,
            min_move_y: 20,
            preventDefaultEvents: true

        });
    }*/

    /*******************************
    GET NEXT/PREV SLIDES AND BUTTONS
    *******************************/

    var getNextSlide = function(context) {
		var $slides = $(context).closest(".flex-wrapper").find(".flex-cell");
        var $curSlide = $slides.filter(".active");
        var $nextSlide = $curSlide.next();
        if($nextSlide.length < 1) $nextSlide = $slides.filter(":first-of-type");

        return $nextSlide;
    }

    var getPrevSlide = function(context) {
		var $slides = $(context).closest(".flex-wrapper").find(".flex-cell");
        var $curSlide = $slides.filter(".active");
        var $prevSlide = $curSlide.prev();

        if ($prevSlide.length < 1) $prevSlide = $slides.filter(":last-of-type");

        return $prevSlide;
    }


    /*******************
	GO TO SLIDES/BUTTONS
    *******************/

    var goToSlide = function($slide) {

        var $slides = $slide.closest(".flex-wrapper").find(".flex-cell");

        //pause current active slide

        var $activeSlide = $slides.filter(".active");

        //remove active class from current active slide

        $activeSlide.removeClass("active");

        //add active class to destination slide

		$slide.addClass("active");


    }


    /*********
    NAV ARROWS
    *********/
    var arrowHandlers = function() {
		var $arrowContainer = $(".flex-carousel-container .nav-arrows");
		var $leftArrow = $arrowContainer.find(".left");
        var $rightArrow = $arrowContainer.find(".right");

        $leftArrow.click(function(e){
			e.preventDefault();
            var $prevSlide = getPrevSlide(this);
			goToSlide($prevSlide);
        });

        $rightArrow.click(function(e){
			e.preventDefault();
            var $nextSlide = getNextSlide(this);
            goToSlide($nextSlide);
        });

    }


    $(init);

})(jQuery, BO4);

var ATVI = ATVI || {};
ATVI._ = ATVI._ || {};

(function ($, ATVI) {

    ATVI._.arrayFrom = function (iterable) {
		if(Array.from) return Array.from(iterable);

        return Array.prototype.slice.call(iterable);
    };

    ATVI._.pipe = function () {
		var fns = ATVI._.arrayFrom(arguments);

        return function (x) {
            return fns.reduce(function (acc, fn) {
				return fn(acc);
            }, x);
        };
    };

    ATVI._.curry = function (fn) {
        return function () {
			var args = ATVI._.arrayFrom(arguments);
            return fn.bind.apply(fn, [null].concat(args));
        };
    };

    ATVI._.debounce = function (fn, ms) {
		var timer = null;

        return function () {
			var context = this;
            var args = ATVI._.arrayFrom(arguments);

            if(timer) clearTimeout(timer);

            timer = setTimeout(function () {
				fn.apply(context, args);
            }, ms || 500);
        };
    };

    ATVI._.throttle = function (fn, ms) {
		var inThrottle = false;

        return function () {
            if(!inThrottle) {
                var args = ATVI._.arrayFrom(arguments);

				inThrottle = true;
                fn.apply(this, args);
                setTimeout(function () {
					inThrottle = false;
                }, ms || 250);
            }
        };
    };

    ATVI._.parseCookie = function (name, parsingInstructions) {
		var cookie = ATVI.utils.getCookie(name);

        if(!cookie) return null;

        if(typeof parsingInstructions === 'function') return parsingInstructions.call(cookie, cookie);

        return ATVI._.pipe.apply(null, parsingInstructions)(cookie);
    };

    ATVI._.templateFrom = function (list, template) {
        return list.reduce(function (markup, item, i) {
			return markup.concat(template.call(item, item, i, list));
        }, '');
    };

})(jQuery, ATVI);


var BO4 = BO4 || {};

BO4.betaWeaponsCarousel = {};


(function($, BO4){

    var init = function(){

		initThumbClickHandler();
        initThumbStateHandler();
    };

    var initThumbClickHandler = function() {

		var $thumbs = $(".weapon-thumbnails .entry");
        var $indicator = $(".weapons-carousel .carousel-indicators .carousel-indicator");
        $thumbs.filter(":first-of-type").addClass("active");

        $thumbs.on("click", function() {

            $thumbs.removeClass("active");
            $(this).addClass("active");

            if($(this).hasClass("assault")) {
				$indicator.filter(".indicator-index-1").find("a").click();
            }

            if($(this).hasClass("smg")) {
				$indicator.filter(".indicator-index-6").find("a").click();
            }

            if($(this).hasClass("tactical")) {
				$indicator.filter(".indicator-index-9").find("a").click();
            }

            if($(this).hasClass("lmg")) {
				$indicator.filter(".indicator-index-11").find("a").click();
            }

            if($(this).hasClass("sniper")) {
				$indicator.filter(".indicator-index-12").find("a").click();
            }

            if($(this).hasClass("pistols")) {
				$indicator.filter(".indicator-index-14").find("a").click();
            }

            if($(this).hasClass("shotguns")) {
				$indicator.filter(".indicator-index-15").find("a").click();
            }

            if($(this).hasClass("launchers")) {
				$indicator.filter(".indicator-index-16").find("a").click();
            }

        });

    };


    var initThumbStateHandler = function() {

		var $indicator = $(".weapons-carousel .carousel-indicators .carousel-indicator a");
        var $navbtns = $indicator.add($(".weapons-carousel .carousel-nav-element"));

        $navbtns.on("click", function() {

            postpone(assignActiveOnThumb);

        });

        function assignActiveOnThumb() {
			var idx = $indicator.filter(".active").data("indicator-index");

            $(".weapon-thumbnails .entry").removeClass("active");

            if(idx >= 0 && idx <= 4) {
				$(".entry.assault").addClass("active");
            }
            if(idx >= 5 && idx <= 7) {
				$(".entry.smg").addClass("active");
            }
            if(idx == 8 || idx == 9) {
				$(".entry.tactical").addClass("active");
            }
            if(idx == 10) {
				$(".entry.lmg").addClass("active");
            }
            if(idx == 11 || idx == 12) {
				$(".entry.sniper").addClass("active");
            }
            if(idx == 13) {
				$(".entry.pistols").addClass("active");
            }
            if(idx == 14) {
				$(".entry.shotguns").addClass("active");
            }
            if(idx == 15) {
				$(".entry.launchers").addClass("active");
            }
        }

        function postpone(myfunction) {
          window.setTimeout(myfunction,0);
        }

    };

    var postpone = function(myfunction) {

        window.setTimeout(myfunction,0);

    }

    $(init);


})(jQuery, BO4);

var BO4 = BO4 || {};

BO4.betaMapsCarousel = {};


(function($, BO4){

    var init = function(){

		initSlideVideos();
    };

    var initSlideVideos = function() {

        var $overlay = $(".maps-carousel .type-video-modal .video-modal-overlay");
        var $content = $overlay.find(".video-modal-content");
		var $play = $(".maps-carousel .type-video-modal a.video-link.type-modal");
        var $close = $(".maps-carousel .type-video-modal .video-close");

        $play.click(function(e) {

			e.preventDefault();

            var $parent = $(this).closest(".slide-entry");
            var $modal = $parent.find(".video-modal-overlay");
            $modal.fadeIn();

        });

        $overlay.add($close).click(function(e) {

			var $parent = $(this).closest(".video-modal-overlay");
            //$parent.find(".atvi-video.playing .controls .pause").click(); 
            var vidContext = ATVI.components.video.getContext($parent.find(".atvi-video"));
            vidContext.pause();
			$parent.fadeOut();

        });

		$content.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

    };

    $(init);


})(jQuery, BO4);

