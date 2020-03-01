ATVI.plugins = ATVI.plugins || {};
ATVI.plugins.selectric = true;
/*! Selectric ϟ v1.8.5 (2014-10-02) - git.io/tjl9sQ - Copyright (c) 2014 Leonardo Santos - Dual licensed: MIT/GPL */
!function(e){"use strict";var t="selectric",s="Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive Above Scroll",i=".sl",o={onChange:function(t){e(t).change()},maxHeight:300,keySearchTimeout:500,arrowButtonMarkup:'<b class="button">&#x25be;</b>',disableOnMobile:!0,openOnHover:!1,expandToItemText:!1,responsive:!1,preventWindowScroll:!0,inheritOriginalWidth:!1,customClass:{prefix:t,postfixes:s,camelCase:!0},optionsItemBuilder:"{text}"},n={add:function(e,t,s){this[e]||(this[e]={}),this[e][t]=s},remove:function(e,t){delete this[e][t]}},a={replaceDiacritics:function(e){for(var t="40-46 50-53 54-57 62-70 71-74 61 47 77".replace(/\d+/g,"\\3$&").split(" "),s=t.length;s--;)e=e.toLowerCase().replace(RegExp("["+t[s]+"]","g"),"aeiouncy".charAt(s));return e},format:function(e){var t=arguments;return(""+e).replace(/{(\d+|(\w+))}/g,function(e,s,i){return i&&t[1]?t[1][i]:t[s]})},nextEnabledItem:function(e,t){for(;e[t=(t+1)%e.length].disabled;);return t},previousEnabledItem:function(e,t){for(;e[t=(t>0?t:e.length)-1].disabled;);return t},toDash:function(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},triggerCallback:function(s,i){var o=i.element,l=i.options["on"+s];e.isFunction(l)&&l.call(o,o,i),n[s]&&e.each(n[s],function(){this.call(o,o,i)}),e(o).trigger(t+"-"+a.toDash(s),i)}},l=e(document),r=e(window),c=function(n,c){function d(t){if($.options=e.extend(!0,{},o,$.options,t),$.classes={},$.element=n,a.triggerCallback("BeforeInit",$),$.options.disableOnMobile&&L)return void($.disableOnMobile=!0);C(!0);var i=$.options.customClass,l=i.postfixes.split(" "),r=R.width();e.each(s.split(" "),function(e,t){var s=i.prefix+l[e];$.classes[t.toLowerCase()]=i.camelCase?s:a.toDash(s)}),x=e("<input/>",{"class":$.classes.input,readonly:L}),k=e("<div/>",{"class":$.classes.items,tabindex:-1}),T=e("<div/>",{"class":$.classes.scroll}),D=e("<div/>",{"class":i.prefix,html:$.options.arrowButtonMarkup}),y=e('<p class="label"/>'),I=R.wrap("<div>").parent().append(D.prepend(y),k,x),A={open:v,close:m,destroy:C,refresh:u,init:d},R.on(A).wrap('<div class="'+$.classes.hideselect+'">'),e.extend($,A),$.options.inheritOriginalWidth&&r>0&&I.width(r),p()}function p(){$.items=[];var s=R.children(),o="<ul>",n=s.filter(":selected").index();H=S=~n?n:0,(E=s.length)&&(s.each(function(t){var s=e(this),i=s.html(),n=s.prop("disabled"),l=$.options.optionsItemBuilder;$.items[t]={value:s.val(),text:i,slug:a.replaceDiacritics(i),disabled:n},o+=a.format('<li class="{1}">{2}</li>',e.trim([t==H?"selected":"",t==E-1?"last":"",n?"disabled":""].join(" ")),e.isFunction(l)?l($.items[t],s,t):a.format(l,$.items[t]))}),k.append(T.html(o+"</ul>")),y.html($.items[H].text)),D.add(R).add(I).add(x).off(i),I.prop("class",[$.classes.wrapper,R.prop("class").replace(/\S+/g,t+"-$&"),$.options.responsive?$.classes.responsive:""].join(" ")),R.prop("disabled")?(I.addClass($.classes.disabled),x.prop("disabled",!0)):(j=!0,I.removeClass($.classes.disabled).on("mouseenter"+i+" mouseleave"+i,function(t){e(this).toggleClass($.classes.hover),$.options.openOnHover&&(clearTimeout($.closeTimer),"mouseleave"==t.type?$.closeTimer=setTimeout(m,500):v())}),D.on("click"+i,function(e){Y?m():v(e)}),x.prop({tabindex:q,disabled:!1}).on("keypress"+i,h).on("keydown"+i,function(e){h(e),clearTimeout($.resetStr),$.resetStr=setTimeout(function(){x.val("")},$.options.keySearchTimeout);var t=e.keyCode||e.which;t>36&&41>t&&b(a[(39>t?"previous":"next")+"EnabledItem"]($.items,S))}).on("focusin"+i,function(e){x.one("blur",function(){x.blur()}),Y||v(e)}).on("oninput"in x[0]?"input":"keyup",function(){x.val().length&&e.each($.items,function(e,t){return RegExp("^"+x.val(),"i").test(t.slug)&&!t.disabled?(b(e),!1):void 0})}),R.prop("tabindex",!1),O=e("li",k.removeAttr("style")).click(function(){return b(e(this).index(),!0),!1})),a.triggerCallback("Init",$)}function u(){a.triggerCallback("Refresh",$),p()}function h(e){var t=e.keyCode||e.which;13==t&&e.preventDefault(),/^(9|13|27)$/.test(t)&&(e.stopPropagation(),b(S,!0))}function f(){var e=k.closest(":visible").children(":hidden"),t=$.options.maxHeight;e.addClass($.classes.tempshow);var s=k.outerWidth(),i=D.outerWidth()-(s-k.width());!$.options.expandToItemText||i>s?W=i:(k.css("overflow","scroll"),I.width(9e4),W=k.width(),k.css("overflow",""),I.width("")),k.width(W).height()>t&&k.height(t),e.removeClass($.classes.tempshow)}function v(s){a.triggerCallback("BeforeOpen",$),s&&(s.preventDefault(),s.stopPropagation()),j&&(f(),e("."+$.classes.hideselect,"."+$.classes.open).children()[t]("close"),Y=!0,B=k.outerHeight(),M=k.height(),x.val("").is(":focus")||x.focus(),l.on("click"+i,m).on("scroll"+i,g),g(),$.options.preventWindowScroll&&l.on("mousewheel"+i+" DOMMouseScroll"+i,"."+$.classes.scroll,function(t){var s=t.originalEvent,i=e(this).scrollTop(),o=0;"detail"in s&&(o=-1*s.detail),"wheelDelta"in s&&(o=s.wheelDelta),"wheelDeltaY"in s&&(o=s.wheelDeltaY),"deltaY"in s&&(o=-1*s.deltaY),(i==this.scrollHeight-M&&0>o||0==i&&o>0)&&t.preventDefault()}),I.addClass($.classes.open),w(S),a.triggerCallback("Open",$))}function g(){f(),I.toggleClass($.classes.above,I.offset().top+I.outerHeight()+B>r.scrollTop()+r.height())}function m(){if(a.triggerCallback("BeforeClose",$),H!=S){a.triggerCallback("BeforeChange",$);var e=$.items[S].text;R.prop("selectedIndex",H=S).data("value",e),y.html(e),a.triggerCallback("Change",$)}l.off(i),I.removeClass($.classes.open),Y=!1,a.triggerCallback("Close",$)}function b(e,t){$.items[e].disabled||(O.removeClass("selected").eq(S=e).addClass("selected"),w(e),t&&m())}function w(e){var t=O.eq(e).outerHeight(),s=O[e].offsetTop,i=T.scrollTop(),o=s+2*t;T.scrollTop(o>i+B?o-B:i>s-t?s-t:i)}function C(e){j&&(k.add(D).add(x).remove(),!e&&R.removeData(t).removeData("value"),R.prop("tabindex",q).off(i).off(A).unwrap().unwrap(),j=!1)}var x,k,T,D,y,I,O,S,H,B,M,W,E,A,$=this,R=e(n),Y=!1,j=!1,L=/android|ip(hone|od|ad)/i.test(navigator.userAgent),q=R.prop("tabindex");d(c)};e.fn[t]=function(s){return this.each(function(){var i=e.data(this,t);i&&!i.disableOnMobile?""+s===s&&i[s]?i[s]():i.init(s):e.data(this,t,new c(this,s))})},e.fn[t].hooks=n}(jQuery);

