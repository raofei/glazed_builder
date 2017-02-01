  {
    base: 'az_separator',
    name: Drupal.t('Divider'),
    icon: 'et et-icon-scissors',
    params: [{
      type: 'colorpicker',
      heading: Drupal.t('Color'),
      param_name: 'bgcolor',
    }, {
      type: 'dropdown',
      heading: Drupal.t('Thickness'),
      param_name: 'thickness',
      value: {
        'auto': Drupal.t('Theme Default'),
        'custom': Drupal.t('Custom Thickness'),
      },
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Thickness'),
      param_name: 'custom_thickness',
      max: '20',
      value: '3',
      dependency: {
        'element': 'thickness',
        'value': ['custom'],
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Length'),
      param_name: 'width',
      value: {
        'auto': Drupal.t('Theme Default'),
        'custom': Drupal.t('Custom Width'),
      },
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Width'),
      param_name: 'custom_width',
      description: Drupal.t('Select where to open link.'),
      max: '500',
      value: '100',
      step: '10',
      dependency: {
        'element': 'width',
        'value': ['custom'],
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Align'),
      param_name: 'align',
      value: {
        'left': Drupal.t('Left'),
        'center': Drupal.t('Center'),
        'right': Drupal.t('Right'),
      },
      dependency: {
        'element': 'width',
        'value': ['custom'],
      },
    },],
    // description: Drupal.t('Horizontal separator'),
    render: function($) {
      var divider_style = 'border: none;';
      // Stroke Width
      if ((this.attrs['thickness'] == 'custom') && this.attrs['custom_thickness']) {
        divider_style = divider_style + 'height: ' + this.attrs['custom_thickness'] + 'px;';
      }
      // Color
      if (this.attrs['bgcolor']) {
        divider_style = divider_style + 'background-color: ' + this.attrs['bgcolor'] + ';';
      }
      // Stroke Length
      if ((this.attrs['width'] == 'custom')) {
        if ( this.attrs['custom_width'] > 0) {
          divider_style = divider_style + 'width: ' + this.attrs['custom_width'] + 'px;';
        }
        else {
          divider_style = divider_style + 'width: 100%;';
        }
        // Align divider
        if (this.attrs['align'] == 'left') {
          divider_style = divider_style + 'margin-left: 0;margin-right: auto;';
        }
        else if (this.attrs['align'] == 'center') {
          divider_style = divider_style + 'margin-left: auto;margin-right: auto;';
        }
        else if (this.attrs['align'] == 'right') {
          divider_style = divider_style + 'margin-left: auto;margin-right: 0;';
        }
      }
       this.dom_element = $('<hr class="az-element az-separator ' + this.attrs['el_class'] + '" style="' + this.attrs[
           'style'] + divider_style + '"></hr>');
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
