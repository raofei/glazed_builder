
  function ContainerElement(parent, position) {
    ContainerElement.baseclass.apply(this, arguments);
    this.rendered = false;
    this.loaded_container = null;
    this.js = {};
    this.css = {};
  }
  register_animated_element('az_container', true, ContainerElement);
  mixin(ContainerElement.prototype, {
    name: Drupal.t('Glazed Container'),
    icon: 'et et-icon-download',
    description: Drupal.t('AJAX Load Fields'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'container',
        heading: Drupal.t('Glazed Container'),
        param_name: 'container',
        description: Drupal.t('Type and name used as identificator to save container on server.'),
        value: '/',
      }),
    ].concat(ContainerElement.prototype.params),
    show_settings_on_create: true,
    is_container: true,
    hidden: !window.glazed_online,
    controls_base_position: 'top-left',
    saveable: true,
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    get_empty: function() {
      var dom_element = '<div class="az-empty"><div class="top well"><strong>' + '  <h3 class="glazed-choose-layout">Choose a Layout</h3></strong>'
           + '<p class="lead">' + Drupal.t('Or add elements from the + button or sidebar.' + '</p></div>')
           + '<div class="top-right well"><h1>↗</h1>'
           + ' <span class="glyphicon glyphicon-save"></span>' +
        Drupal.t(' Don\'t forget to save frequently') + '</div></div>';
      var $dom_element = $(dom_element);
      $dom_element.find('.glazed-choose-layout').bind('click',function(e){
        e.stopPropagation();
        if (e.which == 1) {
          var id = $(this).closest('[data-az-id]').attr('data-az-id');
          glazed_elements.showTemplates(glazed_elements.get_element(id), function(element) {

          });
        }
      })
      return $dom_element;
    },
    show_controls: function() {
      if (window.glazed_editor) {
        var element = this;
        var helpContent = '<ul class="nav">'
        // helpContent += '<li><a href="http://www.sooperthemes.com/" taget="_blank">Start Tour</a></li>';
        helpContent += '<li><a href="https://www.youtube.com/watch?v=lODF-8byKRA" target="_blank">Basic Controls Video</a></li>';
        helpContent += '<li><a href="http://www.sooperthemes.com/documentation" target="_blank">Documentation</a></li>';
        helpContent += '<li><a href="http://www.sooperthemes.com/dashboard/tickets" target="_blank">Support Forum</a></li>';
        helpContent += '</ul>'
        ContainerElement.baseclass.prototype.show_controls.apply(this, arguments);
        if (this.parent == null) {
          // Setting up the Glazed Container main controls
          $('<span title="' + title("Toggle editor") + '" class="control toggle-editor btn btn-default glyphicon glyphicon-eye-open" > </span>')
          .appendTo(this.controls)
            .click(function() {
              $(element.dom_element).toggleClass('glazed-editor');
              return false;
            });
          $('<span role="button" tabindex="0" title="' + title("Documentation and Support") + '" class="control glazed-help btn btn-default glyphicon glyphicon-question-sign glazed-builder-popover"> </span>')
          .appendTo(this.controls)
          .popover({
            html : true,
            placement: 'left',
            container: 'body',
            content: function() {
              return helpContent;
            },
            title: function() {
              return 'Support and Documentation';
            }
          });
          // $('<span title="' + title("Toggle animations") + '" class="control toggle-animations btn ' +
          //    'btn-default glyphicon glyphicon-play-circle" > </span>').appendTo(this.controls)
          //   .click(function() {
          //     $(element.dom_element).toggleClass('glazed-animations-disabled');
          //     return false;
          //   });
          $(this.controls).removeClass(p + 'btn-group-xs');
          $(this.controls).find('.edit').remove();
          $(this.controls).find('.copy').remove();
          $(this.controls).find('.clone').remove();
          $(this.controls).find('.remove').remove();
          $(this.controls).find('.js-animation').remove();
          $(this.controls).find('.drag-and-drop').attr('title', '');
          $(this.controls).find('.drag-and-drop').removeClass(p + 'glyphicon-move');
          $(this.controls).find('.drag-and-drop').removeClass('drag-and-drop');
        }
        if (this.saveable)
          $('<span title="' + title("Save container") + '" class="control save-container btn btn-success glyphicon glyphicon-save" > </span>').appendTo(this.controls).click({
            object: this
          }, this.click_save_container);
      }
    },
    get_my_shortcode: function() {
      return this.get_children_shortcode();
    },
    get_hover_styles: function(element) {
      var hover_styles = '';
      if (element.attrs['hover_style'] != '')
        hover_styles = element.get_hover_style();
      for (var i = 0; i < element.children.length; i++) {
        hover_styles = hover_styles + this.get_hover_styles(element.children[i]);
      }
      return hover_styles;
    },
    get_js: function(element) {
      var html = '';
      for (var url in element.js)
        html += '<script src="' + url + '"></script>\n';
      return html;
    },
    get_css: function(element) {
      var html = '';
      for (var url in element.css)
        html += '<link rel="stylesheet" type="text/css" href="' + url + '">\n';
      return html;
    },
    get_loader: function() {
      var element = this;

      function get_object_method_js(object, method, own) {
        if (own) {
          if (!object.hasOwnProperty(method))
            return '';
        }
        return method + ': ' + object[method].toString() + ",\n";
      }

      function get_object_property_js(object, property, own) {
        if (own) {
          if (!object.hasOwnProperty(property))
            return '';
        }
        return property + ': ' + JSON.stringify(object[property]) + ",\n";
      }

      function get_object_js(object, own) {
        var js = '{';
        for (var key in object) {
          if (own) {
            if (!object.hasOwnProperty(key))
              continue;
          }
          if ($.isFunction(object[key])) {
            js += get_object_method_js(object, key, own);
          }
          else {
            js += get_object_property_js(object, key, own);
          }
        }
        js += '}';
        return js;
      }

      function get_class_method_js(class_function, method, own) {
        if (own) {
          if (!class_function.prototype.hasOwnProperty(method))
            return '';
        }
        return class_function.name + '.prototype.' + method + '=' + class_function.prototype[method].toString() +
          "\n";
      }

      function get_class_property_js(class_function, property, own) {
        if (own) {
          if (!class_function.prototype.hasOwnProperty(property))
            return '';
        }
        return class_function.name + '.prototype.' + property + '=' + JSON.stringify(class_function.prototype[
          property]) + ";\n";
      }

      function get_class_js(class_function, own) {
        var js = '';
        js += class_function.toString() + "\n";
        if ('baseclass' in class_function) {
          js += extend.name + "(" + class_function.name + ", " + class_function.baseclass.name + ");\n";
        }
        for (var key in class_function.prototype) {
          if (own) {
            if (!class_function.prototype.hasOwnProperty(key))
              continue;
          }
          if ($.isFunction(class_function.prototype[key])) {
            js += get_class_method_js(class_function, key, own);
          }
          else {
            js += get_class_property_js(class_function, key, own);
          }
        }
        return js;
      }

      function get_element_params_js(class_function) {
        var params = [];
        for (var i = 0; i < class_function.prototype.params.length; i++) {
          var param = {};
          param.param_name = class_function.prototype.params[i].param_name;
          param.value = '';
          if ('value' in class_function.prototype.params[i] && _.isString(class_function.prototype.params[i].value))
            param.value = class_function.prototype.params[i].value;
          param.safe = class_function.prototype.params[i].safe;
          params.push(param);
        }
        return class_function.name + '.prototype.params=' + JSON.stringify(params) + ";\n";
      }

      function get_element_object_js(object, own) {
        var element = {};
        element.base = object.base;
        if ('showed' in object)
          element.showed = object.showed;
        element.params = [];
        for (var i = 0; i < object.params.length; i++) {
          if ('value' in object.params[i] && _.isString(object.params[i].value)) {
            var param = {};
            param.param_name = object.params[i].param_name;
            param.value = object.params[i].value;
            element.params.push(param);
          }
          else {
            var param = {};
            param.param_name = object.params[i].param_name;
            param.value = '';
            element.params.push(param);
          }
        }
        if (object.hasOwnProperty('is_container'))
          element.is_container = object.is_container;
        if (object.hasOwnProperty('has_content'))
          element.has_content = object.has_content;
        if (object.hasOwnProperty('frontend_render')) {
          element.frontend_render = object.frontend_render;
          if (element.frontend_render) {
            element.render = object.render;
            if (object.hasOwnProperty('recursive_render'))
              element.recursive_render = object.recursive_render;
          }
        }
        return get_object_js(element, own);
      }

      function get_contained_elements(element) {
        var bases = {};
        bases[element.base] = true;
        for (var i = 0; i < element.children.length; i++) {
          var b = get_contained_elements(element.children[i]);
          $.extend(bases, b);
        }
        return bases;
      }

      function check_attributes(element) {
        var attributes = {};
        if ('an_start' in element.attrs && element.attrs['an_start'] != '') {
          attributes['an_start'] = true;
        }
        for (var i = 0; i < element.children.length; i++) {
          $.extend(attributes, check_attributes(element.children[i]));
        }
        return attributes;
      }

      var bases = get_contained_elements(element);
      var attributes = check_attributes(element);

      function get_javascript() {
        var javascript = '';
       /*
        * IMPORTANT: DO NOT DELETE FOLLOWING COMMENTED CODE BLOCK
        *
        * Commented code is exported to glazed_frontend.js to prevent all this
        * code going into the raw fields along with custom js that is needed
        * for JS plugin initialisation, hover styles and animations.
        * Whene any of the here referenced methods and functions are changed the
        * output of the commented code should be used to update glazed_frontend.js
        * ~ Jur 06/07/2016
        *
        */
        // javascript += "(function($) {\n";
        // javascript += "if('glazed_backend' in window) return;\n";
        // javascript += "window.glazed_frontend = true;\n";
        // javascript += "window.glazed_elements = [];\n";
        // javascript += "window.glazed_extend = [];\n";
        // javascript += glazed_load_container.toString() + "\n";

        // javascript += extend.toString() + "\n";
        // javascript += mixin.toString() + "\n";
        // javascript += substr_replace.toString() + "\n";
        // javascript += unescapeParam.toString() + "\n";
        // javascript += "$.fn.closest_descendents = " + $.fn.closest_descendents.toString() + " \n";

        // javascript += BaseParamType.toString() + "\n";
        // javascript += BaseParamType.name + ".prototype.safe = true;\n";
        // javascript += BaseParamType.name + ".prototype.param_types = {};\n";

        // javascript += make_param_type.toString() + "\n";

        // javascript += 'window.glazed_add_css=' + window.glazed_add_css.toString() + "\n";
        // javascript += 'window.glazed_add_js=' + window.glazed_add_js.toString() + "\n";
        // javascript += 'window.glazed_add_js_list=' + window.glazed_add_js_list.toString() + "\n";
        // javascript += "var glazed_js_waiting_callbacks = {};\n";
        // javascript += "var glazed_loaded_js = {};\n";
        // javascript += 'window.glazed_add_external_js=' + window.glazed_add_external_js.toString() + "\n";

        // javascript += glazedElements.toString() + "\n";
        // javascript += glazedElements.name + ".prototype.elements_instances = {};\n";
        // javascript += glazedElements.name + ".prototype.elements_instances_by_an_name = {};\n";
        // javascript += get_class_method_js(glazedElements, 'get_element', true);
        // javascript += get_class_method_js(glazedElements, 'delete_element', true);
        // javascript += get_class_method_js(glazedElements, 'add_element', true);
        // javascript += get_class_method_js(glazedElements, 'try_render_unknown_elements', false);

        // javascript += BaseElement.toString() + "\n";
        // javascript += BaseElement.name + ".prototype.elements = {};\n";
        // javascript += BaseElement.name + ".prototype.tags = {};\n";
        // javascript += get_element_params_js(BaseElement);
        // javascript += get_class_method_js(BaseElement, 'get_hover_style', true);
        // javascript += get_class_method_js(BaseElement, 'showed', true);
        // javascript += get_class_method_js(BaseElement, 'render', true);
        // javascript += get_class_method_js(BaseElement, 'recursive_render', true);
        // javascript += get_class_method_js(BaseElement, 'replace_render', true);
        // javascript += get_class_method_js(BaseElement, 'update_dom', true);
        // javascript += get_class_method_js(BaseElement, 'attach_children', true);
        // javascript += get_class_method_js(BaseElement, 'detach_children', true);
        // javascript += get_class_method_js(BaseElement, 'recursive_showed', true);
        // javascript += get_class_method_js(BaseElement, 'parse_attrs', true);
        // javascript += get_class_method_js(BaseElement, 'parse_html', true);
        // javascript += get_class_method_js(BaseElement, 'add_css', true);
        // javascript += get_class_method_js(BaseElement, 'add_js_list', true);
        // javascript += get_class_method_js(BaseElement, 'add_js', true);
        // javascript += get_class_method_js(BaseElement, 'add_external_js', true);
        // javascript += get_class_method_js(BaseElement, 'get_my_container', true);
        // if ('an_start' in attributes) {
        //   javascript += get_class_method_js(BaseElement, 'trigger_start_in_animation', true);
        //   javascript += get_class_method_js(BaseElement, 'trigger_start_out_animation', true);
        // }
        // javascript += register_element.toString() + "\n";
        // javascript += UnknownElement.toString() + "\n";
        // javascript += register_element.name + "('az_unknown', true, " + UnknownElement.name + ");\n";
        // javascript += UnknownElement.name + ".prototype.has_content = true;\n";

        // // switched off for better loader js portability to new envs/urls ~ Jur 06/07/2016
        // // javascript += "window.glazed_baseurl = '" + window.glazed_baseurl + "';\n";
        // // if ('glazed_ajaxurl' in window)
        // //   javascript += "window.glazed_ajaxurl = '" + toAbsoluteURL(window.glazed_ajaxurl) + "';\n";
        // javascript +=
        //   "window.glazed_online = (window.location.protocol == 'http:' || window.location.protocol == 'https:');\n";
        // javascript += "var glazed_elements = new " + glazedElements.name + "();\n";
        // javascript += "var p = '';\n";
        // javascript += "var fp = '';\n";
        // javascript += "var scroll_magic = null;\n";
        // javascript += "window.glazed_editor = false;\n";
        // if ('glazed_exporter' in window)
        //   javascript += "window.glazed_exported = " + window.glazed_exporter.toString() + ";\n";
        // javascript += "var glazed_containers = [];\n";
        // javascript += "var glazed_containers_loaded = {};\n";
        // javascript += connect_container.toString() + "\n";

        // javascript += AnimatedElement.toString() + "\n";
        // javascript += extend.name + "(" + AnimatedElement.name + ", " + BaseElement.name + ");\n";
        // javascript += get_element_params_js(AnimatedElement);
        // if ('an_start' in attributes) {
        //   javascript += get_class_method_js(AnimatedElement, 'set_in_timeout', true);
        //   javascript += get_class_method_js(AnimatedElement, 'start_in_animation', true);
        //   javascript += get_class_method_js(AnimatedElement, 'set_out_timeout', true);
        //   javascript += get_class_method_js(AnimatedElement, 'start_out_animation', true);
        //   javascript += get_class_method_js(AnimatedElement, 'clear_animation', true);
        //   javascript += get_class_method_js(AnimatedElement, 'end_animation', true);
        //   javascript += get_class_method_js(AnimatedElement, 'trigger_start_in_animation', true);
        //   javascript += get_class_method_js(AnimatedElement, 'trigger_start_out_animation', true);
        //   javascript += get_class_method_js(AnimatedElement, 'animation', true);
        // }
        // if ('an_start' in attributes)
        //   javascript += get_class_method_js(AnimatedElement, 'showed', true);
        // javascript += get_class_method_js(AnimatedElement, 'render', true);
        // javascript += register_animated_element.toString() + "\n";

        // // javascript += FormDataElement.toString() + "\n";
        // // javascript += extend.name + "(" + FormDataElement.name + ", " + AnimatedElement.name + ");\n";
        // // javascript += FormDataElement.name + ".prototype.form_elements = {};\n";
        // // javascript += register_form_data_element.toString() + "\n";

        // if (SectionElement.prototype.base in bases) {
        //   javascript += SectionElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + SectionElement.prototype.base + "', true, " +
        //     SectionElement.name + ");\n";
        //   javascript += get_element_params_js(SectionElement);
        //   javascript += get_class_method_js(SectionElement, 'showed', true);
        // }

        // if (RowElement.prototype.base in bases) {
        //   javascript += RowElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + RowElement.prototype.base + "', true, " +
        //     RowElement.name + ");\n";
        //   javascript += get_element_params_js(RowElement);
        //   javascript += get_class_method_js(RowElement, 'showed', true);
        //   javascript += RowElement.name + ".prototype.set_columns = function(columns){};\n";
        //   javascript += ColumnElement.toString() + "\n";
        //   javascript += register_element.name + "('" + ColumnElement.prototype.base + "', true, " +
        //     ColumnElement.name + ");\n";
        //   javascript += get_element_params_js(ColumnElement);
        //   javascript += get_class_method_js(ColumnElement, 'showed', true);
        // }

        // if (ContainerElement.prototype.base in bases) {
        //   javascript += ContainerElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + ContainerElement.prototype.base + "', true, " +
        //     ContainerElement.name + ");\n";
        //   javascript += get_element_params_js(ContainerElement);
        //   javascript += get_class_method_js(ContainerElement, 'showed', true);
        //   javascript += get_class_method_js(ContainerElement, 'load_container', true);
        //   javascript += get_class_method_js(ContainerElement, 'update_dom', true);
        //   javascript += get_class_method_js(ContainerElement, 'render', true);
        //   javascript += get_class_method_js(ContainerElement, 'recursive_render', true);
        // }

        // if (LayersElement.prototype.base in bases) {
        //   javascript += LayersElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + LayersElement.prototype.base + "', true, " +
        //     LayersElement.name + ");\n";
        //   javascript += get_element_params_js(LayersElement);
        //   javascript += get_class_method_js(LayersElement, 'showed', true);
        // }

        // if (TabsElement.prototype.base in bases) {
        //   javascript += TabsElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + TabsElement.prototype.base + "', true, " +
        //     TabsElement.name + ");\n";
        //   javascript += get_element_params_js(TabsElement);
        //   javascript += get_class_method_js(TabsElement, 'showed', true);
        //   javascript += get_class_method_js(TabsElement, 'render', true);
        //   javascript += TabElement.toString() + "\n";
        //   javascript += register_element.name + "('" + TabElement.prototype.base + "', true, " + TabElement.name +
        //     ");\n";
        //   javascript += get_element_params_js(TabElement);
        //   javascript += get_class_method_js(TabElement, 'render', true);
        // }

        // if (AccordionElement.prototype.base in bases) {
        //   javascript += AccordionElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + AccordionElement.prototype.base + "', true, " +
        //     AccordionElement.name + ");\n";
        //   javascript += get_element_params_js(AccordionElement);
        //   javascript += get_class_method_js(AccordionElement, 'showed', true);
        //   javascript += get_class_method_js(AccordionElement, 'render', true);
        //   javascript += ToggleElement.toString() + "\n";
        //   javascript += register_element.name + "('" + ToggleElement.prototype.base + "', true, " +
        //     ToggleElement.name + ");\n";
        //   javascript += get_element_params_js(ToggleElement);
        //   javascript += get_class_method_js(ToggleElement, 'render', true);
        //   javascript += get_class_method_js(ToggleElement, 'showed', true);
        // }

        // if (CarouselElement.prototype.base in bases) {
        //   javascript += CarouselElement.toString() + "\n";
        //   javascript += register_animated_element.name + "('" + CarouselElement.prototype.base + "', true, " +
        //     CarouselElement.name + ");\n";
        //   javascript += get_element_params_js(CarouselElement);
        //   javascript += CarouselElement.name + ".prototype.frontend_render = true;\n";
        //   javascript += get_class_method_js(CarouselElement, 'showed', true);
        //   javascript += get_class_method_js(CarouselElement, 'render', true);
        //   javascript += SlideElement.toString() + "\n";
        //   javascript += register_element.name + "('" + SlideElement.prototype.base + "', true, " + SlideElement
        //     .name + ");\n";
        //   javascript += get_element_params_js(SlideElement);
        //   javascript += SlideElement.name + ".prototype.frontend_render = true;\n";
        //   javascript += get_class_method_js(SlideElement, 'showed', true);
        //   javascript += get_class_method_js(SlideElement, 'render', true);
        // }

        // javascript += "if (!('glazed_elements' in window)) { window.glazed_elements = []; }\n";
        // if ('glazed_elements' in window) {
        //   for (var i = 0; i < window.glazed_elements.length; i++) {
        //     // Modified this line to include all render and showed code in glazed_frontend.js
        //     if (true || window.glazed_elements[i].base in bases)
        //       javascript += "window.glazed_elements.push(" + get_element_object_js(window.glazed_elements[i],
        //         true) + ");\n";
        //   }
        // }

        // if ('glazed_extend' in window) {
        //   for (var i = 0; i < window.glazed_extend.length; i++) {
        //     javascript += "window.glazed_extend.push(" + get_object_js(window.glazed_extend[i], true) +
        //       ");\n";
        //   }
        // }
        // javascript += create_glazed_elements.toString() + "\n";
        // javascript += create_glazed_elements.name + "();\n";
        // javascript += make_glazed_extend.toString() + "\n";
        // javascript += make_glazed_extend.name + "();\n";
        // //        javascript += create_template_elements.toString() + "\n";
        // //        javascript += create_template_elements.name + "();\n";
        // //        javascript += create_cms_elements.toString() + "\n";
        // //        javascript += create_cms_elements.name + "();\n";

        // if (window.glazed_online) {
        //   hashCode = function(s) {
        //     return s.split("").reduce(function(a, b) {
        //       a = ((a << 5) - a) + b.charCodeAt(0);
        //       return a & a
        //     }, 0);
        //   }
        //   javascript += "$(document).ready(function(){connect_container($('[data-az-hash=\""
        //   + hashCode(javascript) + "\"]'));});\n";
        // }
        // else {
        //   var type = element.attrs['container'].split('/')[0];
        //   var name = element.attrs['container'].split('/')[1];
        //   javascript += "$(document).ready(function(){"
        //     + "connect_container($('[data-az-type=\""
        //     + type + "\"][data-az-name=\"" + name + "\"]'));});\n";
        // }

        // javascript += "})(window.jQuery);\n";

       /*
        * END GLAZED_FRONTEND.JS BLOCK
        */
        return javascript;
      }

     /*
      * See if this container needs glazed frontend rendering
      * A positive return will result in glazed loader javascript being added to the field value
      */
      function check_el_dynamic(element) {
        if ('an_start' in element.attrs && element.attrs['an_start'] != '') {
          animation = true;
          return true;
        }
        if (element.constructor.prototype.hasOwnProperty('showed')) {
          var js = true;
          if ('is_cms_element' in element || 'is_template_element' in element)
            js = false;
          switch (element.base) {
            case 'az_container':
              if (element.parent == null)
                js = false;
              break;
            case 'az_section':
              if (element.attrs['effect'] == '')
                js = false;
              break;
            case 'az_row':
              if (element.attrs['equal'] != 'yes')
                js = false;
              break;
            default:
              break;
          }
          if (js) {
            return true;
          }
        }
        for (var i = 0; i < element.children.length; i++) {
          if (check_el_dynamic(element.children[i])) {
            return true;
          }
        }
        return false;
      }
      var javascript = '';
      var url = '';
      if ('glazed_development' in window) {
        url = window.glazed_baseurl + 'glazed_frontend.js';
      }
      else {
        url = window.glazed_baseurl + 'glazed_frontend.min.js';
      }
      if (check_el_dynamic(element)) {
        javascript += "<script src=\"" + url + "\"></script>\n";
      }
      return javascript;
    },
    get_html: function() {
      this.recursive_update_data();
      this.recursive_clear_animation();
      var dom = $('<div>' + $(this.dom_content_element).html() + '</div>');
      this.recursive_restore(dom);
      $(dom).find('.az-element > .controls').remove();
      $(dom).find('> .controls').remove();
      $(dom).find('.az-sortable-controls').remove();
      $(dom).find('.az-empty').remove();
      $(dom).find('.ui-resizable-e').remove();
      $(dom).find('.ui-resizable-s').remove();
      $(dom).find('.ui-resizable-se').remove();

      // Removed ckeditor-inline elements.
      $(dom).find('.az-text .ckeditor-inline').each(function() {
        var $this = $(this);
        var content = $this.contents();
        $this.replaceWith(content);
      });
      $(dom).find('.az-text').removeClass('cke_editable cke_editable_inline cke_contents_ltr cke_show_borders');

      $(dom).find('.az-element--controls-center').removeClass('az-element--controls-center');
      $(dom).find('.az-element--controls-top-left').removeClass('az-element--controls-top-left');
      $(dom).find('.editable-highlight').removeClass('editable-highlight');
      $(dom).find('.styleable-highlight').removeClass('styleable-highlight');
      $(dom).find('.sortable-highlight').removeClass('sortable-highlight');
      $(dom).find('.ui-draggable').removeClass('ui-draggable');
      $(dom).find('.ui-resizable').removeClass('ui-resizable');
      $(dom).find('.ui-sortable').removeClass('ui-sortable');
      $(dom).find('.az-element.az-container > .az-ctnr').empty();
      $(dom).find('.az-element.az-cms-element').empty();

      // Remove iframe.
      $(dom).find('iframe.playerBox').remove();

      //$(dom).find('[data-az-id]').removeAttr('data-az-id');
      return $(dom).html();
    },
    get_container_html: function() {
      return this.get_html() + this.get_css(this) + this.get_hover_styles(this) + this.get_js(this) + this.get_loader();
    },
    click_save_container: function(e) {
      e.data.object.save_container();
      return false;
    },
    save_container: function() {
      var element = this;
      if ('html_content' in this || true) {
        glazed_add_js({
          path: 'jsON-js/json2.min.js',
          loaded: 'JSON' in window,
          callback: function() {
            var html = element.get_container_html();
            glazed_save_container(element.attrs['container'].split('/')[0], element.attrs['container'].split(
              '/')[1], html);
          }
        });
      }
      else {
        if (this.attrs['container'] != '') {
          var shortcode = this.get_children_shortcode();
          glazed_save_container(this.attrs['container'].split('/')[0], this.attrs['container'].split('/')[1],
            shortcode);
        }
      }
    },
    load_container: function() {
      var element = this;
      if (this.attrs['container'] != '') {
        glazed_load_container(this.attrs['container'].split('/')[0], this.attrs['container'].split('/')[1],
          function(shortcode) {
            var match = /^\s*\<[\s\S]*\>\s*$/.exec(shortcode);
            if (match) {
              element.loaded_container = element.attrs['container'];
              $(shortcode).appendTo(element.dom_content_element);
              $(element.dom_content_element).find('> script').detach().appendTo('head');
              $(element.dom_content_element).find('> link[href]').detach().appendTo('head');
              $(element.dom_element).css('display', '');
              $(element.dom_element).addClass('glazed');
              element.parse_html(element.dom_content_element);
              $(element.dom_element).attr('data-az-id', element.id);
              element.html_content = true;
              for (var i = 0; i < element.children.length; i++) {
                element.children[i].recursive_render();
              }
              element.dom_content_element.empty();
              if (window.glazed_editor) {
                element.show_controls();
                element.update_sortable();
              }
              element.attach_children();
              for (var i = 0; i < element.children.length; i++) {
                element.children[i].recursive_showed();
              }
              $(document).trigger('scroll');
            }
            else {
              if (!glazed_frontend) {
                element.loaded_container = element.attrs['container'];
                element.parse_shortcode(shortcode);

                $(element.dom_element).attr('data-az-id', element.id);
                if (window.glazed_editor) {
                  element.show_controls();
                  element.update_sortable();
                }
                for (var i = 0; i < element.children.length; i++) {
                  element.children[i].recursive_render();
                }
                element.attach_children();
                if (element.parent != null) {
                  element.parent.update_dom();
                }
                for (var i = 0; i < element.children.length; i++) {
                  element.children[i].recursive_showed();
                }
                $(document).trigger('scroll');
              }
            }
            glazed_elements.try_render_unknown_elements();
          });
      }
    },
    clone: function() {
      ContainerElement.baseclass.prototype.clone.apply(this, arguments);
      this.rendered = true;
    },
    recursive_render: function() {
      if (glazed_frontend) {
        this.render($);
        this.children = [];
      }
      else {
        ContainerElement.baseclass.prototype.recursive_render.apply(this, arguments);
      }
      if (window.glazed_editor) {
        this.show_controls();
        this.update_sortable();
      }
    },
    update_dom: function() {
      if (this.loaded_container != this.attrs['container']) {
        this.children = [];
        $(this.dom_content_element).empty();
        this.rendered = false;
        if (this.parent != null) {
          ContainerElement.baseclass.prototype.update_dom.apply(this, arguments);
        }
      }
    },
    showed: function($) {
      ContainerElement.baseclass.prototype.showed.apply(this, arguments);
      var element = this;
      if (this.parent == null) {
        if (!element.rendered) {
          element.rendered = true;
          element.load_container();
        }
      }
      else {
        this.add_js({
          path: 'vendor/jquery.waypoints/lib/jquery.waypoints.min.js',
          loaded: 'waypoint' in $.fn,
          callback: function() {
            $(element.dom_element).waypoint(function(direction) {
              if (!element.rendered) {
                element.rendered = true;
                element.load_container();
              }
            }, {
              offset: '100%',
              handler: function(direction) {
                this.destroy()
              },
            });
            $(document).trigger('scroll');
          }
        });
      }
    },
    render: function($) {
      if (this.attrs.container != '/') {
        this.dom_element = $('<div class="az-element az-container"><div class="az-ctnr"></div></div>');
        this.dom_content_element = $(this.dom_element).find('.az-ctnr');
        ContainerElement.baseclass.prototype.render.apply(this, arguments);
      }
    },
  });
