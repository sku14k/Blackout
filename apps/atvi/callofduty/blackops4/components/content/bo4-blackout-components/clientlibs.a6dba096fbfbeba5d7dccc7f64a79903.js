
var BO4 = BO4 || {};

BO4.blackoutHero = {};


(function($, BO4){

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

BO4.blackoutBgVideo = {};


(function($, BO4){

    $(function() {

        var $win = $(window);
        var scrollPos = $win.scrollTop();
        var $bgVideos = $(".blackout-bg-video");


        BO4.blackoutBgVideo.init = function(){
            // Initialize BG Vid playback if needed
            BO4.blackoutBgVideo.scrollPositionPlayback();

            $win.on("scroll", BO4.blackoutBgVideo.scrollPositionPlayback);
        };


        BO4.blackoutBgVideo.scrollPositionPlayback = function(){
    
            scrollPos = $win.scrollTop();
    
            $bgVideos.each(function(index, element){

                var $el = $(element);
                var el = $el.get(0);
                var $bgVid = $el.find(".bg-video");

                var offset = $win.height() / 2;
                //var start = $el.context.offsetTop - offset;
                //var end = $el.context.offsetTop + $el.height() - offset;
                var start = el.offsetTop - offset;
                var end = el.offsetTop + $el.height() - offset;

                for(var i=0; i < $bgVid.length; i++){
	                if(scrollPos >= start && scrollPos <= end){
                    	$bgVid[i].play();
                    } else {
                    	$bgVid[i].pause();
                    }
                }

            });
    
        };


    	BO4.blackoutBgVideo.init();

    });

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
(function ($) {
    var init = function () {
		//var $video = $('.operation-hero .video');

        var $playBtn = $('.bo4-static-hero-w-video .play-btn');
        var $videoCloseBtn = $('.bo4-static-hero-w-video .close-btn');
        var $pauseBtn = $('.bo4-static-hero-w-video .pause');

        var toggleVideoVisibility = function (e) {

            var $video = $(this).closest(".bo4-static-hero-w-video").find(".hero-video-wrapper .video");


            $video.fadeToggle();

            //if the agegate has already been met, play video
            if($video.find(".atvi-agegate").css("display") == "none") {
				$video.find(".atvi-instrument-video-play").click();
            }
        };
        var pauseVideo = function (e) {

            var $pauseBtn = $(this).closest(".bo4-static-hero-w-video").find(".pause");

			$pauseBtn.click();
        };

        $playBtn.add($videoCloseBtn).on('click', toggleVideoVisibility);
        $videoCloseBtn.on('click', pauseVideo);
    };

    $(init);
}(jQuery));

var BO4 = BO4 || {};

(function($, HUB) {


    var init = function() {

        initPurchase();
    };

    var initPurchase = function() {

        var $btn = $(".free-access-alcatraz .cta a");

        $btn.click(function(e) {

            e.preventDefault();
            var $target = $("#bo4-wtb-default");

			$('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 1000);

        });

    };

    $(init);

})(jQuery, BO4);









