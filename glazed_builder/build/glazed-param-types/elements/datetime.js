  {
    type: 'datetime',
    create: function() {
      this.formatDate = '';
      this.formatTime = '';
      this.timepicker = false;
      this.datepicker = false;
    },
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
      var param = this;
      glazed_add_css('vendor/datetimepicker/jquery.datetimepicker.css', function() {});
      glazed_add_js({
        path: 'vendor/datetimepicker/jquery.datetimepicker.js',
        callback: function() {
          if (param.datepicker && param.timepicker)
            param.format = param.formatDate + ' ' + param.formatTime;
          if (param.datepicker && !param.timepicker)
            param.format = param.formatDate;
          if (!param.datepicker && param.timepicker)
            param.format = param.formatTime;
          $(param.dom_element).find('input[name="' + param.param_name + '"]').datetimepicker({
            format: param.format,
            timepicker: param.timepicker,
            datepicker: param.datepicker,
            inline: true,
          });
        }
      });
    },
  },
