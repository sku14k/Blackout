(function ($) {
    var init = function () {
		var $video = $('.home-hero .video');
        var $videoCloseBtn = $video.find('.close-btn');
        var $pauseBtn = $video.find('.pause');
        var $playBtn = $('.home-hero .play-btn');
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

    $(init);

}(jQuery, BO4));

//script to add Beenox logo to footer

var BO4 = BO4 || {};
BO4.initBeenox = {};

(function($, BO4){

    var init = function(){
		var template = beenoxBuilder();

        beenoxAppend(template);
    }

    var beenoxBuilder = function(){

		var beenoxReference = "/content/dam/atvi/callofduty/blackops4/pc/common/beenox-logo-footer.png";
        var template = '<li class="beenox"><a href="https://www.beenox.com" target="_blank"><img src="' + beenoxReference + '" alt="Beenox"></a></li>'
        return template;
    }

    var beenoxAppend = function(template){
		var $links = $(".bo4-footer").find(".footer-logos ul li");
		$links.eq(1).after(template);
    }

    $(init);

})(jQuery, BO4);
