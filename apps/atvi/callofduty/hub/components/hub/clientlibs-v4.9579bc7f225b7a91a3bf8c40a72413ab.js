var HUB = HUB || {};

(function($, HUB) {

    var $bodyContainer;
    var $activeTile;
    var $desktopHeroVideo;
    var $mobileHeroVideo;

    var init = function() {

        $bodyContainer = $("body > .root > .aem-Grid");
        initModals();
        initHeroVideos();
    };

    var initModals = function() {

        var $overlay = $(".modal-overlay");
        var $ctaBtn1 = $(".hub-hero-container .cta-container .cta-1[data-modal='yes'] a");
        var $ctaBtn2 = $(".hub-hero-container .cta-container .cta-2[data-modal='yes'] a");
        var $content = $overlay.find(".modal-content");
        var $close = $overlay.find(".modal-close");

		function whichTransitionEvent(){
            var t,
                el = document.createElement("fakeelement");

            var transitions = {
                "transition"      : "transitionend",
                "OTransition"     : "oTransitionEnd",
                "MozTransition"   : "transitionend",
                "WebkitTransition": "webkitTransitionEnd"
            }
            
            for (t in transitions){
                if (el.style[t] !== undefined){
                    return transitions[t];
                }
            }
        }
        
        var transitionEvent = whichTransitionEvent();

        $ctaBtn1.click(function(e) {

			e.preventDefault();
            var $parent = $activeTile = $(this).closest(".hero-hub-container");
            var $modal = $(".modal-overlay.hero-modal-1");
            $modal.appendTo($bodyContainer);
            setTimeout(function() {
				$modal.addClass("active");
            }, 10);

        });

        $ctaBtn2.click(function(e) {

			e.preventDefault();
            var $modal = $(".modal-overlay.hero-modal-2");
            $modal.appendTo($bodyContainer);
            setTimeout(function() {
				$modal.addClass("active");
            }, 10);

        });

        $overlay.add($close).click(function(e) {

			var $parent = $(this).closest(".modal-overlay");
            if($parent.find(".atvi-video").length) {
                var vidContext = ATVI.components.video.getContext($parent.find(".atvi-video"));
                vidContext.pause();
            }

            $parent.removeClass("active");
            $parent.one(transitionEvent, function(e) {
				$parent.appendTo($("hub-hero-container"));
            });

        });

		$content.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

    };


    var initHeroVideos = function() {

		$desktopHeroVideo = $(".bgvideo.desktop")[0];
        $mobileHeroVideo = $(".bgvideo.mobile")[0];

        if($(".hub-hero-container video").length != 0) {
            videoResize();
            window.addEventListener("resize", videoResize);
        }

    };

    var videoResize = function(){

        if($(window).width() <= 768) {
			$desktopHeroVideo.pause();
            $mobileHeroVideo.play();
        } else {	
			$desktopHeroVideo.play();
            $mobileHeroVideo.pause();
        }
    }

    $(init);

})(jQuery, HUB);








var HUB = HUB || {};

(function($, HUB) {

    var init = function() {

        $(window).on("load", function() {
			initSSO();
        });

    };

    var initSSO = function() {

        var sb = window.ssobar;
        if(sb) {
            sb.onAuthentication(function() {
                sb.onReady(updateStatsSection);
            });
        }

    };

    var updateStatsSection = function() {

		var sso = $(".SSO-BAR");
        var $body = $("body");

        try {
            if(window.ssobar.user.isLoggedIn) {
                if(ssobar.user.identities.length <= 0) {
        
                    $(".hub-mid-hero-container").addClass("no-stats");
        
                }

                ///////

                var found = false;

                for(var i = 0; i < ssobar.user.identities.length; i++) {

                    if(ssobar.user.identities[i].provider == "psn" || ssobar.user.identities[i].provider == "xbl" || ssobar.user.identities[i].provider == "steam" || ssobar.user.identities[i].provider == "battle") {
						found = true;
                    }

                }

                if(!found) {
					$(".hub-mid-hero-container").addClass("no-stats");
                }

                //////

                if(HUB.mycod.storeModules.identities.state.identities.length == 0) {
					$(".hub-mid-hero-container").addClass("no-stats");
                }
            }
        } catch(e) {}


    };

    $(init);

})(jQuery, HUB);








var HUB = HUB || {};

(function($, HUB) {

    var init = function() {

        filterNews("all");
        initFilter();
    };

    var filterNews = function(game) {

		$("#cod-hub-news .latest-news").attr("data-game", game);

        var $newsGroup = $("#cod-hub-news .news-content .news-group");

        $newsGroup.hide();
        $newsGroup.filter("[data-category='" + game + "']").show();

    };

    var initFilter = function() {

        var $btn = $("#cod-hub-news .news-header-filter li");

        $btn.click(function() {

			var game = $(this).attr("data-game");

            filterNews(game);

        });

    };

    HUB.filterNews = filterNews;

    $(init);

})(jQuery, HUB);







