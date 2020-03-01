
var CODAPP = CODAPP || {};

CODAPP.heroDevice = {};


(function($, ATVI, CODAPP){

    $(function() {

    	if(ATVI.browser.isIPhone){
        	window.location.replace(document.getElementById("apple-appstore").getAttribute("href"));
    	}else if(ATVI.browser.isAndroidMobile){
        	window.location.replace(document.getElementById("google-playstore").getAttribute("href"));
    	}

    });

})(jQuery, ATVI, CODAPP);

var CODAPP = CODAPP || {};

CODAPP.sectionImg = {};


(function($, CODAPP){

    $(function() {

		//

    });

})(jQuery, CODAPP);
