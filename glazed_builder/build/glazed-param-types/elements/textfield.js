  {
    type: 'textfield',
    get_value: function() {
      return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
    },
    render: function(value) {
      var required = this.required ? 'required' : '';
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input class="form-control" name="' + this.param_name +
        '" type="text" value="' + value + '" ' + required + '></div><p class="help-block">' + this.description +
        '</p></div>');
    }
  },
