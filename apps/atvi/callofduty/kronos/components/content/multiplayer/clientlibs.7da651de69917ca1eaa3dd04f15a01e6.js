
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

var MW = MW || {};

(function($, MW){

    var $container,
        containerTop,
        windowTop;


    var init = function(){
        $container = $(".mp-customization-container");
		containerTop = $container.offset().top;


        scrollFade();
        
        window.addEventListener("optimizedScroll", scrollFade);
        videoResize();
        window.addEventListener("resize", videoResize);

    }

    var scrollFade = function(){
        windowPos = window.pageYOffset;

        if ( windowPos > (containerTop - 600)){
			$container.addClass("anim-gunbench");
        } 

        if (windowPos < (containerTop - 800)) {
            $container.removeClass("anim-gunbench");
        }
    }

    var videoResize = function(){
        var $desktopVid = $container.find("video.desktop")[0];
        var $mobileVid = $container.find("video.mobile")[0];

        if($(window).width() <= 1024) {
			$desktopVid.pause();
            $mobileVid.play();
        } else {	
			$desktopVid.play();
            $mobileVid.pause();
        }
    }


    $(init);

})(jQuery, MW);

var MW = MW || {};

(function($, MW){

    var $container,
        containerTop,
        windowTop;

    var init = function(){
        $container = $(".mp-dominate-container");
		containerTop = $container.offset().top;

        scrollFade();

        window.addEventListener("optimizedScroll", scrollFade);
        videoResize();
        window.addEventListener("resize", videoResize);

    }

    var scrollFade = function(){
        windowPos = window.pageYOffset;

        if ( windowPos > (containerTop - 600)){
			$container.addClass("anim-dominate");
        } 

        if (windowPos < (containerTop - 800)) {
            $container.removeClass("anim-dominate");
        }
    }      

    var videoResize = function(){
        var $desktopVid = $container.find("video.desktop")[0];
        var $mobileVid = $container.find("video.mobile")[0];

        if($(window).width() <= 1024) {
			$desktopVid.pause();
            $mobileVid.play();
        } else {	
			$desktopVid.play();
            $mobileVid.pause();
        }
    }

    $(init);

})(jQuery, MW);

var MW = MW || {};

(function($, MW){

    var $pillars,
        pillarTop,
        windowTop;

    var init = function(){
        $pillars = $(".pillarContainer");
		pillarTop = $pillars.offset().top;

        fader();

        window.addEventListener("optimizedScroll", fader);
        window.addEventListener("resize", fader);

    }

    var fader = function(){
        windowPos = window.pageYOffset;

        if ( windowPos > (pillarTop - 600)){
			$pillars.addClass("fade");
        } 

        if (windowPos < (pillarTop - 800)) {
            $pillars.removeClass("fade");
        }
    }      

    $(init);

})(jQuery, MW);

var MW = MW || {};

(function($, MW){

    var $varieties,
        varTop,
        windowTop;

    var init = function(){
        $varieties = $("#varietyContainer");
		varTop = $varieties.offset().top;

        fader();

        window.addEventListener("optimizedScroll", fader);
        window.addEventListener("resize", fader);

    }

    var fader = function(){
        windowPos = window.pageYOffset;

        if ( windowPos > (varTop - 600)){
			$varieties.addClass("fade");
        } 

        if (windowPos < (varTop - 800)) {
            $varieties.removeClass("fade");
        }
    }      

    $(init);

})(jQuery, MW);

var MW = MW || {};
MW.wtb = MW.wtb || {};

(function ($,MW) {

    var mobile = window.matchMedia("(max-width: 768px)");
    var desktop = window.matchMedia("(min-width: 769px)");
    var box;
    var centerScreen = window.innerHeight / 2;
    var stopTop = centerScreen - 450;

	var animIncentives = function () {
    
        var wtb = document.getElementById(document.getElementsByClassName('atvi-wheretobuy')[0].id);
        var wtbFromTop = wtb.offsetTop;
        var windowPosition = window.pageYOffset;
        var differencePositive = wtbFromTop - windowPosition;
        var difference = windowPosition - wtbFromTop;
        var mobile = window.matchMedia("(max-width: 768px)");
        var desktop = window.matchMedia("(min-width: 769px)");
        var purchaseBtnDesktop = document.querySelector(".cod-game-header-container .desktop-header .nav-right .purchase a");
        var purchaseBtnMobile = document.querySelector(".cod-game-header-container .mobile-header .mobile-top-nav .mobile-purchase a");


        var box1 = document.getElementById('buy-column-mobile').getElementsByClassName('bundle-boxart')[0];
        var box2 = document.getElementById('buy-column-desktop').getElementsByClassName('bundle-boxart')[0];
    
        if (windowPosition - 100 > wtbFromTop && windowPosition < wtbFromTop + 1000) {
            wtb.classList.remove("fixed-post");
            box2.style.transform = "scale(0.434)";

            //hide purchaseBtn when scrolling down to wtb
			purchaseBtnDesktop.style.opacity = 0;
            purchaseBtnMobile.style.opacity = 0;

        } else if (windowPosition + 100 > wtbFromTop && windowPosition < wtbFromTop + 1550 && mobile.matches) {
            box1.style.transform = "scale(0.434)";
            box = box1;
            purchaseBtnDesktop.style.opacity = 0;
            purchaseBtnMobile.style.opacity = 0;
        } else {
            box = box2;
            wtb.classList.remove("anim-incentives", "anim-items");

            purchaseBtnDesktop.style.opacity = 1;
            purchaseBtnMobile.style.opacity = 1;
        }
    
        if (windowPosition > wtbFromTop - 500 && windowPosition < wtbFromTop - 0) {
            wtb.classList.remove("anim-incentives", "anim-items");
            wtb.classList.add("initial");

            purchaseBtnDesktop.style.opacity = 1;
            purchaseBtnMobile.style.opacity = 1;

            if(mobile.matches){
                box = box1;
            }
            else{
                box = box2;
            }
    
            if (box) {
                box.style.transform = "scale(0." + (differencePositive + 430) + ")";
            	box.style.opacity = "1";
            }
        }

        if (windowPosition > wtbFromTop + 0 && windowPosition < wtbFromTop + 999) {
    
            wtb.classList.add("anim-incentives", "anim-items");
            wtb.classList.remove("initial");
            if (box) box.style.transform = "scale(0.434)";
        }

        if (windowPosition > wtbFromTop + 1000) {

            if (box) box.style.transform = "scale(0.434)";
        }
    };

	window.addEventListener("optimizedScroll", animIncentives);

    $(animIncentives);

})(jQuery, MW);

