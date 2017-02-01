  {
    type: 'javascript',
    safe: false,
    get_value: function() {
      return $(this.dom_element).find('#' + this.id).val();
    },
    opened: function() {
      var param = this;
      glazed_add_js({
        path: 'vendor/ace/ace.js',
        callback: function() {
          var aceeditor = ace.edit(param.id);
          aceeditor.setTheme("ace/theme/chrome");
          aceeditor.getSession().setMode("ace/mode/javascript");
          aceeditor.setOptions({
            minLines: 10,
            maxLines: 30,
          });
          $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
          aceeditor.on(
            'change',
            function(e) {
              $(param.dom_element).find('#' + param.id).val(aceeditor.getSession().getValue());
              aceeditor.resize();
            }
          );
        }
      });
    },
    render: function(value) {
      this.id = _.uniqueId();
      this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div id="' +
        this.id + '"><textarea class="form-control" rows="10" cols="45" name="' + this.param_name +
        '" ">' + value + '</textarea></div><p class="help-block">' + this.description + '</p></div>'
      );
    },
  },
