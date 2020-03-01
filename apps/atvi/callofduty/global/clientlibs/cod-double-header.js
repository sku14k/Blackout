// hub-fonts

(function() {

    WebFontConfig = {
        google: { families: ['Open+Sans+Condensed:300,700:latin', 'Open+Sans:300,400,700:latin', 'Montserrat:400'] }
    };

    (function() {
        var wf = document.createElement('script');
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(wf, s);
    })();
})();

var HUB = HUB || {};

(function($, HUB) {

    var pageTop;

    var init = function() {

        initSectionBlur();
		initMobileMenu();
        initSSO();
        //initLogin();
		initResize();
    };

    var initSectionBlur = function() {

		var $parent = $(".aem-Grid .experiencefragment").parent();
        $parent.children().not(".experiencefragment:first-of-type").addClass("section-blur");

    };

    var initMobileMenu = function() {

        //open menu
        var $burger = $(".cod-global-header-container .mobile-burger");
        var $mobileMenu = $(".cod-global-header-container .mobile-menu");

        var pageTop;

        $burger.click(function(e) {
            if($(this).hasClass("active")) closeMobileMenu();
            else openMobileMenu();
        });

        //logo drop down
		/*var $logo = $(".global-mobile-menu li.logo-item img");
        $logo.click(function(e) {
            $(this).closest("li.logo-item").addClass("active");
        });*/

    };

    var openMobileMenu = function() {
		var $burger = $(".cod-global-header-container .mobile-burger");
        var $mobileMenu = $(".cod-global-header-container .mobile-menu");

        $burger.addClass("active");
        $mobileMenu.addClass("active");
        $("body > .root > .aem-Grid").addClass("blur");

        pageTop = $(window).scrollTop();
		$("body").addClass("menu-active");
        $("body").css("top", "-" + pageTop + "px");
    };

    var closeMobileMenu = function() {

        var $burger = $(".cod-global-header-container .mobile-burger");
        var $mobileMenu = $(".cod-global-header-container .mobile-menu");

		$burger.removeClass("active");
        $mobileMenu.removeClass("active");
        $("body > .root > .aem-Grid").removeClass("blur");

        $("body").removeClass("menu-active");
        $("body").attr("style","");
		$(window).scrollTop(pageTop);

    };

    var initLogin = function() {

        var $loginBtn = $(".cod-global-header-container .desktop-header .nav-right .login");
        var $ppMenu = $(".player-profile-menu");
        var $ppClose = $ppMenu.find(".pp-close");

        $loginBtn.click(function(e) {
            /*if(!$(this).hasClass("pp-ready")) { //activate login/sign up drop down, hasClass("pp-ready")
                $(this).toggleClass("active");
            }
            else { //activate pp menu
                $ppMenu.toggleClass("active");
            }*/

            $ppMenu.toggleClass("active"); //mycod blue
        });

        $ppClose.click(function() {
			$ppMenu.removeClass("active");
        });

        //mycod blue
        /*var $myCodBtn = $(".cod-global-header-container .desktop-header .nav-right .mycod-link > p > a");

        $myCodBtn.click(function(e) {
            e.preventDefault();
            $(this).closest(".mycod-link").toggleClass("active"); //mycod blue
        });*/


    };

    var initSSO = function() {
        var sb = window.ssobar;
        if(sb) {
            sb.onAuthentication(function() {
                sb.onReady(updateAccountLinksFromSso);
            });
        }
        else {
			$(".cod-global-header-container .mycod-link ul.logged-in").remove();
        }

    };

    var updateAccountLinksFromSso = function() {
        var sso = $(".SSO-BAR");
        var $body = $("body");
        var $gh = $(".cod-global-header-container");

        try {
            if(window.ssobar.user.isLoggedIn) {
                $body.addClass("sso-logged-in");
                $gh.find(".mycod-link ul.logged-out").remove();
            }
        } catch(e) {}
        setTimeout(function() {
            $body.addClass("sso-auth-known"); 
        }, 20);


        $(".login-test .login-link").attr("href", sso.find("#login-solo").attr("href"));
        $(".login-test .signup-link").attr("href", sso.find("#signup-solo").attr("href"));
        $(".log-in a").attr("href", sso.find("#login-solo").attr("href"));
        $(".sign-up a").attr("href", sso.find("#signup-solo").attr("href"));
        $(".profile a, .ppl-linked-accounts a").attr("href", sso.find("#sso-account-action-profile").attr("href"));
        $(".log-out a, .ppl-signout a").attr("href", sso.find("#sso-account-action-logout").attr("href"));

        if(window.location.host.indexOf("stage") == 0) {

			var infoLink = $(".ppl-basic-info a").attr("href").replace("profile", "dev");
            $(".ppl-basic-info a").attr("href", infoLink);

            var prefLink = $(".ppl-preferences a").attr("href").replace("profile", "dev");
            $(".ppl-preferences a").attr("href", prefLink);

        }
    };

    var initResize = function() {

        $(window).resize(function() {

            if(window.innerWidth > 1024) {

                if($(".cod-global-header-container .mobile-burger").hasClass("active")) {
					closeMobileMenu();
                }

            }

        });

    };

    $(init);

})(jQuery, HUB);
// COD GLOBAL PLAYER PROFILE

