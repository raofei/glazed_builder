  {
    base: 'az_alert',
    name: Drupal.t('Alert'),
    icon: 'et et-icon-caution',
    // description: Drupal.t('Alert box'),
    params: [{
      type: 'textfield',
      heading: Drupal.t('Message'),
      param_name: 'message',
      value: Drupal.t(
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      ),
    },
  {
      type: 'dropdown',
      heading: Drupal.t('Type'),
      param_name: 'type',
      description: Drupal.t('Select message type.'),
      value: _.object([p + 'alert-success','alert-info','alert-warning','alert-danger'], [Drupal.t(
        'Success'), Drupal.t('Info'), Drupal.t('Warning'), Drupal.t('Danger')]),
    },],
    show_settings_on_create: true,
    render: function($) {
      this.dom_element = $('<div class="az-element az-alert alert ' + this.attrs['type'] + ' ' + this.attrs[
          'el_class'] + '" style="' + this.attrs['style'] + '">' + this.attrs['message'] + '</div>');
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
