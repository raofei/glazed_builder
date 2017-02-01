  {
    type: 'checkboxes',
      get_value: function() {
      var values = [];
      _.each($(this.dom_element).find('input[name="' + this.param_name + '"]:checked'), function(obj) {
        values.push($(obj).val());
      });
      return values.join(',');
    },
    render: function(value) {
      if (value == null)
        value = '';
      var values = value.split(',');
      var inputs = '';
      if (value == '') {
        for (var name in this.value) {
          inputs += '<label>' + this.value[name] + '</label><div class="wrap-checkbox"><div class="checkbox"><input name="' + this.param_name +
            '" type="checkbox" checked value="' + name + '"></div></div>';
        }
      } else {
        for (var name in this.value) {
          if (_.indexOf(values, name) >= 0) {
            inputs += '<label>' + this.value[name] + '</label><div class="wrap-checkbox"><div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" checked value="' + name + '"></div></div>';
          }
          else {
            inputs += '<label>' + this.value[name] + '</label><div class="wrap-checkbox"><div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" value="' + name + '"></div></div>';
          }
        }
      }
      this.dom_element = $('<div class="form-group">' + inputs +
        '<p class="help-block">' + this.description + '</p>');
      initBootstrapSwitch(this.dom_element);
    }
  },
