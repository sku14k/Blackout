
//tile modal js

var BO4 = BO4 || {};

BO4.tileModal = {};


(function($, BO4){

    var init = function(){

        initModalClick();
        initModalClose();

    }

    var initModalClick = function(){

        var $container = $(".flex-container");

        $container.on("click", ".play-button", function(e){

			e.preventDefault();
			$(this).closest(".modal-tile").find(".video-modal").fadeIn();
        });

    }

    var initModalClose = function(){

        var $close = $(".modal-close");
        var $overlay = $(".video-modal");

        $close.add($overlay).click(function() {

            var $parent;
            $parent = $(this).closest(".video-modal");

            $parent.fadeOut();

            if($parent.hasClass("video-modal")) {
                $parent.find(".atvi-instrument-video-pause")[0].click()
            };

        });

        $overlay.find(".modal-inner").click(function(e) {
			e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    }


    $(init);


})(jQuery, BO4);