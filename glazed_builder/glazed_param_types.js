(function($) {
  var p = '';
  var fp = '';
  if ('glazed_prefix' in window) {
    p = window.glazed_prefix;
    fp = window.glazed_prefix.replace('-', '_');
  }

  function toAbsoluteURL(url) {
    if (url.search(/^\/\//) != -1) {
      return window.location.protocol + url
    }
    if (url.search(/:\/\//) != -1) {
      return url
    }
    if (url.search(/^\//) != -1) {
      return window.location.origin + url
    }
    var base = window.location.href.match(/(.*\/)/)[0]
    return base + url
  }

  function t(text) {
    if ('glazed_t' in window) {
      return window.glazed_t(text);
    }
    else {
      return text;
    }
  }

  window.glazed_open_popup = function(url) {
    window.open(url, '', 'location,width=800,height=600,top=0');
  }

  function chosen_select(options, input) {
    var single_select = '<select>';
    for (var key in options) {
      single_select = single_select + '<option value="' + key + '">"' + options[key] + '"</option>';
    }
    single_select = single_select + '</select>';
    $(input).css('display', 'none');
    var select = $(single_select).insertAfter(input);
    if ($(input).val().length) {
      $(select).append('<option value=""></option>');
      var value = $(input).val();
      if (!$(select).find('option[value="' + value + '"]').length) {
        $(select).append('<option value="' + value + '">"' + value + '"</option>');
      }
      $(select).find('option[value="' + value + '"]').attr("selected", "selected");
    }
    else {
      $(select).append('<option value="" selected></option>');
    }
    $(select).chosen({
      search_contains: true,
      allow_single_deselect: true,
    });
    $(select).change(function() {
      $(this).find('option:selected').each(function() {
        $(input).val($(this).val());
      });
    });
    $(select).parent().find('.chosen-container').width('100%');
    $('<div><a class="direct-input" href="#">' + Drupal.t("Switch to custom text input") + '</a></div>').insertBefore(select).click(
      function() {
        $(input).css('display', 'block');
        $(select).parent().find('.chosen-container').remove();
        $(select).remove();
        $(this).remove();
      });
    return select;
  }

  function multiple_chosen_select(options, input, delimiter) {
    var multiple_select = '<select multiple="multiple">';
    var optgroup = '';
    for (var key in options) {
      if (key.indexOf("optgroup") >= 0) {
        if (optgroup == '') {
          multiple_select = multiple_select + '</optgroup>';
        }
        multiple_select = multiple_select + '<optgroup label="' + options[key] + '">';
        optgroup = options[key];
        continue;
      }
      multiple_select = multiple_select + '<option value="' + key + '">"' + options[key] + '"</option>';
    }
    if (optgroup != '') {
      multiple_select = multiple_select + '</optgroup>';
    }
    multiple_select = multiple_select + '</select>';
    $(input).css('display', 'none');
    var select = $(multiple_select).insertAfter(input);
    if ($(input).val().length) {
      var values = $(input).val().split(delimiter);
      for (var i = 0; i < values.length; i++) {
        if (!$(select).find('option[value="' + values[i] + '"]').length) {
          $(select).append('<option value="' + values[i] + '">"' + values[i] + '"</option>');
        }
        $(select).find('option[value="' + values[i] + '"]').attr("selected", "selected");
      }
    }
    $(select).chosen({
      search_contains: true,
    });
    $(select).change(function() {
      var selected = [];
      $(this).find('option:selected').each(function() {
        selected.push($(this).val());
      });
      $(input).val(selected.join(delimiter));
    });
    $(select).parent().find('.chosen-container').width('100%');
    $('<div><a class="direct-input" href="#">' + Drupal.t("Switch to custom text input") + '</a></div>').insertBefore(select).click(
      function() {
        $(input).css('display', 'block');
        $(select).parent().find('.chosen-container').remove();
        $(select).remove();
        $(this).remove();
      });
    return select;
  }

  function image_select(input) {
    images_select(input, '');
  }

  function images_select(input, delimiter) {
    if ('images_select' in window) {
      window.images_select(input, delimiter);
    }
    else {
      // 23/12/2016 removed code for proprietary file manager ~Jur
    }
  }

  function colorpicker(input) {
    if ('wpColorPicker' in $.fn) {
      $(input).wpColorPicker();
      _.defer(function() {
        $(input).wpColorPicker({
          change: _.throttle(function() {
            $(input).trigger('change');
          }, 1000)
        });
      });
    }
    else {
      window.wpColorPickerL10n = {
        "clear": Drupal.t("Clear"),
        "defaultString": Drupal.t("Default"),
        "pick": Drupal.t("Select Color"),
        "current": Drupal.t("Current Color")
      }
      glazed_add_js({
        path: 'vendor/jquery.iris/dist/iris.min.js?v1',
        callback: function() {
          glazed_add_js({
            path: 'js/glazed.iris.min.js',
            callback: function() {
              glazed_add_css('css/color-picker.min.css', function() {
                $(input).wpColorPicker();
              });
            }
          });
        }
      });
    }
  }

  function nouislider(slider, min, max, value, step, target) {
    glazed_add_css('vendor/noUiSlider/jquery.nouislider.min.css', function() {});
    glazed_add_js({
      path: 'vendor/noUiSlider/jquery.nouislider.min.js',
      callback: function() {
        $(slider).noUiSlider({
          start: [(value == '' || isNaN(parseFloat(value)) || value == 'NaN') ? min : parseFloat(value)],
          step: parseFloat(step),
          range: {
            min: [parseFloat(min)],
            max: [parseFloat(max)]
          },
        }).on('change', function() {
          $(target).val($(slider).val());
        });
      }
    });
  }

  function initBootstrapSlider(slider, min, max, value, step, formatter) {
    glazed_add_css('vendor/bootstrap-slider/bootstrap-slider.min.css', function() {});
    glazed_add_js({
      path: 'vendor/bootstrap-slider/bootstrap-slider.min.js',
      callback: function () {
        if (formatter) {
          $(slider).bootstrapSlider({
            step: parseFloat(step),
            min: parseFloat(min),
            max: parseFloat(max),
            tooltip: 'show',
            value: (value == '' || isNaN(parseFloat(value)) || value == 'NaN') ? min : parseFloat(value),
            formatter: function (value) {
              return value + ' px';
            },
          });
        } else {
          $(slider).bootstrapSlider({
            step: parseFloat(step),
            min: parseFloat(min),
            max: parseFloat(max),
            tooltip: 'show',
            value: (value == '' || isNaN(parseFloat(value)) || value == 'NaN') ? min : parseFloat(value),
          });
        }
      }
    });
  }

  function initBootstrapSwitch(element) {
    glazed_add_css('vendor/bootstrap-switch/bootstrap-switch.min.css', function () {
    });
    glazed_add_js({
      path: 'vendor/bootstrap-switch/bootstrap-switch.min.js',
      callback: function () {
        $(element).find('[type="checkbox"]').bootstrapSwitch({
          onColor: "success",
          onText: "On",
          offText: "Off",
          size: "small",
        }).on('switchChange.bootstrapSwitch', function(event, state) {
          $(this).trigger('change');
        });
      }
    });
  }

  function render_image(value, width, height) {
    if ($.isNumeric(width))
      width = width + 'px';
    if ($.isNumeric(height))
      height = height + 'px';
    var img = $('<div style="background-image: url(' + encodeURI(value) + ');" data-src="' + value + '" ></div>');
    if (width.length > 0)
      $(img).css('width', width);
    if (height.length > 0)
      $(img).css('height', height);
    return img;
  }

  var icons = [];
  if ('glazed_icons' in window)
    icons = window.glazed_icons;

  var glazed_param_types = [

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

  {
    type: 'checkbox',
    get_value: function() {
      var values = [];
      _.each($(this.dom_element).find('input[name="' + this.param_name + '"]:checked'), function(obj) {
        values.push($(obj).val());
      });
      return values.join(',');
    },
    render: function(value) {
      if (value == null)
        value = '';
      var values = value.split(',');
      var inputs = '';
      var count = Object.keys(this.value).length;
      if (count == 1) {
        for (var name in this.value) {
          if (_.indexOf(values, name) >= 0) {
            inputs += '<div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" checked value="' + name + '"></div>';
          }
          else {
            inputs += '<div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" value="' + name + '"></div>';
          }
        }
        this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div class="wrap-checkbox">' + inputs +
          '</div><p class="help-block">' + this.description + '</p>');
        initBootstrapSwitch(this.dom_element);
      } else {
        for (var name in this.value) {
          if (_.indexOf(values, name) >= 0) {
            inputs += '<div class="checkbox"><label><input name="' + this.param_name +
              '" type="checkbox" checked value="' + name + '">' + this.value[name] + '</label></div>';
          }
          else {
            inputs += '<div class="checkbox"><label><input name="' + this.param_name +
              '" type="checkbox" value="' + name + '">' + this.value[name] + '</label></div>';
          }
        }
        this.dom_element = $('<div class="form-group"><label>' + this.heading + '</label><div class="wrap-checkbox">' + inputs +
          '</div><p class="help-block">' + this.description + '</p>');
      }
    }
  },

  {
    type: 'checkboxes',
      get_value: function() {
      var values = [];
      _.each($(this.dom_element).find('input[name="' + this.param_name + '"]:checked'), function(obj) {
        values.push($(obj).val());
      });
      return values.join(',');
    },
    render: function(value) {
      if (value == null)
        value = '';
      var values = value.split(',');
      var inputs = '';
      if (value == '') {
        for (var name in this.value) {
          inputs += '<label>' + this.value[name] + '</label><div class="wrap-checkbox"><div class="checkbox"><input name="' + this.param_name +
            '" type="checkbox" checked value="' + name + '"></div></div>';
        }
      } else {
        for (var name in this.value) {
          if (_.indexOf(values, name) >= 0) {
            inputs += '<label>' + this.value[name] + '</label><div class="wrap-checkbox"><div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" checked value="' + name + '"></div></div>';
          }
          else {
            inputs += '<label>' + this.value[name] + '</label><div class="wrap-checkbox"><div class="checkbox"><input name="' + this.param_name +
              '" type="checkbox" value="' + name + '"></div></div>';
          }
        }
      }
      this.dom_element = $('<div class="form-group">' + inputs +
        '<p class="help-block">' + this.description + '</p>');
      initBootstrapSwitch(this.dom_element);
    }
  },

  {
    type: 'colorpicker',
    get_value: function() {
      return $(this.dom_element).find('#' + this.id).val();
    },
    render: function(value) {
      this.id = _.uniqueId();
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input id="' + this.id + '" name="' + this.param_name + '" type="text" value="' + value +
        '"></div><p class="help-block">' + this.description + '</p></div>');
    },
    opened: function() {
      colorpicker('#' + this.id);
    },
  },

  {
    type: 'css',
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
          aceeditor.getSession().setMode("ace/mode/css");
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

  {
    type: 'google_font',
    hidden: !'glazed_google_fonts' in window,
    get_value: function() {
      var font = $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
      var subset = $(this.dom_element).find('input[name="' + this.param_name + '_subset"]').val();
      var variant = $(this.dom_element).find('input[name="' + this.param_name + '_variant"]').val();
      return font + '|' + subset + '|' + variant;
    },
    render: function(value) {
      var font = '';
      var subset = '';
      var variant = '';
      if (_.isString(value) && value != '' && value.split('|').length == 3) {
        font = value.split('|')[0];
        subset = value.split('|')[1];
        variant = value.split('|')[2];
      }
      var font_input = '<div class="col-sm-4"><label>' + this.heading + '</label><input class="form-control" name="' + this.param_name + '" type="text" value="' + font + '"></div>';
      var subset_input = '<div class="col-sm-4"><label>' + Drupal.t('Subset') + '</label><input class="form-control" name="' + this.param_name + '_subset" type="text" value="' + subset + '"></div>';
      var variant_input = '<div class="col-sm-4"><label>' + Drupal.t('Variant') + '</label><input class="' +
        'form-control" name="' + this.param_name + '_variant" type="text" value="' + variant + '"></div>';
      this.dom_element = $('<div class="form-group"><div class="row">' + font_input +
        subset_input + variant_input + '</div><p class="help-block">' + this.description +
        '</p></div>');
    },
    opened: function() {
      var element = this;
      var fonts = Object.keys(window.glazed_google_fonts);
      fonts = _.object(fonts, fonts);
      var font_select = null;
      var subset_select = null;
      var variant_select = null;
      font_select = chosen_select(fonts, $(this.dom_element).find('input[name="' + this.param_name + '"]'));
      $(font_select).chosen().change(function() {
        var f = Object.keys(window.glazed_google_fonts)[0];
        if ($(this).val() in window.glazed_google_fonts)
          f = window.glazed_google_fonts[$(this).val()];
        var subsets = {};
        for (var i = 0; i < f.subsets.length; i++) {
          subsets[f.subsets[i].id] = f.subsets[i].name;
        }
        var variants = {};
        for (var i = 0; i < f.variants.length; i++) {
          variants[f.variants[i].id] = f.variants[i].name;
        }

        $(subset_select).parent().find('.direct-input').click();
        subset_select = chosen_select(subsets, $(element.dom_element).find('input[name="' + element.param_name +
          '_subset"]'));

        $(variant_select).parent().find('.direct-input').click();
        variant_select = chosen_select(variants, $(element.dom_element).find('input[name="' + element.param_name +
          '_variant"]'));
      });
      $(font_select).chosen().trigger('change');
    },
  },

  {
    type: 'html',
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
          aceeditor.getSession().setMode("ace/mode/html");
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

  {
    type: 'icon',
    icons: [
    // Glyphicons
    'glyphicon glyphicon-asterisk', 'glyphicon glyphicon-plus', 'glyphicon glyphicon-euro',
    'glyphicon glyphicon-minus', 'glyphicon glyphicon-cloud', 'glyphicon glyphicon-envelope',
    'glyphicon glyphicon-pencil', 'glyphicon glyphicon-glass', 'glyphicon glyphicon-music',
    'glyphicon glyphicon-search', 'glyphicon glyphicon-heart', 'glyphicon glyphicon-star',
    'glyphicon glyphicon-star-empty', 'glyphicon glyphicon-user', 'glyphicon glyphicon-film',
    'glyphicon glyphicon-th-large', 'glyphicon glyphicon-th', 'glyphicon glyphicon-th-list',
    'glyphicon glyphicon-ok', 'glyphicon glyphicon-remove', 'glyphicon glyphicon-zoom-in',
    'glyphicon glyphicon-zoom-out', 'glyphicon glyphicon-off', 'glyphicon glyphicon-signal',
    'glyphicon glyphicon-cog', 'glyphicon glyphicon-trash', 'glyphicon glyphicon-home',
    'glyphicon glyphicon-file', 'glyphicon glyphicon-time', 'glyphicon glyphicon-road',
    'glyphicon glyphicon-download-alt', 'glyphicon glyphicon-download', 'glyphicon glyphicon-upload',
    'glyphicon glyphicon-inbox', 'glyphicon glyphicon-play-circle', 'glyphicon glyphicon-repeat',
    'glyphicon glyphicon-refresh', 'glyphicon glyphicon-list-alt', 'glyphicon glyphicon-lock',
    'glyphicon glyphicon-flag', 'glyphicon glyphicon-headphones', 'glyphicon glyphicon-volume-off',
    'glyphicon glyphicon-volume-down', 'glyphicon glyphicon-volume-up', 'glyphicon glyphicon-qrcode',
    'glyphicon glyphicon-barcode', 'glyphicon glyphicon-tag', 'glyphicon glyphicon-tags',
    'glyphicon glyphicon-book', 'glyphicon glyphicon-bookmark', 'glyphicon glyphicon-print',
    'glyphicon glyphicon-camera', 'glyphicon glyphicon-font', 'glyphicon glyphicon-bold',
    'glyphicon glyphicon-italic', 'glyphicon glyphicon-text-height', 'glyphicon glyphicon-text-width',
    'glyphicon glyphicon-align-left', 'glyphicon glyphicon-align-center', 'glyphicon glyphicon-align-right',
    'glyphicon glyphicon-align-justify', 'glyphicon glyphicon-list', 'glyphicon glyphicon-indent-left',
    'glyphicon glyphicon-indent-right', 'glyphicon glyphicon-facetime-video', 'glyphicon glyphicon-picture',
    'glyphicon glyphicon-map-marker', 'glyphicon glyphicon-adjust', 'glyphicon glyphicon-tint',
    'glyphicon glyphicon-edit', 'glyphicon glyphicon-share', 'glyphicon glyphicon-check',
    'glyphicon glyphicon-move', 'glyphicon glyphicon-step-backward', 'glyphicon glyphicon-fast-backward',
    'glyphicon glyphicon-backward', 'glyphicon glyphicon-play', 'glyphicon glyphicon-pause',
    'glyphicon glyphicon-stop', 'glyphicon glyphicon-forward', 'glyphicon glyphicon-fast-forward',
    'glyphicon glyphicon-step-forward', 'glyphicon glyphicon-eject', 'glyphicon glyphicon-chevron-left',
    'glyphicon glyphicon-chevron-right', 'glyphicon glyphicon-plus-sign', 'glyphicon glyphicon-minus-sign',
    'glyphicon glyphicon-remove-sign', 'glyphicon glyphicon-ok-sign', 'glyphicon glyphicon-question-sign',
    'glyphicon glyphicon-info-sign', 'glyphicon glyphicon-screenshot', 'glyphicon glyphicon-remove-circle',
    'glyphicon glyphicon-ok-circle', 'glyphicon glyphicon-ban-circle', 'glyphicon glyphicon-arrow-left',
    'glyphicon glyphicon-arrow-right', 'glyphicon glyphicon-arrow-up', 'glyphicon glyphicon-arrow-down',
    'glyphicon glyphicon-share-alt', 'glyphicon glyphicon-resize-full', 'glyphicon glyphicon-resize-small',
    'glyphicon glyphicon-exclamation-sign', 'glyphicon glyphicon-gift', 'glyphicon glyphicon-leaf',
    'glyphicon glyphicon-fire', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-eye-close',
    'glyphicon glyphicon-warning-sign', 'glyphicon glyphicon-plane', 'glyphicon glyphicon-calendar',
    'glyphicon glyphicon-random', 'glyphicon glyphicon-comment', 'glyphicon glyphicon-magnet',
    'glyphicon glyphicon-chevron-up', 'glyphicon glyphicon-chevron-down', 'glyphicon glyphicon-retweet',
    'glyphicon glyphicon-shopping-cart', 'glyphicon glyphicon-folder-close',
    'glyphicon glyphicon-folder-open', 'glyphicon glyphicon-resize-vertical',
    'glyphicon glyphicon-resize-horizontal', 'glyphicon glyphicon-hdd', 'glyphicon glyphicon-bullhorn',
    'glyphicon glyphicon-bell', 'glyphicon glyphicon-certificate', 'glyphicon glyphicon-thumbs-up',
    'glyphicon glyphicon-thumbs-down', 'glyphicon glyphicon-hand-right', 'glyphicon glyphicon-hand-left',
    'glyphicon glyphicon-hand-up', 'glyphicon glyphicon-hand-down', 'glyphicon glyphicon-circle-arrow-right',
    'glyphicon glyphicon-circle-arrow-left', 'glyphicon glyphicon-circle-arrow-up',
    'glyphicon glyphicon-circle-arrow-down', 'glyphicon glyphicon-globe', 'glyphicon glyphicon-wrench',
    'glyphicon glyphicon-tasks', 'glyphicon glyphicon-filter', 'glyphicon glyphicon-briefcase',
    'glyphicon glyphicon-fullscreen', 'glyphicon glyphicon-dashboard', 'glyphicon glyphicon-paperclip',
    'glyphicon glyphicon-heart-empty', 'glyphicon glyphicon-link', 'glyphicon glyphicon-phone',
    'glyphicon glyphicon-pushpin', 'glyphicon glyphicon-usd', 'glyphicon glyphicon-gbp',
    'glyphicon glyphicon-sort', 'glyphicon glyphicon-sort-by-alphabet',
    'glyphicon glyphicon-sort-by-alphabet-alt', 'glyphicon glyphicon-sort-by-order',
    'glyphicon glyphicon-sort-by-order-alt', 'glyphicon glyphicon-sort-by-attributes',
    'glyphicon glyphicon-sort-by-attributes-alt', 'glyphicon glyphicon-unchecked',
    'glyphicon glyphicon-expand', 'glyphicon glyphicon-collapse-down', 'glyphicon glyphicon-collapse-up',
    'glyphicon glyphicon-log-in', 'glyphicon glyphicon-flash', 'glyphicon glyphicon-log-out',
    'glyphicon glyphicon-new-window', 'glyphicon glyphicon-record', 'glyphicon glyphicon-save',
    'glyphicon glyphicon-open', 'glyphicon glyphicon-saved', 'glyphicon glyphicon-import',
    'glyphicon glyphicon-export', 'glyphicon glyphicon-send', 'glyphicon glyphicon-floppy-disk',
    'glyphicon glyphicon-floppy-saved', 'glyphicon glyphicon-floppy-remove',
    'glyphicon glyphicon-floppy-save', 'glyphicon glyphicon-floppy-open', 'glyphicon glyphicon-credit-card',
    'glyphicon glyphicon-transfer', 'glyphicon glyphicon-cutlery', 'glyphicon glyphicon-header',
    'glyphicon glyphicon-compressed', 'glyphicon glyphicon-earphone', 'glyphicon glyphicon-phone-alt',
    'glyphicon glyphicon-tower', 'glyphicon glyphicon-stats', 'glyphicon glyphicon-sd-video',
    'glyphicon glyphicon-hd-video', 'glyphicon glyphicon-subtitles', 'glyphicon glyphicon-sound-stereo',
    'glyphicon glyphicon-sound-dolby', 'glyphicon glyphicon-sound-5-1', 'glyphicon glyphicon-sound-6-1',
    'glyphicon glyphicon-sound-7-1', 'glyphicon glyphicon-copyright-mark',
    'glyphicon glyphicon-registration-mark', 'glyphicon glyphicon-cloud-download',
    'glyphicon glyphicon-cloud-upload', 'glyphicon glyphicon-tree-conifer',
    'glyphicon glyphicon-tree-deciduous',
    // ET Line icons
    'et et-icon-mobile', 'et et-icon-laptop', 'et et-icon-desktop', 'et et-icon-tablet', 'et et-icon-phone',
    'et et-icon-document', 'et et-icon-documents', 'et et-icon-search', 'et et-icon-clipboard',
    'et et-icon-newspaper', 'et et-icon-notebook', 'et et-icon-book-open', 'et et-icon-browser',
    'et et-icon-calendar', 'et et-icon-presentation', 'et et-icon-picture', 'et et-icon-pictures',
    'et et-icon-video', 'et et-icon-camera', 'et et-icon-printer', 'et et-icon-toolbox',
    'et et-icon-briefcase', 'et et-icon-wallet', 'et et-icon-gift', 'et et-icon-bargraph', 'et et-icon-grid',
    'et et-icon-expand', 'et et-icon-focus', 'et et-icon-edit', 'et et-icon-adjustments', 'et et-icon-ribbon',
    'et et-icon-hourglass', 'et et-icon-lock', 'et et-icon-megaphone', 'et et-icon-shield',
    'et et-icon-trophy', 'et et-icon-flag', 'et et-icon-map', 'et et-icon-puzzle', 'et et-icon-basket',
    'et et-icon-envelope', 'et et-icon-streetsign', 'et et-icon-telescope', 'et et-icon-gears',
    'et et-icon-key', 'et et-icon-paperclip', 'et et-icon-attachment', 'et et-icon-pricetags',
    'et et-icon-lightbulb', 'et et-icon-layers', 'et et-icon-pencil', 'et et-icon-tools',
    'et et-icon-tools-2', 'et et-icon-scissors', 'et et-icon-paintbrush', 'et et-icon-magnifying-glass',
    'et et-icon-circle-compass', 'et et-icon-linegraph', 'et et-icon-mic', 'et et-icon-strategy',
    'et et-icon-beaker', 'et et-icon-caution', 'et et-icon-recycle', 'et et-icon-anchor',
    'et et-icon-profile-male', 'et et-icon-profile-female', 'et et-icon-bike', 'et et-icon-wine',
    'et et-icon-hotairballoon', 'et et-icon-globe', 'et et-icon-genius', 'et et-icon-map-pin',
    'et et-icon-dial', 'et et-icon-chat', 'et et-icon-heart', 'et et-icon-cloud', 'et et-icon-upload',
    'et et-icon-download', 'et et-icon-target', 'et et-icon-hazardous', 'et et-icon-piechart',
    'et et-icon-speedometer', 'et et-icon-global', 'et et-icon-compass', 'et et-icon-lifesaver',
    'et et-icon-clock', 'et et-icon-aperture', 'et et-icon-quote', 'et et-icon-scope',
    'et et-icon-alarmclock', 'et et-icon-refresh', 'et et-icon-happy', 'et et-icon-sad',
    'et et-icon-facebook', 'et et-icon-twitter', 'et et-icon-googleplus', 'et et-icon-rss',
    'et et-icon-tumblr', 'et et-icon-linkedin', 'et et-icon-dribbble',
    // Font Awesome
    'fa fa-500px', 'fa fa-address-book', 'fa fa-address-book-o', 'fa fa-address-card', 'fa fa-address-card-o', 'fa fa-adjust', 'fa fa-adn', 'fa fa-align-center', 'fa fa-align-justify', 'fa fa-align-left', 'fa fa-align-right', 'fa fa-amazon', 'fa fa-ambulance', 'fa fa-american-sign-language-interpreting', 'fa fa-anchor', 'fa fa-android', 'fa fa-angellist', 'fa fa-angle-double-down', 'fa fa-angle-double-left', 'fa fa-angle-double-right', 'fa fa-angle-double-up', 'fa fa-angle-down', 'fa fa-angle-left', 'fa fa-angle-right', 'fa fa-angle-up', 'fa fa-apple', 'fa fa-archive', 'fa fa-area-chart', 'fa fa-arrow-circle-down', 'fa fa-arrow-circle-left', 'fa fa-arrow-circle-o-down', 'fa fa-arrow-circle-o-left', 'fa fa-arrow-circle-o-right', 'fa fa-arrow-circle-o-up', 'fa fa-arrow-circle-right', 'fa fa-arrow-circle-up', 'fa fa-arrow-down', 'fa fa-arrow-left', 'fa fa-arrow-right', 'fa fa-arrow-up', 'fa fa-arrows', 'fa fa-arrows-alt', 'fa fa-arrows-h', 'fa fa-arrows-v', 'fa fa-assistive-listening-systems', 'fa fa-asterisk', 'fa fa-at', 'fa fa-audio-description', 'fa fa-backward', 'fa fa-balance-scale', 'fa fa-ban', 'fa fa-bandcamp', 'fa fa-bar-chart', 'fa fa-barcode', 'fa fa-bars', 'fa fa-bath', 'fa fa-battery-empty', 'fa fa-battery-full', 'fa fa-battery-half', 'fa fa-battery-quarter', 'fa fa-battery-three-quarters', 'fa fa-bed', 'fa fa-beer', 'fa fa-behance', 'fa fa-behance-square', 'fa fa-bell', 'fa fa-bell-o', 'fa fa-bell-slash', 'fa fa-bell-slash-o', 'fa fa-bicycle', 'fa fa-binoculars', 'fa fa-birthday-cake', 'fa fa-bitbucket', 'fa fa-bitbucket-square', 'fa fa-black-tie', 'fa fa-blind', 'fa fa-bluetooth', 'fa fa-bluetooth-b', 'fa fa-bold', 'fa fa-bolt', 'fa fa-bomb', 'fa fa-book', 'fa fa-bookmark', 'fa fa-bookmark-o', 'fa fa-braille', 'fa fa-briefcase', 'fa fa-btc', 'fa fa-bug', 'fa fa-building', 'fa fa-building-o', 'fa fa-bullhorn', 'fa fa-bullseye', 'fa fa-bus', 'fa fa-buysellads', 'fa fa-calculator', 'fa fa-calendar', 'fa fa-calendar-check-o', 'fa fa-calendar-minus-o', 'fa fa-calendar-o', 'fa fa-calendar-plus-o', 'fa fa-calendar-times-o', 'fa fa-camera', 'fa fa-camera-retro', 'fa fa-car', 'fa fa-caret-down', 'fa fa-caret-left', 'fa fa-caret-right', 'fa fa-caret-square-o-down', 'fa fa-caret-square-o-left', 'fa fa-caret-square-o-right', 'fa fa-caret-square-o-up', 'fa fa-caret-up', 'fa fa-cart-arrow-down', 'fa fa-cart-plus', 'fa fa-cc', 'fa fa-cc-amex', 'fa fa-cc-diners-club', 'fa fa-cc-discover', 'fa fa-cc-jcb', 'fa fa-cc-mastercard', 'fa fa-cc-paypal', 'fa fa-cc-stripe', 'fa fa-cc-visa', 'fa fa-certificate', 'fa fa-chain-broken', 'fa fa-check', 'fa fa-check-circle', 'fa fa-check-circle-o', 'fa fa-check-square', 'fa fa-check-square-o', 'fa fa-chevron-circle-down', 'fa fa-chevron-circle-left', 'fa fa-chevron-circle-right', 'fa fa-chevron-circle-up', 'fa fa-chevron-down', 'fa fa-chevron-left', 'fa fa-chevron-right', 'fa fa-chevron-up', 'fa fa-child', 'fa fa-chrome', 'fa fa-circle', 'fa fa-circle-o', 'fa fa-circle-o-notch', 'fa fa-circle-thin', 'fa fa-clipboard', 'fa fa-clock-o', 'fa fa-clone', 'fa fa-cloud', 'fa fa-cloud-download', 'fa fa-cloud-upload', 'fa fa-code', 'fa fa-code-fork', 'fa fa-codepen', 'fa fa-codiepie', 'fa fa-coffee', 'fa fa-cog', 'fa fa-cogs', 'fa fa-columns', 'fa fa-comment', 'fa fa-comment-o', 'fa fa-commenting', 'fa fa-commenting-o', 'fa fa-comments', 'fa fa-comments-o', 'fa fa-compass', 'fa fa-compress', 'fa fa-connectdevelop', 'fa fa-contao', 'fa fa-copyright', 'fa fa-creative-commons', 'fa fa-credit-card', 'fa fa-credit-card-alt', 'fa fa-crop', 'fa fa-crosshairs', 'fa fa-css3', 'fa fa-cube', 'fa fa-cubes', 'fa fa-cutlery', 'fa fa-dashcube', 'fa fa-database', 'fa fa-deaf', 'fa fa-delicious', 'fa fa-desktop', 'fa fa-deviantart', 'fa fa-diamond', 'fa fa-digg', 'fa fa-dot-circle-o', 'fa fa-download', 'fa fa-dribbble', 'fa fa-dropbox', 'fa fa-drupal', 'fa fa-edge', 'fa fa-eercast', 'fa fa-eject', 'fa fa-ellipsis-h', 'fa fa-ellipsis-v', 'fa fa-empire', 'fa fa-envelope', 'fa fa-envelope-o', 'fa fa-envelope-open', 'fa fa-envelope-open-o', 'fa fa-envelope-square', 'fa fa-envira', 'fa fa-eraser', 'fa fa-etsy', 'fa fa-eur', 'fa fa-exchange', 'fa fa-exclamation', 'fa fa-exclamation-circle', 'fa fa-exclamation-triangle', 'fa fa-expand', 'fa fa-expeditedssl', 'fa fa-external-link', 'fa fa-external-link-square', 'fa fa-eye', 'fa fa-eye-slash', 'fa fa-eyedropper', 'fa fa-facebook', 'fa fa-facebook-official', 'fa fa-facebook-square', 'fa fa-fast-backward', 'fa fa-fast-forward', 'fa fa-fax', 'fa fa-female', 'fa fa-fighter-jet', 'fa fa-file', 'fa fa-file-archive-o', 'fa fa-file-audio-o', 'fa fa-file-code-o', 'fa fa-file-excel-o', 'fa fa-file-image-o', 'fa fa-file-o', 'fa fa-file-pdf-o', 'fa fa-file-powerpoint-o', 'fa fa-file-text', 'fa fa-file-text-o', 'fa fa-file-video-o', 'fa fa-file-word-o', 'fa fa-files-o', 'fa fa-film', 'fa fa-filter', 'fa fa-fire', 'fa fa-fire-extinguisher', 'fa fa-firefox', 'fa fa-first-order', 'fa fa-flag', 'fa fa-flag-checkered', 'fa fa-flag-o', 'fa fa-flask', 'fa fa-flickr', 'fa fa-floppy-o', 'fa fa-folder', 'fa fa-folder-o', 'fa fa-folder-open', 'fa fa-folder-open-o', 'fa fa-font', 'fa fa-font-awesome', 'fa fa-fonticons', 'fa fa-fort-awesome', 'fa fa-forumbee', 'fa fa-forward', 'fa fa-foursquare', 'fa fa-free-code-camp', 'fa fa-frown-o', 'fa fa-futbol-o', 'fa fa-gamepad', 'fa fa-gavel', 'fa fa-gbp', 'fa fa-genderless', 'fa fa-get-pocket', 'fa fa-gg', 'fa fa-gg-circle', 'fa fa-gift', 'fa fa-git', 'fa fa-git-square', 'fa fa-github', 'fa fa-github-alt', 'fa fa-github-square', 'fa fa-gitlab', 'fa fa-glass', 'fa fa-glide', 'fa fa-glide-g', 'fa fa-globe', 'fa fa-google', 'fa fa-google-plus', 'fa fa-google-plus-official', 'fa fa-google-plus-square', 'fa fa-google-wallet', 'fa fa-graduation-cap', 'fa fa-gratipay', 'fa fa-grav', 'fa fa-h-square', 'fa fa-hacker-news', 'fa fa-hand-lizard-o', 'fa fa-hand-o-down', 'fa fa-hand-o-left', 'fa fa-hand-o-right', 'fa fa-hand-o-up', 'fa fa-hand-paper-o', 'fa fa-hand-peace-o', 'fa fa-hand-pointer-o', 'fa fa-hand-rock-o', 'fa fa-hand-scissors-o', 'fa fa-hand-spock-o', 'fa fa-handshake-o', 'fa fa-hashtag', 'fa fa-hdd-o', 'fa fa-header', 'fa fa-headphones', 'fa fa-heart', 'fa fa-heart-o', 'fa fa-heartbeat', 'fa fa-history', 'fa fa-home', 'fa fa-hospital-o', 'fa fa-hourglass', 'fa fa-hourglass-end', 'fa fa-hourglass-half', 'fa fa-hourglass-o', 'fa fa-hourglass-start', 'fa fa-houzz', 'fa fa-html5', 'fa fa-i-cursor', 'fa fa-id-badge', 'fa fa-id-card', 'fa fa-id-card-o', 'fa fa-ils', 'fa fa-imdb', 'fa fa-inbox', 'fa fa-indent', 'fa fa-industry', 'fa fa-info', 'fa fa-info-circle', 'fa fa-inr', 'fa fa-instagram', 'fa fa-internet-explorer', 'fa fa-ioxhost', 'fa fa-italic', 'fa fa-joomla', 'fa fa-jpy', 'fa fa-jsfiddle', 'fa fa-key', 'fa fa-keyboard-o', 'fa fa-krw', 'fa fa-language', 'fa fa-laptop', 'fa fa-lastfm', 'fa fa-lastfm-square', 'fa fa-leaf', 'fa fa-leanpub', 'fa fa-lemon-o', 'fa fa-level-down', 'fa fa-level-up', 'fa fa-life-ring', 'fa fa-lightbulb-o', 'fa fa-line-chart', 'fa fa-link', 'fa fa-linkedin', 'fa fa-linkedin-square', 'fa fa-linode', 'fa fa-linux', 'fa fa-list', 'fa fa-list-alt', 'fa fa-list-ol', 'fa fa-list-ul', 'fa fa-location-arrow', 'fa fa-lock', 'fa fa-long-arrow-down', 'fa fa-long-arrow-left', 'fa fa-long-arrow-right', 'fa fa-long-arrow-up', 'fa fa-low-vision', 'fa fa-magic', 'fa fa-magnet', 'fa fa-male', 'fa fa-map', 'fa fa-map-marker', 'fa fa-map-o', 'fa fa-map-pin', 'fa fa-map-signs', 'fa fa-mars', 'fa fa-mars-double', 'fa fa-mars-stroke', 'fa fa-mars-stroke-h', 'fa fa-mars-stroke-v', 'fa fa-maxcdn', 'fa fa-meanpath', 'fa fa-medium', 'fa fa-medkit', 'fa fa-meetup', 'fa fa-meh-o', 'fa fa-mercury', 'fa fa-microchip', 'fa fa-microphone', 'fa fa-microphone-slash', 'fa fa-minus', 'fa fa-minus-circle', 'fa fa-minus-square', 'fa fa-minus-square-o', 'fa fa-mixcloud', 'fa fa-mobile', 'fa fa-modx', 'fa fa-money', 'fa fa-moon-o', 'fa fa-motorcycle', 'fa fa-mouse-pointer', 'fa fa-music', 'fa fa-neuter', 'fa fa-newspaper-o', 'fa fa-object-group', 'fa fa-object-ungroup', 'fa fa-odnoklassniki', 'fa fa-odnoklassniki-square', 'fa fa-opencart', 'fa fa-openid', 'fa fa-opera', 'fa fa-optin-monster', 'fa fa-outdent', 'fa fa-pagelines', 'fa fa-paint-brush', 'fa fa-paper-plane', 'fa fa-paper-plane-o', 'fa fa-paperclip', 'fa fa-paragraph', 'fa fa-pause', 'fa fa-pause-circle', 'fa fa-pause-circle-o', 'fa fa-paw', 'fa fa-paypal', 'fa fa-pencil', 'fa fa-pencil-square', 'fa fa-pencil-square-o', 'fa fa-percent', 'fa fa-phone', 'fa fa-phone-square', 'fa fa-picture-o', 'fa fa-pie-chart', 'fa fa-pied-piper', 'fa fa-pied-piper-alt', 'fa fa-pied-piper-pp', 'fa fa-pinterest', 'fa fa-pinterest-p', 'fa fa-pinterest-square', 'fa fa-plane', 'fa fa-play', 'fa fa-play-circle', 'fa fa-play-circle-o', 'fa fa-plug', 'fa fa-plus', 'fa fa-plus-circle', 'fa fa-plus-square', 'fa fa-plus-square-o', 'fa fa-podcast', 'fa fa-power-off', 'fa fa-print', 'fa fa-product-hunt', 'fa fa-puzzle-piece', 'fa fa-qq', 'fa fa-qrcode', 'fa fa-question', 'fa fa-question-circle', 'fa fa-question-circle-o', 'fa fa-quora', 'fa fa-quote-left', 'fa fa-quote-right', 'fa fa-random', 'fa fa-ravelry', 'fa fa-rebel', 'fa fa-recycle', 'fa fa-reddit', 'fa fa-reddit-alien', 'fa fa-reddit-square', 'fa fa-refresh', 'fa fa-registered', 'fa fa-renren', 'fa fa-repeat', 'fa fa-reply', 'fa fa-reply-all', 'fa fa-retweet', 'fa fa-road', 'fa fa-rocket', 'fa fa-rss', 'fa fa-rss-square', 'fa fa-rub', 'fa fa-safari', 'fa fa-scissors', 'fa fa-scribd', 'fa fa-search', 'fa fa-search-minus', 'fa fa-search-plus', 'fa fa-sellsy', 'fa fa-server', 'fa fa-share', 'fa fa-share-alt', 'fa fa-share-alt-square', 'fa fa-share-square', 'fa fa-share-square-o', 'fa fa-shield', 'fa fa-ship', 'fa fa-shirtsinbulk', 'fa fa-shopping-bag', 'fa fa-shopping-basket', 'fa fa-shopping-cart', 'fa fa-shower', 'fa fa-sign-in', 'fa fa-sign-language', 'fa fa-sign-out', 'fa fa-signal', 'fa fa-simplybuilt', 'fa fa-sitemap', 'fa fa-skyatlas', 'fa fa-skype', 'fa fa-slack', 'fa fa-sliders', 'fa fa-slideshare', 'fa fa-smile-o', 'fa fa-snapchat', 'fa fa-snapchat-ghost', 'fa fa-snapchat-square', 'fa fa-snowflake-o', 'fa fa-sort', 'fa fa-sort-alpha-asc', 'fa fa-sort-alpha-desc', 'fa fa-sort-amount-asc', 'fa fa-sort-amount-desc', 'fa fa-sort-asc', 'fa fa-sort-desc', 'fa fa-sort-numeric-asc', 'fa fa-sort-numeric-desc', 'fa fa-soundcloud', 'fa fa-space-shuttle', 'fa fa-spinner', 'fa fa-spoon', 'fa fa-spotify', 'fa fa-square', 'fa fa-square-o', 'fa fa-stack-exchange', 'fa fa-stack-overflow', 'fa fa-star', 'fa fa-star-half', 'fa fa-star-half-o', 'fa fa-star-o', 'fa fa-steam', 'fa fa-steam-square', 'fa fa-step-backward', 'fa fa-step-forward', 'fa fa-stethoscope', 'fa fa-sticky-note', 'fa fa-sticky-note-o', 'fa fa-stop', 'fa fa-stop-circle', 'fa fa-stop-circle-o', 'fa fa-street-view', 'fa fa-strikethrough', 'fa fa-stumbleupon', 'fa fa-stumbleupon-circle', 'fa fa-subscript', 'fa fa-subway', 'fa fa-suitcase', 'fa fa-sun-o', 'fa fa-superpowers', 'fa fa-superscript', 'fa fa-table', 'fa fa-tablet', 'fa fa-tachometer', 'fa fa-tag', 'fa fa-tags', 'fa fa-tasks', 'fa fa-taxi', 'fa fa-telegram', 'fa fa-television', 'fa fa-tencent-weibo', 'fa fa-terminal', 'fa fa-text-height', 'fa fa-text-width', 'fa fa-th', 'fa fa-th-large', 'fa fa-th-list', 'fa fa-themeisle', 'fa fa-thermometer-empty', 'fa fa-thermometer-full', 'fa fa-thermometer-half', 'fa fa-thermometer-quarter', 'fa fa-thermometer-three-quarters', 'fa fa-thumb-tack', 'fa fa-thumbs-down', 'fa fa-thumbs-o-down', 'fa fa-thumbs-o-up', 'fa fa-thumbs-up', 'fa fa-ticket', 'fa fa-times', 'fa fa-times-circle', 'fa fa-times-circle-o', 'fa fa-tint', 'fa fa-toggle-off', 'fa fa-toggle-on', 'fa fa-trademark', 'fa fa-train', 'fa fa-transgender', 'fa fa-transgender-alt', 'fa fa-trash', 'fa fa-trash-o', 'fa fa-tree', 'fa fa-trello', 'fa fa-tripadvisor', 'fa fa-trophy', 'fa fa-truck', 'fa fa-try', 'fa fa-tty', 'fa fa-tumblr', 'fa fa-tumblr-square', 'fa fa-twitch', 'fa fa-twitter', 'fa fa-twitter-square', 'fa fa-umbrella', 'fa fa-underline', 'fa fa-undo', 'fa fa-universal-access', 'fa fa-university', 'fa fa-unlock', 'fa fa-unlock-alt', 'fa fa-upload', 'fa fa-usb', 'fa fa-usd', 'fa fa-user', 'fa fa-user-circle', 'fa fa-user-circle-o', 'fa fa-user-md', 'fa fa-user-o', 'fa fa-user-plus', 'fa fa-user-secret', 'fa fa-user-times', 'fa fa-users', 'fa fa-venus', 'fa fa-venus-double', 'fa fa-venus-mars', 'fa fa-viacoin', 'fa fa-viadeo', 'fa fa-viadeo-square', 'fa fa-video-camera', 'fa fa-vimeo', 'fa fa-vimeo-square', 'fa fa-vine', 'fa fa-vk', 'fa fa-volume-control-phone', 'fa fa-volume-down', 'fa fa-volume-off', 'fa fa-volume-up', 'fa fa-weibo', 'fa fa-weixin', 'fa fa-whatsapp', 'fa fa-wheelchair', 'fa fa-wheelchair-alt', 'fa fa-wifi', 'fa fa-wikipedia-w', 'fa fa-window-close', 'fa fa-window-close-o', 'fa fa-window-maximize', 'fa fa-window-minimize', 'fa fa-window-restore', 'fa fa-windows', 'fa fa-wordpress', 'fa fa-wpbeginner', 'fa fa-wpexplorer', 'fa fa-wpforms', 'fa fa-wrench', 'fa fa-xing', 'fa fa-xing-square', 'fa fa-y-combinator', 'fa fa-yahoo', 'fa fa-yelp', 'fa fa-yoast', 'fa fa-youtube', 'fa fa-youtube-play', 'fa fa-youtube-square',
    // PE Line Icons
    'pe pe-7s-album', 'pe pe-7s-arc', 'pe pe-7s-back-2', 'pe pe-7s-bandaid', 'pe pe-7s-car',
    'pe pe-7s-diamond', 'pe pe-7s-door-lock', 'pe pe-7s-eyedropper', 'pe pe-7s-female', 'pe pe-7s-gym',
    'pe pe-7s-hammer', 'pe pe-7s-headphones', 'pe pe-7s-helm', 'pe pe-7s-hourglass', 'pe pe-7s-leaf',
    'pe pe-7s-magic-wand', 'pe pe-7s-male', 'pe pe-7s-map-2', 'pe pe-7s-next-2', 'pe pe-7s-paint-bucket',
    'pe pe-7s-pendrive', 'pe pe-7s-photo', 'pe pe-7s-piggy', 'pe pe-7s-plugin', 'pe pe-7s-refresh-2',
    'pe pe-7s-rocket', 'pe pe-7s-settings', 'pe pe-7s-shield', 'pe pe-7s-smile', 'pe pe-7s-usb',
    'pe pe-7s-vector', 'pe pe-7s-wine', 'pe pe-7s-cloud-upload', 'pe pe-7s-cash', 'pe pe-7s-close',
    'pe pe-7s-bluetooth', 'pe pe-7s-cloud-download', 'pe pe-7s-way', 'pe pe-7s-close-circle', 'pe pe-7s-id',
    'pe pe-7s-angle-up', 'pe pe-7s-wristwatch', 'pe pe-7s-angle-up-circle', 'pe pe-7s-world',
    'pe pe-7s-angle-right', 'pe pe-7s-volume', 'pe pe-7s-angle-right-circle', 'pe pe-7s-users',
    'pe pe-7s-angle-left', 'pe pe-7s-user-female', 'pe pe-7s-angle-left-circle', 'pe pe-7s-up-arrow',
    'pe pe-7s-angle-down', 'pe pe-7s-switch', 'pe pe-7s-angle-down-circle', 'pe pe-7s-scissors',
    'pe pe-7s-wallet', 'pe pe-7s-safe', 'pe pe-7s-volume2', 'pe pe-7s-volume1', 'pe pe-7s-voicemail',
    'pe pe-7s-video', 'pe pe-7s-user', 'pe pe-7s-upload', 'pe pe-7s-unlock', 'pe pe-7s-umbrella',
    'pe pe-7s-trash', 'pe pe-7s-tools', 'pe pe-7s-timer', 'pe pe-7s-ticket', 'pe pe-7s-target',
    'pe pe-7s-sun', 'pe pe-7s-study', 'pe pe-7s-stopwatch', 'pe pe-7s-star', 'pe pe-7s-speaker',
    'pe pe-7s-signal', 'pe pe-7s-shuffle', 'pe pe-7s-shopbag', 'pe pe-7s-share', 'pe pe-7s-server',
    'pe pe-7s-search', 'pe pe-7s-film', 'pe pe-7s-science', 'pe pe-7s-disk', 'pe pe-7s-ribbon',
    'pe pe-7s-repeat', 'pe pe-7s-refresh', 'pe pe-7s-add-user', 'pe pe-7s-refresh-cloud',
    'pe pe-7s-paperclip', 'pe pe-7s-radio', 'pe pe-7s-note2', 'pe pe-7s-print', 'pe pe-7s-network',
    'pe pe-7s-prev', 'pe pe-7s-mute', 'pe pe-7s-power', 'pe pe-7s-medal', 'pe pe-7s-portfolio',
    'pe pe-7s-like2', 'pe pe-7s-plus', 'pe pe-7s-left-arrow', 'pe pe-7s-play', 'pe pe-7s-key',
    'pe pe-7s-plane', 'pe pe-7s-joy', 'pe pe-7s-photo-gallery', 'pe pe-7s-pin', 'pe pe-7s-phone',
    'pe pe-7s-plug', 'pe pe-7s-pen', 'pe pe-7s-right-arrow', 'pe pe-7s-paper-plane', 'pe pe-7s-delete-user',
    'pe pe-7s-paint', 'pe pe-7s-bottom-arrow', 'pe pe-7s-notebook', 'pe pe-7s-note', 'pe pe-7s-next',
    'pe pe-7s-news-paper', 'pe pe-7s-musiclist', 'pe pe-7s-music', 'pe pe-7s-mouse', 'pe pe-7s-more',
    'pe pe-7s-moon', 'pe pe-7s-monitor', 'pe pe-7s-micro', 'pe pe-7s-menu', 'pe pe-7s-map',
    'pe pe-7s-map-marker', 'pe pe-7s-mail', 'pe pe-7s-mail-open', 'pe pe-7s-mail-open-file',
    'pe pe-7s-magnet', 'pe pe-7s-loop', 'pe pe-7s-look', 'pe pe-7s-lock', 'pe pe-7s-lintern', 'pe pe-7s-link',
    'pe pe-7s-like', 'pe pe-7s-light', 'pe pe-7s-less', 'pe pe-7s-keypad', 'pe pe-7s-junk', 'pe pe-7s-info',
    'pe pe-7s-home', 'pe pe-7s-help2', 'pe pe-7s-help1', 'pe pe-7s-graph3', 'pe pe-7s-graph2',
    'pe pe-7s-graph1', 'pe pe-7s-graph', 'pe pe-7s-global', 'pe pe-7s-gleam', 'pe pe-7s-glasses',
    'pe pe-7s-gift', 'pe pe-7s-folder', 'pe pe-7s-flag', 'pe pe-7s-filter', 'pe pe-7s-file',
    'pe pe-7s-expand1', 'pe pe-7s-exapnd2', 'pe pe-7s-edit', 'pe pe-7s-drop', 'pe pe-7s-drawer',
    'pe pe-7s-download', 'pe pe-7s-display2', 'pe pe-7s-display1', 'pe pe-7s-diskette', 'pe pe-7s-date',
    'pe pe-7s-cup', 'pe pe-7s-culture', 'pe pe-7s-crop', 'pe pe-7s-credit', 'pe pe-7s-copy-file',
    'pe pe-7s-config', 'pe pe-7s-compass', 'pe pe-7s-comment', 'pe pe-7s-coffee', 'pe pe-7s-cloud',
    'pe pe-7s-clock', 'pe pe-7s-check', 'pe pe-7s-chat', 'pe pe-7s-cart', 'pe pe-7s-camera', 'pe pe-7s-call',
    'pe pe-7s-calculator', 'pe pe-7s-browser', 'pe pe-7s-box2', 'pe pe-7s-box1', 'pe pe-7s-bookmarks',
    'pe pe-7s-bicycle', 'pe pe-7s-bell', 'pe pe-7s-battery', 'pe pe-7s-ball', 'pe pe-7s-back',
    'pe pe-7s-attention', 'pe pe-7s-anchor', 'pe pe-7s-albums', 'pe pe-7s-alarm', 'pe pe-7s-airplay',

  ].concat(icons),
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
      glazed_add_css('vendor/font-awesome/css/font-awesome.css', function() {});
      glazed_add_css('vendor/et-line-font/et-line-font.css', function() {});
      glazed_add_css('vendor/pe-icon-7-stroke/css/pe-icon-7-stroke.css', function() {});
      var icons = $('<div class="icons"></div>').appendTo(this.dom_element);
      var $searchField = $('<input type="search" class="cb-search-icon" placeholder="' + Drupal.t('Search icon') + '"/>');
      $searchField.appendTo(icons);

      var $iconsWrapper = $('<div class="cb-icons-wrapper"/>').appendTo(icons);
      for (var i = 0; i < this.icons.length; i++) {
        $iconsWrapper.append('<span class="' + this.icons[i] + '"></span>');
      }

      var $icons = $iconsWrapper.find('span');
      $searchField.on('input', _.debounce(function() {
        var searchKey = $(this).val();
        if (searchKey == '') {
          $icons.show();
        }
        else {
          $icons
            .hide()
            .each(function() {
              var $icon = $(this);
              // ui-selectee class does not make sense in search context.
              var classes = $icon.attr('class').replace('ui-selectee', '');
              $icon.toggle(classes.indexOf(searchKey) !== -1);
          })
        }
      }, 300));

      var param = this;
      $iconsWrapper.selectable({
        autoRefresh: false,
        stop: function() {
          var icon = '';
          var c = $(param.dom_element).find('.ui-selected').attr('class');
          if (c)
            icon = c.replace('ui-selectee', '').replace('ui-selected', '');
          $(param.dom_element).find('input[name="' + param.param_name + '"]').val($.trim(icon));
        }
      });
      if (this.get_value() != '')
        $(icons).find('.' + $.trim(this.get_value()).replace(/ /g, '.')).addClass("ui-selected");
    },
  },

  {
    type: 'image',
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
      image_select($(this.dom_element).find('input[name="' + this.param_name + '"]'));
    },
  },

  {
    type: 'images',
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
      images_select($(this.dom_element).find('input[name="' + this.param_name + '"]'), ',');
    },
  },

  {
    type: 'integer_slider',
    create: function() {
      this.min = 0;
      this.max = 100;
      this.step = 1;
    },
    get_value: function() {
      var v = $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
      return (v == '') ? NaN : parseFloat(v).toString();
    },
    render: function(value) {
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input class="form-control" name="' + this.param_name +
        '" type="text" value="' + value + '"></div><div class="slider"></div><p class="help-block">' +
        this.description + '</p></div>');
    },
    opened: function() {
      nouislider($(this.dom_element).find('.slider'), this.min, this.max, this.get_value(), this.step, $(this.dom_element)
        .find('input[name="' + this.param_name + '"]'));
    },
  },

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

  {
    type: 'link',
    get_value: function() {
      return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
    },
    render: function(value) {
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input class="form-control" name="' + this.param_name +
        '" type="text" value="' + value + '"></div><p class="help-block">' + this.description +
        '</p></div>');
    },
  },

  {
    type: 'links',
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

  {
    type: 'saved_datetime',
    get_value: function() {
      return (new Date).toUTCString();
    },
  },

  {
    type: 'style',
    create: function() {
      this.important = false;
    },
    get_value: function() {
      var imp = '';
      if (this.important) {
        imp = ' !important';
      }
      var style = '';
      var margin_top = $(this.dom_element).find('[name="margin_top"]').val();
      if (margin_top != '') {
        if ($.isNumeric(margin_top))
          margin_top = margin_top + 'px';
        style += 'margin-top:' + margin_top + imp + ';';
      }
      var margin_bottom = $(this.dom_element).find('[name="margin_bottom"]').val();
      if (margin_bottom != '') {
        if ($.isNumeric(margin_bottom))
          margin_bottom = margin_bottom + 'px';
        style += 'margin-bottom:' + margin_bottom + imp + ';';
      }
      var margin_left = $(this.dom_element).find('[name="margin_left"]').val();
      if (margin_left != '') {
        if ($.isNumeric(margin_left))
          margin_left = margin_left + 'px';
        style += 'margin-left:' + margin_left + imp + ';';
      }
      var margin_right = $(this.dom_element).find('[name="margin_right"]').val();
      if (margin_right != '') {
        if ($.isNumeric(margin_right))
          margin_right = margin_right + 'px';
        style += 'margin-right:' + margin_right + imp + ';';
      }
      var border_top_width = $(this.dom_element).find('[name="border_top_width"]').val();
      if (border_top_width != '') {
        if ($.isNumeric(border_top_width))
          border_top_width = border_top_width + 'px';
        style += 'border-top-width:' + border_top_width + imp + ';';
      }
      var border_bottom_width = $(this.dom_element).find('[name="border_bottom_width"]').val();
      if (border_bottom_width != '') {
        if ($.isNumeric(border_bottom_width))
          border_bottom_width = border_bottom_width + 'px';
        style += 'border-bottom-width:' + border_bottom_width + imp + ';';
      }
      var border_left_width = $(this.dom_element).find('[name="border_left_width"]').val();
      if (border_left_width != '') {
        if ($.isNumeric(border_left_width))
          border_left_width = border_left_width + 'px';
        style += 'border-left-width:' + border_left_width + imp + ';';
      }
      var border_right_width = $(this.dom_element).find('[name="border_right_width"]').val();
      if (border_right_width != '') {
        if ($.isNumeric(border_right_width))
          border_right_width = border_right_width + 'px';
        style += 'border-right-width:' + border_right_width + imp + ';';
      }
      var padding_top = $(this.dom_element).find('[name="padding_top"]').val();
      if (padding_top != '') {
        if ($.isNumeric(padding_top))
          padding_top = padding_top + 'px';
        style += 'padding-top:' + padding_top + imp + ';';
      }
      var padding_bottom = $(this.dom_element).find('[name="padding_bottom"]').val();
      if (padding_bottom != '') {
        if ($.isNumeric(padding_bottom))
          padding_bottom = padding_bottom + 'px';
        style += 'padding-bottom:' + padding_bottom + imp + ';';
      }
      var padding_left = $(this.dom_element).find('[name="padding_left"]').val();
      if (padding_left != '') {
        if ($.isNumeric(padding_left))
          padding_left = padding_left + 'px';
        style += 'padding-left:' + padding_left + imp + ';';
      }
      var padding_right = $(this.dom_element).find('[name="padding_right"]').val();
      if (padding_right != '') {
        if ($.isNumeric(padding_right))
          padding_right = padding_right + 'px';
        style += 'padding-right:' + padding_right + imp + ';';
      }
      var color = $(this.dom_element).find('#' + this.color_id).val();
      if (color != '') {
        style += 'color:' + color + imp + ';';
      }
      var fontsize = $(this.dom_element).find('[name="fontsize"]').val();
      if (fontsize != 0) {
        if ($.isNumeric(fontsize))
          fontsize = Math.round(fontsize) + 'px';
        style += 'font-size:' + fontsize + imp + ';';
      }
      var border_color = $(this.dom_element).find('#' + this.border_color_id).val();
      if (border_color != '') {
        style += 'border-color:' + border_color + imp + ';';
      }
      var border_radius = $(this.dom_element).find('[name="border_radius"]').val();
      if (border_radius != 0) {
        if ($.isNumeric(border_radius))
          border_radius = Math.round(border_radius) + 'px';
        style += 'border-radius:' + border_radius + imp + ';';
      }
      var border_style = $(this.dom_element).find('select[name="border_style"] > option:selected').val();
      if (border_style != '') {
        style += 'border-style:' + border_style + imp + ';';
      }
      var bg_color = $(this.dom_element).find('#' + this.bg_color_id).val();
      if (bg_color) {
        style += 'background-color:' + bg_color + imp + ';';
      }
      var bg_image = $(this.dom_element).find('[name="bg_image"]').val();
      if (bg_image) {
        style += 'background-image: url(' + encodeURI(bg_image) + ');';
      }
      var background_style = $(this.dom_element).find('select[name="background_style"] > option:selected').val();
      if (background_style.match(/repeat/)) {
        style += 'background-repeat: ' + background_style + imp + ';';
      }
      else if (background_style.match(/cover|contain/)) {
        style += 'background-repeat: no-repeat;';
        style += 'background-size: ' + background_style + imp + ';';
      }
      var background_position = $(this.dom_element).find('select[name="background_position"] > option:selected').val();
      if (background_position != '') {
        style += 'background-position:' + background_position + imp + ';';
      }
      var opacity = $(this.dom_element).find('[name="opacity"]').val();
      if (opacity != 0) {
        style += 'opacity:' + opacity + imp + ';';
      }
      return style;
    },
    render: function(value) {
      value = value.replace(/!important/g, '');
      var output = '<div class="style row">';
      var match = null;
      var v = '';
      output += '<div class="layout col-sm-6">';
      output += '<div class="margin"><label>' + Drupal.t('Margin') + '</label>';
      match = value.match(/margin-top[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_top" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/margin-bottom[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_bottom" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/margin-left[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_left" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/margin-right[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_right" type="text" placeholder="-" value="' + v + '">';
      output += '<div class="border"><label>' + Drupal.t('Border') + '</label>';
      match = value.match(/border-top-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_top_width" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/border-bottom-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_bottom_width" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/border-left-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_left_width" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/border-right-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_right_width" type="text" placeholder="-" value="' + v + '">';
      output += '<div class="padding"><label>' + Drupal.t('Padding') + '</label>';
      match = value.match(/padding-top[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_top" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/padding-bottom[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_bottom" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/padding-left[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_left" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/padding-right[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_right" type="text" placeholder="-" value="' + v + '">';
      output += '<div class="content">';
      output += '</div></div></div></div>';
      output += '</div>';
      output += '<div class="settings col-sm-6">';
      output += '<div class="font form-group"><label>' + Drupal.t('Font color') + '</label>';
      this.color_id = _.uniqueId();
      match = value.match(/(^| |;)color[: ]*([#\dabcdef]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[2];
      output += '<div><input id="' + this.color_id + '" name="color" type="text" value="' + v + '"></div></div>';
      output += '<div class="border form-group"><label>' + Drupal.t('Border color') + '</label>';
      this.border_color_id = _.uniqueId();
      match = value.match(/border-color[: ]*([#\dabcdef]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div><input id="' + this.border_color_id + '" name="border_color" type="text" value="' + v +
        '"></div></div>';
      output += '<div class="background form-group"><label>' + Drupal.t('Background') + '</label>';
      this.bg_color_id = _.uniqueId();
      match = value.match(/background-color[: ]*([#\dabcdef]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div><input id="' + this.bg_color_id + '" name="bg_color" type="text" value="' + v +
        '"></div>';
      this.bg_image_id = _.uniqueId();
      match = value.match(/background-image[: ]*url\(([^\)]+)\) *;/);
      if (match == null)
        v = '';
      else
        v = decodeURI(match[1]);
      output += '<input id="' + this.bg_image_id + '" name="bg_image" class="form-control" type="text" value="' + v + '"></div>';
      match = value.match(/background-repeat[: ]*([-\w]*) *;/);
      if (match == null) {
        v = '';
      }
      else {
        if (match[1] == 'repeat') {
          v = match[1];
        }
        else {
          if (match[1] == 'repeat-x') {
            v = 'repeat-x';
          }
          else {
            match = value.match(/background-size[: ]*([-\w]*) *;/);
            if (match == null) {
              v = 'no-repeat';
            }
            else {
              v = match[1];
            }
          }
        }
      }
      output += '<div class="form-group"><label>' + Drupal.t('Background style') + '</label><div class="form-controls"><select name="background_style" class="form-control">';
      var background_styles = {
        '': Drupal.t("Theme defaults"),
        'cover': Drupal.t("Cover"),
        'contain': Drupal.t("Contain"),
        'no-repeat': Drupal.t("No Repeat"),
        'repeat': Drupal.t("Repeat"),
      };
      for (var key in background_styles) {
        if (key == v)
          output += '<option selected value="' + key + '">' + background_styles[key] + '</option>';
        else
          output += '<option value="' + key + '">' + background_styles[key] + '</option>';
      }
      output += '</select>';
      output += '</div>';
      output += '</div>';
      match = value.match(/background-position[: ]*([\s\w]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div class="form-group"><label>' + Drupal.t('Background position') + '</label><div class="form-controls"><select name="background_position" class="form-control">';
      var background_position = {
        '': Drupal.t("Theme defaults"),
        'center center': Drupal.t("Center  Center"),
        'left top': Drupal.t("Left Top"),
        'left center': Drupal.t("Left Center"),
        'left bottom': Drupal.t("Left Bottom"),
        'right top': Drupal.t("Right Top"),
        'right center': Drupal.t("Right Center"),
        'right bottom': Drupal.t("Right Bottom"),
        'center bottom': Drupal.t("Center Bottom"),
      };
      for (var key in background_position) {
        if (key == v)
          output += '<option selected value="' + key + '">' + background_position[key] + '</option>';
        else
          output += '<option value="' + key + '">' + background_position[key] + '</option>';
      }
      output += '</select>';
      output += '</div></div>';


      match = value.match(/border-style[: ]*(\w*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div class="form-group"><label>' + Drupal.t('Border style') + '</label><div class="form-controls"><select name="border_style" class="form-control">';
      var border_styles = {
        '': Drupal.t("Theme defaults"),
        'solid': Drupal.t("Solid"),
        'dotted': Drupal.t("Dotted"),
        'dashed': Drupal.t("Dashed"),
        'none': Drupal.t("None"),
      };
      for (var key in border_styles) {
        if (key == v)
          output += '<option selected value="' + key + '">' + border_styles[key] + '</option>';
        else
          output += '<option value="' + key + '">' + border_styles[key] + '</option>';
      }
      output += '</select>';
      output += '</div></div>';
      match = value.match(/font-size[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<div class="form-group"><label>' + Drupal.t('Font size') + '</label><div class="form-controls"><input name="fontsize" class="form-control bootstrap-slider" type="text" value="' + v + '"></div></div>';
      match = value.match(/border-radius[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<div class="form-group"><label>' + Drupal.t('Border radius') + '</label><div class="form-controls"><input name="border_radius" class="form-control bootstrap-slider" type="text" value="' + v + '"></div></div>';
      match = value.match(/opacity[: ]*([\d\.]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div class="form-group"><label>' + Drupal.t('Opacity') +'</label><div class="form-controls"><input name="opacity" class="form-control bootstrap-slider" type="text" value="' + v + '"></div>';
      output += '</div>';
      output += '</div>';
      output += '</div>';
      this.dom_element = $(output);
    },
    opened: function() {
      image_select($(this.dom_element).find('input[name="bg_image"]'));
      colorpicker('#' + this.color_id);
      colorpicker('#' + this.border_color_id);
      colorpicker('#' + this.bg_color_id);
      initBootstrapSlider($(this.dom_element).find('input[name="opacity"]'), 0, 1, $(this.dom_element).find(
        'input[name="opacity"]').val(), 0.01);

      initBootstrapSlider($(this.dom_element).find('input[name="fontsize"]'), 0, 100, $(this.dom_element).find(
        'input[name="fontsize"]').val(), 1, true);
      initBootstrapSlider($(this.dom_element).find('input[name="border_radius"]'), 0, 100, $(this.dom_element).find(
        'input[name="border_radius"]').val(), 1);
    },
  },

  {
    type: 'textarea',
    safe: false,
    get_value: function() {
      // Return data.
      return CKEDITOR.instances[this.id].getData();
    },
    render: function(value) {
      this.id = _.uniqueId();
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><textarea id="' + this.id + '" rows="10" cols="45" name="' + this.param_name + '" ">' +
        value + '</textarea></div><p class="help-block">' + this.description + '</p></div>');
    },
    opened: function() {
      var param = this;
      if ('glazed_ckeditor' in window) {
        window.glazed_ckeditor($(this.dom_element).find('#' + param.id));
      }
      else {
        function ckeditor_add_editor() {

          // Don't add spaces to empty blocks
          CKEDITOR.config.fillEmptyBlocks = false;
          // Disabling content filtering.
          CKEDITOR.config.allowedContent = true;
          // Prevent wrapping inline content in paragraphs
          CKEDITOR.config.autoParagraph = false;

          // Theme integration
          CKEDITOR.config.contentsCss = ['//cdn.jsdelivr.net/bootstrap/3.3.5/css/bootstrap.min.css'];
          if (typeof window.Drupal.settings.glazed.glazedPath.length != "undefined") {
            CKEDITOR.config.contentsCss.push(Drupal.settings.basePath + window.Drupal.settings.glazed.glazedPath +
              'css/glazed.css');
          }

          // Styles dropdown
          CKEDITOR.config.stylesSet = [{
            name: 'Lead',
            element: 'p',
            attributes: {
              'class': 'lead'
            }
          }, {
            name: 'Muted',
            element: 'p',
            attributes: {
              'class': 'text-muted'
            }
          }, {
            name: 'Highlighted',
            element: 'mark'
          }, {
            name: 'Small',
            element: 'small'
          }, {
            name: 'Button Primary',
            element: 'div',
            attributes: {
              'class': 'btn btn-primary'
            }
          }, {
            name: 'Button Default',
            element: 'div',
            attributes: {
              'class': 'btn btn-default'
            }
          }, ];

          var palette = [];
          for (var name in window.sooperthemes_theme_palette) {
            palette.push(window.sooperthemes_theme_palette[name].substring(1));
          }

          // Only once apply this settings
          var palletsString = palette.join(',') + ',';
          if (CKEDITOR.config.colorButton_colors.indexOf(palletsString) < 0) {
            CKEDITOR.config.colorButton_colors = palletsString + CKEDITOR.config.colorButton_colors;
          }

          // Added config toolbar
          CKEDITOR.config.toolbar = [{
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Superscript', 'Subscript', 'RemoveFormat']
          }, {
            name: 'paragraph',
            items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'BulletedList',
              'NumberedList', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv'
            ]
          }, {
            name: 'clipboard',
            items: ['Undo', 'Redo', 'PasteText', 'PasteFromWord']
          }, {
            name: 'links',
            items: ['Link', 'Unlink']
          }, {
            name: 'insert',
            items: ['Image', 'HorizontalRule', 'SpecialChar', 'Table', 'Templates']
          }, {
            name: 'colors',
            items: ['TextColor']
          }, {
            name: 'document',
            items: ['Source']
          }, {
            name: 'tools',
            items: ['ShowBlocks', 'Maximize']
          }, {
            name: 'styles',
            items: ['Format', 'Styles', 'FontSize']
          }, {
            name: 'editing',
            items: ['Scayt']
          }, ];

          CKEDITOR.config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;60/60px;72/72px;90/90px;117/117px;144/144px';

          // Don't move about our Glazed Builder stylesheet link tags
          CKEDITOR.config.protectedSource.push(/<link.*?>/gi);

          CKEDITOR.replace(param.id);
        }
        if ('CKEDITOR' in window) {
          ckeditor_add_editor();
        }
        else {
          glazed_add_js({
            path: 'vendor/ckeditor/ckeditor.js',
            callback: function() {
              if (_.isObject(CKEDITOR)) {
                ckeditor_add_editor();
              }
            }
          });
        }
      }
    },
    closed: function() {
      // Destroy ckeditor.
      CKEDITOR.instances[this.id].destroy();
    }
  },

  {
    type: 'textfield',
    get_value: function() {
      return $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
    },
    render: function(value) {
      var required = this.required ? 'required' : '';
      this.dom_element = $('<div class="form-group"><label>' + this.heading +
        '</label><div><input class="form-control" name="' + this.param_name +
        '" type="text" value="' + value + '" ' + required + '></div><p class="help-block">' + this.description +
        '</p></div>');
    }
  },

];

if ('glazed_param_types' in window) {
  window.glazed_param_types = window.glazed_param_types.concat(glazed_param_types);
}
else {
  window.glazed_param_types = glazed_param_types;
}

})(window.jQuery);