var COD = COD || {}; 

(function($, COD) {

    COD.menu = COD.menu || {};
    
    var menu = COD.menu;

    var init = function() {
		ssoReady();
    };

    var ssoReady = function() {
        var sb = window.ssobar;
        if(sb) sb.onAuthentication(function() {
            sb.onReady(checkLoginState);
        });

    };

    var checkLoginState = function() {
        var sso = $(".SSO-BAR"); 
        var $body = $("body");

        try {
            if(window.ssobar.user.isLoggedIn) {
                var game = menu.game || getCurGame();
                menu.initPlayerProfile();
                setupMyCodLink();
            }
        } catch(e) {}

    };

	menu.initPlayerProfile = function() { 

        //$(".cod-global-header-container .desktop-header .nav-right .login").addClass("pp-ready");

        var defaultUsername, dataAvailable;
        menu.platformsAvailable = [];
		defaultIdentities = ssobar.user.identities;

        //Grab crm blob cookie from user
		var crmBlobCookie = ATVI.utils.getCookie("CRM_BLOB");
        if(crmBlobCookie) {
        	var decoded = atob(crmBlobCookie);
          	var crmBlob = JSON.parse(decoded);
			menu.crmBlob = crmBlob.plat;
        }

        //Check which platforms user has linked and add to array
        for(var i=0;i < defaultIdentities.length; i++) {

			if(defaultIdentities[i].provider == "psn" || 
               defaultIdentities[i].provider == "xbl" || 
               defaultIdentities[i].provider == "steam") {
				menu.platformsAvailable.push(defaultIdentities[i].provider);
            }
        }

        //Get uno username
        var unoUsername;
        for(var i = 0; i < defaultIdentities.length; i++) {
            if(defaultIdentities[i].provider == "uno") {
                unoUsername = defaultIdentities[i].username;
            }
        }

        //Do the real checking

        if(menu.platformsAvailable.length >= 1) { //if user has at least one major platform linked

            if(!menu.crmBlob) { // if crmBlob is not defined, display uno username only

				$(".cod-global-header-container").addClass("no-data");
                defaultUsername = unoUsername;
                dataAvailable = false;
            }

            else { // if crmBlob is working

                //what platforms are available for current game
                menu.platformsAvailableFromGame = getPlatformsAvailableFromGame(menu.game);

                if(menu.platformsAvailableFromGame.length <=0) { //if user does not have game, show forum id
				
                    $(".cod-global-header-container").addClass("no-data");
                    defaultUsername = unoUsername;
                    dataAvailable = false;
                    
                }
                else {
                    menu.platform = menu.platformsAvailableFromGame[0]; //get first platform
                    createPlatformDropDown(menu.platformsAvailableFromGame);
                    defaultUsername = getUsername(menu.platform);
                    $(".cod-global-header-container").removeClass("no-data");
                    $(".pp-header").find(".platform-selection, .pp-rank").show();
                    $(".pp-header").find(".link-account-btn").hide();
                    $(".pp-header").find(".mycod-cta").show();
                    dataAvailable = true;
                }

            }

        }

        else { //if user has no major platforms linked, display uno username only

			$(".cod-global-header-container").addClass("no-data");
            defaultUsername = unoUsername;
            dataAvailable = false;

        }

		//defaultUsername and menu.platform is now available
        menu.fillInPP(defaultUsername, dataAvailable)

    };


    menu.getProfile = function(game, defaultPlatform, gamer, defaultUsername, callback) {

        var obj = {};

        COD.api.papi.crm.profile(game, defaultPlatform, gamer, defaultUsername, function(res) {
            
            var pData    = res;
            obj.username = pData.username;
            obj.level    = pData.mp.level;
            obj.prestige = pData.mp.prestige;
            obj.avatar   = HUB.mycod.methods.getRankIcon(pData.mp, game);
            obj.platform = defaultPlatform;
            
            return callback(obj);
            
        });

    };

    var setupMyCodLink = function() {

		var $cta = $(".pp-header .mycod-cta a");
		var game = menu.game;
        var pageLocale = ATVI.pageLocale;
        var localeAvail = ["en","en_GB", "en_CA", "en_AU", "pt_BR", "es_MX", "it", "es", "de", "fr", "fr_CA"];
		var cleanLocale;

        for(var i = 0; i < localeAvail.length; i++) {

            if(pageLocale == localeAvail[i]) {

                if(pageLocale == "en_GB") {
					cleanLocale == "/uk/en";
                }
                else if(pageLocale == "en_CA") {
                    cleanLocale = "/ca/en";
                }	
                else if(pageLocale == "en_AU") {
                    cleanLocale = "/au/en";
                }
                else if(pageLocale == "pt_BR") {
                    cleanLocale = "/br/pt";
                }
                else if(pageLocale == "es_MX") {
                    cleanLocale = "/mx/es";
                }
                else if(pageLocale == "fr_CA") {
                    cleanLocale = "/ca/fr";
                }
                else if(pageLocale == "en") {
                    cleanLocale = "";
                }
                else {
                    cleanLocale = "/" + localeAvail[i].toLowerCase();
                }

            }
            else {
				cleanLocale = "";
            }

        }

        //var linkString = "https://my.callofduty.com" + cleanLocale + "/" + game + "/dashboard";
        var linkString = "https://my.callofduty.com/dashboard";
        $cta.attr("href", linkString);

    };

	var getPrestige = function(game, platform) {
		var plat;
		if     (platform == "psn")   plat = "p";
		else if(platform == "xbl")   plat = "x";
		else if(platform == "steam") plat = "pc";
		
		return menu.crmBlob[plat]['t'][game]["pres"];
	};
	
	var getLevel = function(game, platform) {
        var plat;
		if     (platform == "psn")   plat = "p";
		else if(platform == "xbl")   plat = "x";
		else if(platform == "steam") plat = "pc";
		return menu.crmBlob[plat]['t'][game]["lev"];
	};
	
	var getUsername = function(platform) {
		var identities = ssobar.user.identities;
		for(var i = 0; i < identities.length; i++) {
			if(identities[i].provider == platform) {
				return identities[i].username;
			} 
		}
	};

    var getRankIcon = function(game, platform) {

        var prestigeIconId = getPrestige(game, platform);
        var levelId = getLevel(game, platform);
        var bo4IcnSrc;

        if (game === 'iw') {
            levelId = levelId < 28 ? Math.ceil(levelId / 3) :
                10 + Math.floor((levelId - 28) / 2);
        } else if (game === 'wwii') { 
            levelId = levelId >= 50 ? levelId = levelId - 31 : 
            levelId >= 40 ?  14 + Math.floor((levelId - 40) / 2) :
                Math.ceil(levelId / 3) ;
        } else if (game === 'bo4') {
			var path = "https://www.callofduty.com/cdn/app/icons/bo4/";
            var mode = 'mp';
            var ext = mode == 'mp' ? '.png' : '_large.png';
            if(prestigeIconId) {
                var prest = prestigeIconId < 10 ? '0'+prestigeIconId : ''+prestigeIconId;
                return path + 'prestige/'+mode+'/ui_icon_'+mode+'_prestige_' + prest + ext;
            }
            else {
                var lvl = levelId < 10 ? '0'+levelId : ''+levelId;
            	return path + 'ranks/'+mode+'/ui_icon_rank_'+mode+'_level' + lvl + ext;
            }
        }


        var iconName = prestigeIconId  ? 'prestige-' + prestigeIconId : 'level-' + levelId;

        var playerIconPath = '/content/dam/atvi/callofduty/mycod/common/player-icons/';
        var imgSrc = playerIconPath + game + '/' + iconName + '.png';
        return imgSrc;
    };
	
	var getPlatformsAvailableFromGame = function(game) {
		
		var platArr = [];


        $.each(menu.crmBlob, function(key,value) {

            if(key == "p") {

				if(game in menu.crmBlob["p"]["t"]) {
                    //user has game	on psn
                    platArr.push("psn");
                }

            } else if (key == "x") {

                if(game in menu.crmBlob["x"]["t"]) {
                    //user has game on xbox
                    platArr.push("xbl");
                }

            } else if (key == "pc") {

                if(game in menu.crmBlob["pc"]["t"]) {
                    //user has game on steam
                    platArr.push("steam");
                }

            }

        });

		return platArr;
		
	};

    var getCurGame = function() {

        var game;
		var url = window.location.href;

        if(url.indexOf("/iw") > 0 || url.indexOf("/infinitewarfare") > 0) game = "iw";
        else if(url.indexOf("/bo3") > 0 || url.indexOf("/blackops3") > 0) game = "bo3";
        else if(url.indexOf("/wwii") > 0) game = "wwii";
        else if(url.indexOf("/blackops4") > 0 || url.indexOf("/bo4") > 0) game = "bo4";
        else game = "bo4";
        menu.game = game;
        return game;

    };

    var createPlatformDropDown = function(platformArr) {

		var $platformSelect = $(".pp-header .platform-selector");
        $platformSelect.find("select").empty();
        $platformSelect.find("select").append("<option disabled='disabled' value='0'>Select an account</option>");

        for(var i = 0; i < platformArr.length; i++) {

            var template = "<option value='" + platformArr[i] + "'>" + getUsername(platformArr[i]) + " (" + platformArr[i] + ")</option>";
            $platformSelect.find("select").append(template);
        }

        $platformSelect.off("change", "select", function() {

        });

        $platformSelect.on("change", "select", function() {

            var val = menu.platform = this.value;

			menu.platformChange(menu.platform); //update flyout menu
            menu.onPlatformChange(menu.platform); //update mycod page info

        });

    };

    menu.fillInPP = function(username, dataAvailable) {

        //pp menu
		var $container = $(".player-profile-menu");

        $(".cod-global-header-container .desktop-header .nav-right .login .username").text(username);
        $container.find(".pp-username").text(username);
        $container.removeClass("iw bo3 wwii bo4").addClass(menu.game);
		if(dataAvailable != false) {
            $container.find(".emblem").show();
			$container.find(".pp-rank .pp-level").text(getLevel(menu.game, menu.platform));
			$container.find(".pp-rank .pp-prestige").text(getPrestige(menu.game, menu.platform));
			$container.find(".platform-selection").removeClass("steam psn xbl").addClass(menu.platform);
            $container.find(".emblem").css("background-image", "url(" + getRankIcon(menu.game, menu.platform) + ")"); 
            //$(".cod-global-header-container .desktop-header .nav-right .login .emblem-sm").css("background-image", "url(" + getRankIcon(menu.game, menu.platform) + ")"); 
			//$(".cod-global-header-container .desktop-header .nav-right .login .account-icon").hide();
        }

    };

    //for flyout menu
    menu.onGameChange = function(game) { //this gets triggered on mycod app end
        menu.game = game;
		menu.initPlayerProfile();
    };

    menu.platformChange = function(platform) { //this gets triggered from flyout menu platform selection to update flyout menu info

        menu.platform = platform;
		var username = getUsername(menu.platform);
        menu.fillInPP(username, dataAvailable);

    };

    //for mycod page info
    menu.onPlatformChange = function(platform) { //this gets triggered from flyout menu platform selection and will be overwritten on mycod app end to update the page info

    };

    $(init);

})(jQuery, COD);


