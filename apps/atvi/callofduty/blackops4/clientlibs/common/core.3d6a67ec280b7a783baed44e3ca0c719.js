

// BO4 CORE

var BO4 = window.BO4 || {};

(function(BO4, $) {

    if(BO4.core) return;
    var core = BO4.core = {};
    BO4.data = {};

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

    BO4.core.changeUrl = function(url, title, replace) {

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

    BO4.core.addPopstateHandler = function(f) {
		popstateHandlers.push(f);
    };

    //helpers

    BO4.core.scrollToTarget = function($target, delta) {
		$('html, body').stop().animate({
	        'scrollTop': $target.offset().top + delta
	    }, 1000);
    };

    BO4.core.initHashtag = function(hashtag, $target) {

		var hash = window.location.hash.substring(1);

        if(hash == hashtag) {

            $('html,body').animate({
                scrollTop: $target.offset().top - 100
            }, 1000);

        }

    };

    init();

})(BO4, jQuery);



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
            item = $('<li/>');
        item.append(anchor);
        $('.bo4-footer .footer-links > ul').append(item);
    };

    $(init);

})(jQuery, ATVI);
(function ($, BO4) {

    var init = function () {
        if(!window.location.hash.length) return;
        
		var urlHash = window.location.hash.slice(1).toLowerCase();
        var whitelistHashes = ['multiplayer', 'zombies', 'blackout'];
        var $scrollTarget = $('.' + urlHash);

        if(whitelistHashes.indexOf(urlHash) === -1) return;

        BO4.core.scrollToTarget($scrollTarget, 0);
    };

    $(init);

}(jQuery, BO4));

