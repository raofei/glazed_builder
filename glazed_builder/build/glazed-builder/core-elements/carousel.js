
  function CarouselElement(parent, position) {
    CarouselElement.baseclass.apply(this, arguments);
    if (!position || typeof position !== 'boolean') {
      this.add_slide();
    }
  }
  register_animated_element('az_carousel', true, CarouselElement);
  mixin(CarouselElement.prototype, {
    name: Drupal.t('Carousel'),
    icon: 'pe pe-7s-more',
    // description: Drupal.t('Bootstrap Carousel'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Frames per slide'),
        param_name: 'items',
        min: '1',
        max: '10',
        value: '1',
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Disable Auto Play'),
        param_name: 'autoPlay',
        value: {
          'yes': Drupal.t('Yes'),
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Dots Navigation'),
        param_name: 'pagination',
        tab: 'Dots',
        value: {
          'on': Drupal.t('On'),
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Dots Orientation'),
        param_name: 'pagination_orientation',
        tab: 'Dots',
        value: {
          'outside': Drupal.t('Outside Slider'),
          'inside': Drupal.t('Inside Slider'),
        },
        dependency: {
          'element': 'pagination',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Shape'),
        param_name: 'pagination_shape',
        tab: 'Dots',
        value: {
          'circle': Drupal.t('Circle'),
          'square': Drupal.t('Square'),
          'triangle': Drupal.t('Triangle'),
          'bar': Drupal.t('Bar'),
        },
        dependency: {
          'element': 'pagination',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Transform Active'),
        param_name: 'pagination_transform',
        tab: 'Dots',
        value: {
          '': Drupal.t('None'),
          'growTaller': Drupal.t('Grow Taller'),
          'growWider': Drupal.t('Grow Wider'),
          'scaleUp': Drupal.t('Scale up'),
        },
        dependency: {
          'element': 'pagination',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'colorpicker',
        heading: Drupal.t('Dots Color'),
        param_name: 'pagination_color',
        tab: 'Dots',
        dependency: {
          'element': 'pagination',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'colorpicker',
        heading: Drupal.t('Active Dot Color'),
        param_name: 'pagination_active_color',
        tab: 'Dots',
        dependency: {
          'element': 'pagination',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Next/Previous'),
        param_name: 'navigation',
        tab: 'Next/Previous',
        value: {
          'on': Drupal.t('On'),
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Orientation'),
        param_name: 'navigation_orientation',
        tab: 'Next/Previous',
        value: {
          'outside': Drupal.t('Outside Slider'),
          'inside': Drupal.t('Inside Slider'),
        },
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Shape'),
        param_name: 'navigation_shape',
        tab: 'Next/Previous',
        value: {
          '': Drupal.t('No Background'),
          'circle': Drupal.t('Circle'),
          'square': Drupal.t('Square'),
          'bar': Drupal.t('Bar'),
        },
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'colorpicker',
        heading: Drupal.t('Icon Color'),
        param_name: 'navigation_icon_color',
        tab: 'Next/Previous',
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'colorpicker',
        heading: Drupal.t('Icon Hover Color'),
        param_name: 'navigation_icon_hover_color',
        tab: 'Next/Previous',
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'colorpicker',
        heading: Drupal.t('Background Color'),
        param_name: 'navigation_background_color',
        tab: 'Next/Previous',
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'colorpicker',
        heading: Drupal.t('Background Hover'),
        param_name: 'navigation_background_hover_color',
        tab: 'Next/Previous',
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Icon Thickness'),
        param_name: 'navigation_thickness',
        tab: 'Next/Previous',
        min: '1',
        max: '10',
        value: '2',
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Outside Navigation Position'),
        param_name: 'navigation_position',
        tab: 'Next/Previous',
        value: {
          'adjacent': Drupal.t('Adjacent'),
          'bottomCenter': Drupal.t('Bottom Center'),
          'topLeft': Drupal.t('Top Left'),
          'topRight': Drupal.t('Top Right'),
          'bottomCenter': Drupal.t('Bottom Center'),
          'bottomLeft': Drupal.t('Bottom Left'),
          'bottomRight': Drupal.t('Bottom Right'),
        },
        dependency: {
          'element': 'navigation',
          'not_empty': {}
        },
      }),
      // make_param_type({
      //   type: 'checkbox',
      //   heading: Drupal.t('Mouse Drag'),
      //   param_name: 'mouseDrag',
      //   value: {
      //     'on': Drupal.t('On'),
      //   },
      // }),
      // make_param_type({
      //   type: 'checkbox',
      //   heading: Drupal.t('Touch Drag'),
      //   param_name: 'touchDrag',
      //   value: {
      //     'on': Drupal.t('On'),
      //   },
      // }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Auto Play Interval'),
        param_name: 'interval',
        min: '1000',
        max: '20000',
        value: '5000',
        step: '100',
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Transition style'),
        param_name: 'transition',
        value: {
          '': Drupal.t('Default'),
          'fade': Drupal.t('fade'),
          'backSlide': Drupal.t('backSlide'),
          'goDown': Drupal.t('goDown'),
          'fadeUp': Drupal.t('fadeUp'),
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Stop on Hover'),
        param_name: 'stopOnHover',
        value: {
          'on': Drupal.t('On'),
        },
      }),
      // This is here for backwards compatibility before the settings were refactored in Glazed Builder 1.0.13
      make_param_type({
        type: 'checkbox',
        hidden: true,
        heading: Drupal.t('Options'),
        param_name: 'options',
        value: {
          'navigation': Drupal.t("Navigation"),
          'auto_play': Drupal.t("Auto play"),
          'mouse': Drupal.t("Mouse drag"),
          'touch': Drupal.t("Touch drag"),
        },
      }),
    ].concat(CarouselElement.prototype.params),
    is_container: true,
    controls_base_position: 'top-left',
    show_settings_on_create: true,
    frontend_render: true,
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    show_controls: function() {
      if (window.glazed_editor) {
        CarouselElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.add').remove();
        $(this.controls).find('.paste').remove();
        var element = this;
        $('<span title="' + title("Add slide") + '" class="control add-toggle btn btn-default glyphicon glyphicon-plus-sign" > </span>').appendTo(this.controls)
          .click({
            object: this
          }, this.click_add_slide);
      }
    },
    update_sortable: function() {},
    click_add_slide: function(e) {
      e.data.object.add_slide();
      return false;
    },
    add_slide: function() {
      var child = new SlideElement(this, true);
      child.update_dom();
      this.update_dom();
    },
    showed: function($) {
      CarouselElement.baseclass.prototype.showed.apply(this, arguments);
      var get_carousel_style = function(element) {
        var el = '[data-az-id=' + element.id + '] .st-owl-theme';
        output = '<style id="carousel-style-' + element.id + '"><!-- ';
        // Dots color
        if (element.attrs['pagination_shape'] == 'triangle') {
          output += el + ' .owl-page {background:transparent !important; border-bottom-color: ' + element.attrs['pagination_color'] + ' !important}';
          output += el + ' .owl-page.active {background:transparent !important; border-bottom-color: ' + element.attrs['pagination_active_color'] + ' !important}';
        }
        else {
          output += el + ' .owl-page {background: ' + element.attrs['pagination_color'] + ' !important}';
          output += el + ' .owl-page.active {background: ' + element.attrs['pagination_active_color'] + ' !important}';
        }
        // Icon Color and thickness
        output += el + ' .owl-buttons .owl-prev::after, ' + el + ' .owl-buttons .owl-next::after,'
          + el + ' .owl-buttons .owl-prev::before, ' + el + ' .owl-buttons .owl-next::before {'
          + 'background: ' + element.attrs['navigation_icon_color'] + ';'
          + 'width: ' + element.attrs['navigation_thickness'] + 'px;'
          + '}';
        // Icon Hover color
        output += el + ' .owl-buttons .owl-prev:hover::after, ' + el + ' .owl-buttons .owl-next:hover::after,'
          + el + ' .owl-buttons .owl-prev:hover::before, ' + el + ' .owl-buttons .owl-next:hover::before {'
          + 'background: ' + element.attrs['navigation_icon_hover_color'] + '}';
        // Icon Background Color
        output += el + ' .owl-buttons .owl-prev, ' + el + ' .owl-buttons .owl-next {'
          + 'background: ' + element.attrs['navigation_background_color'] + ';'
          + 'border-color: ' + element.attrs['navigation_background_color'] + ' }';
        // Icon Background Hover Color
        output += el + ' .owl-buttons .owl-prev:hover, ' + el + ' .owl-buttons .owl-next:hover {'
          + 'background: ' + element.attrs['navigation_background_hover_color'] + ';'
          + 'border-color: ' + element.attrs['navigation_background_hover_color'] + ' }';

        output += ' --></style>';
        return output;
      }
      this.add_css('vendor/owl.carousel/owl-carousel/owl.carousel.css', 'owlCarousel' in $.fn, function() {});
      this.add_css('css/st-owl-carousel.css', 'owlCarousel' in $.fn, function() {});
      this.add_css('vendor/owl.carousel/owl-carousel/owl.transitions.css', 'owlCarousel' in $.fn, function() {});
      var element = this;
      this.add_js({
        path: 'vendor/owl.carousel/owl-carousel/owl.carousel.js',
        loaded: 'owlCarousel' in $.fn,
        callback: function() {
          //$(element.controls).detach();
          var owl_carousel_refresh = function(owl) {
            var userItems = null;
            if ('userItems' in owl)
              userItems = owl.userItems;
            else
              userItems = owl.$userItems;
            var visibleItems = null;
            if ('visibleItems' in owl)
              visibleItems = owl.visibleItems;
            else
              visibleItems = owl.$visibleItems;
            for (var i = 0; i < userItems.length; i++) {
              if (_.indexOf(visibleItems, i) < 0) {
                var item = userItems[i];
                var id = $(item).attr('data-az-id');
                var el = glazed_elements.get_element(id);
                if (!_.isUndefined(el)) {
                  if ('trigger_start_out_animation' in el)
                    el.trigger_start_out_animation();
                }
              }
            }
            for (var i = 0; i < visibleItems.length; i++) {
              if (visibleItems[i] < userItems.length) {
                var item = userItems[visibleItems[i]];
                var id = $(item).attr('data-az-id');
                var el = glazed_elements.get_element(id);
                if (!_.isUndefined(el)) {
                  if ('trigger_start_in_animation' in el)
                    el.trigger_start_in_animation();
                }
              }
            }
          }
          var owlClasses = 'st-owl-theme';
          if (element.attrs['pagination']) {
            if (element.attrs['pagination_orientation'])
              owlClasses += ' st-owl-pager-' + element.attrs['pagination_orientation'];
            if (element.attrs['pagination_shape'])
              owlClasses += ' st-owl-pager-' + element.attrs['pagination_shape'];
            if (element.attrs['pagination_transform'])
              owlClasses += ' st-owl-pager-' + element.attrs['pagination_transform'];
          }
          if (element.attrs['navigation']) {
            if (element.attrs['navigation_orientation'])
              owlClasses += ' st-owl-navigation-' + element.attrs['navigation_orientation'];
            if (element.attrs['navigation_shape'])
              owlClasses += ' st-owl-navigation-' + element.attrs['navigation_shape'];
            if (element.attrs['navigation_position'])
              owlClasses += ' st-owl-navigation-' + element.attrs['navigation_position'];
          }
          var autoPlay = false;
          if (!Boolean(element.attrs['autoPlay']) && (element.attrs['interval'] > 0)) {
            autoPlay = element.attrs['interval'];
          }
          $(element.dom_content_element).owlCarousel({
            addClassActive: true,
            afterAction: function() {owl_carousel_refresh(this.owl);},
            afterMove: function() {},
            autoPlay: autoPlay,
            beforeMove: function() {},
            items: element.attrs['items'],
            mouseDrag: true,
            navigation: Boolean(element.attrs['navigation']),
            navigationText: false,
            pagination: Boolean(element.attrs['pagination']),
            singleItem: (element.attrs['items'] == '1'),
            startDragging: function() {},
            stopOnHover: Boolean(element.attrs['stopOnHover']),
            theme: owlClasses,
            touchDrag: true,
            transitionStyle: element.attrs['transition'] == '' ? false : element.attrs['transition'],
          });
          owl_carousel_refresh(element.dom_content_element.data('owlCarousel'));
          if ((element.attrs['navigation_orientation'] == 'outside') &&
            ((element.attrs['navigation_position'] == 'topLeft')
              || (element.attrs['navigation_position'] == 'topRight')
              || (element.attrs['navigation_position'] == 'topCenter'))) {
            $(element.dom_content_element).find('.owl-buttons').prependTo($(element.dom_content_element));
          }
          $('head').find('#carousel-style-' + element.id).remove();
          $('head').append(get_carousel_style(element));
          //$(element.dom_element).prepend(element.controls);
        }
      });
    },
    render: function($) {
      this.dom_element = $('<div id="' + this.id + '" class="az-element az-carousel ' + this.attrs['el_class'] +
        '" style="' + this.attrs['style'] + '"></div>');
      this.dom_content_element = $('<div></div>').appendTo(this.dom_element);
      CarouselElement.baseclass.prototype.render.apply(this, arguments);
    },
  });