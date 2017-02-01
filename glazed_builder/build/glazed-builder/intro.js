(function($) {
  /**
   * Glazed Builder Drag and Drop Visual HTML & Drupal Editor by SooperThemes.
   *
   * Users Bootstrap framework together with Drupal and various 3rd party
   * libraries to give rich site building experience without coding
   *
   */

  /**
   * Enabling Ajax cache for ajax datatype script.
   */
  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (options.dataType == 'script' || originalOptions.dataType == 'script') {
      options.cache = true;
    }
  });

  /**
   * Locale
   */
  function glazed_lang() {
    if ('glazed_lang' in window) {
      return window.glazed_lang;
    } else {
      return 'en';
    }
  }

  /**
   * Legacy setup stuff @todo document or remove.
   */
  if (!('glazed_baseurl' in window)) {
    if ($('script[src*="glazed_builder.js"]').length > 0) {
      var glazed_builder_src = $('script[src*="glazed_builder.js"]').attr('src');
      window.glazed_baseurl = glazed_builder_src.slice(0, glazed_builder_src.indexOf('glazed_builder.js'));
    }
    else {
      if ($('script[src*="glazed_builder.min.js"]').length > 0) {
        var glazed_builder_src = $('script[src*="glazed_builder.min.js"]').attr('src');
        window.glazed_baseurl = glazed_builder_src.slice(0, glazed_builder_src.indexOf('glazed_builder.min.js'));
      }
    }
  }
  if (!('glazed_online' in window))
    window.glazed_online = (window.location.protocol == 'http:' || window.location.protocol == 'https:');