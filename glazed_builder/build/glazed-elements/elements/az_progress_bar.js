  {
    base: 'az_progress_bar',
    name: Drupal.t('Progress Bar'),
    icon: 'et et-icon-bargraph fa-rotate-90',
    // description: Drupal.t('Animated progress bar'),
    params: [{
      type: 'textfield',
      heading: Drupal.t('Label'),
      param_name: 'label',
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Progress'),
      param_name: 'width',
      value: '50',
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Bar height'),
      param_name: 'height',
      value: '3',
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Back Color'),
      param_name: 'bgcolor',
    }, {
      type: 'colorpicker',
      heading: Drupal.t('Front Color'),
      param_name: 'fcolor',
    }, {
      type: 'dropdown',
      heading: Drupal.t('Type'),
      param_name: 'type',
      hidden: true,
      value: _.object(['','progress-bar-success','progress-bar-info','progress-bar-warning',
        'progress-bar-danger'
      ], [Drupal.t('Default'), Drupal.t('Success'), Drupal.t('Info'), Drupal.t('Warning'), Drupal.t('Danger')]),
    }, {
      type: 'checkbox',
      heading: Drupal.t('Options'),
      param_name: 'options',
      value: {
        'progress-striped': Drupal.t("Add Stripes?"),
        'active': Drupal.t("Add animation? Will be visible with striped bars."),
      },
    },],
    render: function($) {
      var height = this.attrs['height'] + 'px';
      var options = this.attrs['options'];
      if (options != '')
        options = _.map(options.split(','), function(value) {
          return p + value;
        }).join(' ');
      this.dom_element = $('<div class="az-element az-progress-bar progress ' + this.attrs['el_class'] +
        ' ' + options + '" style="' + this.attrs['style'] + '"><div class="progress-bar ' + this.attrs[
          'type'] + '" role="progressbar" aria-valuenow="' + this.attrs['width'] +
        '" aria-valuemin="0" aria-valuemax="100" style="width: ' + this.attrs['width'] + '%; line-height: ' + height + ';">' + this.attrs[
          'label'] + '</div></div>');
      this.dom_element.css('height', height).css('min-height', height).css('line-height', height);
      // Back Color
      if (this.attrs['bgcolor']) {
        this.dom_element.css('background-color', this.attrs['bgcolor']);
      }
      // Front Color
      if (this.attrs['fcolor']) {
        this.dom_element.find('.progress-bar').css('background-color', this.attrs['fcolor']);
      }
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