// country codes
ATVI.countryCodes = {};
(function($, ATVI) {

    ATVI.countryCodes = {
        "af"	: "Afghanistan",
        "al"	: "Albania",
        "dz"	: "Algeria",
        "as"	: "American Samoa",
        "ad"	: "Andorra",
        "ao"	: "Angola",
        "ag"	: "Antigua and Barbuda",
        "ar"	: "Argentina",
        "am"	: "Armenia",
        "aw"	: "Aruba",
        "au"	: "Australia",
        "at"	: "Austria",
        "az"	: "Azerbaijan",
        "bs"	: "Bahamas",
        "bh"	: "Bahrain",
        "bd"	: "Bangladesh",
        "bb"	: "Barbados",
        "by"	: "Belarus",
        "be"	: "Belgium",
        "be-fr" : "Belgium French",
        "bz"	: "Belize",
        "bj"	: "Benin",
        "bm"	: "Bermuda",
        "bt"	: "Bhutan",
        "bo"	: "Bolivia",
        "ba"	: "Bosnia and Herzegovina",
        "bw"	: "Botswana",
        "bv"	: "Bouvet Island",
        "br"	: "Brazil",
        "io"	: "British Indian Ocean Territory",
        "bn"	: "Brunei Daarussalam",
        "bg"	: "Bulgaria",
        "bf"	: "Burkina Faso",
        "bi"	: "Burundi",
        "kh"	: "Cambodia",
        "cm"	: "Cameroon",
        "ca"	: "Canada",
        "ca-fr"	: "Le Canada Français",
        "cv"	: "Cape Verde",
        "ky"	: "Cayman Islands",
        "cf"	: "Central AFrican Republic",
        "td"	: "Chad",
        "cl"	: "Chile",
        "cn"	: "繁體中文",
        "cn-s"	: "简体中文",
        "cx"	: "Christmas Island",
        "cc"	: "Cocos Islands",
        "co"	: "Colombia",
        "km"	: "Comoros",
        "cg"	: "Congo",
        "cd"	: "The Democratic Republic of Congo",
        "ck"	: "Cook Islands",
        "cr"	: "Costa Rica",
        "ci"	: "Côte d'Ivoire",
        "hr"	: "Croatia",
        "cu"	: "Cuba",
        "cy"	: "Cypress",
        "cz"	: "Czech Republic",
        "dk"	: "Danmark",
        "dj"	: "Djibouti",
        "dm"	: "Dominica",
        "do"	: "Dominican Republic",
        "ec"	: "Ecuador",
        "eg"	: "Egypt",
        "sv"	: "El Salvador",
        "gq"	: "Equatorial Guinea",
        "er"	: "Eritrea",
        "ee"	: "Estonia",
        "et"	: "Ethiopia",
        "fk"	: "Falkland Islands",
        "fo"	: "Faroe Islands",
        "fj"	: "Fiji",
        "fi"	: "Suomi",
        "fr"	: "France",
        "gf"	: "French Guiana",
        "pf"	: "French Polynesia",
        "tf"	: "French Southern Territories",
        "ga"	: "Gabon",
        "gm"	: "Gambia",
        "ge"	: "Georgia",
        "de"	: "Deutschland",
        "gh"	: "Ghana",
        "gi"	: "Gibraltar",
        "gr"	: "Greece",
        "gl"	: "Greenland",
        "gd"	: "Grenada",
        "gp"	: "Guadaloupe",
        "gu"	: "Guam",
        "gt"	: "Guatemala",
        "gn"	: "Guinea",
        "gw"	: "Guinea-Bissau",
        "gy"	: "Guyana",
        "ht"	: "Haiti",
        "hm"	: "Heard Island and Mcdonald Islands",
        "hn"	: "Honduras",
        "hk"	: "Hong Kong",
        "hk-s"	: "Hong Kong 简体中文",
        "hu"	: "Hungary",
        "is"	: "Iceland",
        "in"	: "India",
        "id"	: "Indonesia",
        "ir"	: "Iran",
        "iq"	: "Iraq",
        "ie"	: "Ireland",
        "il"	: "Israel",
        "it"	: "Italia",
        "jm"	: "Jamaica",
        "jp"	: "Japan  日本国",
        "jo"	: "Jordan",
        "kz"	: "Kazakhstan",
        "ke"	: "Kenya",
        "ki"	: "Kiribati",
        "kp"	: "Korea  한국",
        "kr"	: "Korea 조선민주주의인민공화국",
        "xk"	: "Kosovo",
        "kw"	: "Kuwait",
        "kg"	: "Kyrgyzstan",
        "la"	: "Laos",
        "lv"	: "Latvia",
        "lb"	: "Lebanon",
        "ls"	: "Lesotho",
        "lr"	: "Liberia",
        "ly"	: "Libyan Arab Jamahiriya",
        "li"	: "Liechtenstein",
        "lt"	: "Lithuania",
        "lu"	: "Luxembourg",
        "lu-de"	: "Luxemburg",
        "lu-fr"	: "Luxembourg",
        "mo"	: "Macao",
        "mk"	: "Macedonia",
        "mg"	: "Madagascar",
        "mw"	: "Malawi",
        "my"	: "Malaysia",
        "mv"	: "Maldives",
        "ml"	: "Mali",
        "mt"	: "Malta",
        "mh"	: "Marshall Islands",
        "mq"	: "Martinique",
        "mu"	: "Mauritius",
        "yt"	: "Mayotte",
        "mx"	: "México",
        "fm"	: "Micronesia",
        "md"	: "Moldova",
        "mc"	: "Monaco",
        "mn"	: "Mongolia",
        "me"	: "Montenegro",
        "ms"	: "Montserrat",
        "ma"	: "Morocco",
        "mz"	: "Mozambique",
        "mm"	: "Myanmar",
        "na"	: "Namibia",
        "nr"	: "Nauru",
        "np"	: "Nepal",
        "nl"	: "Netherlands",
        "an"	: "Netherlands Antilles",
        "nc"	: "New Caledonia",
        "nz"	: "New Zealand",
        "ni"	: "Nicaragua",
        "ne"	: "Niger",
        "ng"	: "Nigeria",
        "nu"	: "Niue",
        "nf"	: "Norfolk Islands",
        "mp"	: "Northern Mariana Islands",
        "no"	: "Norge",
        "om"	: "Oman",
        "pk"	: "Pakistan",
        "pw"	: "Palau",
        "ps"	: "Palestinian Territory",
        "pa"	: "Panama",
        "pg"	: "Papua New Guinea",
        "py"	: "Paraguay",
        "pe"	: "Peru",
        "ph"	: "Philippines",
        "pn"	: "Pitcairn",
        "pl"	: "Polska",
        "pl-en"	: "Poland",
        "pt"	: "Portugal",
        "pr"	: "Puerto Rico",
        "qa"	: "Qatar",
        "re"	: "Réunion",
        "ro"	: "Romania",
        "ru"	: "Росси́я",
        "rw"	: "Rwanda",
        "sh"	: "Saint Helena",
        "kn"	: "Saint Kitts and Nevis",
        "lc"	: "Saint Lucia",
        "pm"	: "Saint Pierre and Miquelon",
        "vc"	: "Saint Vincent and the Grenadines",
        "ws"	: "Samoa",
        "sm"	: "San Marino",
        "st"	: "Sao Tome and Principe",
        "sa"	: "Saudi Arabia",
        "sn"	: "Senegal",
        "rs"	: "Serbia",
        "sc"	: "Seychelles",
        "sl"	: "Sierra Leone",
        "sg"	: "Singapore",
        "sk"	: "Slovakia",
        "si"	: "Slovenia",
        "sb"	: "Solomon Islands",
        "so"	: "Somalia",
        "za"	: "South Africa",
        "gs"	: "South Georgia and the South Sandwich Islands",
        "es"	: "España",
        "lk"	: "Sri Lanka",
        "sd"	: "Sudan",
        "sr"	: "Suriname",
        "sj"	: "Svalbard and Jan Mayen",
        "sz"	: "Swaziland",
        "se"	: "Sverige",
        "ch"	: "Switzerland",
        "ch-de"	: "Schweizerische Eidgenossenschaft",
        "ch-fr"	: "Confédération Suisse",
        "ch-it"	: "Confederazione Svizzera",
        "ch-ro"	: "Confederaziun Svizra",
        "sy"	: "Syrian Arab Republic",
        "tw"	: "Taiwan",
        "tj"	: "Tajikistan",
        "tz"	: "Tanzania",
        "th"	: "Thailand",
        "tl"	: "Timor-Leste",
        "tg"	: "Togo",
        "tk"	: "Tokelau",
        "to"	: "Tonga",
        "tt"	: "Trinidad and Tobago",
        "tn"	: "Tunisia",
        "tr"	: "Turkey",
        "tm"	: "Turkmenistan",
        "tc"	: "Turks and Caicos Islands",
        "tv"	: "Tuvalu",
        "ug"	: "Uganda",
        "ua"	: "Ukraine",
        "ua-ru"	: "Ukraine - Russian",
        "ae"	: "United Arab Emirates",
        "gb"	: "United Kingdom",
        "us"	: "United States",
        "um"	: "United States Minor Outlying Islands",
        "uy"	: "Uruguay",
        "uz"	: "Uzbekistan",
        "vu"	: "Vanuatu",
        "ve"	: "Venezuela",
        "vn"	: "Viet Nam",
        "vg"	: "British Virgin Islands",
        "vi"	: "U.S. Virgin Islands",
        "wf"	: "Wallis and Futuna",
        "eh"	: "Western Sahara",
        "ye"	: "Yemen",
        "zm"	: "Zambia",
        "zw"	: "Zimbabwe"
    };

})(jQuery, ATVI);

