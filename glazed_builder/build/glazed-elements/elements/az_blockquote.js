  {
    base: 'az_blockquote',
    name: Drupal.t('Blockquote'),
    icon: 'et et-icon-quote',
    // description: Drupal.t('Blockquote box'),
    params: [{
      type: 'textarea',
      heading: Drupal.t('Text'),
      param_name: 'content',
      value: Drupal.t(
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      ),
    }, {
      type: 'textfield',
      heading: Drupal.t('Cite'),
      param_name: 'cite',
    }, {
      type: 'checkbox',
      heading: Drupal.t('Reverse?'),
      param_name: 'reverse',
      value: {
        'blockquote-reverse': Drupal.t("Yes"),
      },
    }, ],
    show_settings_on_create: true,
    // controls_base_position: 'top-left',
    is_container: true,
    has_content: true,
    render: function($) {
      var reverse = this.attrs['reverse'];
      if (reverse != '')
        reverse = p + reverse;
      this.dom_element = $('<blockquote class="az-element az-blockquote ' + this.attrs['el_class'] + ' ' +
        reverse + '" style="' + this.attrs['style'] + '">' + this.attrs['content'] + '</blockquote>');
      this.dom_content_element = this.dom_element;

      // Condition to check existing item.
      var str = '<footer><cite>' + this.attrs['cite'] + '</cite></footer>';
      var innerHtml = this.dom_element.html().indexOf(str);
      if (this.attrs['cite'] != '' && innerHtml < 0)
        $(this.dom_element).append(str);
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
