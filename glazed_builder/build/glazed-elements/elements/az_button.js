  {
    base: 'az_button',
    name: Drupal.t('Button'),
    icon: 'pe pe-7s-mouse',
    // description: Drupal.t('Button'),
    params: [{
      type: 'textfield',
      heading: Drupal.t('Title'),
      param_name: 'title',
      description: Drupal.t('Text on the button'),
    }, {
      type: 'link',
      heading: Drupal.t('Link'),
      param_name: 'link',
      description: Drupal.t('Button link (url).'),
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
    }, {
      type: 'dropdown',
      heading: Drupal.t('Type'),
      param_name: 'type',
      value: getButtonsStyle()
    }, {
      type: 'checkbox',
      heading: Drupal.t('Block button'),
      param_name: 'block',
      value: {
        'btn-block': Drupal.t("Yes"),
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Size'),
      param_name: 'size',
      value: _.object(['','btn-lg','btn-sm','btn-xs'], [Drupal.t('Normal'), Drupal.t('Large'), Drupal.t('Small'), Drupal.t(
        'Extra small')]),
    }, ],
    show_settings_on_create: true,
    style_selector: '> .btn',
    render: function($) {
      if (this.attrs['link'] == '') {
        this.dom_element = $('<div class="az-element az-button ' + this.attrs['el_class'] +
          '"><button type="button" class="btn ' + this.attrs['type'] + ' ' + this.attrs['size'] + ' ' + this.attrs['block'] +
          '" style="' + this.attrs['style'] + '">' + this.attrs['title'] + '</button></div>');
      }
      else {
        this.dom_element = $('<div class="az-element az-button ' + this.attrs['el_class'] + '"><a href="' +
          this.attrs['link'] + '" type="button" class="btn ' + this.attrs['type'] + ' ' + this.attrs['size'] + ' ' + this.attrs['block'] +
          '" style="' + this.attrs['style'] + '" target="' + this.attrs['link_target'] + '">' +
          this.attrs['title'] + '</a></div>');
      }
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
