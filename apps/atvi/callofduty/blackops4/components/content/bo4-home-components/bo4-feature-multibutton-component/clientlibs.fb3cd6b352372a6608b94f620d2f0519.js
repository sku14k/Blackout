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

            if((featureBottom >= windowTop) && (featureTop <= windowBottom)){

                $feature.addClass("animate-active").addClass("animate-border").delay(3000).queue(function(){
					$(this).addClass("animate-done");
                });

            } else {

				$feature.removeClass("animate-active").removeClass("animate-done");
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

        $(".feature-multibutton-container .cta-container").on("click", ".open-video", function(e){
			e.preventDefault();

            var videoId = $(this).data("videoid");

            var $mainContainer = $(this).closest(".main-container");
            $mainContainer.find(".feature-info").fadeOut().promise().done(function(){

                $mainContainer.addClass("video-mode").promise().done( function(){
                    
                    var $videoContainer = $mainContainer.closest(".feature-multibutton-container").find(".video-container").filter("[data-id=" + videoId + "]");
                    $videoContainer.fadeIn(500);
                    
                    if($videoContainer.find(".atvi-agegate").css("display") === "none"){
                        $videoContainer.find(".atvi-instrument-video-play").click();
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
        $(".feature-multibutton-container").on("click", ".video-close", function(e){
			$(this).closest(".video-container").find(".atvi-instrument-video-pause").click();
			$(this).closest(".video-container").fadeOut(500);

            var $mainContainer = $(this).closest(".feature-multibutton-container").find(".main-container")
            $mainContainer.removeClass("video-mode").delay(300).promise().done(function(){
				$mainContainer.find(".feature-info").fadeIn();
            });
        });
    }

    $(init);


})(jQuery, BO4);
