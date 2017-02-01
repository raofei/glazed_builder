  {
    type: 'images',
    get_value: function() {
      return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
    },
    render: function(value) {
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input class="form-control" name="' + this.param_name +
        '" type="text" value="' + value + '"></div><p class="help-block">' + this.description +
        '</p></div>');
    },
    opened: function() {
      images_select($(this.dom_element).find('input[name="' + this.param_name + '"]'), ',');
    },
  },
