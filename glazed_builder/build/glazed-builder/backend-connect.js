  /**
   * Check user access, load controls
   */
  function glazed_login(callback) {
    if ('glazed_editor' in window) {
      callback(window.glazed_editor);
      return;
    }
    if (window.glazed_online) {
      if ('glazed_ajaxurl' in window) {
        $.ajax({
          type: 'POST',
          url: window.glazed_ajaxurl,
          data: {
            action: 'glazed_login',
            url: window.location.href,
          },
          dataType: "json",
          cache: false,
          context: this
        }).done(function(data) {
          callback(data);
        });
      }
    }
    else {
      callback(false);
    }
  }

  /**
   * Check user access, load controls
   */
  function glazed_get_container_types(callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_get_container_types',
          url: window.location.href,
        },
        dataType: "json",
        cache: false,
        context: this
      }).done(function(data) {
        callback(data);
      });
    }
  }

  /**
   * Callback that lists all entity fields
   */
  function glazed_get_container_names(container_type, callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_get_container_names',
          container_type: container_type,
          url: window.location.href,
        },
        dataType: "json",
        cache: false,
        context: this
      }).done(function(data) {
        callback(data);
      });
    }
  }

  /**
   * Save Glazed Container Contents
   */
  function glazed_save_container(type, name, shortcode) {
    typeArray = type.split('|');
    nameArray = name.split('|');
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_save_container',
          type: type,
          name: name,
          lang: window.glazed_lang,
          shortcode: enc(encodeURIComponent(shortcode)),
        },
        dataType: "json",
        cache: false,
        context: this
      }).done(function(data) {
        $.notify(Drupal.t('Saved ' + nameArray[1] + ' field'), {
          type: 'success',
          z_index: '8000',
          offset: {
            x: 25,
            y: 70
          }
        }); // y offset for toolbar + shortcut bar
      }).fail(function(data) {
        $.notify(Drupal.t('Server error: Unable to save page'), {
          type: 'danger',
          z_index: '8000',
          offset: {
            x: 25,
            y: 70
          }
        });
      });
    }
  }

  /**
   * Load Glazed Container contents.
   */
  function glazed_load_container(type, name, callback) {
    if (glazed_containers_loaded.hasOwnProperty(type + '/' + name)) {
      callback(glazed_containers_loaded[type + '/' + name]);
      return;
    }
    if (window.glazed_online) {
      if ('glazed_ajaxurl' in window) {
        $.ajax({
          type: 'POST',
          url: window.glazed_ajaxurl,
          data: {
            action: 'glazed_load_container',
            type: type,
            name: name,
          },
          cache: !window.glazed_editor,
        }).done(function(data) {
          glazed_containers_loaded[type + '/' + name] = data;
          callback(data);
        }).fail(function() {
          callback('');
        });
      }
    }
  }

  /**
   * Load Drupal Elements (Blocks, Views).
   */
  function glazed_builder_get_cms_element_names(callback) {
    if ('glazed_cms_element_names' in window) {
      callback(window.glazed_cms_element_names);
      return;
    }
    if (window.glazed_online) {
      if ('glazed_ajaxurl' in window) {
        $.ajax({
          type: 'POST',
          url: window.glazed_ajaxurl,
          data: {
            action: 'glazed_builder_get_cms_element_names',
            url: window.location.href,
          },
          dataType: "json",
          cache: false,
          context: this
        }).done(function(data) {
          callback(data);
        }).fail(function() {
          callback(false);
        });
      }
      else {
        callback(false);
      }
    }
    else {
      callback(false);
    }
  }

  /**
   * Callback to load Drupal element contents.
   */
  function glazed_builder_load_cms_element(name, settings, container, data, callback) {
    if ('glazed_ajaxurl' in window) {
      data.originalPath = Drupal.settings.glazed_builder.currentPath;
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_builder_load_cms_element',
          name: name,
          settings: settings,
          container: container,
          data: data
        },
        dataType: "json",
        cache: !window.glazed_editor
      }).done(function(data) {
        $(data.css).appendTo($('head'));
        $(data.js).appendTo($('head'));
        $.extend(true, Drupal.settings, data.settings);
        callback(data.data);
      });
    }
  }

  /**
   * Callback to load settings for all Drupal Elements (blocks, views).
   */
  function glazed_get_cms_element_settings(name, callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_get_cms_element_settings',
          name: name,
          url: window.location.href,
        },
        cache: !window.glazed_editor,
      }).done(function(data) {
        callback(data);
      });
    }
  }

  /**
   * Load all sidebar templates.
   */
  function glazed_get_elements(callback) {
    if ('glazed_template_elements' in window) {
      for (var name in window.glazed_template_elements) {
        window.glazed_template_elements[name].html = decodeURIComponent(window.glazed_template_elements[name].html);
      }
      callback(window.glazed_template_elements);
      return;
    }
  }

  /**
   * Load all user templates.
   */
  function glazed_get_templates(callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_get_templates',
          url: window.location.href,
        },
        dataType: "json",
        cache: false,
        context: this
      }).done(function(data) {
        callback(data);
      });
    }
  }

  /**
   * Load contents for user template.
   */
  function glazed_load_template(name, callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_load_template',
          url: window.location.href,
          name: name,
        },
        cache: false,
      }).done(function(data) {
        callback(data);
      }).fail(function() {
        callback('');
      });
    }
    else {
      var url = window.glazed_baseurl + '../glazed_templates/' + name;
      $.ajax({
        url: url,
        cache: false,
      }).done(function(data) {
        callback(data);
      }).fail(function() {
        callback('');
      });
    }
  }

  /**
   * Save user template.
   */
  function glazed_save_template(name, template) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_save_template',
          url: window.location.href,
          name: name,
          template: template,
        },
        cache: false,
        context: this
      }).done(function(data) {});
    }
  }

  /**
   * Delete user template.
   */
  function glazed_delete_template(name) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_delete_template',
          url: window.location.href,
          name: name,
        },
        cache: false,
        context: this
      }).done(function(data) {});
    }
  }

  /**
   * List all page templates.
   */
  function glazed_get_page_templates(callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_get_page_templates',
          url: window.location.href,
        },
        dataType: "json",
        cache: false,
        context: this
      }).done(function(data) {
        callback(data);
      });
    }
  }

  /**
   * Load contents for page template.
   */
  function glazed_load_page_template(uuid, callback) {
    if ('glazed_ajaxurl' in window) {
      $.ajax({
        type: 'POST',
        url: window.glazed_ajaxurl,
        data: {
          action: 'glazed_load_page_template',
          url: window.location.href,
          uuid: uuid,
        },
        cache: false,
      }).done(function(data) {
        callback(data);
      }).fail(function() {
        callback('');
      });
    }
  }
