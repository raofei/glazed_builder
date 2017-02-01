  {
    base: 'az_text',
    name: Drupal.t('Text'),
    icon: 'et et-icon-document',
    // description: Drupal.t('Text with editor'),
    params: [{
      type: 'textarea',
      heading: Drupal.t('Text'),
      param_name: 'content',
      value: '<h2>Lorem ipsum dolor sit amet.</h2> Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },],
    show_settings_on_create: true,
    is_container: true,
    has_content: true,
    render: function($) {
      this.dom_element = $('<div class="az-element az-text ' + this.attrs['el_class'] + '" style="' + this.attrs[
          'style'] + '">' + this.attrs['content'] + '</div>');
      this.dom_content_element = this.dom_element;
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
