  {
    base: 'az_icon',
    name: Drupal.t('Icon'),
    icon: 'et et-icon-strategy',
    // description: Drupal.t('Vector icon'),
    params: [{
      type: 'icon',
      heading: Drupal.t('Icon'),
      param_name: 'icon',
    }, {
      type: 'dropdown',
      heading: Drupal.t('Icon Size'),
      param_name: 'size',
      value: _.object(['fa-lg', '', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x'], [Drupal.t('Large'), Drupal.t('Normal'), Drupal.t('2x'), Drupal.t(
        '3x'), Drupal.t('4x'), Drupal.t('5x')]),
    }, {
      type: 'dropdown',
      heading: Drupal.t('Style'),
      param_name: 'st_style',
      value: {
        '': Drupal.t('None'),
        'stbe-util-icon-rounded': Drupal.t('Rounded'),
        'stbe-util-icon-circle': Drupal.t('Circle'),
        'stbe-util-icon-square': Drupal.t('Square'),
      },
      tab: Drupal.t('Icon Utilities')
    }, {
      type: 'dropdown',
      heading: Drupal.t('Icon Animation'),
      param_name: 'animation',
      value: _.object(['', 'fa-spin', 'fa-pulse'], [Drupal.t('No'), Drupal.t('Spin'), Drupal.t('Pulse')]),
      tab: Drupal.t('Icon Utilities')
    }, {
      type: 'dropdown',
      heading: Drupal.t('Icon Orientation'),
      param_name: 'orientation',
      value: _.object(['', 'fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270', 'fa-flip-horizontal',
        'fa-flip-vertical'
      ], [Drupal.t('Normal'), Drupal.t('Rotate 90'), Drupal.t('Rotate 180'), Drupal.t('Rotate 270'), Drupal.t('Flip Horizontal'), Drupal.t(
        'Flip Vertical')]),
      tab: Drupal.t('Icon Utilities')
    }, {
      type: 'link',
      heading: Drupal.t('Link'),
      param_name: 'link',
      description: Drupal.t('Icon link (url).'),
    }, {
      type: 'dropdown',
      heading: Drupal.t('Link target'),
      param_name: 'link_target',
      description: Drupal.t('Select where to open link.'),
      value: target_options,
      dependency: {
        'element': 'link',
        'not_empty': {}
      },
    },],
    show_settings_on_create: true,
    style_selector: '> i',
    render: function($) {
      var icon_set = this.attrs['icon'].charAt(0);
      switch (icon_set) {
        case 'e':
          // ET Icons
          this.add_css('vendor/et-line-font/et-line-font.css', 'ETLineFont' in $.fn, function() {});
          this.add_css('css/icon-helpers.css', 'IconHelpers' in $.fn, function() {});
          break;
        case 'f':
          // Font Awesome Icons
          this.add_css('vendor/font-awesome/css/font-awesome.min.css', 'fontAwesome' in $.fn, function() {});
          break;
        case 'g':
          // Glyphicons
          this.add_css('css/icon-helpers.css', 'IconHelpers' in $.fn, function() {});
          break;
        case 'p':
          // Pixeden Icons
          this.add_css('vendor/pe-icon-7-stroke/css/pe-icon-7-stroke.css', 'PELineFont' in $.fn, function() {});
          this.add_css('css/icon-helpers.css', 'IconHelpers' in $.fn, function() {});
          break;
        default:
          break;
      }

      var icon_style = '';
      // Foreground color
      if (this.attrs['st_theme_color'] == '') {
        icon_style = icon_style + 'color: ' + this.attrs['st_color'] + ';';
      }
      else {
        if ('sooperthemes_theme_palette' in window && window.sooperthemes_theme_palette != null && this.attrs[
            'st_theme_color'] in window.sooperthemes_theme_palette)
          icon_style = icon_style + 'color: ' + window.sooperthemes_theme_palette[this.attrs['st_theme_color']] +
            ';';
        else
          icon_style = icon_style + 'color: ' + this.attrs['st_theme_color'] + ';';
      }
      // Background color
      if (this.attrs['st_theme_bgcolor'] == '') {
        icon_style = icon_style + 'background-color: ' + this.attrs['st_bgcolor'] + ';';
      }
      else {
        if ('sooperthemes_theme_palette' in window && window.sooperthemes_theme_palette != null && this.attrs[
            'st_theme_bgcolor'] in window.sooperthemes_theme_palette)
          icon_style = icon_style + 'background-color: ' + window.sooperthemes_theme_palette[this.attrs[
              'st_theme_bgcolor']] + ';';
        else
          icon_style = icon_style + 'background-color: ' + this.attrs['st_theme_bgcolor'] + ';';
      }
      var icon_html = '<div class="az-element az-icon ' + this.attrs['el_class'] + '"><i class="' + this.attrs[
          'icon'] + ' ' + this.attrs['size'] + ' ' + this.attrs['st_style'] + ' ' + this.attrs['fw'] + ' ' +
        this.attrs['pull'] + ' ' + this.attrs['animation'] + ' ' + this.attrs['orientation'] + '" style="' +
        this.attrs['style'] + icon_style + '"></i></div>';
      if (this.attrs['link'] == '') {
        this.dom_element = $(icon_html);
      }
      else {
        this.dom_element = $('<a href="' + this.attrs['link'] + '" class="az-element az-icon ' + this.attrs[
            'el_class'] + '" target="' + this.attrs['link_target'] + '">' + icon_html + '</a>');
      }
      $(this.dom_element).css('font-size', this.attrs['size'] + 'px');
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
