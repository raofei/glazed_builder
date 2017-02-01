  {
    base: 'az_map',
    name: Drupal.t('Map'),
    icon: 'et et-icon-map',
    params: [{
      type: 'textfield',
      heading: Drupal.t('Address'),
      param_name: 'address',
      description: Drupal.t('1865 Winchester Blvd #202 Campbell, CA 95008'),
      can_be_empty: false
    }, {
      type: 'textfield',
      heading: Drupal.t('Map width'),
      param_name: 'width',
      description: Drupal.t('For example 100px, or 50%.'),
      can_be_empty: true,
      value: '100%'
    }, {
      type: 'textfield',
      heading: Drupal.t('Map Height'),
      description: Drupal.t('For example 100px, or 50%.'),
      can_be_empty: true,
      param_name: 'height',
      value: '400px'
    }],
    show_settings_on_create: true,
    is_container: true,
    has_content: true,
    render: function($) {
      this.dom_element = $('<div style="line-height: 0;" class="az-element az-map ' + this.attrs['el_class'] + '"></div>');
      function render_map(address, style, width, height) {
        address = address.replace(' ', '+');
        if ($.isNumeric(width))
          width = width + 'px';
        if ($.isNumeric(height))
          height = height + 'px';
        var map = $('<iframe src="https://maps.google.com/maps?q=' + address +
          '&iwloc=near&output=embed" frameborder="0"></<iframe>');
        $(map).attr('style', style);
        if (width.length > 0)
          $(map).css('width', width);
        if (height.length > 0)
          $(map).css('height', height);
        return map;
      }
      var map = render_map(this.attrs['address'], this.attrs['style'], this.attrs['width'], this.attrs['height']);
      $(map).appendTo(this.dom_element);
      this.baseclass.prototype.render.apply(this, arguments);
    }
  },
