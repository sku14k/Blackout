

//video modal

"use strict";

(function($){

    var $desktopVid,
        $mobileVid;

    var init = function(){

        initModalClick();
        initModalClose();

        $desktopVid = $(".bg-video.desktop")[0];
        $mobileVid = $(".bg-video.mobile")[0];
        
        if($(".html5-container video").length != 0) {
            videoResize();
            window.addEventListener("resize", videoResize);
        }

    }

    var initModalClick = function(){

        var $modal = $(".modal-container .video-modal");
        var $playButton = $(".hero .play-button");
        
        $playButton.click(function(e){
            e.preventDefault();
            $modal.fadeIn();
            $modal.find(".atvi-instrument-video-play")[0].click();
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

    var videoResize = function(){

        if($(window).width() <= 768) {
			$desktopVid.pause();
            $mobileVid.play();
        } else {	
			$desktopVid.play();
            $mobileVid.pause();
        }
    }


    $(init);


})(jQuery);

(function(){

    var init = function(){

		autoStyle();
    }

    //test for adobe target
    var autoStyle = function(){

        var $body = document.body;
        var $wtb = document.querySelector(".atvi-wheretobuy");
        var $reg = document.querySelector(".kronos-registration");
        var $codApp = document.querySelector(".app-ad");
        var wtbBot, regBot, codAppBot;

        if($wtb) {
            wtbBot = $wtb.getBoundingClientRect().bottom;
        } else {
        wtbBot = undefined;
        }
        if($reg) {
            regBot = $reg.getBoundingClientRect().bottom;
        } else {
        regBot= undefined;
        }
        if($codApp) {
            codAppBot = $codApp.getBoundingClientRect().bottom;
        } else {
        codAppBot = undefined;
        }


        if(wtbBot > regBot ||  wtbBot > codAppBot) {
            $body.classList.add("target-active");
        }
    }

    $(init);

})();