try{pswtb}catch(ex){pswtb={}}
if(!pswtb.loader){
    pswtb.loader={
        lsc:[],
        waitLoad:function() {
            var e=pswtb.loader;
            if(e.finish){
                for(var t=0;t<e.lsc.length;t++)
                    e.finish(e.lsc[t].wcid);
                window.clearInterval(e.waitLoadTimer);
                e.waitLoadTimer=null
            }else{
                if(!e.waitLoadTimer) e.waitLoadTimer=window.setInterval(e.waitLoad,20)
            }
        },
        show:function(e){
            for(var t=0;t<this.lsc.length;t++)
                if(this.lsc[t].wcid===e.widgetConfigurationId){
                    this.lsc[t].ops.push(e);
                    return
                }
            var n=document.createElement("script");
            n.type="text/javascript";
            var r=e.server;
            n.language="javascript";
            n.src="//cdn.pricespider.com/1/lib/ps-widget.js";

            var o=document.createElement("meta");
            o.name="ps-country";
            o.content=e.country;

            var p=document.createElement("meta");
            p.name="ps-language";
            p.content=e.lang;

            var q=document.createElement("meta");
            q.name="ps-key";
            q.content=e.widgetConfigurationId;

            this.lsc.push({
                wcid:e.widgetConfigurationId,
                ops:[e]
            });
            if(navigator.userAgent.match(/msie [6-7]/i)){
                document.write('<'+'script type="'+n.type+'" src="'+n.src.replace(/d=al&/i,"")+'"><'+"/script>");
                this.waitLoad();
                return
            }
            var i=navigator.userAgent.match(/msie [8-9]/i);
            n.async=true;
            //if(i)n.onreadystatechange=new Function("if ((/loaded|completed/i).test(this.readyState)) pswtb.loader.finish('"+e.widgetConfigurationId+"');");
            //else n.onload=new Function("pswtb.loader.finish('"+e.widgetConfigurationId+"');");
            document.getElementsByTagName("head")[0].appendChild(q);
            document.getElementsByTagName("head")[0].appendChild(o);
            document.getElementsByTagName("head")[0].appendChild(p);
            document.getElementsByTagName("head")[0].appendChild(n);
        }
    }
}





ATVI.components.wheretobuy = ATVI.components.wheretobuy || {};

(function($, ATVI) {
    var where = ATVI.components.wheretobuy;

	where.localeCodes = {
        "ar"  	: "sa",
        "da"  	: "dk",
        "en" 	: "us",
        "en_CA" : "ca",
        "en_AR" : "ae",
        "en_AU" : "au",
        "en_GB" : "gb",
        "en_NZ" : "nz",
        "en_ZA" : "za",
        "fr_BE" : "be",
        "fr_CA" : "ca-fr",
        "es_MX" : "mx",
        "ja" 	: "jp",
        "ko" 	: "kp",
        "nl_BE"	: "be",
        "pt_BR" : "br",
        "sv" 	: "se",
        "zh_CN" : "cn-s",
        "zh_TW" : "tw"
    };

})(jQuery, ATVI);


ATVI.components.wheretobuy = ATVI.components.wheretobuy || {};

