ATVI.components.carousel = {};

(function ($, ATVI) {
    'use strict';

    var c = ATVI.components.carousel,
        COMPONENT_CLASSNAME = 'atvi-carousel',
        INDICATOR_LINK_CLASSNAME = 'carousel-indicator-link',
        SLIDE_CLASSNAME = 'slide-entry',
        inMotion = false;

    var documentHiddenProp = function () {
		if(typeof document.hidden != 'undefined') 		return 'hidden';
        if(typeof document.webkitHidden != 'undefined') return 'webkitHidden';
        if(typeof document.msHidden != 'undefined') 	return 'msHidden';
    }();

    var animations = {
        'fade': 	runToggleAnimation,
        'display': 	runToggleAnimation,
        'slide': 	runSlideAnimation
    };

    /*
    * A generic animation function that toggles the active state between the carousel items. Most animations will probably use this function.
    *
    * @param {jQuery} $activeItem - A jQuery object representing the current, active carousel item.
    * @param {jQuery} $nextItem - A jQuery object representing the next carousel item.
    * @param {Object} options - The carousel options. Derived from the data-{property} attributes on the carousel.
    */
    function runToggleAnimation($activeItem, $nextItem, options) {
        $activeItem.removeClass('active');
        $nextItem.addClass('active');
    }

    /*
    * An animation function that should only be used for slide animations.
    *
    * @param {jQuery} $activeItem - A jQuery object representing the current, active carousel item.
    * @param {jQuery} $nextItem - A jQuery object representing the next carousel item.
    * @param {Object} options - The carousel options. Derived from the data-{property} attributes on the carousel.
    */
    function runSlideAnimation($activeItem, $nextItem, options) {
        var direction = (options.slideDirection || 'left').toLowerCase();

        $activeItem.addClass('slide-out-' + direction);
        $nextItem.addClass('active slide-in-' + direction);
    }

    /*
    * A utility function that helps us handle pausing/resuming a slideshow.
    *
    * @param {jQuery} $carousel - The carousel to run the slideshow on.
    * @param {Function} next - A function to execute for every interval.
    */
    function startSlideshow($carousel, next) {
        var speed = $carousel.data('autoplay-interval');
        var timer = setInterval(function () {
            if($carousel.hasClass('pause') || document[documentHiddenProp]) return;

            if($carousel.hasClass('restart')) {
                $carousel.removeClass('restart');
                clearInterval(timer);
                startSlideshow($carousel, next);
                return;
            }

            next();
        }, speed);
    }

    /*
    * Initializes a carousel.
    *
    * @param {jQuery} $carousel - A jQuery object representing a carousel instance.
    */
    function createCarousel($carousel) {
        var carouselOptions = $carousel.data(),
            autoplay = carouselOptions.autoplay;

        if(!autoplay) return;

        startSlideshow($carousel, function () {
            $carousel.trigger('atvi-carousel.nextSlide');
        });
    }

    /*
    * Reset the carousel. Typically used only when jumping to a slide or going to next/prev slide.
    *
    * @param {Function} fn
    */
    function resetCarousel(fn) {
        return function () {
            var $carousel = ($(this).hasClass(COMPONENT_CLASSNAME)) ? $(this) : $(this).parents('.' + COMPONENT_CLASSNAME);

            fn.apply(this, arguments);
            $carousel.addClass('restart');
        };
    }


    /*
    * Set the corresponding indicator of the current slide to active.
    *
    * @param {Function} fn
    */
	function setIndicator($context, index) {
		var $indicators = $context.find('.' + INDICATOR_LINK_CLASSNAME);
        $indicators.removeClass('active').filter(function() {
            return $(this).data('indicator-index') == index;
        }).addClass('active');
    }


    c.init = function () {
        /*
        * We register events on all carousels here because we don't need to register an event for every carousel, rather, one event for all carousels.
        */
        var $carousels = $('.' + COMPONENT_CLASSNAME).not('.aem-GridColumn'),
            $carouselItems = $carousels.find('.' + SLIDE_CLASSNAME),
            $carouselArrows = $carousels.find('.carousel-nav-link'),
            $carouselIndicators = $carousels.find('.' + INDICATOR_LINK_CLASSNAME);

        var pauseSlideshow = function(e) {
            var $carousel = $(this);
            if(!$carousel.hasClass('pause')) $carousel.addClass('pause');
        };
        var resumeSlideshow = function(e) {
            var $carousel = $(this);
            if($carousel.hasClass('pause')) $carousel.removeClass('pause');
        };
        var nextSlide = function(e) {
            var $carousel = $(this),
                $carouselSlides = $carousel.find('.slides-container .' + SLIDE_CLASSNAME),
                $activeSlide = $carouselSlides.filter('.active'),
                $nextSlide = ($activeSlide.index() + 1 == $carouselSlides.length) ? $carouselSlides.first() : $activeSlide.next(),
                animation = $carousel.data('animation'),
                options = $.extend({}, $carousel.data(), {slideDirection: 'left'});

            if (animation) animations[animation]($activeSlide, $nextSlide, options);
            setIndicator($carousel, $nextSlide.data('slide-entry-index'));
        };
        var prevSlide = function(e) {
            var $carousel = $(this),
                $carouselSlides = $carousel.find('.slides-container .' + SLIDE_CLASSNAME),
                $activeSlide = $carouselSlides.filter('.active'),
                $prevSlide = ($activeSlide.index() == 0) ? $carouselSlides.last() : $activeSlide.prev(),
                animation = $carousel.data('animation'),
                options = $.extend({}, $carousel.data(), {slideDirection: 'right'});
    
            if (animation) animations[animation]($activeSlide, $prevSlide, options);
            setIndicator($carousel, $prevSlide.data('slide-entry-index'));
        };
        var goToSlide = function(e, slide) {
            var $carousel = $(this),
                $carouselSlides = $carousel.find('.slides-container .' + SLIDE_CLASSNAME),
                $activeSlide = $carouselSlides.filter('.active'),
                $nextSlide = $carouselSlides.eq(slide),
                animation = $carousel.data('animation'),
                options = $.extend({}, $carousel.data(), {slideDirection: $activeSlide.index() > slide ? 'right' : 'left'});

            if(slide > ($carouselSlides.length - 1)) return;
    
            if (animation) animations[animation]($activeSlide, $nextSlide, options);
            setIndicator($carousel, $nextSlide.data('slide-entry-index'));
        };
        var handleArrowClick = function(e) {
            e.preventDefault();
            if (inMotion) return;
            inMotion = true;
            var $target = $(e.target),
                $carousel = $(this).closest('.' + COMPONENT_CLASSNAME);

            if ($target.data('direction')) {
                var direction = $target.data('direction').toLowerCase();

                if (direction == 'previous') $carousel.trigger('atvi-carousel.prevSlide');
                if (direction == 'next') $carousel.trigger('atvi-carousel.nextSlide');
            }
            setTimeout(function() {
                inMotion = false;
            }, 300);
        };
        var handleIndicatorClick = function(e) {
            e.preventDefault();
            if (inMotion) return;
            inMotion = true;
            var $target = $(e.target),
                $carousel = $(this).closest('.' + COMPONENT_CLASSNAME),
                activeIndex = $carousel.find('.active.' + SLIDE_CLASSNAME).index(),
                slideIndex = $target.data('indicator-index');

            if (slideIndex >= 0 && slideIndex != activeIndex) {
                $carousel.trigger('atvi-carousel.goToSlide', [slideIndex]);
            }
            setIndicator($carousel, slideIndex);
            setTimeout(function() {
				inMotion = false;
            }, 300);
        };
        var handleSlideAnimationChange = function(e) {
            var $this = $(this);

            if ($this.filter('.slide-out-left, .slide-out-right').length) $this.removeClass('active slide-out-left slide-out-right');
            if ($this.hasClass('active')) $this.removeClass('slide-in-left slide-in-right');
        };

        $carousels.on('atvi-carousel.pauseSlideshow', pauseSlideshow);
        $carousels.on('atvi-carousel.resumeSlideshow', resumeSlideshow);
        $carousels.on('atvi-carousel.nextSlide', resetCarousel(nextSlide));
        $carousels.on('atvi-carousel.prevSlide', resetCarousel(prevSlide));
        $carousels.on('atvi-carousel.goToSlide', resetCarousel(goToSlide));
        $carouselArrows.on('click', resetCarousel(handleArrowClick));
        $carouselIndicators.on('click', resetCarousel(handleIndicatorClick));

        $carouselItems.on('animationend', handleSlideAnimationChange);
        $carousels.find('.' + SLIDE_CLASSNAME).each(function() {
			ATVI.touch.onSimpleHorizontal($(this), {
                swipeLeft: function() {
                    var $thisCarousel = $(this).parents('.' + COMPONENT_CLASSNAME);
                    $thisCarousel.trigger('atvi-carousel.nextSlide');
                },
                swipeRight: function() {
                    var $thisCarousel = $(this).parents('.' + COMPONENT_CLASSNAME);
                    $thisCarousel.trigger('atvi-carousel.prevSlide');
                }
            });
        });

        $carousels.each(function (i, carousel) {
            createCarousel($(carousel));
        });
    };

    $(c.init);
}(jQuery, ATVI));