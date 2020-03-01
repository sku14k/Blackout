//sms-registration

(function($){


    var phoneNumber = null;
    var dob = null;
    var $smsRegistration = null;

    var init = function(){

		$smsRegistration = $(".sms-registration");
		submitHandler();
        closeModal();
    }


    var submitHandler = function(){

        $(".sms-registration .submit-button").on("click", function(){

            phoneNumber = null;
            dob = null;

			clearErrorMessages();
            getPhoneNumber();
            getDate();

            if(phoneNumber && dob) {

                var data = {
                    
                    phoneNumber : phoneNumber,
                    dateOfBirth : dob
                }

                postSMSRegistration(data, postSuccess, postFail);

            }

        });

    }
    
    var closeModal = function(){
        var $close = $(".sms-registration .sms-main .close-button");
        var $overlay = $(".sms-registration .sms-main");
        
        $close.add($overlay).click(function() {
            
            var $parent;
            $parent = $(this).closest(".sms-registration-container");
            
            $parent.fadeOut();
            
        });

        $overlay.find(".modal-container").click(function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

    }


    var postSMSRegistration = function( data, onSuccess, onFail) {

        var url = "https://profile.callofduty.com/cod/sms/optIn";

        var settings = {

            cache: false,
            contentType : "application/json; charset=UTF-8",
            data: JSON.stringify(data),
            success: onSuccess,
            error: onFail,
            type: "POST"
        };

        $.ajax(url, settings);

    }

    var postSuccess = function(response, status, xhr) {

        if(response.status == "success") {

			resetForm();
            onSuccessHideForm();
            $(".sms-registration").find(".submit-messages .success-message").show();

        }

    }

    var postFail = function(response, status, xhr) {

		$(".sms-registration").find(".submit-messages .failed-submit").show();
    }


    var getDate = function(){

		var $dob = $smsRegistration.find(".date-of-birth");
		var $messages = $smsRegistration.find(".submit-messages");

        var ageGateMet = false;

		var month = $dob.find(".month-input").val();
        var day = $dob.find(".day-input").val();
        var year = $dob.find(".year-input").val();

        var m = parseInt(month);
        var d = parseInt(day);
        var y = parseInt(year);

        if(month.length > 2 || day.length > 2 || year.length > 4) {

			$messages.find(".invalid-date").show();

        } else if(!m || !d || !y) {

			$messages.find(".invalid-date").show();

        } else if( m > 12 || d > 31) {

			$messages.find(".invalid-date").show();

        } else {

			var dateString = month + "-" + day + "-" + year;
			ageGateMet = checkAge(dateString);

            if(ageGateMet) {

                if(month.length < 2) month = "0" + month;
                if(day.length < 2) day = "0" + day;

				dob = year + "-" + month + "-" + day;
            } else {

                $messages.find(".failure").show();
				dob = null;
            }
        }


    }

    var checkAge = function(dateString){

		var requiredAge = 17;

		var birthday = new Date(dateString);

		var diff = Date.now() - birthday.getTime();
        var ageCumulative = new Date(diff);

        var age = Math.abs(ageCumulative.getUTCFullYear() - 1970);


        return age > requiredAge;


    }


    var getPhoneNumber = function(){

        var $messages = $smsRegistration.find(".submit-messages");
        var errorMessages = "";
		phoneNumber = $smsRegistration.find(".phone-input-field").val();
        phoneNumber = phoneNumber.replace(/[\s()-]+/gi, "");

        phoneNumber = parseInt(phoneNumber);

        if(!phoneNumber) {
            errorMessages += "Invalid Phone Number<br>"
        } 

        if(phoneNumber.toString().length < 10) {
            errorMessages += "Sorry, your phone number must be 10 digits long, please include your area code<br>";
        }

        if(errorMessages.length > 0) {
			$messages.find(".error-message.dynamic").html(errorMessages).show();
            phoneNumber = null;

        } else {

			phoneNumber = "+1" + phoneNumber;
        }

    }


    var clearErrorMessages = function(){

		var $messages = $smsRegistration.find(".submit-messages");
        $messages.find(".error-message")
        .hide()
        .filter(".dynamic")
        .html("");

        $messages.find(".success-message").hide();
    }

    var resetForm = function(){

		$(".sms-form")[0].reset();
        phoneNumber = null;
        dob = null;
    }

    var onSuccessHideForm = function(){
		$smsRegistration.find(".fade-content").hide();
        if($(".sms-registration-container").hasClass("background-theme")){
            $smsRegistration.find(".background-desktop").hide();
            $smsRegistration.find(".modal-container").css("background-color", "black");
            $smsRegistration.find(".content-container").css("background-color", "black").css("width", "100%");
        }

    }


    $(init);

})(jQuery);
//sms timer function

"use strict";

(function($){

	var interval;

    var init = function(){

		interval = setInterval(popup, 1000);
    }


    var popup = function(){


        if($(".sms-registration-container").hasClass("active")){
            
            if(ATVI.utils.getCookie("atvi-cookie")){

                $(".sms-registration-container").closest(".experiencefragment").removeClass("section-blur");

                if(!$(".sms-registration-container").hasClass("side-theme")){
                    
                    setTimeout(function(){
                        $(".sms-registration-container").fadeIn();
                        
                    }, 3000);
                    
                    clearInterval(interval);
                    
                } else {

                    setTimeout(function(){

                        $(".sms-registration-container")
                        .show()
                        .addClass("slide");

                    }, 3000);

                    clearInterval(interval);

                }

            }
        }
    }

	$(init);

})(jQuery);
