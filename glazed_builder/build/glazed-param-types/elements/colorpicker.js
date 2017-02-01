  {
    type: 'colorpicker',
    get_value: function() {
      return $(this.dom_element).find('#' + this.id).val();
    },
    render: function(value) {
      this.id = _.uniqueId();
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input id="' + this.id + '" name="' + this.param_name + '" type="text" value="' + value +
        '"></div><p class="help-block">' + this.description + '</p></div>');
    },
    opened: function() {
      colorpicker('#' + this.id);
    },
  },
