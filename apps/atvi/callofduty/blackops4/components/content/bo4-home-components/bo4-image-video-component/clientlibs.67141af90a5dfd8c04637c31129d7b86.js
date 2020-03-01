
//bo4 image video js

"use strict";

var BO4 = BO4 || {};
BO4.imageVideo = {};


(function($, BO4){

    var init = function(){
		modalHandlers();
    }

    var modalHandlers = function(){

		openModal();
        closeModal();
    }

    var openModal = function(){

        $(".bo4-image-video-component").on("click", ".play-button", function(e){

            e.preventDefault();
            var $mainContainer = $(this).closest(".main-container");

            if(!(ATVI.browser.isPhone) && !(ATVI.browser.isTablet)) {
                BO4.core.scrollToTarget($mainContainer, -75);
            } 

            /*$mainContainer.addClass("video-mode").promise().done(function(){
                $mainContainer.animate({"padding-bottom": "57%"}, 500).promise().done(function(){
                    $(this).closest(".play-button-overlay").fadeOut(500).promise().done(function(){
						$mainContainer.find(".inline-play").fadeIn(500);
                    });
                });
            });*/

            $mainContainer.addClass("video-mode").promise().done(function(){
                $(this).closest(".play-button-overlay").fadeOut(500).promise().done(function(){
                    $mainContainer.find(".inline-play").fadeIn(500);

                    var $videoContainer = $mainContainer.find(".video-container");
                    if($videoContainer.find(".atvi-agegate").css("display") === "none"){
                        $videoContainer.find(".atvi-instrument-video-play").click();
                    }
                });
            });


        });

    }

    var closeModal = function(){

        $(".bo4-image-video-component").on("click", ".video-close", function(e){

            var $mainContainer = $(this).closest(".main-container");
            $(this).closest(".video-container").find(".atvi-instrument-video-pause").click();


            $(this).closest(".inline-play").fadeOut(500).promise().done(function(){
				$mainContainer.removeClass("video-mode");
            });

            $mainContainer.find(".play-button-overlay").fadeIn(500);
        });
    }


    $(init);


})(jQuery, BO4);