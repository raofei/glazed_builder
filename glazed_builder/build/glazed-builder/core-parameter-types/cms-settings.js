

 /**
  * Initiate CMSSettingsParamType object, register and mix with base object
  */
  function CMSSettingsParamType() {
    CMSSettingsParamType.baseclass.apply(this, arguments);
  }
  register_param_type('cms_settings', CMSSettingsParamType);
  mixin(CMSSettingsParamType.prototype, {
    get_value: function() {
      return $(this.dom_element).find('form').serialize();
    },
    render_form: function(instance) {
      var param = this;
      glazed_get_cms_element_settings(instance, function(data) {
        $(param.dom_element).empty();
        $(data).appendTo(param.dom_element);
        $(param.dom_element).find('[type="submit"]').remove();
        if (param.form_value.length > 0) {
          $(param.dom_element).deserialize(htmlDecode(param.form_value));
        }
      });
    },
    get_form: function(name_param) {
      var form_value = name_param.get_value();
      if (form_value.length > 0) {
        this.render_form(form_value);
      }
    },
    render: function(value) {
      this.form_value = value;
      this.dom_element = $('<div class="form-group"></div>');
    },
    opened: function() {
      if ('instance' in this) {
        this.render_form(this.instance);
      }
    },
  });