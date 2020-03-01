

// BO4 CORE

var CODM = window.CODM || {};

(function(CODM, $) {

    if(CODM.core) return;
    var core = CODM.core = {};
    CODM.data = {};

	var historyPoppable, popstateHandlers = [];

    var init = function() {
		$(postload);
        preload();
    };

    var preload = function() {
		setupHistory();
    };

    var postload = function() {
        //BO4.menu.init();
        if(core.postloadCallback) core.postloadCallback();
        removeBlurClass();
    };

    var removeBlurClass = function() {

        //$(window).load(function() {
			$(".responsivegrid > .aem-Grid").removeClass("section-blur");
        //});

    };

    var setupHistory = function() {
		$(window).bind("popstate", function() {
			if(!historyPoppable) return;

            popstateHandlers.forEach(function(f) { f() });

            var ls = ATVI.components.localeSelector;
            if(ls) ls.updateAll();

            // analytics
            ATVI.analytics.setupPageLoad();
        });
    };

    CODM.core.changeUrl = function(url, title, replace) {

        if(!window.history.pushState) return false;
        historyPoppable = true;

        // do url change
        if(replace) {
			history.replaceState({}, title, url);
        } else {
        	history.pushState({}, title, url);
        }
        document.title = title;

        // update components
        var ls = ATVI.components.localeSelector;
        if(ls) ls.updateAll();

    };

    CODM.core.addPopstateHandler = function(f) {
		popstateHandlers.push(f);
    };

    //helpers

    CODM.core.scrollToTarget = function($target, delta) {
		$('html, body').stop().animate({
	        'scrollTop': $target.offset().top + delta
	    }, 1000);
    };

    CODM.core.initHashtag = function(hashtag, $target) {

		var hash = window.location.hash.substring(1);

        if(hash == hashtag) {

            $('html,body').animate({
                scrollTop: $target.offset().top - 100
            }, 1000);

        }

    };

    init();

})(CODM, jQuery);



var ATVI = ATVI || {};

(function($, ATVI) {

	var ld = ATVI.localeDetector,
        region = undefined;


    ATVI.localeDetector.getRegion(function(d) {
        region = d;
    });

    var init = function() {
		if (region == 'ca') addPrivacyLink();
    };

    var addPrivacyLink = function() {
        var anchor = $('<a/>', { 'href':'https://support.activision.com/privacyrequest?st=ca', 'text': 'Do Not Sell My Personal Information', 'target': '_blank' }),
            item = $('<li/>', { 'class': 'legal-link' });
        item.append(anchor);
        $('.codm-footer .legal-links > ul').append(item);
    };

    $(init);

})(jQuery, ATVI);