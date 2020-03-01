var MW = MW || {};
MW.wtb = MW.wtb || {};

(function($, MW) {

    var where = ATVI.components.wheretobuy;


    if (where) {
        // type === 'bundle' or 'platform'
        where.filterContentByType = function($els, type, id) {
            var $parents = (type == 'bundle') ? $els.parent().not('.bundle-incentives-container') : $els.parent(),
                $incentives = (type == 'bundle') ? $els.parent('.bundle-incentives-container') : undefined;
            if (id == "") id = 'default';

            if (type == 'bundle' && $incentives.length) filterIncentives($incentives, id);

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
    }

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

    var addAnim = function(){
        $('.atvi-wheretobuy').addClass('anim-items anim-incentives');
    };

    var filterIncentives = function($els, id) {
        $('.atvi-wheretobuy').removeClass('anim-items');
        $('.bundle-boxart').removeClass('standard');
        $els.children().removeClass('bundle-selected');
        $els.find('.' + id).addClass('bundle-selected');
        
        setTimeout(addAnim, 1000);
    };

    MW.wtb.initRegionModal = function($context) {
		var $modal = $context.find('.region-select-modal'),
            $closeButton = $modal.find('.close-button'),
            $modalCloseButton = $modal.find('.modal-btn'),
            $modalBg = $modal.find('.background-container'),
            $modalCta = $context.find('.cta.change-region'),
            modalObj = {};
        modalObj.$modal = $modal;
		modalObj.$closeButton = $closeButton;
        modalObj.$modalBg = $modalBg;
        modalObj.$modalCta =$modalCta;
        $closeButton.add($modalBg).add($modalCloseButton).on('click', function(e) {
            e.preventDefault();
			MW.wtb.closeRegionModal(modalObj);
        });

        $modalCta.on('click', function(e) {
			e.preventDefault();
            MW.wtb.openRegionModal(modalObj);
        });
    };

    MW.wtb.openRegionModal = function(modalObj) {
		modalObj.$modal.addClass('active');
        $('body').addClass('region-modal-active');
    };

    MW.wtb.closeRegionModal = function(modalObj) {
		modalObj.$modal.removeClass('active');
        $('body').removeClass('region-modal-active');
    };

    MW.wtb.updateCurrentRegionPrompt = function(context) {
		var regionId = context.status.regions,
            regionText = context.listsObj.regions[0].elems.filter(function(item) { return item.id == regionId; })[0].text,
            $el = context.wrapper.find('.current-region.message .region-label');
        if ($el.text() != regionText) $el.text(regionText);
    };


})(jQuery, MW);