var HUB = HUB || {};

(function($, HUB) {

    var $bodyContainer;
    var $activeTile;

    var init = function() {

        $bodyContainer = $("body > .root > .aem-Grid");
        initModals();
    };

    var initModals = function() {

        var $overlay = $(".hub-sub-news-tile .modal-overlay");
        var $ctaBtn1 = $(".hub-sub-news-tile[data-tiletype='video'] > a");
        var $content = $overlay.find(".modal-content");
        var $close = $overlay.find(".modal-close");

		function whichTransitionEvent(){
            var t,
                el = document.createElement("fakeelement");

            var transitions = {
                "transition"      : "transitionend",
                "OTransition"     : "oTransitionEnd",
                "MozTransition"   : "transitionend",
                "WebkitTransition": "webkitTransitionEnd"
            }
            
            for (t in transitions){
                if (el.style[t] !== undefined){
                    return transitions[t];
                }
            }
        }
        
        var transitionEvent = whichTransitionEvent();

        $ctaBtn1.click(function(e) {

			e.preventDefault();
            var $parent = $activeTile = $(this).closest(".hero-sub-news-tile");
            var $modal = $(".modal-overlay.news-modal-1");
            $modal.appendTo($bodyContainer);
            setTimeout(function() {
				$modal.addClass("active");
            }, 10);

        });

        $overlay.add($close).click(function(e) {

			var $parent = $(this).closest(".modal-overlay");
            if($parent.find(".atvi-video").length) {
                var vidContext = ATVI.components.video.getContext($parent.find(".atvi-video"));
                vidContext.pause();
            }

            $parent.removeClass("active");
            $parent.one(transitionEvent, function(e) {
				$parent.appendTo($activeTile);
            });

        });

		$content.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

    };

    $(init);

})(jQuery, HUB);











var ATVI = ATVI || {};

(function($, ATVI) {

	var ld = ATVI.localeDetector,
        region = undefined;


    ld.getRegion(function(d) {
        region = d;
    });

    var init = function() {
		if (region == 'ca') addPrivacyLink();
    };

    var addPrivacyLink = function() {
        var anchor = $('<a/>', { 'href':'https://support.activision.com/privacyrequest?st=ca', 'text': 'Do Not Sell My Personal Information', 'target': '_blank' }),
            item = $('<div/>', { 'class': 'basic-margin footer-link-item caps' });
        item.append(anchor);
        $('.cod-global-footer .footer-links').append(item);
    };

    $(init);

})(jQuery, ATVI);
var HUB = HUB || {};

(function($, HUB) {


    var init = function() {

        //initPurchase();
        //initColorReveal();
        //initTouts();
        //initOverride();

        //window.removeEventListener("optimizedScroll", animIncentives);
		//initAnimations();

    };

    var initPurchase = function() {

        var $btn = $(".cod-global-header-container .purchase a, .cod-global-header-container .mobile-purchase a");
        //var $btn = $(".cod-global-header-container .purchase a, .cod-global-header-container .mobile-purchase a");

        $btn.click(function(e) {

            e.preventDefault();
            var $target = $(".wtb-component");

			$('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 1000);

        });

    };

    var initColorReveal = function() {

        $(window).scroll(function() {

            var $tiles = $(".sub-features");

            if(window.innerWidth >= 1024) {

                var tileTop = $tiles.offset().top;
                var tileMiddle = tileTop + ($tiles.height() / 2);
                var screenTop = $(window).scrollTop();
                var screenHalf = screenTop + (window.innerHeight * .66);

                if((screenHalf > tileTop) && (screenTop < tileMiddle)) {
					$tiles.find(".hub-tile").addClass("active");
                }

                else {
					$tiles.find(".hub-tile").removeClass("active");
                }

        	}
            else {
				$tiles.find(".hub-tile").removeClass("active");
            }

        });

    };

    var initTouts = function() {

        //classified

		var $btn = $(".hub-sub-tile:eq(0), .hub-sub-tile:eq(2)");

        $btn.click(function(e) {

            e.preventDefault();

            var url = $(this).find(".tile-cta a").attr("href");
			window.open(url, "_self");
            
        });


    };

    /*var initAnimations = function() {
		$(".atvi-wheretobuy").addClass("anim-incentives fixed-post");
    }*/

    $(init);

})(jQuery, HUB);








