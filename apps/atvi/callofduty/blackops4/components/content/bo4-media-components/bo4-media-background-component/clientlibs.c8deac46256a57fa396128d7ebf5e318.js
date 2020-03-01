(function () {
    var init = function () {
		var $video = $('.media-lp-background .video');
        var $videoCloseBtn = $video.find('.close-btn');
        var $pauseBtn = $video.find('.pause');
        var $playBtn = $('.media-lp-background .play-btn');
        var toggleVideoVisibility = function (e) {
			$video.toggleClass('active');
        };
        var pauseVideo = function (e) {
			$pauseBtn.click();
        };

        $playBtn.add($videoCloseBtn).on('click', toggleVideoVisibility);
        $videoCloseBtn.on('click', pauseVideo);
    };

    $(init);
}());