/********
css found under cod-global-header.less
lines 168/176/373
********/


(function($){

    var init = function(){

        //change href of tab to prevent page change
		$(".cod-global-header-container .desktop-header .nav-left .global-top-nav ul.games-list .has-dd > a").attr("href", "#");

        //open mobile games menu
        $(".mobile-header .mobile-menu .mobile-menu-container li.logo-item").addClass("active");

		//add games tab on mobile
        var gamesLabel = $(".games-list > li > a").text();
        $(".mobile-menu-container").addClass("cod-logo-switch");
        $(".mobile-menu-container li.logo-item .logo a").text(gamesLabel).attr("href","#");
        var hubUrl = $(".cod-global-header-container .desktop-header .nav-left .global-logo .logo a").attr("href");
		$(".mobile-menu-container .global-mobile-menu > ul").prepend('<li class="cod-logo-item nav-item"><div class="logo"><a href="' + hubUrl + '">Call of Duty</a></div></li>');

		//test

        $(".cod-game-header-container li.logo-item img").click(function() {
            if($("body").hasClass("closed-games-test")) {
            	$(".cod-game-header-container li.logo-item").toggleClass("active");
            }
        });
        $(".cod-global-header-container li.logo-item img").click(function() {
            if($("body").hasClass("closed-games-test")) {
            	$(".cod-global-header-container li.logo-item").toggleClass("active");
            }
        });
    }

	$(init);

})(jQuery);

