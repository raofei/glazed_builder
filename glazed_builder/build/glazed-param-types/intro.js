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
