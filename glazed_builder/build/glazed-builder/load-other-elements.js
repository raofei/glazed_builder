
  function create_glazed_elements() {
    if ('glazed_elements' in window) {
      for (var i = 0; i < window.glazed_elements.length; i++) {
        var element = window.glazed_elements[i];
        var ExternalElement = function(parent, position) {
          ExternalElement.baseclass.apply(this, arguments);
        }
        register_animated_element(element.base, element.is_container, ExternalElement);
        element.baseclass = ExternalElement.baseclass;
        element.params = element.params.concat(ExternalElement.prototype.params);
        mixin(ExternalElement.prototype, element);
        for (var j = 0; j < ExternalElement.prototype.params.length; j++) {
          var param = ExternalElement.prototype.params[j];
          var new_param = make_param_type(param);
          ExternalElement.prototype.params[j] = new_param;
        }
      }
    }
  }
  create_glazed_elements();

  function create_template_elements() {
    if (!window.glazed_editor || window.glazed_online)
      glazed_get_elements(function(elements) {
        if (_.isObject(elements)) {
          glazed_elements.create_template_elements(elements);
        }
      });
  }
  create_template_elements();

  function create_cms_elements() {
    glazed_builder_get_cms_element_names(function(elements) {
      if (_.isObject(elements)) {
        glazed_elements.create_cms_elements(elements);
      }
      else {
        glazed_elements.cms_elements_loaded = true;
      }
    });
  }
  create_cms_elements();