// AB TEST
// https://activision.jira.com/browse/COD-1651
//

/*
(function($){

    $(function(){
        var $gameNavList = $('.cod-global-header-container .desktop-header .nav-left .global-top-nav ul.games-list');
        var $generalNavList = $('.cod-global-header-container .desktop-header .nav-left .global-top-nav ul.global-general-nav');
		var $gameLinks = $gameNavList.find('.dd-sublist a');
        var index = ($gameLinks && $gameLinks.length > 0) ? $gameLinks.length : 0;

        // ADD AB TEST CLASSES
		$gameNavList.addClass('ab-test');
		$generalNavList.addClass('ab-test');

        // GENERATE ITEMS TO PREPEND
        var generateNode = function(index){
            var item = $gameLinks[index];
            var href = item.getAttribute("href");
			var label = item.getAttribute("data-label");

            var node = '<li><a ';
			node += 'class="nav-link-ab-test ' + label.toLowerCase().replace(/([^0-9a-zA-Z])/g, '') + '" ';
			node += 'href="' + href + '" ';
			node += 'title="' + label + '" ';
            node += '>' + label + '</a></li>';

            return node;
        };

        // REVERSE PREPEND LINKS
		while (index--) {
            var node = generateNode(index);
			$generalNavList.prepend(node);
        }
    });

}(jQuery));
*/
var HUB = HUB || {};

