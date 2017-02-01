  {
    base: 'az_link',
    name: Drupal.t('Link'),
    icon: 'et et-icon-attachment fa-flip-horizontal',
    // description: Drupal.t('Link wrapper'),
    params: [{
      type: 'link',
      heading: Drupal.t('Link'),
      param_name: 'link',
      description: Drupal.t('Content link (url).'),
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
    is_container: true,
    controls_base_position: 'top-left',
    show_settings_on_create: true,
    show_controls: function() {
      if (window.glazed_editor) {
        this.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.dom_content_element).click(function() {
          return !$(this).closest('.az-container').hasClass('glazed-editor');
        });
      }
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-link ' + this.attrs['el_class'] + '"></div>');
      this.dom_content_element = $('<a href="' + this.attrs['link'] + '" class="az-ctnr" target="' + this.attrs[
          'link_target'] + '"></a>').appendTo(this.dom_element);
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
