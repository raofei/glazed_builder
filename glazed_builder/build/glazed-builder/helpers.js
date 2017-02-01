
  /**
   * Old string translation funcitons, now replaced with Drupal.t
   * Still here for backwards compatibility with custom extensions
   * and possibly lingering code in databases
   */
  function t(text) {
    if ('Drupal' in window) {
      return Drupal.t(text);
    }
    else {
      return text;
    }
  }

  /**
   * Replace token strings with actual button titles
   */
  function title(text) {
    if ('glazed_title' in window && (text in window.glazed_title)) {
      return window.glazed_title[text];
    }
    else {
      return t(text);
    }
  }

  /**
   * Helper function that obfuscates strings. This function can help circumvent shared hosting values
   * that check for urls and javascript in post values.
   */
  function enc(str) {
    var encoded = "";
    for (i = 0; i < str.length; i++) {
      var a = str.charCodeAt(i);
      var b = a ^ 7;
      encoded = encoded + String.fromCharCode(b);
    }
    return encoded;
  }

  /**
   * Helper function to do protype based class extension
   */
  function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.baseclass = Parent;
  }

  /**
   * Helper function with property base object extension.
   */
  function mixin(dst, src) {
    var tobj = {};
    for (var x in src) {
      if ((typeof tobj[x] == "undefined") || (tobj[x] != src[x])) {
        dst[x] = src[x];
      }
    }
    if (document.all && !document.isOpera) {
      var p = src.toString;
      if (typeof p == "function" && p != dst.toString && p != tobj.toString &&
        p != "\nfunction toString() {\n  [native code]\n}\n") {
        dst.toString = src.toString;
      }
    }
    return dst;
  }

  /**
   * Helper function to do substring replacement.
   */
  function substr_replace(str, replace, start, length) {
    if (start < 0) { // start position in str
      start = start + str.length;
    }
    length = length !== undefined ? length : str.length;
    if (length < 0) {
      length = length + str.length - start;
    }

    return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
  }

  /**
   * Helper function with convert RGB triplet to hex color code.
   */
  function rgb2hex(rgb) {
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return rgb.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, function(match, r, g, b) {
      return "#" + hex(r) + hex(g) + hex(b);
    });
  }

  /**
   * Helper function with convert hex color code to RGB triplet.
   */
  function hex2rgb(hex) {
    if (hex.lastIndexOf('#') > -1) {
      hex = hex.replace(/#/, '0x');
    }
    else {
      hex = '0x' + hex;
    }
    var r = hex >> 16;
    var g = (hex & 0x00FF00) >> 8;
    var b = hex & 0x0000FF;
    return [r, g, b];
  }

  /**
   * Helper function with convert HSL color to RGB.
   */
  function hsl2rgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    }
    else {
      function hue2rgb(p, q, t) {
        if (t < 0)
          t += 1;
        if (t > 1)
          t -= 1;
        if (t < 1 / 6)
          return p + (q - p) * 6 * t;
        if (t < 1 / 2)
          return q;
        if (t < 2 / 3)
          return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   * Helper function with convert RGB color to HSL.
   */
  function rgb2hsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  /**
   * Helper function with convert fractinoal width to bootstrap class.
   */
  function width2span(width, device) {
    var prefix ='col-' + device + '-',
      numbers = width ? width.split('/') : [1, 1],
      range = _.range(1, 13),
      num = !_.isUndefined(numbers[0]) && _.indexOf(range, parseInt(numbers[0], 10)) >= 0 ? parseInt(numbers[0], 10) :
      false,
      dev = !_.isUndefined(numbers[1]) && _.indexOf(range, parseInt(numbers[1], 10)) >= 0 ? parseInt(numbers[1], 10) :
      false;
    if (num !== false && dev !== false) {
      return prefix + (12 * num / dev);
    }
    return prefix + '12';
  }

  /**
   * Helper function with convert bootstrap class to fractional width.
   */
  function span2width(span, device) {
    if (span == "col-" + device + "-12")
      return '1/1';
    else if (span == "col-" + device + "-11")
      return '11/12';
    else if (span == "col-" + device + "-10") //three-fourth
      return '5/6';
    else if (span == "col-" + device + "-9") //three-fourth
      return '3/4';
    else if (span == "col-" + device + "-8") //two-third
      return '2/3';
    else if (span == "col-" + device + "-7")
      return '7/12';
    else if (span == "col-" + device + "-6") //one-half
      return '1/2';
    else if (span == "col-" + device + "-5") //one-half
      return '5/12';
    else if (span == "col-" + device + "-4") // one-third
      return '1/3';
    else if (span == "col-" + device + "-3") // one-fourth
      return '1/4';
    else if (span == "col-" + device + "-2") // one-fourth
      return '1/6';
    else if (span == "col-" + device + "-1")
      return '1/12';
    return false;
  }

  /**
   * Cached Helper Function that does a bunch of regex
   */
  var glazed_regexp_split = _.memoize(function(tags) {
    return new RegExp('(\\[(\\[?)[' + tags + ']+' +
      '(?![\\w-])' +
      '[^\\]\\/]*' +
      '[\\/' +
      '(?!\\])' +
      '[^\\]\\/]*' +
      ']?' +
      '(?:' +
      '\\/]' +
      '\\]|\\]' +
      '(?:' +
      '[^\\[]*' +
      '(?:\\[' +
      '(?!\\/' + tags + '\\])[^\\[]*' +
      ')*' +
      '' +
      '\\[\\/' + tags + '\\]' +
      ')?' +
      ')' +
      '\\]?)', 'g');
  });

  /**
   * Cached Helper Function that does a bunch of regex
   */
  var glazed_regexp = _.memoize(function(tags) {
    return new RegExp('\\[(\\[?)(' + tags +
      ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)'
    );
  });

  /**
   * Helper function to escape quotes by replacing them with backticks.
   */
  function escapeParam(value) {
    return value.replace(/"/g, '``');
  }

  /**
   * Helper function to reverse effect of escapeParam.
   */
  function unescapeParam(value) {
    if (_.isString(value))
      return value.replace(/(\`{2})/g, '"');
    else
      return value;
  }

  /**
   * Helper function to decode encodede urls.
   */
  function rawurldecode(str) {
    return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
        // PHP tolerates poorly formed escape sequences
        return '%25';
      }));
  }
  /**
   * Helper function to encode urls.
   */
  function rawurlencode(str) {
    str = (str + '')
      .toString();

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .
    replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }


  /**
   * Helper function to get the highest z-index value in DOM (sub)tree.
   */
  function get_max_zindex(dom_element) {
    var max_zindex = parseInt($(dom_element).css('z-index'));
    $(dom_element).parent().find('*').each(function() {
      var zindex = parseInt($(this).css('z-index'));
      if (max_zindex < zindex)
        max_zindex = zindex;
    });
    return max_zindex;
  };

  /**
   * Helper function to set highest z-index on element within DOM (sub)tree.
   */
  function set_highest_zindex(dom_element) {
    var zindex = get_max_zindex(dom_element);
    $(dom_element).css('z-index', zindex + 1);
  }

  /**
   * Helper function to use chosen library on form element.
   */
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

  /**
   * Helper function to use chosen library on form element with support for multiple values.
   */
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

  /**
   * Callback to extract youtube resource url from embed or watch url.
   */
  function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
      return match[7];
    }
    else {
      return false;
    }
  }

  /**
   * Callback to extract vimeo resource url url.
   */
  function vimeo_parser(url) {
    var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
    return m ? m[2] || m[1] : false;
  }

  /**
   * Helper function to convert relative url to absolute url. Possibly only used by glazed_frontend via param type (image select).
   */
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

  /**
   * Helper function to render select element from options.
   */
  function get_select(options, name, value) {
    var select = '<select name="' + name + '" class="form-control">';
    select += '<option value="">' + Drupal.t("Select") + '</option>';
    for (var key in options) {
      if (key == value)
        select += '<option value="' + key + '" selected>' + options[key] + '</option>';
      else
        select += '<option value="' + key + '">' + options[key] + '</option>';
    }
    select += '/<select>';
    return select;
  }

  /**
   * Helper function to render bootstrap alert message.
   */
  function get_alert(message) {
    return '<div class="alert alert-warning" role="alert"><span class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">' + Drupal.t('Close') + '</span></span>' +
      message + '</div>';
  }

  /**
   * Function like $.closest(selector) but only for descendants.
   */
  $.fn.closest_descendents = function(filter) {
    var $found = $(),
      $currentSet = this;
    while ($currentSet.length) {
      $found = $.merge($found, $currentSet.filter(filter));
      $currentSet = $currentSet.not(filter);
      $currentSet = $currentSet.children();
    }
    return $found;
  }

  /**
   * Helper function to normalize form data values
   */
  function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  /**
   * Helper function to deserialize form data
   */
  $.fn.deserialize = function(data) {
    var f = $(this),
      map = {};
    //Get map of values
    $.each(data.split("&"), function() {
        var nv = this.split("="),
          n = rawurldecode(nv[0]),
          v = nv.length > 1 ? rawurldecode(nv[1]) : null;
        if (!(n in map)) {
          map[n] = [];
        }
        map[n].push(v);
      })
      //Set values for all form elements in the data
    $.each(map, function(n, v) {
        f.find("[name='" + n + "']").val(v[0].replace(/\+/g, " "));
        if (v[0].replace(/\+/g, " ") == 'on') {
          f.find("[type='checkbox'][name='" + n + "']").attr('checked', 'checked');
        }
        f.find("select[name='" + n + "'] > option").removeAttr('selected');
        for (var i = 0; i < v.length; i++) {
          f.find("select[name='" + n + "'] > option[value='" + v[i] + "']").prop('selected', 'selected');
        }
      })
      //Uncheck checkboxes and radio buttons not in the form data
    $("input:checkbox:checked,input:radio:checked", f).each(function() {
      if (!($(this).attr("name") in map)) {
        this.checked = false;
      }
    })

    return this;
  };

 /**
  * Glazed Builder Asset Loading Functions
  */
  window.glazed_add_css = function(path, callback) {
    var url = window.glazed_baseurl + path;
    if ($('link[href*="' + url + '"]').length || 'glazed_exported' in window) {
      callback();
      return;
    }
    var head = document.getElementsByTagName('head')[0];
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    stylesheet.href = url;
    stylesheet.onload = callback;
    head.appendChild(stylesheet);
  }
  window.glazed_add_js_list = function(options) {
    if ('loaded' in options && options.loaded) {
      options.callback();
    }
    else {
      var counter = 0;
      for (var i = 0; i < options.paths.length; i++) {
        glazed_add_js({
          path: options.paths[i],
          callback: function() {
            counter++;
            if (counter == options.paths.length) {
              options.callback();
            }
          }
        });
      }
    }
  }
  window.glazed_add_js = function(options) {
    if ('loaded' in options && options.loaded || 'glazed_exported' in window) {
      options.callback();
    }
    else {
      glazed_add_external_js(window.glazed_baseurl + options.path, 'callback' in options ? options.callback :
        function() {});
    }
  }
  window.glazed_add_external_js = function(url, callback) {
      if (url in glazed_js_waiting_callbacks) {
        glazed_js_waiting_callbacks[url].push(callback);
        return;
      }
      else {
        if (url in glazed_loaded_js) {
          callback();
          return;
        }
      }
      glazed_js_waiting_callbacks[url] = [callback];
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onload = function() {
        glazed_loaded_js[url] = true;
        while (url in glazed_js_waiting_callbacks) {
          var callbacks = glazed_js_waiting_callbacks[url];
          glazed_js_waiting_callbacks[url] = undefined;
          delete glazed_js_waiting_callbacks[url];
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
        }
      };
      head.appendChild(script);
    }

