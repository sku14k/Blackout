
"use strict";

(function($){

    var init = function(){
		getQueryVal();
    }

    var getQueryVal = function(){

        var params = new URLSearchParams(window.location.search);
        var edition = params.get("edition");
        var platform = params.get("platform");

        selectEdition(edition);
        selectPlatform(platform);

    }

    var selectEdition = function(edition){

        //settimeout allows the wtb module to fully load before the click event fires

		setTimeout(function(){
            $(".wtb-component").find(".selectricItems li span[data-option-item-id='" + edition +"']").click();
        }, 0);

    }

    var selectPlatform = function(platform) {

        setTimeout(function() {
			$(".wtb-component").find(".selectricItems li span[data-option-item-id='" + platform + "']").click();
        }, 0);

    }

    $(init);

})(jQuery);
