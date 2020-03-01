//Friends Feed

var ABTEST = {
    api: {},
    data: {},
    isAnimated: false
};

(function(ABTEST, $) {

    var init = function() {
        $(postload);
        preload();
    };

    var preload = function() {
    };

    var postload = function() {
        checkMobileOS();

    	if(getAccountHashId()) {
	        ABTEST.api.getFriendsFeed();

	        $(document).ajaxStop(function() {
				//console.log("======== ajaxStop() ========");
				if(!JSON.stringify(ABTEST.data.friendsFeed)) {
					console.log ("NO DATA returned from Friends Feed API");
                } else if (ABTEST.data.friendsFeed.data.events.length < 5) {
					console.log ("NOT ENOUGH DATA returned from Friends Feed API");
                } else {
                    buildFeedItems();
	       		}

	    		showFeedAndScroll();

                /* =============== SHOW VERSION w/ 5 Phones ================= */
				/*
                $(".app-ad .tile-content").addClass("v2");
                $(".app-ad .button-link button").addClass("v2");
                $(".app-ad .phone-frame").addClass("v2").removeClass("v1");
                $(".app-ad .phone-frame .friends-feed-container").addClass("v2");
                $(".app-ad .phone-frame-image.v1").hide();
                $(".app-ad .phone-frame-image.v2").show();
                $(".app-ad .phone-frame .friends-feed-container").show();
				*/
	        });
	    } else {
            console.log("NOT LOGGED IN: ACT_SSO_COOKIE not found");
	    	showFeedAndScroll();
	    }
    };

    var checkMobileOS = function() {
        if(ATVI.browser.isIos){
			$(".app-ad .mobile-link.ios").show();
        } else if (ATVI.browser.isAndroid) {
			$(".app-ad .mobile-link.android").show();
        }
    }

    var isScrolledIntoView = function(el) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
    
        var elemTop = $(el).offset().top;
        var elemBottom = elemTop + $(el).height();
    
        return (((elemTop + 150) <= docViewBottom) && ((elemTop + 100) >= docViewTop));
    };

    var showFeedAndScroll = function() {
        $(".friends-feed-container").show();

		$(window).scroll(function() {
            if(isScrolledIntoView(".app-ad") && !ABTEST.isAnimated) {
                var screenHeightBuffer = 450;
                ABTEST.isAnimated = true;

                var divHeight = $(".friends-feed-list").outerHeight(true) - screenHeightBuffer;
                var scrollDuration = divHeight * 10;
                $(".friends-feed-container").animate({ scrollTop: divHeight }, scrollDuration, "linear");
            }
        });
    };

    var getAccountHashId = function() {
        var hashId = ATVI.utils.getCookie("ACT_SSO_COOKIE");
        return hashId;
    };

    var getEnv = function() {
        if (window.location.hostname.indexOf('preview') > -1) {
            return "//preview.callofduty.com";
        } else {
            return "https://www.callofduty.com";
        }
    };

    var getFriendIcon = function(username) {
		var identities = ABTEST.data.friendsFeed.data.identities;
		var iconURL;
        
        $.each(identities, function(i, identity){
            if(identity.username === username) {
                iconURL = identity.avatarUrlLarge;
            }
        });
        
        return iconURL;
    };

	var getTimeSince = function(date) {
        var now = Date.now();
        var diff = Math.max(0, Math.floor((now - date) / 1000)); 
        var days = Math.floor(diff / (24 * 60 * 60));
        diff -= days * 24 * 60 * 60;
        var hours = Math.floor(diff / (60 * 60));
        diff -= hours * 60 * 60;
        var mins = Math.floor(diff / 60);
        diff -= mins * 60;
        var secs = diff;
        
        if (days > 0) {
            if (days == 1) {
                return "a day ago";    
            } else {
                return days + " days ago";
            }
        } else if (hours > 0) {
            if (hours == 1) {
                return "an hour ago";    
            } else {
                return hours + " hours ago";
            }
        } else if (mins > 0) {
            if (mins == 1) {
                return "a minute ago";    
            } else {
                return mins + " minutes ago";
            }
        } else {
            return secs + " seconds ago";
        }
    };

    var isFriendOnline = function(username) {
		var identities = ABTEST.data.friendsFeed.data.identities;
        var onlineStatus = false;
        
        $.each(identities, function(i, identity){
            if(identity.username === username && identity.status) {
                onlineStatus = identity.status.online;
            }
        });

        return onlineStatus ? "online" : "offline";
    };

    var buildFeedItems = function() {
		var events = ABTEST.data.friendsFeed.data.events;
        var feedMarkup = "";

        $.each(events, function(i, item) {
            if(i>29) return false;

            var feedItem = "";
            feedItem += '<li>';
            feedItem += '    <div class="friend-avatar ' + isFriendOnline(item.username) + '" style="background-image: url(&quot;' + getFriendIcon(item.username) + '&quot;);"></div>';
            feedItem += '    <span class="friend-event">' + item.rendered + '</span>'; 
            feedItem += '    <div class="friend-timestamp">';
            feedItem += '        <span class="friend-time-since">' + getTimeSince(item.date) + '</span>';
            feedItem += '        <span class="friend-game-icon ' + item.title + '"></span>';
            feedItem += '    </div>';
            feedItem += '</li>';

            feedMarkup += feedItem;
        });

		$(".app-ad .friends-feed-list").html(feedMarkup);
    };

    var codApiError = function(url, error) {
        return 'COD API error (' + error.message + ', ' + error.type + '):  (' + url + ').';
    };

    /* ***************************************************
  	https://www.callofduty.com/api/papi-client/userfeed/v1/friendFeed/[hashId]
    **************************************************** */
    ABTEST.api.getFriendsFeed = function() {

        error = typeof error === 'function' ? error : function(err) {};

        var friendsFeedUrl = getEnv() + "/api/papi-client/userfeed/v1/friendFeed/" + getAccountHashId();

        return $.ajax({
            type: 'GET',
            url: friendsFeedUrl,
            crossDomain: true
        }).done(function(d) {
            if (!d) {
                console.log('Unknown API error (' + url + ').');
                return;
            }

            if (typeof d != 'undefined' && d.status == "error") {
                console.log('codApiError - Error type: ' + d.data.type);
                console.log('codApiError - Error message: ' + d.data.message);
                return;
            }

            if (typeof d == 'undefined') {
                console.log('getFriendsFeed - Response not found');
                return;
            }

            ABTEST.data.friendsFeed = d;
        });
    };


    init();

})(ABTEST, jQuery);