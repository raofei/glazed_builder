  {
    type: 'bootstrap_slider',
    create: function() {
      this.min = 0;
      this.max = 100;
      this.step = 1;
      this.formatter = false;
    },
    get_value: function() {
      var v = $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
      return (v == '') ? NaN : parseFloat(v).toString();
    },
    render: function(value) {
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input class="form-control" name="' + this.param_name +
        '" type="text" value="' + value + '"></div><p class="help-block">' +
        this.description + '</p></div>');
    },
    opened: function() {
      initBootstrapSlider($(this.dom_element).find('input[name="' + this.param_name + '"]'), this.min, this.max, this.get_value(), this.step,this.formatter);
    },
  },
