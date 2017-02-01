  {
    type: 'rawtext',
    safe: false,
    get_value: function() {
      return $(this.dom_element).find('#' + this.id).val();
    },
    render: function(value) {
      this.id = _.uniqueId();
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><textarea id="' + this.id + '" class="form-control" rows="10" cols="45" name="' + this.param_name + '" ">' + value +
        '</textarea></div><p class="help-block">' + this.description + '</p></div>');
    },
  },
