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
BO4.featureV2 = {};

(function($, BO4){

    var init = function(){
		clickHandlers();
    }

    var clickHandlers = function(){
		openVideo();
        closeVideo();
    }

    var openVideo = function(){

        $(".feature-container-v2").on("click", ".play-button", function(e){
			e.preventDefault();
            var $mainContainer = $(this).closest(".main-container");
            $mainContainer.find(".feature-info").fadeOut().promise().done(function(){

                $mainContainer.addClass("video-mode").promise().done( function(){

                    var $videoContainer = $mainContainer.closest(".feature-container-v2").find(".video-container");
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
                BO4.core.scrollToTarget($mainContainer, -100);
            }	
        });

        $(".feature-container-v2 .cta-container").on("click", ".open-video", function(e){
			e.preventDefault();
            var $mainContainer = $(this).closest(".main-container");
            $mainContainer.find(".feature-info").fadeOut().promise().done(function(){ // fade out text

                $mainContainer.addClass("video-mode").promise().done( function(){ //change padding 
                    var $videoContainer = $mainContainer.closest(".feature-container-v2").find(".video-container");
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
        $(".feature-container-v2").on("click", ".video-close", function(e){
			$(this).closest(".video-container").find(".atvi-instrument-video-pause").click();
			$(this).closest(".video-container").fadeOut(500);

            var $mainContainer = $(this).closest(".feature-container-v2").find(".main-container")
            $mainContainer.removeClass("video-mode").delay(400).promise().done(function(){
				$mainContainer.find(".feature-info").fadeIn();
            });
        });
    }

    $(init);


})(jQuery, BO4);