(function($, ATVI) {

    var where = ATVI.components.wheretobuy;

	var registry = ATVI.utils.createRegistry(),
    	unique = 0,
		sku,
		cc;

    var consts = where.constants = {};

	// classnames
	consts.CN_COMPONENT 		  = '.atvi-wheretobuy';
	consts.CN_SELECTCONTAINER 	  = '.wtb-select';
	consts.CN_SELECTFIELDS 	      = '.wtb-field';
	consts.CN_BUYBUTTONCONTAINER  = '.order-button';
	consts.CN_BUYBUTTON 		  = '.wtb-button';
	consts.CN_BUYBUTTONTEXT 	  = '.buy-button-text';
	consts.CN_BOXART 			  = '.product-img';
	consts.CN_EMPTYRETAILERS 	  = '.empty-retailers';
	consts.CN_BUNDLECONTENT 	  = '.bundle-specific-content';
	consts.CN_PLATFORMCONTENT 	  = '.platform-specific-content';
	consts.CN_BUNDLESENTRY 	      = '.bundles-entry';
	consts.CN_PLATFORMSENTRY 	  = '.platforms-entry';
	consts.CN_REGIONSENTRY 	      = '.regions-entry';
	consts.CN_RETAILERSENTRY 	  = '.retailers-entry';
	consts.CN_SELECTRICWRAPPER    = '.selectricWrapper, .selectric-wrapper';
	consts.CN_SELECTRICITEMS 	  = '.selectricItems, .selectric-items';
	consts.CN_SELECTED 		      = '.selected';

	// classes
	consts.HIDE 		 = 'hidden';
	consts.SELECTED 	 = 'selected';
	consts.NORETAILER    = 'no-retailer';

	// data-attributes
	consts.DATA_OPTIONID 		= 'option-item-id';
	consts.DATA_BUYBUTTONTEXT 	= 'buy-button-text';

	// PriceSpider
	consts.PS_ID 			= '1715-59d4f55aa6e10e0012b3f323';
	consts.PS_COOKIENAME 	= 'PS_CTID';
	consts.PS_SKUMODE 		= 'sku-mode';
	consts.PS_INITIALIZED 	= 'initialized';
	consts.PS_WIDGET 		= 'ps-widget';
	consts.PS_ATTR   		= 'ps-sku';


    where.PScountryCodes = {
		"United States"	: "US",
        "Canada"		: "CA",
        "Deutschland"	: "DE",
        "France"		: "FR",
        "Australia"		: "AU",
        "United Kingdom": "UK",
        "Italia"		: "IT",
        "Espana"		: "ES",
        "España"		: "ES",
        "Arabic"        : "AR"
    };

    where.init = function($el, config) {
		var reg = registry.register($el),
            context = reg.context;

        context.wrapper = $el;
        context.config = config;
        context.status = {
            bundles: undefined, regions: undefined, platforms: undefined, retailers: undefined, retailerTypes: undefined
        };
        context.listsObj = {};
		buildContextLists(context);
        where.setStatusHandlers(context);

        setupRetailersList(context);
        setupButtons(context);
        where.updateImage(context, context.config.data.wtb.rows);

        where.setDefaults(context);

        if (ATVI.localeDetector) {
            ATVI.localeDetector.getCountry(function(d) {
				where.detectedLocale = d;
                var region = where.processDetectedLocale(context);
                if (region != context.status.regions) {
                	where.updateStatus(context, 'regions', region);
                    where.updateForPossibleRows(context, where.widenPossibleRows(context));
                    where.updateButtons(context);
                }
        	});
        }
    };

    where.buildConfigObj = function(jsonObj) {
        if (!jsonObj) return;
		var rows = jsonObj.rows,
            fields = ['bundles', 'regions', 'platforms'],
            fieldsData = {bundles : [], regions : [], platforms : [], rows : rows},
            compositeObj = {regions: [], platforms: [], bundles: []},
            customizedData = {},
            customizedDataTypes = ['bundles', 'regions', 'platforms'],
            retailerTypes = [],
            dataType, bundle, platform, row;

        customizedData.bundles = {};
        customizedData.bundles.id = (where.wtbBundlesId.length) ? where.wtbBundlesId : [];
        customizedData.bundles.label = (where.wtbBundlesLabel) ? where.wtbBundlesLabel : [];
        customizedData.platforms = {};
        customizedData.platforms.id = (where.wtbPlatformsId.length) ? where.wtbPlatformsId : [];
        customizedData.platforms.label = (where.wtbPlatformsLabel) ? where.wtbPlatformsLabel : [];
        customizedData.regions = {};
        customizedData.regions.id = Object.keys(ATVI.countryCodes);
        customizedData.regions.label = (Object.values) ? Object.values(ATVI.countryCodes) : objectValuesPolyfill(ATVI.countryCodes);


        for (dataType = 0; dataType < customizedDataTypes.length; dataType++) {
            var type = customizedDataTypes[dataType],
                index;
			customizedData[type]['processed'] = [];
            for (index = 0; index < customizedData[type]['id'].length; index++) {
                customizedData[type]['processed'].push({id: customizedData[type]['id'][index], text: customizedData[type]['label'][index]});
            }
        }

        for (row = 0; row < rows.length; row++) {
            $.each(fields, function(i, val) {
                var entry = rows[row][val];
				compositeObj[val].push(entry);
            });

            var rType = rows[row].retailer.type;
            if (rType.length && isNaN(rType)) {
                if (!retailerTypes.length) retailerTypes.push({id: rType, text: rType});
                else {
                    var present = [], j;
                    for (j = 0; j < retailerTypes.length; j++) {
						if (retailerTypes[j].id == rType) present.push(retailerTypes[j].id);
                    }
                    if (present.indexOf(rType) < 0) retailerTypes.push({id: rType, text: rType});
                }
            }
        }

        $.each(compositeObj, function(key, val) {
			var idArr = compositeObj[key].filter(uniqueVals);
            if (!fieldsData[key].length) {
                $.each(idArr, function(i, val) {
                    var textVal = (customizedData[key] && customizedData[key]['processed']) ? scanForValue(customizedData[key]['processed'], val) : val;
                    fieldsData[key].push({id: val, text: textVal});
                });
            }
        });

		if (retailerTypes.length) fieldsData.retailerTypes = retailerTypes;

        return fieldsData;

        function scanForValue(arr, target) {
            var i;
            for (i = 0; i < arr.length; i++) {
				if (arr[i].id == target) return arr[i].text;
            }
            return target;
        }
    };

    where.setDefaults = function (context) {
        var defaults = context.config.opts.defaults,
			query = ATVI.utils.getQueryParameters(true),
			defaultRegion = where.processDefaultRegion(context, defaults.regions);
        defaults.regions = defaultRegion;
        if (query.bundles) defaults.bundles = query.bundles;
        if (query.platforms) defaults.platforms = query.platforms;
        if (query.regions) defaults.regions = query.regions;

        where.useValues(context, defaults);
    };

    var buildContextLists = function (context) {
		var $el = context.wrapper, 
            lo = context.listsObj,
            listItems = getArrayOfSelections(context);
        for (var i = 0; i < listItems.length; i++) {
            var item = listItems[i];
            if (context.config.data.wtb.retailerTypes && item.type == 'retailerTypes' && context.config.data.wtb.retailerTypes.length < 2) continue;
            lo[item.type] = lo[item.type] || [];
            var listType = getListType(item.$el);
            var list = buildContextList(context, item.$el, listType, item.type);
            item.$el.append(list.$el);
            lo[item.type].push(list);
            if (listType == 'selectbox') where.onSelectboxCreate(context, list.$el, list);
        }
    };

    var buildContextList = function(context, $el, listType, field) {
        var selectionLists = context.config.data.wtb,
            selList = selectionLists[field] = where.processSelectionList(context, field, selectionLists[field]) || selectionLists[field],
		    list = where.listBuilderUtils[listType](context, selList || [], $el, field);
        list.field = field;
		return list;
    };

    var getListType = function($list) {
        if ($list.hasClass('selectbox')) return 'selectbox';
        return 'list';
    };

    
    where.setStatusHandlers = function (context) {
        var status = context.status,
            data = context.config.data.wtb,
            listsObj = context.listsObj;

        var setupOnChangeForType = function(type) {
			if (!listsObj.hasOwnProperty(type) || type == 'retailers') return;
            var arr = listsObj[type];
            for (var i = 0; i < arr.length; i++) {
                arr[i].onChange(function(ev) {
                    ev = ev || {};
                    ev.type = type;
                    handleSelectionChange(ev);
                });
            }
        };

        var handleSelectionChange = function(ev) {
            where.updateStatus(context, ev.type, ev.value);
            var possibleRows = where.widenPossibleRows(context, ev.type);
            where.updateForPossibleRows(context, possibleRows);
            if (ATVI.analytics) {
                where.updateAnalyticsObject(context);
            	where.sendStatusEvent(context, ev);
            }
        };

        for (var type in listsObj) {
			setupOnChangeForType(type);
        }

    };

    var setupRetailersList = function (context) {
        var robjs = context.listsObj.retailers;

        for (var i = 0; i < robjs.length; i++) {
			var list = robjs[i];
            list.updateElems([]);
            list.onChange(function(ev) {
                var newVal = ev.value;                
				where.updateButtonLink(context, newVal);
                if (ev) {
                    ev.value = ev.text || ev.value;
                    ev.oldValue = ev.oldText || ev.oldValue;
                }
                if (ATVI.analytics) {
                    where.updateAnalyticsObject(context);
                	where.sendStatusEvent(context, ev);
                }
            });
        }
    };

    var setupButtons = function(context) {
        context.wrapper.find(consts.CN_BUYBUTTON).click(function(e) {
			where.onWtbButtonClick(e, context, $(this));
        });
    };

    where.onWtbButtonClick = function(e, context, $this) {
		where.sendButtonClickEvent(context, $this);
        var href = $this.attr('href');

        if (!href || href == '#') e.preventDefault();
        if (context.skuMode) where.launchExistingPswtbModal(context.lastSku, context);
    };

    where.launchExistingPswtbModal = function(sku, context) {
		var pc = getPswtbContainer(sku, context);
        if (pc) pc[0].click();
    };

    var getPriorityList = function(context, exclude) {
        var opts = context.config.opts;
        opts.priority = opts.priority || ['bundles', 'regions', 'platforms'];

        return opts.priority.filter(function(element) { 
            return element != exclude;
        });
    };

    where.updateStatus = function(context, field, value) {
		context.status[field] = value;
        var arr = context.listsObj[field] || [];
        for (var i = 0; i < arr.length; i++) {
			arr[i].setValue(value);
        }
        where.onStatusUpdate(context, field);
    };

    var returnPossibleRows = function(context) {
		var status = context.status,
            dataRows = context.config.data.wtb.rows,
            ret = dataRows.slice(0);
        for (var field in status) {
			if (!status.hasOwnProperty(field)) continue;
            if (status[field]) ret = ret.filter(function(row) {
                if (field == 'retailerTypes' && status.retailerTypes) return row.retailer.type == status.retailerTypes;
				return row[field] == status[field];
            });
        }
        return ret;
    };

    var buildRetailerList = function (context, rows) {
        var w = context.wrapper,
            listsObj = context.listsObj,
            bundle = (listsObj.bundles) ? context.status.bundles : true,
            region = (listsObj.regions) ? context.status.regions : true,
            platform = (listsObj.platforms) ? context.status.platforms : true,
            retailerType = (listsObj.retailerTypes && context.status.retailerTypes) ? context.status.retailerTypes : true;

        var elems = [],
            skuElems = [];
		
        if (bundle && region && platform) {
            for ( var i = 0; i < rows.length; i++) {
				var retailer = rows[i].retailer,
                    retailerObj = { id: retailer.link, text: retailer.name, tags: retailer.notes, type: retailer.type };

				if ((retailer.name || "").trim().toLowerCase() == "sku") {
					skuElems.push(retailerObj);
				}
				else {
                    if (retailerObj.tags == 'preferred') elems.unshift(retailerObj);
                	else elems.push(retailerObj);
				}
            }
        }

        if (skuElems.length) {
			w.addClass(consts.PS_SKUMODE);
            context.skuMode = true;
			elems = [];
			setupPsRetailers(context, skuElems);

        } else {
    		w.removeClass(consts.PS_SKUMODE);
            context.skuMode = false;
        }

        if (context.skuMode) where.hideRetailerSelection(context);
        else where.showRetailerSelection(context);

        var v;
        var robjs = context.listsObj.retailers;
        for (var i = 0; i < robjs.length; i++) {
			robjs[i].updateElems(elems);
            v = v || robjs[i].getValue();
        }

        var elems = context.listsObj.retailers[0].elems,
            isInRetailersList = scanForRetailer(v, elems);

        if (elems.length && !isInRetailersList && v != elems[0].id) v = elems[0].id;

		if (elems.length) {
        	where.onPopulatedRetailers(context);
        } else {
			where.onEmptyRetailers(context);
        }

        where.updateButtonLink(context, v);
    };

    var setupPsRetailers = function(context, arr) {
        var cc = context.status.regions.toUpperCase(),
            sku = arr[0].id;
        
        if (context.lastSku != sku && window.pswtb) {            
            context.lastSku = sku;
            var pswtbContainer = getPswtbContainer(sku, context);
            
            if (pswtbContainer.hasClass(consts.PS_INITIALIZED)) {
                if (window.console) console.log("using SKU: " + sku);
            } else {                
                if (window.console) console.log("initiating SKU: " + sku);
                pswtbContainer.addClass(consts.PS_INITIALIZED);
                
                var psOpts = {
                    widgetConfigurationId: consts.PS_ID,
                    sku: sku,
                    container: pswtbContainer[0],
                    country: cc,
                    lang: ATVI.pageLocale
                };
                var psCookie = (ATVI.utils.getCookie(consts.PS_COOKIENAME, true) || "").trim();
                if (psCookie) psOpts.customTrackingId = psCookie;

                pswtb.loader.show(psOpts);
                $('meta[name="ps-country"]').attr('content', cc);

            }
        }
    };

    var getPswtbContainer = function(sku, context) {
		if (!sku) return;
        var cs = context.pswtbContainers = context.pswtbContainers || {};
		if (cs[sku]) return cs[sku];
        if (!context) return;
        cs[sku] = $('<div>').addClass(consts.PS_WIDGET).attr(consts.PS_ATTR, sku).appendTo(context.wrapper);
        if (typeof PriceSpider !== 'undefined') PriceSpider.rebind();
        return cs[sku];
    };

    where.getPswtbContainer = getPswtbContainer;
    where.buildRetailerList = buildRetailerList;

    var lb = where.listBuilderUtils = {};

    lb.list = function (context, elems) {
        var lis, ret = lb.generic(context, 'list', elems),
            $listWrapper = ret.$el = $('<ul>'); 


        ret.updateElems = function() {
            $listWrapper.html('');
            var elems = ret.elems;
            for (var i = 0; i < elems.length; i++) {
                var elemClass = elems[i].id.toLowerCase().replace(' ', '-');
                var li = $('<li>').addClass('possible ' + elemClass).appendTo($listWrapper);
                $('<a>', { class: elemClass + ' atvi-no-instrument'}).html(elems[i].text).attr('href', '#').appendTo(li);
            }
            lis = $listWrapper.find('li');
            lis.find('a').click(function(e) {
                e.preventDefault();
                var $this = $(this);
                var ev = {
                    original: e,
                    wrapper: $listWrapper,
                    target: $this,
                    oldValue: ret.getValue(),
                    oldText: ret.getText()
                };
                ret.setValueIndex(lis.index($this.parent()), ev);
            });

        };

        ret.readValue = function() {
			var ind = lis.index(lis.filter(consts.CN_SELECTED));
            if(ind >= 0) return ret.elems[ind].id;pl
        };

        ret.updateView = function() {
            lis.removeClass(consts.SELECTED);
			var i = ret.getValueIndex();
            if(i >= 0) lis.eq(i).addClass(consts.SELECTED);
        };

        ret.updateElems(elems);
        return ret;
    };

    lb.selectbox = function (context, elems, wrapper, field) {
        var ret = lb.generic(context, 'select', elems),
            $selectWrapper = ret.$el = $('<select>'),
            includeDefaultOption = wrapper.hasClass('withdefault');

        ret.buildFromElems = function() {
            $selectWrapper.html('');
            var elems = ret.elems;
            if (elems.length == 0) {
                $('<option>', {value: 'blank'}).appendTo($selectWrapper);
            } else {
                if (includeDefaultOption) {
                    $('<option>', {class: 'possible', value: ''}).html(context.config.opts.defaultText[field] || '').appendTo($selectWrapper);
                }
                for (var i = 0; i < elems.length; i++) {
                    $('<option>', {class: 'possible', value: elems[i].id}).html(elems[i].text).appendTo($selectWrapper);
                }
            }
        };

        ret.readValue = function() {
			return $selectWrapper.val();
        };
        ret.updateView = function() {
            var v = ret.getValue(),
                sv = $selectWrapper.val();
            if(!v && (!sv || sv == 'blank')) return;
            if(v == sv) return;
            $selectWrapper.val(v);
        };
        $selectWrapper.on('change', function(e) {
			var ev = {
                original: e,
                wrapper: $selectWrapper,
                target: $selectWrapper,
                oldValue: ret.getValue(),
                oldText: ret.getText()
            };
            var sv = ret.readValue();
            if (sv == 'blank') sv = null;
            ret.setValue(sv, ev);
        });

        ret.updateElems(elems);
        return ret;
    };

    lb.generic = function(context, type, elems) {
        var ret = {type: type, elems: elems}, index = -1, val, changeQueue = [];
        ret.getValue = function() { return val; };
        ret.getValueIndex = function() { return index; };
        ret.setValue = function(v, triggerEv) {
            if(v == val) return;
            var m = -1;
            for(var i = 0; i < ret.elems.length; i++) {
                if(ret.elems[i].id == v) {
                    m = i;
                    break;
                }
            }
            if(m == -1 && v) return;
            ret.setValueIndex(m, triggerEv);
        };
        ret.setValueIndex = function(i, triggerEv) {
			if (i >= ret.elems.length || i < -1 || i == index) return;
            index = i;
            val = i == -1 ? null : ret.elems[i].id;
            ret.updateView();
            if (triggerEv) {
                triggerEv.value = val;
                triggerEv.text = ret.getText();
                ret.triggerChange(triggerEv);
            }
        };
        ret.getText = function() {
            var i = ret.getValueIndex();
            if (i < 0 || i >= (ret.elems || []).length) return "";
			return ret.elems[i].text || "";
        };
        ret.findText = function(t) {
			var a = ret.elems || [];
            for (var i = 0; i < a.length; i++) {
				if(a[i].text == t) return i;
            }
            return -1;
        };
        ret.onChange = function(c) {
			changeQueue.push(c);
        };
        ret.triggerChange = function(ev) {
			for (var i = 0; i < changeQueue.length; i++) changeQueue[i](ev);
        };
        ret.updateView = function() {};
        ret.updateElems = function(elems) {
            ret.elems = elems;
			var curr = ret.getValue(),
                currText = ret.getText();
            ret.setValue();
            ret.buildFromElems(true);
            ret.setValue(ret.readValue());
            if (curr) ret.setValue(curr);
            if (currText) {
				var ti = ret.findText(currText);
                if (ti >= 0) ret.setValueIndex(ti);
            }
            if (ret.$el) elems.length ? ret.$el.removeClass('empty') : ret.$el.addClass('empty');
            if (ret.type == 'select') {
				where.onSelectboxUpdate(context, ret.$el, ret);
            }
        };
        return ret;
    };

    where.useValues = function(context, d) {
		var listsObj = context.listsObj;
        for (var field in d) {
			if (!d.hasOwnProperty(field)) continue;
			where.updateStatus(context, field, d[field]);
			var v = null, arr = listsObj[field] || [];
            for (var i = 0; i < arr.length; i++) {
				v = v || arr[i].getValue();
            }
            where.updateStatus(context, field, v);
        }
        where.updateForPossibleRows(context, where.widenPossibleRows(context));
        where.updateButtons(context);
    };

    where.widenPossibleRows = function(context, excluded) {
		var possibleRows = returnPossibleRows(context);
        if (context.widenSelection) {
            var priorityList = getPriorityList(context, excluded);
            while (possibleRows.length == 0 && priorityList.length) {
                where.updateStatus(context, priorityList.pop(), null);
                possibleRows = returnPossibleRows(context);
            }
        }
		return possibleRows;
    };

    where.updateForPossibleRows = function(context, possibleRows) {
        where.updateImage(context, possibleRows);
        where.buildRetailerList(context, possibleRows);
        where.checkForLonelyOptions(context);
    };

    where.updateImage = function (context, rows) {
        if (!rows || !rows.length) return;
        var imgRoot = context.config.opts.imageRootDirectory || "";
        var url = imgRoot + rows[0].img;
        var imgs = context.wrapper.find(consts.CN_BOXART);
        imgs.filter('.background').css('background-image', 'url("' + url + '")');
        imgs.not('.background').html('<img src="' + url + '">');
    };

    where.updateButtons = function(context) {
        var v = where.scanComponentValues(context, 'retailers').value;
        where.updateButtonLink(context, v);
    };

    where.updateButtonData = function(context) {
		var $button = context.wrapper.find(consts.CN_BUYBUTTON);
        $button.attr({
            'data-platform-id': context.status.platforms,
            'data-bundle-id': context.status.bundles,
            'data-region-id': context.status.regions,
            'data-retailer-id': (context.skuMode) ? 'pricespider' : where.scanComponentValues(context, 'retailers').value
        });
    };

    where.updateButtonLink = function (context, url) {
        var $button = context.wrapper.find(consts.CN_BUYBUTTON);

        if (context.skuMode) {
            $button.attr('target', '').attr('href', '#').removeClass(consts.NORETAILER);
        } else {
            if (url != null) $button.attr('target', '_blank').attr('href', url).removeClass(consts.NORETAILER);
            else $button.attr('target', '').attr('href', '#').addClass(consts.NORETAILER);
            where.checkForLonelyOptions(context);
        }

        where.updateButtonData(context);
    };

    where.scanComponentValues = function(context, field) {
		var arr = context.listsObj[field];
        if (!arr) return {};
        for (var i = 0; i < arr.length; i++) {
            var v = arr[i].getValue();
            if(v) return {
                value: v,
                text: arr[i].getText()
            };
        }
        return {};
    };

    where.updateAnalyticsObject = function(context) {
        if (!ATVI.analytics) return;
		var dd = window.digitalData;
        if (!dd || !context || !context.wrapper) return;

        var format = function(s) {
			return (s || "").trim().toLowerCase().replace(/\s+/g, '-');
        };
        var prod = {};
        var attr = prod.attributes = {};
        var info = prod.productInfo = {};
        var status = context.status || {};
        info.productName = format(context.wrapper.attr('data-product-name') || 'default');
        attr.platform = format(status.platforms);
        attr.region = format(status.regions);
        var retailerLink = context.wrapper.find('.selection-type-retailers select').val();
        if(retailerLink) attr.vendor = format(context.wrapper.find('.selection-type-retailers select option:selected').text()) || retailerLink;
        info.productID = format(status.bundles);
        dd.product = prod;
    };

    where.sendStatusEvent = function(context, ev) {
        if (!ATVI.analytics) return;
        var status = context.status;
        ev = ev || {};
        var data = {};
        if(ev.value) data.value = ev.value;
        if(ev.oldValue) data.old_value = ev.oldValue;
        if(ev.type) data.field = ev.type;
        var details = ATVI.analytics.findComponentId(ev.target ? ev.target : context.wrapper);
		where.sendAnalyticsEvent(context, 'wheretobuy-status-update', details, data);
    };

    where.sendButtonClickEvent = function(context, $el) {
        if (!ATVI.analytics) return;
		var details = ATVI.analytics.findComponentId($el);
        where.updateAnalyticsObject(context);
        where.sendAnalyticsEvent(context, 'wtb-button-click', details, {
            button_text: $el.text().trim()
        });
    };

    where.sendAnalyticsEvent = function(context, type, details, data) {
        if (!ATVI.analytics) return;
		var status = context.status;
		data.bundle = status.bundles || "";
        var retailerData = where.scanComponentValues(context, 'retailers');
		data.retailer = retailerData.text || "";
        data.retailerLink = retailerData.value || "";
        data.region = status.regions || "";
        data.platform = status.platforms || "";
		ATVI.analytics.sendEvent(type, details, data);
    };

    where.onEmptyRetailers = function(context) {
        where.checkEmptyRetailers(context);
		var er = context.wrapper.find(consts.CN_EMPTYRETAILERS);
        if (!er.length) return;
		var arr = context.listsObj.retailers || [];
        for (var i = 0; i < arr.length; i++) {
            arr[i].$el.parents('.selectbox').first().hide();
        }
        if (context.skuMode) er.hide();
        else er.show();
    };

    where.onPopulatedRetailers = function(context) {
		var arr = context.listsObj.retailers || [];
        for(var i = 0; i < arr.length; i++) {
            arr[i].$el.parents('.selectbox').first().show();
        }
        context.wrapper.find(consts.CN_EMPTYRETAILERS).hide();
    };

    where.onSelectboxCreate = function(context, $el, listObj) {
        if (ATVI.plugins.selectric && listObj.type == 'select') {
			$(function() {
                $el.selectric({ 
                    disableOnMobile: false,
                    optionsItemBuilder: function(itemData) {
                        return '<span data-' + consts.DATA_OPTIONID + '="' + itemData.value + '"></span>' + itemData.text;
                    },
                    onInit: function() {
                        where.filterPlatformsByBundle(context);
                        where.filterBundlesByRegion(context);
                    }
                });

                where.checkForLonelyOptions(context);
            });
        } else {
            $el.find('option').each(function() {
                where.cleanText(this);
            });
        }
    };

    where.onSelectboxUpdate = function(context, $el, listObj) {
        $el.find('option').each(function() {
            where.cleanText(this);
        });
        where.refreshSelectBox(context, $el);
    };

    where.onStatusUpdate = function(context, field) {
    	if (field == 'regions') where.filterBundlesByRegion(context);
        where.updateButtonData(context);
    };

    where.processSelectionList = function (context, key, list) {
        if(!context.fieldsSorted) {
            context.fieldsSorted = true;
            where.sortFields(context);
            where.sortRows(context);
        }
        return list;
    };


    // ***  UTILS  ***

    where.getContext = function($el) {
		return registry.get($el);
    };

    where.refreshSelectBox = function(context, $el) {
        var bundleId = context.status.bundles,
            platformId = context.status.platforms;
        if (context.wrapper.find(consts.CN_SELECTRICWRAPPER).length) $el.selectric('refresh');

        if ($el.parents(consts.CN_BUNDLESENTRY).length) {
            where.filterPlatformsByBundle(context);
        }

        if (context.wrapper.find(consts.CN_BUNDLECONTENT).length > 1 ||
            context.wrapper.find(consts.CN_PLATFORMCONTENT).length > 1) {
            var $bundleEls = context.wrapper.find(consts.CN_BUNDLECONTENT),
                $platformEls = context.wrapper.find(consts.CN_PLATFORMCONTENT);

            if (bundleId) where.filterContentByType($bundleEls, 'bundle', context.status.bundles);
            if (platformId) where.filterContentByType($platformEls, 'platform', context.status.platforms);
        }

        if (bundleId && context.status.regions) where.filterBundlesByRegion(context);
        if (bundleId && platformId) where.filterButtonText(context);
        context.wrapper.attr({
            'data-current-bundle': context.status.bundles,
            'data-current-platform': context.status.platforms,
            'data-current-region': context.status.regions
        });
    };

	// type === 'bundle' or 'platform'
    where.filterContentByType = function($els, type, id) {
		var $parents = $els.parent();
        if (id == "") id = 'default';
        // find any parents with no matching child >>> show the 'default' child
        $parents.each(function() {
			var thisParent = $(this);
            if (!thisParent.children('[data-' + type + '-id=' + id + ']').length) {
                thisParent.children().hide().filter(function() {
					return $(this).data(type + '-id') == 'default';
                }).show();
            } else {
				thisParent.children().hide().filter(function() {
            		return $(this).data(type + '-id') == id;
        		}).show();
            }
        });
    };

    where.filterBundlesByRegion = function(context) {
        if (!context.wrapper.find(consts.CN_SELECTRICWRAPPER).length) return;
		var rows = context.config.data.wtb.rows,
            bundles = context.listsObj.bundles[0].elems,
            options = context.wrapper.find(consts.CN_BUNDLESENTRY).find(consts.CN_SELECTRICITEMS).find('li'),
            thisRegion = context.status.regions || context.config.opts.defaults.regions,
            i;
        options.removeClass(consts.HIDE);
        for (i = 0; i < bundles.length; i++) {
			var thisBundle = bundles[i].id,
                newBundleArr;
            newBundleArr = $.grep(rows, function(item, j) {
				return (item.regions == thisRegion && item.bundles == thisBundle);
            });
            if (newBundleArr.length) continue;
            else {
				var targetOption;
                targetOption = options.filter(function() {
					return $(this).find('span').data(consts.DATA_OPTIONID) == thisBundle;
                });
                if (targetOption.length) targetOption.addClass(consts.HIDE);
            }
        }
    };

    where.filterPlatformsByBundle = function(context) {
        if (!context.wrapper.find(consts.CN_SELECTRICWRAPPER).length) return;
        var rows = context.config.data.wtb.rows,
            platforms = context.listsObj.platforms[0].elems,
            platformsEls = context.wrapper.find(consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICITEMS).find('li'),
            thisRegion = context.status.regions || context.config.opts.defaults.regions,
            i;
		platformsEls.removeClass(consts.HIDE);
        for (i = 0; i < platforms.length; i++) {
			var thisPlatform = platforms[i].id,
                newPlatformArr = $.grep(rows, function(item, j) {
					return (item.regions == thisRegion && item.bundles == context.status.bundles && item.platforms == thisPlatform);
            	});
            if (newPlatformArr.length) continue;
            else {
				var targetPlatform = platformsEls.filter(function() {
						return $(this).find('span').data(consts.DATA_OPTIONID) == thisPlatform;
                	});
                if (targetPlatform.length) {
                    var selectWrapper = context.wrapper.find(consts.CN_SELECTCONTAINER + consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICWRAPPER),
                        $targetSelect = selectWrapper.find('select'),
                        currentIndex = $targetSelect.prop('selectedIndex'),
                        possibleRows = $.grep(rows, function(thing, k) { return (thing.regions == thisRegion && thing.bundles == context.status.bundles) });

                    targetPlatform.addClass(consts.HIDE);

                    if (thisPlatform == context.status.platforms) {
                        var newPlatform = (possibleRows.length) ? possibleRows[0].platforms : false,
                            newIndex;
                        if (newPlatform) {
                            newIndex = $targetSelect.children().filter(function() { return $(this)[0].value == newPlatform }).index();
                            $targetSelect.prop('selectedIndex', newIndex).selectric('refresh');
                            where.updateStatus(context, 'platforms', newPlatform);
                        }
                    }
                }
            }
        }
    };

    where.checkForLonelyOptions = function(context) {
        var rows = context.config.data.wtb.rows,
            obj = context.listsObj;

        $.each(obj, function() {
            var thisNode = $(this),
                fieldName = thisNode[0].field,
                thisRegion = context.status.regions || context.config.opts.defaults.regions;

            if (fieldName === 'retailers' && thisNode[0].elems.length === 1) {
                var url = context.listsObj.retailers[0].elems[0].id,
                    selectWrapper = context.wrapper.find(consts.CN_SELECTCONTAINER + consts.CN_RETAILERSENTRY).find(consts.CN_SELECTRICWRAPPER);

                selectWrapper.find('select').prop('selectedIndex', 1).selectric('refresh');
                where.updateButtonLonelyRetailer(context, url);
            }

            if (fieldName == 'platforms') {
				var platforms = context.listsObj.platforms[0].elems,
                    platformsEls = context.wrapper.find(consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICITEMS).find('li'),
                    availablePlatformArr = [],
                    i;

                for (i = 0; i < platforms.length; i++) {
                    var newPlatformArr = $.grep(rows, function(item, j) {
                        return (item.regions == thisRegion && item.bundles == context.status.bundles && item.platforms == platforms[i].id);
                    });
                    if (newPlatformArr.length) {
                        availablePlatformArr.push(platforms[i].id);
                        continue;
                    }
                }
				if (availablePlatformArr.length == 1) {
                    var selectWrapper = context.wrapper.find(consts.CN_SELECTCONTAINER + consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICWRAPPER),
                        $targetSelect = selectWrapper.find('select'),
                        index, possibleRows;

                    if (selectWrapper.find('li').length > 1) {
                        index = platformsEls.filter(function() {
                            return $(this).find('span').data(consts.DATA_OPTIONID) == availablePlatformArr[0];
                        }).index();
                    } else index = 1;

                    if ($targetSelect.prop('selectedIndex') == index) return;
                	$targetSelect.prop('selectedIndex', index).selectric('refresh');
                    where.updateStatus(context, 'platforms', availablePlatformArr[0]);i
                }
            }
        });
    };

    where.getButtonState = function(context) {
        var retailersArr = context.listsObj.retailers[0].elems,
            url = (retailersArr.length) ? retailersArr[0].id : undefined,
            tag = (retailersArr.length) ? retailersArr[0].tags : '',
            val;
        if (isOriginalLocale(context)) {
            var arrGrep = $.grep(where.bundleBuyButtonStatus, function(n) { return n.id == context.status.bundles; }),
                dataNode = arrGrep[0],
                hasOverride = (dataNode) ? dataNode.buttonOverride : false,
                platformMatch = undefined;

            if (hasOverride) {
                var opArr = dataNode.buttonOverridePlatforms;
                platformMatch = opArr.indexOf(context.status.platforms) > -1 || opArr[0] == "all";
            }

            if (url == '#unavailable' || url == 'unavailable' || url == '') val = 'coming-soon';
            else if (tag.toLowerCase() == 'download') val = 'download';
            else if (dataNode && dataNode.buttonValue && hasOverride && platformMatch) val = dataNode.buttonValue;
            else val = where.bundleBuyButtonStatus.default.buttonValue;

        } else {
            if (url == '#unavailable' || url == 'unavailable' || url == 'coming-soon' || url == '') val = 'coming-soon';
            else if (tag.toLowerCase() == 'download') val = 'download';
            else val = where.bundleBuyButtonStatus.default.buttonValue;            
        }

        return val;
    };

    where.filterButtonText = function(context) {
        var $button = context.wrapper.find(consts.CN_BUYBUTTON),
            $spans = context.wrapper.find(consts.CN_BUYBUTTONCONTAINER + ' ' + consts.CN_BUYBUTTONTEXT),
            defaultState = where.bundleBuyButtonStatus.default.buttonValue,
            buttonVal = where.getButtonState(context);

        if (!context.skuMode) where.showRetailerSelection(context);
    	where.enableBuyButton(context);
        $spans.hide();

        if (buttonVal != defaultState) {
			where.hideRetailerSelection(context);
            $spans.filter(function() {
                return $(this).data(consts.DATA_BUYBUTTONTEXT) == buttonVal;
            }).show();
        } else {
			$spans.filter(function() {
                return $(this).data(consts.DATA_BUYBUTTONTEXT) == defaultState;
            }).show();
        }

        if (buttonVal == 'coming-soon') where.disableBuyButton(context);
		$button.attr('data-button-type', buttonVal);
    };

    var isOriginalLocale = function(context) {
        return where.config.opts.defaults.regions == context.status.regions;
    };

    where.hideRetailerSelection = function(context, transition) {
        var $el = context.wrapper.find(consts.CN_RETAILERSENTRY);
        if (transition) $el.addClass(consts.HIDE);
        else $el.hide();
    };

    where.showRetailerSelection = function(context, transition) {
        var $el = context.wrapper.find(consts.CN_RETAILERSENTRY);
        if (transition) $el.removeClass(consts.HIDE);
        else $el.show();
    };

    where.disableBuyButton = function(context) {
		context.wrapper.find(consts.CN_BUYBUTTON).addClass('unavailable');
    };

    where.enableBuyButton = function(context) {
		context.wrapper.find(consts.CN_BUYBUTTON).removeClass('unavailable');
    };

    where.updateButtonLonelyRetailer = function(context, url) {
		var $button = context.wrapper.find(consts.CN_BUYBUTTON);

        if (context.skuMode) {
            $button.attr('target', '').attr('href', '#').removeClass(consts.NORETAILER);
        } else {
            if(url != null) $button.attr('target', '_blank').attr('href', url).removeClass(consts.NORETAILER);
            else $button.attr('target', '').attr('href', '#').addClass(consts.NORETAILER);            
        }
    };

    where.cleanText = function(el) {
		var $el = $(el),
            div = $('<div>').html($el.html());
        $el.text(div.text());
    };

    where.checkEmptyRetailers = function(context) {
        if (context.skuMode && context.lastSku) return;
    };

    where.sortFields = function(context) {
        if (!where.wtbBundlesOrder && !where.wtbPlatformsOrder) return;
        var obj = context.config.data.wtb,
            allBundles = obj.bundles,
            allPlatforms = obj.platforms;

        var bundleOrder = (where.wtbBundlesOrder) ? $.map(where.wtbBundlesOrder, $.trim) : false,
        	platformOrder = (where.wtbPlatformsOrder) ? $.map(where.wtbPlatformsOrder, $.trim) : false;

        // make sure all items are in the array
        if (allBundles.length && bundleOrder.length < allBundles.length + 1) {
            var newArr = [],
                i;
            for (i = 0; i < allBundles.length; i++) {
                var id = (bundleOrder.indexOf(allBundles[i]['id']) == -1) ? allBundles[i]['id'] : undefined;
                if (id) newArr.push(id);
            }
            bundleOrder = bundleOrder.concat(newArr);
        }
        if (allPlatforms.length && platformOrder.length < allPlatforms.length + 1) {
            var newArr = [],
                i;
            for (i = 0; i < allPlatforms.length; i++) {
                var id = (platformOrder.indexOf(allPlatforms[i]['id']) == -1) ? allPlatforms[i]['id'] : undefined;
                if (id) newArr.push(id);
            }
            platformOrder = platformOrder.concat(newArr);
        }

        if (bundleOrder) obj.bundles.sort(getSorter(bundleOrder));
        if (platformOrder) obj.platforms.sort(getSorter(platformOrder));
    };

    var getSorter = function(arr) {
        var index = function(o) {
            return arr.indexOf(o.id) || 100;
        };
        return function(a, b) {
            return index(a) - index(b);
        };
    };

    where.sortRows = function(context) {
        var rows = context.config.data.wtb.rows;

        for (var i = 0; i < rows.length; i++) {
            rows[i].initialIndex = i;
        } 	

        rows.sort(function(a, b) {
            if (a.bundles == 'standard' && b.bundles == 'standard') {
                return a.retailer.name > b.retailer.name ? 1 : -1;
            }
            return a.initialIndex > b.initialIndex ? 1 : -1;
        });
    };

    where.processDefaultRegion = function(context, defaultRegion) {
		var localeArr = Object.keys(where.localeCodes),
            isLocaleCode = (localeArr.indexOf(defaultRegion) > -1) ? true : false,
            ret = defaultRegion;
        if (isLocaleCode) {
			ret = where.localeCodes[defaultRegion];
        }
        if (where.detectedLocale) {
            ret = where.detectedLocale;
        }
        return ret;
    };

    where.processDetectedLocale = function(context) {
        var str = context.status.regions,
            detectedLocale = where.detectedLocale,
            regionsArr = context.config.data.wtb.regions.map(function(o) { return o.id; });
		if (regionsArr.indexOf(detectedLocale) > -1 && !ATVI.utils.getQueryParameters().regions) str = detectedLocale;
        return str;
    };

    var getAllRegions = function(context) {
		return context.config.data.wtb.regions.map(function(o) { return o.id; });
    };

    var getArrayOfSelections = function (context) {
		return context.wrapper.find(consts.CN_SELECTFIELDS).map(function() {
            return {
                type: this.className.match(/selection-type-(\w+)/)[1],
                $el: $(this)
            };
        });
    };

    var uniqueVals = function(val, i, self) {
        return self.indexOf(val) === i;
    };

    var scanForRetailer = function(val, arr) {
		var i;
        for (i = 0; i < arr.length; i++) {
			if (arr[i].id == val) return true;
        }
        return false;
    };

    var objectValuesPolyfill = function(obj) {
		var arr = [];
        $.each(obj, function(k, v) {
			arr.push(v);
        });
        return arr;
    };

})(jQuery, ATVI);


ATVI.library.registerLibrary("wtb-component");
