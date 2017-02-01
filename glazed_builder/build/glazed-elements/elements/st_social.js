  {
    base: 'st_social',
    name: Drupal.t('Social links'),
    icon: 'et et-icon-twitter',
    // description: Drupal.t('Branded Social Links'),
    params: [{
      type: 'html',
      heading: Drupal.t('Social links'),
      param_name: 'st_social_links',
      description: Drupal.t(
        'Enter a social brand and URL per line. Example: Facebook="https://www.facebook.com/"'),
      value: "Facebook='https://www.facebook.com/'\nYouTube='https://www.youtube.com/'",
    }, {
      type: 'dropdown',
      heading: Drupal.t('Layout'),
      param_name: 'st_type',
      value: {
        'inline': Drupal.t('Inline'),
        'stacked': Drupal.t('Stacked'),
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Style'),
      param_name: 'st_style',
      value: {
        '': Drupal.t('None'),
        'rounded': Drupal.t('Rounded'),
        'circle': Drupal.t('Circle'),
        'square': Drupal.t('Square'),
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Size'),
      param_name: 'st_size',
      value: {
        'lg': Drupal.t('Large'),
        '': Drupal.t('Small'),
        '2x': Drupal.t('2x'),
        '3x': Drupal.t('3x'),
        '4x': Drupal.t('4x'),
        '5x': Drupal.t('5x'),
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Color'),
      param_name: 'st_theme_color',
      value: colors,
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Color'),
      param_name: 'st_color',
      dependency: {
        'element': 'st_theme_color',
        'is_empty': {}
      },
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'dropdown',
      heading: Drupal.t('Background Color'),
      param_name: 'st_theme_bgcolor',
      value: colors,
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Background Color'),
      param_name: 'st_bgcolor',
      dependency: {
        'element': 'st_theme_bgcolor',
        'is_empty': {}
      },
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'dropdown',
      heading: Drupal.t('Hover color'),
      param_name: 'st_hover_color',
      value: {
        'brand': Drupal.t('Brand color'),
        'inherit': Drupal.t('Inherit'),
        '': Drupal.t('None'),
      },
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'dropdown',
      heading: Drupal.t('Border color'),
      param_name: 'st_theme_border_color',
      value: colors,
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Border color'),
      param_name: 'st_border_color',
      dependency: {
        'element': 'st_theme_border_color',
        'is_empty': {}
      },
      tab: Drupal.t('Icon Colors')
    }, {
      type: 'dropdown',
      heading: Drupal.t('CSS3 Hover Effects'),
      description: Drupal.t('Setting a CSS3 Hover effect will automatically make the icon a circle-style icon.'),
      param_name: 'st_css3_hover_effects',
      value: {
        '': Drupal.t('None'),
        'disc': Drupal.t('Disc'),
        'pulse': Drupal.t('Pulse'),
      },
    }, ],
    show_settings_on_create: true,
    render: function($) {
      this.add_css('css/social.css', 'socialLink' in $.fn, function() {});
      this.add_css('css/icon-helpers.css', 'IconHelpers' in $.fn, function() {});
      this.add_css('vendor/font-awesome/css/font-awesome.min.css', 'fontAwesome' in $.fn, function() {});
      this.dom_element = $('<ul class="az-element st-social stbe-social-links ' + this.attrs['el_class'] +
        '" style="' + this.attrs['style'] + '"></ul>');
      if (this.attrs['st_theme_bgcolor'] == 'brand')
        $(this.dom_element).addClass('stbe-social-links--bgcolor-brand');
      if (this.attrs['st_hover_bgcolor'] == 'brand')
        $(this.dom_element).addClass('stbe-social-links--hover-bgcolor-brand');
      if (this.attrs['st_theme_color'] == 'brand')
        $(this.dom_element).addClass('stbe-social-links--color-brand');
      if (this.attrs['st_hover_color'] == 'brand')
        $(this.dom_element).addClass('stbe-social-links--hover-color-brand');
      if (this.attrs['st_type'] == 'stacked')
        $(this.dom_element).addClass('stbe-social-links-stacked');

      var icon_style = '';
      // Foreground color
      if (this.attrs['st_color'] && (this.attrs['st_theme_color'] == '')) {
        icon_style = icon_style + 'color: ' + this.attrs['st_color'] + ';';
      }
      // Background color
      if (this.attrs['st_bgcolor'] && (this.attrs['st_theme_bgcolor'] == '')) {
        icon_style = icon_style + 'background-color: ' + this.attrs['st_bgcolor'] + ';';
      }
      // Border color
      if (this.attrs['st_border_color'] && (this.attrs['st_theme_border_color'] == '')) {
        icon_style = icon_style + 'border-color: ' + this.attrs['st_border_color'] + ';';
      }
      var links = this.attrs['st_social_links'].split("\n");
      for (var i in links) {
        if (links[i] != '') {
          var link = links[i].split("=");
          var name = link[0].replace(/['"]+/g, '').toLowerCase();
          var url = link[1].replace(/['"]+/g, '');
          var icon_classes = ['fa'];
          icon_classes.push('fa-' + this.attrs['st_size']);
          icon_classes.push('fa-' + name);
          icon_classes.push('stbe-util-icon-' + this.attrs['st_style']);
          if (this.attrs['st_css3_hover_effects'])
            icon_classes.push('stbe-util-icon-fx');
            icon_classes.push('stbe-util-fx-' + this.attrs['st_css3_hover_effects']);
          if (this.attrs['st_border_color'] != '' || this.attrs['st_theme_border_color'] != '')
            icon_classes.push('stbe-util-icon-border');
          $(this.dom_element).append('<li class="stbe-social-links__item"><a href="' + url + '"><i class="' +
            icon_classes.join(' ') + '" style="' + icon_style +
            '" data-toggle="tooltip" data-placement="top" title="' + name + '"></i></a></li>')
        }
      }
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
