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

        bg.find('.bg').css('transform', 'translate3d(0,-140%,-1200px) scale(9)');

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
			$video.fadeToggle();

            //if the agegate has already been met, play video
            if($video.find(".atvi-agegate").css("display") == "none") {
				$video.find(".atvi-instrument-video-play").click();
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

    //$(init);

}(jQuery, BO4));

