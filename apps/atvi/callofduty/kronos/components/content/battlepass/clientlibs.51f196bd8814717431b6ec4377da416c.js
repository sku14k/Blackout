
(function(){

    var throttle = function(type, name, obj) {

		var obj = obj || window;
        var running = false;
        var func = function(){
			if(running) return;

            running = true;
            requestAnimationFrame(function(){
				obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };

        obj.addEventListener(type, func);
    };

    throttle("scroll", "optimizedScroll");

})();


//video modal

"use strict";
var ATVI = ATVI || {};
var MW = ATVI.MW = ATVI.MW || {};

(function($, ATVI){

    var MW = ATVI.MW = ATVI.MW || {},
        atviVid, atviAgegate;


    var $desktopVid,
        $mobileVid,
        $modal,
        $playButton,
    	$modalVid,
        $modalAgegate,
        vidContext;

    var init = function(){

        atviVid = ATVI.components.video;
		atviAgegate = ATVI.components.agegate;
        $modal = $(".atvi-modal");
        $playButton = $(".hero .play-button");
        $modalVid = $('.atvi-video-component.atvi-modal');
        $modalAgegate = $modal.find('.atvi-agegate');



        initModalClick();
        initModalClose();

        $desktopVid = $(".bg-video.desktop")[0];
        $mobileVid = $(".bg-video.mobile")[0];

        if($(".html5-container video").length != 0) {
            videoResize();
            window.addEventListener("resize", videoResize);
        }

    };


    var initModalClick = function(){        
        $playButton.click(function(e){
            e.preventDefault();
            vidContext = atviVid.getContext($modalVid);

            var agegateContext = ($modalAgegate.length) ? ATVI.components.agegate.getContext($modalAgegate) : false;
            ATVI.modal.openModal($modal);

            //play if passed agegate
            if (agegateContext && agegateContext.ageVerified) {
            	vidContext.play();
            }

        });

    };

    var initModalClose = function(){

        var $close = $(".button-container.close");
        var $overlay = $(".background-container");

        $close.add($overlay).click(function() {

            var $parent;
            $parent = $(this).closest(".atvi-video");

            ATVI.modal.closeModal($modal);
            //if($(".atvi-video").hasClass("fullscreen")) $(".atvi-video").removeClass("fullscreen");

            if($parent.hasClass("atvi-video")) {
                $parent.find(".atvi-instrument-video-pause")[0].click()
            };

        });

        $overlay.find(".inner").click(function(e) {
			e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    }

    var videoResize = function(){

        if($(window).width() <= 1280) {
			$desktopVid.pause();
            $mobileVid.play();
        } else {	
			$desktopVid.play();
            $mobileVid.pause();
        }
    }


    $(init);


})(jQuery, ATVI);

(function(){

    var throttle = function(type, name, obj) {

		var obj = obj || window;
        var running = false;
        var func = function(){
			if(running) return;

            running = true;
            requestAnimationFrame(function(){
				obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };

        obj.addEventListener(type, func);
    };

    throttle("scroll", "optimizedScroll");

})();


//video modal

"use strict";
var ATVI = ATVI || {};
var MW = ATVI.MW = ATVI.MW || {};

(function($, ATVI){

    var MW = ATVI.MW = ATVI.MW || {},
        atviVid, atviAgegate;


    var $desktopVid,
        $mobileVid,
        $modal,
        $playButton,
    	$modalVid,
        $modalAgegate,
        vidContext;

    var init = function(){

        atviVid = ATVI.components.video;
		atviAgegate = ATVI.components.agegate;
        $modal = $(".atvi-modal");
        $playButton = $(".hero .play-button");
        $modalVid = $('.atvi-video-component.atvi-modal');
        $modalAgegate = $modal.find('.atvi-agegate');



        initModalClick();
        initModalClose();

        $desktopVid = $(".bg-video.desktop")[0];
        $mobileVid = $(".bg-video.mobile")[0];

        if($(".html5-container video").length != 0) {
            videoResize();
            window.addEventListener("resize", videoResize);
        }

    };


    var initModalClick = function(){        
        $playButton.click(function(e){
            e.preventDefault();
            vidContext = atviVid.getContext($modalVid);

            var agegateContext = ($modalAgegate.length) ? ATVI.components.agegate.getContext($modalAgegate) : false;
            ATVI.modal.openModal($modal);

            //play if passed agegate
            if (agegateContext && agegateContext.ageVerified) {
            	vidContext.play();
            }

        });

    };

    var initModalClose = function(){

        var $close = $(".button-container.close");
        var $overlay = $(".background-container");

        $close.add($overlay).click(function() {

            var $parent;
            $parent = $(this).closest(".atvi-video");

            ATVI.modal.closeModal($modal);
            //if($(".atvi-video").hasClass("fullscreen")) $(".atvi-video").removeClass("fullscreen");

            if($parent.hasClass("atvi-video")) {
                $parent.find(".atvi-instrument-video-pause")[0].click()
            };

        });

        $overlay.find(".inner").click(function(e) {
			e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    }

    var videoResize = function(){

        if($(window).width() <= 1280) {
			$desktopVid.pause();
            $mobileVid.play();
        } else {	
			$desktopVid.play();
            $mobileVid.pause();
        }
    }


    $(init);


})(jQuery, ATVI);
(function($){

    var init = function(){
		handlers();
    }

    var handlers = function(){

        var weapons = document.getElementById("weapons");

        if (HelperFunc.inViewFromBottom(weapons)) $("#weapons").addClass("animate");

        $(window).on("scroll", function(){

			if (HelperFunc.inViewFromBottom(weapons)) $("#weapons").addClass("animate");
        })
    }

    $(init);

})(jQuery);

var MW = MW || {};

(function($, MW) {

    var init = function() {
        linkScroll();
		initBPPurchaseLink();
    };

    var linkScroll = function() {

        if (window.location.href.indexOf("?s=cp") > -1){
            var $target = $('#codpoints');

            $('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 1000);

        }

        $('.block-banner .btn-container').on('click',function(){
            var $target = $('#codpoints');

            $('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 1000);
        });
    };

    var initBPPurchaseLink = function() {
        $('.cod-game-header-container .desktop-header .nav-right .purchase a').attr('href','#');

        var $btn = $(".cod-game-header-container .desktop-header .nav-right .purchase a");
        var $mobileBtn = $(".cod-game-header-container .mobile-header .mobile-purchase a");

        if($btn.hasClass('load-popup')) return;
        $btn.add($mobileBtn).on('click',function(e) {
            e.preventDefault();

            var $target = $('#codpoints');

            $('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 1000);
            
        });

    };

    $(init);

    
})(jQuery, MW)
