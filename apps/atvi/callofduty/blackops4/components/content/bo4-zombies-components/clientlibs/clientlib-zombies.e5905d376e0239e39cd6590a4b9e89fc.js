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

BO4.zombiesHero = {};


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
//bo4 animate feature js

var BO4 = BO4 || {};

BO4.featureAnimate = {};


(function($, BO4){

    var init = function(){

		scrollHandlers();

    }


    var scrollHandlers = function(){

        var $window = $(window);

        //scroll event

        $window.on("scroll", checkView);
        $window.on("scroll resize", checkView);
        $window.trigger("scroll");

    }

    var checkView = function(){

		var $scrollElements = $(".feature-animate");
        var $window = $(window);

        var windowHeight = $window.height();
        var windowTop = $window.scrollTop();
        var windowBottom = windowHeight + windowTop; // takes total height and adds to the top of the currrent view height


        $scrollElements.each(function(){

			var $feature = $(this);
            var featureHeight = $feature.outerHeight();
            var featureTop = $feature.offset().top;
            var featureBottom = featureHeight + featureTop;

            if((featureBottom >= windowTop) && (featureTop <= windowBottom )){

                $feature.addClass("animate-active").addClass("animate-border").delay(3000).queue(function(){
					$(this).addClass("animate-done");
                });

            } else {

				$feature.removeClass("animate-active");
            }
        });
    }

    $(init);

})(jQuery, BO4);




//bo4 feature js

var BO4 = BO4 || {};
BO4.feature = {};

(function($, BO4){

    var init = function(){
		clickHandlers();
    }

    var clickHandlers = function(){
		openVideo();
        closeVideo();
    }

    var openVideo = function(){

        $(".feature-container").on("click", ".play-button", function(e){
			e.preventDefault();
            var $mainContainer = $(this).closest(".main-container");
            $mainContainer.find(".feature-info").fadeOut().promise().done(function(){

                $mainContainer.addClass("video-mode").promise().done( function(){

                    var $videoContainer = $mainContainer.closest(".feature-container").find(".video-container");
                    $videoContainer.fadeIn(500);
                    if(!ATVI.browser.isPhone && !ATVI.browser.isTablet){
                        if($videoContainer.find(".atvi-agegate").css("display") === "none"){
                            $videoContainer.find(".atvi-instrument-video-play").click();
                        }
                    }
                });
            });



            if(!(ATVI.browser.isPhone) && !(ATVI.browser.isTablet)) {
                BO4.core.scrollToTarget($mainContainer, -75);
            } else {
                BO4.core.scrollToTarget($mainContainer, -200);
            }	
        });

        $(".feature-container .cta-container").on("click", ".open-video", function(e){
			e.preventDefault();
            var $mainContainer = $(this).closest(".main-container");
            $mainContainer.find(".feature-info").fadeOut().promise().done(function(){ // fade out text

                $mainContainer.addClass("video-mode").promise().done( function(){ //change padding 
                    var $videoContainer = $mainContainer.closest(".feature-container").find(".video-container");
                    $videoContainer.fadeIn(500);
                    if(!ATVI.browser.isPhone && !ATVI.browser.isTablet){
                        if($videoContainer.find(".atvi-agegate").css("display") === "none"){
                            $videoContainer.find(".atvi-instrument-video-play").click();
                        }
                    }
                });
            });


            if(!(ATVI.browser.isPhone) && !(ATVI.browser.isTablet)) {
                BO4.core.scrollToTarget($mainContainer, -75);
            } else {
				BO4.core.scrollToTarget($mainContainer, -200);
            }	
        });

    }

    var closeVideo = function(){
        $(".feature-container").on("click", ".video-close", function(e){
			$(this).closest(".video-container").find(".atvi-instrument-video-pause").click();
			$(this).closest(".video-container").fadeOut(500);

            var $mainContainer = $(this).closest(".feature-container").find(".main-container")
            $mainContainer.removeClass("video-mode").delay(400).promise().done(function(){
				$mainContainer.find(".feature-info").fadeIn();
            });
        });
    }

    $(init);


})(jQuery, BO4);


//tile modal js

var BO4 = BO4 || {};

BO4.featureModal = {};


(function($, BO4){

    var init = function(){

        initModalClick();
        initModalClose();

    }

    var initModalClick = function(){

        var $container = $(".flex-container");

        $container.on("click", ".modal-button", function(e){

			e.preventDefault();
			$(this).closest(".feature-tile").find(".video-modal").fadeIn();
        });

    }

    var initModalClose = function(){

        var $close = $(".modal-close");
        var $overlay = $(".video-modal");

        $close.add($overlay).click(function() {

            var $parent;
            $parent = $(this).closest(".video-modal");

            $parent.fadeOut();

            if($parent.hasClass("video-modal")) {
                $parent.find(".atvi-instrument-video-pause")[0].click()
            };

        });

        $overlay.find(".modal-inner").click(function(e) {
			e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    }


    $(init);


})(jQuery, BO4);



//bo4 zombies characters carousel js

var BO4 = BO4 || {};
BO4.characterCarousel = {};

(function($, BO4) {

    var init = function() {

        initCarousel();
        arrowHandlers();
        //carouselTouchHandlers();
    }

    var initCarousel = function() {

		var $carouselContainers = $(".characters-container .characters-flex");

        for(var i=0; i < $carouselContainers.length; i++) {							//iterate through carousels

            var $slides = $carouselContainers.eq(i).find(".character-container");	//find slides
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
		var $slides = $(context).closest(".characters-container").find(".character-container");
        var $curSlide = $slides.filter(".active");
        var $nextSlide = $curSlide.next();
        if($nextSlide.length < 1) $nextSlide = $slides.filter(":first-of-type");

        return $nextSlide;
    }

    var getPrevSlide = function(context) {
		var $slides = $(context).closest(".characters-container").find(".character-container");
        var $curSlide = $slides.filter(".active");
        var $prevSlide = $curSlide.prev();

        if ($prevSlide.length < 1) $prevSlide = $slides.filter(":last-of-type");

        return $prevSlide;
    }


    /*******************
	GO TO SLIDES/BUTTONS
    *******************/

    var goToSlide = function($slide) {

        var $slides = $slide.closest(".characters-container").find(".character-container");

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
		var $arrowContainer = $(".characters-container .nav-arrows");
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
