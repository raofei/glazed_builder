  {
    base: 'az_circle_counter',
    name: Drupal.t('Circle counter'),
    icon: 'et et-icon-speedometer',
    // description: Drupal.t('Infographic Counter'),
    params: [{
      type: 'colorpicker',
      heading: Drupal.t('Foreground color'),
      param_name: 'fgcolor',
      value: '#333333',
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Background color'),
      param_name: 'bgcolor',
      value: '#999999',
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Fill'),
      param_name: 'fill',
    }, {
      type: 'checkbox',
      heading: Drupal.t('Half Circle'),
      param_name: 'type',
      value: {
        'half': Drupal.t("Yes"),
      },
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Dimension'),
      param_name: 'dimension',
      max: '500',
      value: '250',
    }, {
      type: 'textfield',
      heading: Drupal.t('Text'),
      param_name: 'text',
      tab: Drupal.t('Circle content'),
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Font size'),
      param_name: 'fontsize',
      max: '100',
      value: '16',
      formatter: true,
      tab: Drupal.t('Circle content'),
    }, {
      type: 'textfield',
      heading: Drupal.t('Info'),
      param_name: 'info',
      tab: Drupal.t('Circle content'),
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Width'),
      param_name: 'width',
      max: '100',
      value: '5',
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Percent'),
      param_name: 'percent',
      max: '100',
      value: '50',
    }, {
      type: 'dropdown',
      heading: Drupal.t('Border style'),
      param_name: 'border',
      value: {
        'default': Drupal.t('Default'),
        'inline': Drupal.t('Inline'),
        'outline': Drupal.t('Outline'),
      },
    }, {
      type: 'icon',
      heading: Drupal.t('Icon'),
      param_name: 'icon',
      tab: Drupal.t('Icon'),
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Icon size'),
      param_name: 'icon_size',
      max: '100',
      description: Drupal.t('Will set the font size of the icon.'),
      value: '16',
      tab: Drupal.t('Icon'),
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Icon color'),
      param_name: 'icon_color',
      description: Drupal.t('Will set the font color of the icon.'),
      tab: Drupal.t('Icon'),
    }, ],
    show_settings_on_create: true,
    frontend_render: true,
    showed: function($) {
      this.baseclass.prototype.showed.apply(this, arguments);
      var icon_set = this.attrs['icon'].charAt(0);
      switch (icon_set) {
        case 'e':
          this.add_css('vendor/et-line-font/et-line-font.css', 'ETLineFont' in $.fn, function() {});
          break;
        case 'f':
          this.add_css('vendor/font-awesome/css/font-awesome.min.css', 'fontAwesome' in $.fn, function() {});
          break;
        case 'p':
          this.add_css('vendor/pe-icon-7-stroke/css/pe-icon-7-stroke.css', 'PELineFont' in $.fn, function() {});
          break;
        default:
          break;
      }
      var element = this;
      this.add_css('vendor/jquery.circliful/css/jquery.circliful.css', 'circliful' in $.fn, function() {});
      this.add_js_list({
        paths: ['vendor/jquery.circliful/js/jquery.circliful.min.js',
          'vendor/jquery.waypoints/lib/jquery.waypoints.min.js'
        ],
        loaded: 'waypoint' in $.fn && 'circliful' in $.fn,
        callback: function() {
          $(element.dom_element).waypoint(function(direction) {
            $(element.dom_element).find('#' + element.id).once().circliful();
          }, {
            offset: '100%',
            handler: function(direction) {
              this.destroy()
            },
          });
          $(document).trigger('scroll');
        }
      });
    },
    render: function($) {
      if (this.attrs['icon']) {
        var circliful_icon = '" data-icon=" ' + this.attrs['icon'] + '" data-iconsize="' + this.attrs[
            'icon_size'] + '" data-iconcolor="' + this.attrs['icon_color'];
      }
      else {
        var circliful_icon = '';
      }
      this.dom_element = $('<div class="az-element az-circle-counter ' + this.attrs['el_class'] + '" style="' +
        this.attrs['style'] + '"><div id="' + this.id + '" data-dimension="' + this.attrs['dimension'] +
        '" data-text="' + this.attrs['text'] + '" data-info="' + this.attrs['info'] + '" data-width="' + this
          .attrs['width'] + '" data-fontsize="' + this.attrs['fontsize'] + '" data-type="' + this.attrs['type'] +
        '" data-percent="' + this.attrs['percent'] + '" data-fgcolor="' + this.attrs['fgcolor'] +
        '" data-bgcolor="' + this.attrs['bgcolor'] + '" data-fill="' + this.attrs['fill'] + '" data-border="' +
        this.attrs['border'] + circliful_icon + '"></div></div>');

      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
