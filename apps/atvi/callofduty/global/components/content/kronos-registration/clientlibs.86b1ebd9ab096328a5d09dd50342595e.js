//sms-registration

(function($){


    var emailValue = "";

    var init = function(){

		checkEmail();
    }

    var checkEmail = function() {

        $(".version2 .subscribe-btn").click(function(e) {

			e.preventDefault();
			emailValue = $("#modal-email").val();

            if(cleanEmail(emailValue)) {

				var emailExists = validateEmail(emailValue, onSuccess, onFail);
        	}
            else {
                $(".not-real-email").show();
            }

        });

        $("#modal-email").keyup(function() {
			$(".error").hide();
        });

    };

    var cleanEmail = function(myEmail) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		return re.test(myEmail);
    };

    var closeModal = function() {

		var $close = $(".kronos-registration .close-modal");
        var $overlay = $(".kronos-registration");
        
        $close.add($overlay).click(function() {
            
            var $parent;
            $parent = $(this).closest(".kronos-registration");
            
            $parent.fadeOut();
            
        });

        $overlay.find(".subscribe-modal").click(function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    };

    var validateEmail = function(emailValue, onSuccess, onFail) {

        var csrf = SSO.csrf.cont["X-XSRF-TOKEN"] || SSO.utility.getCookie("XSRF-TOKEN");
        var url = SSO.utility.getApiUrl() + "/checkEmail?_csrf=" + csrf;

        var settings = {

            cache: false,
			type: "POST",
            data: "email=" + emailValue,
            xhrFields: {
                withCredentials: true
            },
            success: onSuccess,
            error: onFail

        };

    	$.ajax(url, settings);

    };

 	var onSuccess = function(response, status, xhr) {

        if(response.status == "invalid") {

            console.log("Email already in use. Display error.");
			$(".email-in-use").show();

        }

        else if(response.status == "valid") {
    		//redirect them to
            window.open(SSO.utility.getBaseUrl() + "/cod/register-email?email=" + emailValue,"_self");
        }

    }

    var onFail = function(response, status, xhr) {

		console.log("ITS A FAIL:" + response);
    }


    $(init);

})(jQuery);
