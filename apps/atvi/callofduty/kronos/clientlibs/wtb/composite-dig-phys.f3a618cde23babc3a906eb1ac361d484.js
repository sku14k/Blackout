
MW = MW || {};
MW.compositeWtb = {};

(function($, MW) {

	var where = ATVI.components.wheretobuy,
        $con;

    MW.compositeWtb.init = function() {
        $con = $('#composite-dig-phys');
        MW.wtb.initRegionModal($con);
    };

	where.onStatusUpdate = function(context, field) {
        var s = context.status;
        if (s.regions && s.platforms) filterBundles(context);
        if (field == 'regions' && s.regions) {
            MW.wtb.updateCurrentRegionPrompt(context);
        }
    };

    var filterBundles = function(context) {
		var rows = context.config.data.wtb.rows,
            bundles = context.listsObj.bundles[0].elems,
            platform = context.status.platforms,
            region = context.status.regions || context.config.opts.defaults.regions,
            $bundleOptionEls = context.wrapper.find(where.constants.CN_BUNDLESENTRY).find(where.constants.CN_SELECTRICITEMS).find('li'),
            i;

        if (!platform || !region) return;
        $bundleOptionEls.removeClass(where.constants.HIDE);

        for (i = 0; i < bundles.length; i++) {
			var thisBundle = bundles[i].id,
                newBundleArr;
            newBundleArr = $.grep(rows, function(item) {
				return (item.regions == region 
                        && item.bundles == thisBundle 
                        && item.platforms == platform);
            });
            if (newBundleArr.length) continue;
            else {
                var $targetOption = $bundleOptionEls.filter(function() {
                    return $(this).find('span').data(where.constants.DATA_OPTIONID) == thisBundle;
                });
                if ($targetOption.length) $targetOption.addClass(where.constants.HIDE);
            }
        }

    };

    $(MW.compositeWtb.init);

})(jQuery, MW);