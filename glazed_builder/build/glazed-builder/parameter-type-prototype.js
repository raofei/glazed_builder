

  /**
   * Initiate ParamType base object.
   */
  function BaseParamType() {
    this.dom_element = null;
    this.heading = '';
    this.description = '';
    this.param_name = '';
    this.required = false;
    this.admin_label = '';
    this.holder = '';
    this.wrapper_class = '';
    this.value = null;
    this.can_be_empty = false;
    this.hidden = false;
    this.tab = '';
    this.dependency = {};
    if ('create' in this) {
      this.create();
    }
  }

  /**
   * Extend ParamType base object.
   */
  BaseParamType.prototype = {
    safe: true,
    param_types: {},
    /**
     * Generate modal window for element settings.
     */
    show_editor: function(params, element, callback) {
      $('#az-editor-modal').remove();
      var header = '<div class="modal-header"><span class="close" data-dismiss="modal" aria-hidden="true">&times;</span><h4 class="modal-title">' + element.name + ' ' + Drupal.t("settings") + '</h4></div>';
      var footer = '<div class="modal-footer"><span class="btn btn-default" data-dismiss="modal">' + Drupal.t("Close") +
        '</span><span class="save btn btn-primary">' + Drupal.t("Save changes") +
        '</span></div>';
      var modal = $('<div id="az-editor-modal" class="modal glazed"><div class="modal-dialog ' +
       'modal-lg"><div class="modal-content">' + header + '<div class="modal-body"></div>' + footer + '</div></div></div>').prependTo('body');
      var tabs = {};
      for (var i = 0; i < params.length; i++) {
        if (params[i].hidden)
          continue;
        params[i].element = element;
        if (params[i].tab in tabs) {
          tabs[params[i].tab].push(params[i]);
        }
        else {
          tabs[params[i].tab] = [params[i]];
        }
      }
      var tabs_form = $('<div id="az-editor-tabs"></div>');
      var i = 0;
      var menu = '<ul class="nav nav-tabs">';
      for (var title in tabs) {
        i++;
        if (title === '')
          title = Drupal.t('General');
        menu += '<li><a href="#az-editor-tab-' + i + '" data-toggle="tab">' + title + '</a></li>';
      }
      menu += '</ul>';
      $(tabs_form).append(menu);
      i = 0;
      var tabs_content = $('<form role="form" class="tab-content"></form>');
      for (var title in tabs) {
        i++;
        var tab = $('<div id="az-editor-tab-' + i + '" class="tab-pane"></div>');
        for (var j = 0; j < tabs[title].length; j++) {
          tabs[title][j].render(element.attrs[tabs[title][j].param_name]);
          $(tab).append(tabs[title][j].dom_element);
          //$(tab).append('<hr>');
        }
        $(tabs_content).append(tab);
      }
      $(tabs_form).append(tabs_content);
      $(modal).find('.modal-body').append(tabs_form);
      $('#az-editor-tabs a[href="#az-editor-tab-1"]')[fp + 'tab']('show');
      $('#az-editor-modal input[name="el_class"]').each(function() {
        multiple_chosen_select(BaseElement.prototype.el_classes, this, ' ');
      });
      for (var i = 0; i < params.length; i++) {
        if ('element' in params[i].dependency) {
          var param = null;
          for (var j = 0; j < params.length; j++) {
            if (params[j].param_name === params[i].dependency.element) {
              param = params[j];
              break;
            }
          }
          if ('is_empty' in params[i].dependency) {
            (function(i, param) {
              $(param.dom_element).find('[name="' + param.param_name + '"]').on('keyup change', function() {
                if (param.get_value() === '') {
                  params[i].display_none = false;
                  $(params[i].dom_element).css('display', 'block');
                  if ('callback' in params[i].dependency) {
                    params[i].dependency.callback.call(params[i], param);
                  }
                }
                else {
                  params[i].display_none = true;
                  $(params[i].dom_element).css('display', 'none');
                }
              }).trigger('change');
            })(i, param);
          }
          if ('not_empty' in params[i].dependency) {
            (function(i, param) {
              $(param.dom_element).find('[name="' + param.param_name + '"]').on('keyup change', function() {
                if (param.get_value() !== '') {
                  params[i].display_none = false;
                  $(params[i].dom_element).css('display', 'block');
                  if ('callback' in params[i].dependency) {
                    params[i].dependency.callback.call(params[i], param);
                  }
                }
                else {
                  params[i].display_none = true;
                  $(params[i].dom_element).css('display', 'none');
                }
              }).trigger('change');
            })(i, param);
          }
          if ('value' in params[i].dependency) {
            (function(i, param) {
              $(param.dom_element).find('[name="' + param.param_name + '"]').on('keyup change', function() {
                if (_.indexOf(params[i].dependency.value, param.get_value()) >= 0) {
                  params[i].display_none = false;
                  $(params[i].dom_element).css('display', 'block');
                  if ('callback' in params[i].dependency) {
                    params[i].dependency.callback.call(params[i], param);
                  }
                }
                else {
                  params[i].display_none = true;
                  $(params[i].dom_element).css('display', 'none');
                }
              }).trigger('change');
            })(i, param);
          }
        }
      }
      $('#az-editor-modal').one('shown.bs.modal', function(e) {
        $('body').addClass('modal-open');
        for (var i = 0; i < params.length; i++) {
          if (!params[i].hidden)
            params[i].opened();
        }
      });
      $('#az-editor-modal').one('hidden.bs.modal', function(e) {
        for (var i = 0; i < params.length; i++) {
          params[i].closed();
        }
        $(window).scrollTop(scrollTop);
        $(window).off('scroll.az-editor-modal');
        $('body').removeClass('modal-open');
      });
      $('#az-editor-modal').find('.save').click(function() {
        var values = {};
        for (var i = 0; i < params.length; i++) {
          if (params[i].hidden)
            continue;
          if (!('display_none' in params[i]) || ('display_none' in params[i] && !params[i].display_none))
            values[params[i].param_name] = params[i].get_value();
          if (params[i].required && values[params[i].param_name] == '') {
            $(params[i].dom_element).addClass('has-error');
            return false;
          }
        }
        $('#az-editor-modal')[fp + 'modal']("hide");
        callback.call(element, values);
        $(window).trigger('CKinlineAttach');
        return false;
      });
      $('#az-editor-modal').find('[data-dismiss="modal"]').click(function() {
        glazed_elements.edit_stack = [];
      });
      var scrollTop = $(window).scrollTop();
      $(window).on('scroll.az-editor-modal', function() {
        $(window).scrollTop(scrollTop);
      });
      $('#az-editor-modal')[fp + 'modal']('show');
    },
    opened: function() {},
    closed: function() {},
    render: function(value) {

    }
  };

 /**
   * Helper function to extend BaseParamType with new parameter types.
   */
  function register_param_type(type, ParamType) {
    extend(ParamType, BaseParamType);
    ParamType.prototype.type = type;
    BaseParamType.prototype.param_types[type] = ParamType;
  }

 /**
   * Create parameter in element
   */
  function make_param_type(settings) {
    if (settings.type in BaseParamType.prototype.param_types) {
      var new_param = new BaseParamType.prototype.param_types[settings.type];
      mixin(new_param, settings);
      return new_param;
    }
    else {
      var new_param = new BaseParamType();
      mixin(new_param, settings);
      return new_param;
    }
  }

 /**
  * Load all param_types from glazed_param_types.js, register and mix them
  */
  if ('glazed_param_types' in window) {
    for (var i = 0; i < window.glazed_param_types.length; i++) {
      var param_type = window.glazed_param_types[i];
      var ExternalParamType = function() {
        ExternalParamType.baseclass.apply(this, arguments);
      }
      register_param_type(param_type.type, ExternalParamType);
      param_type.baseclass = ExternalParamType.baseclass;
      mixin(ExternalParamType.prototype, param_type);
    }
  }
