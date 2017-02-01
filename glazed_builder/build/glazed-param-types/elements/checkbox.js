  {
    type: 'checkbox',
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
      var count = Object.keys(this.value).length;
      if (count == 1) {
        for (var name in this.value) {
          if (_.indexOf(values, name) >= 0) {
            inputs += '<div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" checked value="' + name + '"></div>';
          }
          else {
            inputs += '<div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" value="' + name + '"></div>';
          }
        }
        this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div class="wrap-checkbox">' + inputs +
          '</div><p class="help-block">' + this.description + '</p>');
        initBootstrapSwitch(this.dom_element);
      } else {
        for (var name in this.value) {
          if (_.indexOf(values, name) >= 0) {
            inputs += '<div class="checkbox"><label><input name="' + this.param_name +
              '" type="checkbox" checked value="' + name + '">' + this.value[name] + '</label></div>';
          }
          else {
            inputs += '<div class="checkbox"><label><input name="' + this.param_name +
              '" type="checkbox" value="' + name + '">' + this.value[name] + '</label></div>';
          }
        }
        this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div class="wrap-checkbox">' + inputs +
          '</div><p class="help-block">' + this.description + '</p>');
      }
    }
  },
