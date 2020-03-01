

var MW = MW || {};
MW.digitalOnlyWtb = {};

(function($, MW) {

	var where = ATVI.components.wheretobuy,
        $con;

    var init = function() {
        $con = $('#wtb-digital-only');
        MW.wtb.initRegionModal($con);
    };

    where.setDefaults = function(context) {
		var defaults = context.config.opts.defaults,
			query = ATVI.utils.getQueryParameters(true),
			defaultRegion = where.processDefaultRegion(context, defaults.regions);
        defaults.regions = defaultRegion;
        if (query.bundles) defaults.bundles = query.bundles;
        if (query.platforms) defaults.platforms = query.platforms;
        if (query.regions) defaults.regions = query.regions;

        if (defaultRegion == 'ru') defaults.platforms = 'xboxone';

        where.useValues(context, defaults);
    };

	where.onStatusUpdate = function(context, field) {
        var s = context.status;
        if (field == 'regions' && s.regions) {
            var $ps4Select = context.wrapper.find('.selection-type-platforms .ps4');
            MW.wtb.updateCurrentRegionPrompt(context);
            $ps4Select.show();
            if (s.regions == 'ru' || s.regions == 'ua-ru') {
				where.updateStatus(context, 'platforms', 'xboxone');
                $ps4Select.hide();
            }
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
				if (rows[row].retailer.type != 'physical') compositeObj[val].push(entry);
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

    var uniqueVals = function(val, i, self) {
        return self.indexOf(val) === i;
    };


    $(init);

})(jQuery, MW);