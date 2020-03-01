
;(function(win, doc, style, timeout) {
  var STYLE_ID = 'at-body-style';

  function getParent() {
    return doc.getElementsByTagName('head')[0];
  }

  function addStyle(parent, id, def) {
    if (!parent) {
      return;
    }

    var style = doc.createElement('style');
    style.id = id;
    style.innerHTML = def;
    parent.appendChild(style);
  }

  function removeStyle(parent, id) {
    if (!parent) {
      return;
    }

    var style = doc.getElementById(id);

    if (!style) {
      return;
    }

    parent.removeChild(style);
  }

  addStyle(getParent(), STYLE_ID, style);
  setTimeout(function() {
    removeStyle(getParent(), STYLE_ID);
  }, timeout);
}(window, document, "body {opacity: 0 !important}", 1000));
var HUB = HUB || {};

(function($, HUB) {
    
    
    var init = function() {
        
        //initPurchase();
        refreshLocsec();
    };
    
    /*var initPurchase = function() {
        
        var $btn = $(".cod-game-header-container .desktop-header .nav-right .purchase a");

        $btn.click(function(e) {

            e.preventDefault();
            var $target = $(".bundle-descriptions-list");

            $('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 500);
            
        });

    };*/
    
    var refreshLocsec = function(){
        //display:none set on locale selector in core.css
        setTimeout(function(){
            $(".atvi-locale-selector").css("opacity", "1");
        }, 1000);

    }
    
    
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
            item = $('<li/>');
        item.append(anchor);
        $('.footer-container .footer-right .footer-links > ul').append(item);
    };

    $(init);

})(jQuery, ATVI);

var HelperFunc = {};

(function($, helper){
    
    var helper = helper;
    
    //pass in the element as a string
    
    
    helper.inTotalView = function(context){

        var bounding = context.getBoundingClientRect();
        
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            
            );
    }

    helper.inViewFromBottom = function(context) {

        var bottomPos = window.scrollY + window.innerHeight;

        return context.offsetTop + 100 < bottomPos;


    }


})(jQuery, HelperFunc);
