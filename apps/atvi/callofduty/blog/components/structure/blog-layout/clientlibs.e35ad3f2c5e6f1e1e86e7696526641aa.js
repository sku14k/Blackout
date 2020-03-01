var BLOG = BLOG || {};

(function($, BLOG) {

    var init = function() {
        initHash();
    };

    var initHash = function() {

        var hash = window.location.hash;

        if(hash.length > 0) {
			var $target = $("#" +  window.location.hash.substring(1)); 

            $('html,body').animate({
                scrollTop: $target.offset().top - 100
            }, 1000);
        }

    };

    var initAppMode = function() {

		var url = window.location.href;

        if(url.indexOf("app=true") > 1) {

            $("body").addClass("app-mode");
        }

    };

    $(window).on("load", function() {
		init();
    });

    $(initAppMode);

})(jQuery, BLOG);






