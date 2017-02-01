
  glazed_elements = new glazedElements();

  function toggle_editor_controls() {
    if (window.glazed_editor) {
      glazed_add_css('vendor/font-awesome/css/font-awesome.min.css', function() {});
      if ($('#glazed-clipboard').length == 0) {
        $('body').prepend('<div id="glazed-clipboard" style="display:none"></div>');
      }
      glazed_add_js({
        path: 'vendor/chosen/chosen.jquery.min.js'
      });
      glazed_add_css('vendor/chosen/chosen.min.css', function() {});
      for (var id in glazed_elements.elements_instances) {
        var el = glazed_elements.elements_instances[id];
        if (el instanceof ContainerElement) {
          $(el.dom_element).addClass('glazed-editor');
        }
        if (el.controls == null) {
          el.show_controls();
        }
        el.update_sortable();
      }
      $('#az-exporter').show();
    }
    else {
      for (var id in glazed_elements.elements_instances) {
        var el = glazed_elements.elements_instances[id];
        if (el instanceof ContainerElement) {
          $(el.dom_element).removeClass('glazed-editor');
        }
        if (el.controls != null) {
          $(el.controls).remove();
        }
        el.update_empty();
      }
      $('#az-exporter').hide();
    }
  }

  function try_login() {
    if (!('glazed_ajaxurl' in window))
      if (!window.glazed_editor || window.glazed_online)
        delete window.glazed_editor;
    glazed_login(function(data) {
      window.glazed_editor = data;
      $(function() {
        toggle_editor_controls();
      })
    });
  }
  try_login();

  function onReadyFirst(completed) {
    $.holdReady(true);
    if (document.readyState === "complete") {
      setTimeout(completed);
    }
    else if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", completed, false);
      window.addEventListener("load", completed, false);
    }
    else {
      document.attachEvent("onreadystatechange", completed);
      window.attachEvent("onload", completed);
    }
  }
  onReadyFirst(function() {
    glazed_load();
    $.holdReady(false);
  });

  function connect_container(dom_element) {
    if ($(dom_element).length > 0) {
      var html = $(dom_element).html();
      var match = /^\s*\<[\s\S]*\>\s*$/.exec(html);
      if (match || (html == '' && 'glazed_ajaxurl' in window)) {
        $(dom_element).find('> script').detach().appendTo('head');
        $(dom_element).find('> link[href]').detach().appendTo('head');
        //$(dom_element).find('> script').remove();
        //$(dom_element).find('> link[href]').remove();
        var container = new ContainerElement(null, false);
        container.attrs['container'] = $(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name');
        container.dom_element = $(dom_element);
        $(container.dom_element).attr('data-az-id', container.id);
        //container.dom_content_element = $(dom_element).closest_descendents('[data-azcnt]');
        container.dom_content_element = $(dom_element);
        $(container.dom_element).css('display', '');
        $(container.dom_element).addClass('glazed');
        $(container.dom_element).addClass('az-ctnr');
        container.parse_html(container.dom_content_element);
        container.html_content = true;
        container.loaded_container = container.attrs['container'];
        for (var i = 0; i < container.children.length; i++) {
          container.children[i].recursive_render();
        }
        if (!glazed_frontend) {
          container.dom_content_element.empty();
          if (window.glazed_editor) {
            container.show_controls();
            container.update_sortable();
          }
          container.attach_children();
        }
        container.rendered = true;
        for (var i = 0; i < container.children.length; i++) {
          container.children[i].recursive_showed();
        }
      }
      else {
        if (html.replace(/^\s+|\s+$/g, '') != '')
          glazed_containers_loaded[$(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name')] =
          html.replace(/^\s+|\s+$/g, '');
        var container = new ContainerElement(null, false);
        container.attrs['container'] = $(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name');
        container.render($);
        var classes = $(container.dom_element).attr('class') + ' ' + $(dom_element).attr('class');
        classes = $.unique(classes.split(' ')).join(' ');
        $(container.dom_element).attr('class', classes);
        $(container.dom_element).attr('style', $(dom_element).attr('style'));
        $(container.dom_element).css('display', '');
        $(container.dom_element).addClass('glazed');
        $(container.dom_element).addClass('az-ctnr');
        var type = $(dom_element).attr('data-az-type');
        var name = $(dom_element).attr('data-az-name');
        $(dom_element).replaceWith(container.dom_element);
        $(container.dom_element).attr('data-az-type', type);
        $(container.dom_element).attr('data-az-name', name);
        container.showed($);
        if (window.glazed_editor)
          container.show_controls();
      }
      if (window.glazed_editor) {
        $(container.dom_element).addClass('glazed-editor');
      }
      return container;
    }
    return null;
  }
  var glazed_loaded = false;

  function glazed_load() {
    if (glazed_loaded)
      return;
    glazed_loaded = true;
     if (Drupal.settings.glazed_builder.hasOwnProperty('DisallowContainers'));
    var glazedDisallowContainer = Drupal.settings.glazed_builder.DisallowContainers;
    $('.az-container').each(function() {
      var containerId = $(this).attr('data-az-name')
      if ($.inArray(containerId, glazedDisallowContainer) == -1) {
        var container = connect_container(this);
        if (container)
          glazed_containers.push(container);
      }
    });
    if (window.glazed_editor) {
      if ($('#glazed-clipboard').length == 0) {
        $('body').prepend('<div id="glazed-clipboard" class="glazed-backend" style="display:none"></div>');
      }
    }
  }
  $.fn.glazed_builder = function(method) {
    var methods = {
      init: function(options) {
        var settings = $.extend({
          'test': 'test',
        }, options);
        return this.each(function() {
          var textarea = this;
          var container = $(this).data('glazed_builder');
          if (!container) {
            var dom = $('<div>' + $(textarea).val() + '</div>')[0];
            $(dom).find('> script').remove();
            $(dom).find('> link[href]').remove();
            $(dom).find('> .az-container > script').remove();
            $(dom).find('> .az-container > link[href]').remove();
            $(textarea).css('display', 'none');
            var container_dom = null;
            if ($(dom).find('> .az-container[data-az-type][data-az-name]').length > 0) {
              container_dom = $(dom).children().insertAfter(textarea);
            }
            else {
              var type = 'textarea';
              var name = Math.random().toString(36).substr(2);
              if (window.glazed_online) {
                type = window.glazed_type;
                name = window.glazed_name;
              }
              container_dom = $('<div class="az-element az-container" data-az-type="' + type +
                '" data-az-name="' + name + '"></div>').insertAfter(textarea);
              container_dom.append($(dom).html());
            }

            window.glazed_title['Save container'] = Drupal.t(
              'Generate HTML and JS for all elements which placed in current container element.');
            var container = connect_container(container_dom);
            if (container) {
              glazed_containers.push(container);
              $(textarea).data('glazed_builder', container);

              container.save_container = function() {
                glazed_add_js({
                  path: 'jsON-js/json2.min.js',
                  loaded: 'JSON' in window,
                  callback: function() {
                    _.defer(function() {
                      if (container.id in glazed_elements.elements_instances) {
                        var html = container.get_container_html();
                        if (window.glazed_online) {
                          $(textarea).val(html);
                        }
                        else {
                          var type = container.attrs['container'].split('/')[0];
                          var name = container.attrs['container'].split('/')[1];
                          $(textarea).val('<div class="az-element az-container" data-az-type="' +
                            type + '" data-az-name="' + name + '">' + html + '</div>');
                        }
                      }
                    });
                  }
                });
              };
              $(document).on("glazed_add_element", container.save_container);
              $(document).on("glazed_edited_element", container.save_container);
              $(document).on("glazed_update_element", container.save_container);
              $(document).on("glazed_delete_element", container.save_container);
              $(document).on("glazed_update_sorting", container.save_container);
            }
          }
        });
      },
      show: function() {
        this.each(function() {});
      },
      hide: function() {
        this.each(function() {
          var container = $(this).data('glazed_builder');
          if (container) {
            glazed_elements.delete_element(container.id);
            for (var i = 0; i < container.children.length; i++) {
              container.children[i].remove();
            }
            $(container.dom_element).remove();
            $(this).removeData('glazed_builder');

            $(this).css('display', '');
          }
        });
      },
    };
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error(method);
    }
  };