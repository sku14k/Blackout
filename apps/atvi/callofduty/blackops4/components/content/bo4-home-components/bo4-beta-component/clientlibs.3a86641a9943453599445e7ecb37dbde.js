
//bo4 info/beta js

var BO4 = BO4 || {};

BO4.info = {};

(function($, BO4){

    var init = function(){
		initInfo();
    }

    var initInfo = function(){
		checkLocale();
    }

    var checkLocale = function(){
        if((ATVI.pageLocale === "ko") || (ATVI.pageLocale === "ja")){

			var $mainContainer = $(".intel-container .main-container") 
			$mainContainer.addClass("no-beta");

            $mainContainer.find(".beta").remove();
        }
    }

    $(init);


})(jQuery, BO4);