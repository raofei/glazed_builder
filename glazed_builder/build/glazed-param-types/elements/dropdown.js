  {
    type: 'dropdown',
    get_value: function () {
      if (Object.keys(this.value).length < 10) {
        var val = $(this.dom_element).find('input[name="' + this.param_name + '"]:checked').val();
        if (typeof val != 'undefined')
          return val;
      } else {
        return $(this.dom_element).find('select[name="' + this.param_name + '"] > option:selected').val();
      }
    },
    render: function (value) {
      var content = '<div class="form-radios">';
      if (Object.keys(this.value).length < 10) {
        /* Render radios */
        var inValue = value in this.value;
        for (var name in this.value) {
          var radio = '';
          var inputName = (name == '') ? 'default' : name;
          var id = 'dropdown-' + this.param_name + '-' + inputName;
          if (!inValue) {
            radio += '<div class="form-item form-type-radio">'
              + '<input type="radio" id="' + id + '" name="' + this.param_name + '" value="' + name + '" checked="checked" class="form-radio">'
              + '<label class="option" for="' + id + '">' + this.value[name] + ' </label>'
              + '</div>';
            inValue = true;
          } else {
            if (name == value) {
              radio += '<div class="form-item form-type-radio">'
                + '<input type="radio" id="' + id + '" name="' + this.param_name + '" value="' + name + '" checked="checked" class="form-radio">'
                + '<label class="option" for="' + id + '">' + this.value[name] + ' </label>'
                + '</div>';
            }
            else {
              radio += '<div class="form-item form-type-radio">'
                + '<input type="radio" id="' + id + '" name="' + this.param_name + '" value="' + name + '" class="form-radio">'
                + '<label class="option" for="' + id + '">' + this.value[name] + ' </label>'
                + '</div>';
            }
          }
          content += radio;
        }
        content += '</div>';
      } else {
        /* Render select */
        content = '<select name="' + this.param_name + '" class="form-control">';
        for (var name in this.value) {
          var option = '';
          if (name == value) {
            option = '<option selected value="' + name + '">' + this.value[name] + '</option>';
          }
          else {
            option = '<option value="' + name + '">' + this.value[name] + '</option>';
          }
          content += option;
        }
        content += '/<select>';
      }
      this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div>' + content +
        '</div><p class="help-block">' + this.description + '</p></div>');
    }
  },
