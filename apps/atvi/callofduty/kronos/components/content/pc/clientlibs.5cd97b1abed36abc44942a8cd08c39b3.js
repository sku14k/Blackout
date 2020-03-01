
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


        verifyVideoContext();

        initModalClick();
        initModalClose();

        $desktopVid = $(".bg-video.desktop")[0];
        $mobileVid = $(".bg-video.mobile")[0];

        if($(".html5-container video").length != 0) {
            videoResize();
            window.addEventListener("resize", videoResize);
        }

    };

    var verifyVideoContext = function() {
            var con = (atviVid) ? vidContext : undefined,
            obj = {youtubeId: '', vimeoId: ''};
        if (!con) {
			var ytId = $modalVid.data('youtube-id'),
                vimeoId = $modalVid.data('vimeo-id');
            if (ytId && ytId.length) obj.youtubeId = ytId;
            if (vimeoId && vimeoId.length) obj.vimeoId = vimeoId;
            atviVid.init($modalVid, obj);

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
// PC TABLE
var PC = PC || {};

(function($ ,PC){
    var init = function(){
        resizeTable();

        $(window).resize(function(){
            $('.mobile').removeClass('active');
            resizeTable();
        });
    };

    //MOBILE ONLY
    var resizeTable = function(){
        if($(window).width() <= 768) {
            $(".mobile .row-blank").attr("style", "");
            $(".mobile .row-0").attr("style", "");
            $(".mobile .row-1").attr("style", "");
            $(".mobile .row-2").attr("style", "");
            $(".mobile .row-3").attr("style", "");
            $(".mobile .row-4").attr("style", "");

            $(".mobile .row-blank").css({
                'height':($(".mobile-row.header").height()  + 'px')
            });
            $(".mobile .row-0").css({
                'height':($(".mobile-row.row-0").height()  + 'px')
            });
            $(".mobile .row-1").css({
                'height':($(".mobile-row.row-1").height()  + 'px')
            });
            $(".mobile .row-2").css({
                'height':($(".mobile-row.row-2").height()  + 'px')
            });
            $(".mobile .row-3").css({
                'height':($(".mobile-row.row-3").height()  + 'px')
            });
            $(".mobile .row-4").css({
                'height':($(".mobile-row.row-4").height()  + 'px')
            });

            $('.mobile').addClass('active');
        }
    };
    $(init);

})(jQuery, PC);


//Scroll To wtb
(function($){
    var init = function(){
        scrollWtb();
    }
    var scrollWtb = function(){
        //if user url #buy -> atvi-wheretobuy

        if(window.location.href.indexOf('#buy') > -1){
            var $target = $('.atvi-wheretobuy');

            $('html, body').animate({
                scrollTop: $target.offset().top
            }, 1000);
        }
    }

    $(init);
})(jQuery);


(function($){

    var init = function(){
		selectPC();
    }

    var selectPC = function(){

        var $wtb = $(".atvi-wheretobuy");
        var $pcBtn = $wtb.find(".selection-type-platforms .pc a.pc");

        $pcBtn.click();

    }

    $(init);

})(jQuery);
