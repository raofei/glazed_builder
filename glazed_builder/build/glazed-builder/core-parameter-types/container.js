
 /**
  * Initiate ContainerParamType object, register and mix with base object
  */
  function ContainerParamType() {
    ContainerParamType.baseclass.apply(this, arguments);
  }
  register_param_type('container', ContainerParamType);
  mixin(ContainerParamType.prototype, {
    get_value: function() {
      return $(this.dom_element).find('input[name="' + this.param_name + '_type"]').val() + '/' + $(this.dom_element)
        .find('input[name="' + this.param_name + '_name"]').val();
    },
    render: function(value) {
      var type = value.split('/')[0];
      var name = value.split('/')[1];
      this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div class="wrap-type"><label>' +
        Drupal.t("Type") + '</label><input class="form-control" name="' + this.param_name +
        '_type" type="text" value="' + type + '"></div><div class="wrap-name"><label>' + Drupal.t("Name") + '</label><input class="' +
       'form-control" name="' + this.param_name + '_name" type="text" value="' + name +
        '"></div><p class="help-block">' + this.description + '</p></div>');
    },
    opened: function() {
      var value = this.get_value();
      var type_select = null;
      var name_select = null;
      var element = this;
      glazed_get_container_types(function(data) {
        type_select = chosen_select(data, $(element.dom_element).find('input[name="' + element.param_name +
          '_type"]'));
        $(type_select).chosen().change(function() {
          glazed_get_container_names($(this).val(), function(data) {
            $(name_select).parent().find('.direct-input').click();
            $(element.dom_element).find('input[name="' + element.param_name + '_name"]').val('');
            name_select = chosen_select(data, $(element.dom_element).find('input[name="' + element.param_name +
              '_name"]'));
            //            $(name_select).empty();
            //            for (var key in data) {
            //              $(name_select).append('<option value="' + key + '">"' + data[key] + '"</option>');
            //            }
            //            $(name_select).trigger("chosen:updated");
          });
        });
      });
      glazed_get_container_names(value.split('/')[0], function(data) {
        name_select = chosen_select(data, $(element.dom_element).find('input[name="' + element.param_name +
          '_name"]'));
      });
    },
  });
