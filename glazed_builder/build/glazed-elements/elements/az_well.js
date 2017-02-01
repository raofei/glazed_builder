  {
    base: 'az_well',
    name: Drupal.t('Well'),
    icon: 'et et-icon-focus',
    // description: Drupal.t('Content box'),
    params: [{
      type: 'dropdown',
      heading: Drupal.t('Type'),
      param_name: 'type',
      value: _.object(
        [p,'well-lg','well-sm'], [Drupal.t('Default'), Drupal.t('Large'), Drupal.t('Small')]
      )
    }],
    is_container: true,
    controls_base_position: 'top-left',
    render: function($) {
      this.dom_element = $('<div class="az-element az-well well ' + this.attrs['el_class'] + ' ' +
        this.attrs['type'] + '" style="' + this.attrs['style'] + '"></div>');
      var body = $('<div class="az-ctnr"></div>').appendTo(this.dom_element);
      this.dom_content_element = body;
      this.baseclass.prototype.render.apply(this, arguments);
    }
  },
