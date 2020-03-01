// COD GAME NAV

var COD = COD || {};

(function($, COD) {

    COD.menu = COD.menu || {};
    menu = COD.menu;
    var $megamenu, $topNavLinks, $subLinks,$curTopLink;
    var isMouseOverMenu = false;
    var overMainNav = false;
    var menuActive = false;
    var curMenuState;

    var breakpoint = 1040;

    var init = function() {
        preload();
        $(postload);
    };

    var preload = function() {

    };

    var postload = function() {
		defineElements();
        setupHamburger();
        importGlobalNav();
        setupHeaderScroll();
        $(window).load(setupMobileMenu);
        resize();
    };

    var defineElements = function() {

        $megamenu = $(".main-mega-menu");
        $topNavLinks = $(".global-main-menu li.submenu-parent");
        $subLinks = $megamenu.find(".sub-links-list");

    };

    var setupHamburger = function() { 
        $(".top-game-mobile-menu-icon").on("click", openMenu);
        $(".mobile-nav-close").on("click", closeMenu);
    };

    var openMenu = function(e) {
        if(e) e.preventDefault();
        $("body").addClass("menu-open");
    };

    var closeMenu = function(e) {
        $("body").removeClass("menu-open");
    };

    var setupMobileMenu = function() {

        var $mobileNavContainer = $(".mobile-game-nav");
        var $topLink = $mobileNavContainer.find(".submenu-parent > p > a");

        $topLink.click(function(e) {

            e.preventDefault();

            var $parent = $(this).closest(".submenu-parent");
            if($parent.hasClass("active")) $parent.removeClass("active");
            else $parent.addClass("active");

            $topLink.not($(this)).closest(".submenu-parent").removeClass("active");

        });

        var $subMenuLink = $mobileNavContainer.find(".submenu-parent .submenu > .nav-item > a");
        $subMenuLink.click(function() {
			closeMenu();
        });

    };

    var setupHeaderScroll = function() {

        //var $header = $(".header-container");
        var $header = $(".game-header");
        //var $header = $(".container > .root > .aem-Grid > .experiencefragment:first-of-type");

        $(window).scroll(function() {

            if(window.innerWidth > 1024) {

                var curPost = $(window).scrollTop();
    
                if(curPost > 300) {
                    $header.removeClass("g-active");
                    $header.addClass("g-collapse");
    
                } else {
                    $header.removeClass("g-collapse");
                }
            }

        });

        $header.find(".collapse-btn").click(function() {
            $header.addClass("g-active");
        });

    };

    var importGlobalNav = function() {

		var $globalNav = $(".global-mobile-nav-container .primary-nav");
        var $container = $(".game-mobile-nav-container .mobile-inner-wrapper");

        $container.append($globalNav);

    };

    var resize = function() {

        $(window).resize(function() {

            if(window.innerWidth > 1100) {
                closeMenu();
            }

        });

    };

    init();

})(jQuery, COD);


