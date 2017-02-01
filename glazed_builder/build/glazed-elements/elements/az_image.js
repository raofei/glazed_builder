  {
    base: 'az_image',
    name: Drupal.t('Image'),
    icon: 'et et-icon-picture',
    // description: Drupal.t('Single image'),
    params: [{
      type: 'image',
      heading: Drupal.t('Image'),
      param_name: 'image',
      description: Drupal.t('Select image from media library.'),
    }, {
      type: 'textfield',
      heading: Drupal.t('Image width'),
      param_name: 'width',
      description: Drupal.t('For example 100px, or 50%.'),
      can_be_empty: true,
      value: '100%',
    }, {
      type: 'textfield',
      heading: Drupal.t('Image height'),
      description: Drupal.t('For example 100px, or 50%.'),
      can_be_empty: true,
      param_name: 'height',
    }, {
      type: 'link',
      heading: Drupal.t('Image link'),
      param_name: 'link',
      description: Drupal.t('Enter URL if you want this image to have a link.'),
    }, {
      type: 'dropdown',
      heading: Drupal.t('Image link target'),
      param_name: 'link_target',
      description: Drupal.t('Select where to open link.'),
      value: target_options,
      dependency: {
        'element': 'link',
        'not_empty': {}
      },
    }, {
      type: 'textfield',
      heading: Drupal.t('Alt attribute'),
      param_name: 'alt',
      description: Drupal.t('Image description'),
      can_be_empty: true,
      value: '',
      tab: Drupal.t('SEO'),
    }, {
      type: 'textfield',
      heading: Drupal.t('Title attribute'),
      param_name: 'title',
      description: Drupal.t('Additional information about the image'),
      can_be_empty: true,
      value: '',
      tab: Drupal.t('SEO'),
    },],
    frontend_render: true,
    show_settings_on_create: true,
    render: function($) {
      var id = this.id;
      var element = this;
      this.dom_element = $('<div class="az-element az-image ' + this.attrs['el_class'] + '"></div>');
      function render_image(value, style, width, height, alt, title) {
        if ($.isNumeric(width))
          width = width + 'px';
        if ($.isNumeric(height))
          height = height + 'px';
        var img = $('<img src="' + value + '" alt="' + alt + '" title="' + title + '">');
        $(img).attr('style', style);
        if (width.length > 0)
          $(img).css('width', width);
        if (height.length > 0)
          $(img).css('height', height);
        return img;
      }
      var img = render_image(
          this.attrs['image'],
          this.attrs['style'],
          this.attrs['width'],
          this.attrs['height'],
          this.attrs['alt'],
          this.attrs['title']
        );
      $(img).appendTo(this.dom_element);
      if (this.attrs['link'] != '') {
        $(this.dom_element).find('img').each(function() {
          $(this).wrap('<a href="' + element.attrs['link'] + '" target="' + element.attrs['link_target'] +
            '"></a>');
        });
      }
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
