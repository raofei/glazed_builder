  {
    base: 'az_html',
    name: Drupal.t('HTML'),
    icon: 'et et-icon-search',
    // description: Drupal.t('HTML Editor'),
    params: [{
      type: 'html',
      heading: Drupal.t('Raw html'),
      param_name: 'content',
      description: Drupal.t('Enter your HTML content.'),
      value: Drupal.t('<p>Click the edit button to change this HTML</p>'),
    },],
    show_settings_on_create: true,
    is_container: true,
    has_content: true,
    render: function($) {
      this.dom_element = $('<div class="az-element az-html ' + this.attrs['el_class'] + '" style="' + this.attrs[
          'style'] + '">' + this.attrs['content'] + '</div>');
      this.dom_content_element = this.dom_element;
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
