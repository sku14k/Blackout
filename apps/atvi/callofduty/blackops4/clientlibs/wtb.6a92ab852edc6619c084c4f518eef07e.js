
var BO4 = BO4 || {};
BO4.wtb = {};

(function($, BO4) {

    var where = ATVI.components.wheretobuy;


    where.onStatusUpdate = function(context, field) {
        if (field == 'regions') where.filterBundlesByRegion(context);
        if (field == 'bundles') setPlatform(context);
        where.updateButtonData(context);
    };


    var setPlatform = function(context) {
		var bundle = context.status.bundles,
            region = context.status.regions,
            rows = context.config.data.wtb.rows,
            possibleRows = $.grep(rows, function(row) { return row.platforms == context.status.platforms && row.bundles == bundle && row.regions == region; });
        if (possibleRows.length) return;
        else {
            var bundleRows = $.grep(rows, function(row) { return row.bundles == bundle && row.regions == region; }),
                platformSelectWrapper = context.wrapper.find(where.constants.CN_SELECTCONTAINER + where.constants.CN_PLATFORMSENTRY).find(where.constants.CN_SELECTRICWRAPPER),
            	$platformSelect = platformSelectWrapper.find('select'),
                platformsArr = [],
                i;
            for (i = 0; i < bundleRows.length; i++) {
				if (platformsArr.indexOf(bundleRows[i].platforms) < 0) platformsArr.push(bundleRows[i].platforms);
            }
            var newIndex = $platformSelect.children().filter(function() { return $(this)[0].value == platformsArr[0]; }).index();
			where.updateStatus(context, 'platforms', platformsArr[0]);
            $platformSelect.prop('selectedIndex', newIndex).selectric('refresh');
        }
    };


})(jQuery, BO4);