(function($, HUB) {

    var pageTop;
    HUB.menu = HUB.menu || {};

    var init = function() {

        initSectionBlur();
		initMobileMenu();
        initScroll();
		initResize();
    };

    var initSectionBlur = function() {

		var $parent = $(".aem-Grid .experiencefragment").parent();
        $parent.children().not(".experiencefragment:first-of-type").addClass("section-blur");

    };

    var initMobileMenu = function() {

        //open menu
        var $burger = $(".cod-game-header-container .mobile-burger");
        var $mobileMenu = $(".cod-game-header-container .mobile-menu");

        var pageTop;

        $burger.click(function(e) {
            //e.stopImmediatePropagation();
            if($(this).hasClass("active")) HUB.menu.closeMobileMenu();
            else openMobileMenu();
        });

        //parent list item drop down
        var $pListItem = $(".mobile-menu-container li.dropdown img");
		$pListItem.click(function(e) {
            $(this).closest("li.dropdown").toggleClass("active");
        });

    };

    var openMobileMenu = function() {
		var $burger = $(".cod-game-header-container .mobile-burger");
        var $mobileMenu = $(".cod-game-header-container .mobile-menu");

        $burger.addClass("active");
        $mobileMenu.addClass("active");
        $("body > .root > .aem-Grid").addClass("blur");

        pageTop = $(window).scrollTop();
		$("body").addClass("menu-active");
        $("body").css("top", "-" + pageTop + "px");
    };

    HUB.menu.closeMobileMenu = function() {

        var $burger = $(".cod-game-header-container .mobile-burger");
        var $mobileMenu = $(".cod-game-header-container .mobile-menu");

		$burger.removeClass("active");
        $mobileMenu.removeClass("active");
        $("body > .root > .aem-Grid").removeClass("blur");

        $("body").removeClass("menu-active");
        $("body").attr("style","");
		$(window).scrollTop(pageTop);

    };

    var initScroll = function() {

        var $header = $(".cod-game-header");

        var lastScrollTop = 0;

        $(window).scroll(function(e) {

            if(window.innerWidth > 1024) {

                var st = $(this).scrollTop();

                if(st > 300) {

                    if(st > lastScrollTop) {
                        // downscroll code
                        $header.addClass("g-collapse");
                        $('body').addClass("header-collapse");
                        $(".cod-global-header-container .desktop-header .nav-right .login").removeClass("active");
                    }
                    else {
                        // upscroll
                        $header.removeClass("g-collapse");
                        $('body').removeClass("header-collapse");
                    }
                }

                else {
					$header.removeClass("g-collapse");
                    $('body').removeClass("header-collapse");
                }

                lastScrollTop = st;

            }

            else {
				$header.removeClass("g-collapse");
                $('body').removeClass("header-collapse");
            }

        });

        $header.find(".collapse-btn").click(function() {
            $header.addClass("g-active");
            $('body').addClass("header-collapse");
        });

    };

    var initResize = function() {

        $(window).resize(function() {

            if(window.innerWidth > 1024) {

                if($(".cod-game-header-container .mobile-burger").hasClass("active")) {
					HUB.menu.closeMobileMenu();
                }

            }

        });

    };

    $(init);

})(jQuery, HUB);


