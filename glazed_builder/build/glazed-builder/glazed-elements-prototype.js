
  /**
   * Initiate glazedElements object
   */
  function glazedElements() {}

  /**
   * Extend glazedElements base object with glazedElements methods and variables
   */
  mixin(glazedElements.prototype, {
    elements_instances: {},
    elements_instances_by_an_name: {},
    template_elements_loaded: false,
    cms_elements_loaded: false,
    edit_stack: [],
    try_render_unknown_elements: function() {
      if (this.template_elements_loaded && this.cms_elements_loaded) {
        for (var id in glazed_elements.elements_instances) {
          var el = glazed_elements.elements_instances[id];
          if (el instanceof UnknownElement) {
            var shortcode = el.attrs['content'];
            var match = /^\s*\<[\s\S]*\>\s*$/.exec(shortcode);
            if (match)
              BaseElement.prototype.parse_html.call(el, shortcode);
            else
              BaseElement.prototype.parse_shortcode.call(el, shortcode);
            for (var i = 0; i < el.children.length; i++) {
              el.children[i].recursive_render();
            }
            $(el.dom_content_element).empty();
            el.attach_children();
            if (window.glazed_editor)
              el.update_sortable();
            el.recursive_showed();
          }
        }
      }
    },
    create_template_elements: function(elements) {
      var urls_to_update = {
        'link[href]': 'href',
        'script[src]': 'src',
        'img[src]': 'src',
      };
      if ('glazed_urls_to_update' in window)
        urls_to_update = $.extend(urls_to_update, window.glazed_urls_to_update);
      var editable = [];
      if ('glazed_editable' in window)
        editable = window.glazed_editable;
      var styleable = [];
      if ('glazed_styleable' in window)
        styleable = window.glazed_styleable;
      var sortable = [];
      if ('glazed_sortable' in window)
        sortable = window.glazed_sortable;
      var synchronizable = [];
      if ('glazed_synchronizable' in window)
        synchronizable = window.glazed_synchronizable;
      var restoreable = [];
      if ('glazed_restoreable' in window)
        restoreable = window.glazed_restoreable;
      var containable = [];
      if ('glazed_containable' in window)
        containable = window.glazed_containable;
      // Recognise icons in sidebar elements
      var icons = BaseParamType.prototype.param_types['icon'].prototype.icons.map(function(item, i, arr) {
        return item.replace(/^/, '.').replace(/ /, '.')
      });
      var icon_selector = icons.join(', ');
      for (var path in elements) {
        var name = elements[path].name;
        var template = elements[path].html;
        var folders = path.split('|');
        folders.pop();
        folders = folders.join('/')
        var element_baseurl = window.glazed_baseurl + '../glazed_elements/' + folders + '/';
        if ('baseurl' in elements[path])
          element_baseurl = elements[path].baseurl;
        var thumbnail = '';
        if ('thumbnail' in elements[path])
          thumbnail = elements[path].thumbnail;
        var section = (template.indexOf('az-rootable') >= 0);

        var TemplateElement = function(parent, position) {
          var element = this;
          for (var i = 0; i < this.baseclass.prototype.params.length; i++) {
            if (this.baseclass.prototype.params[i].param_name == 'content' && this.baseclass.prototype.params[
                i].value == '') {
              if ('glazed_ajaxurl' in window) {
                function template_element_urls(dom) {
                  function update_url(url) {
                    if (url.indexOf("glazed_elements") == 0) {
                      return window.glazed_baseurl + '../' + url;
                    }
                    else {
                      if (url.indexOf("/") != 0 && url.indexOf("http://") != 0 && url.indexOf("https://") !=
                        0) {
                        return element.baseurl + url;
                      }
                    }
                    return url;
                  }
                  for (var selector in urls_to_update) {
                    var attr = urls_to_update[selector];
                    $(dom).find(selector).each(function() {
                      $(this).attr(attr, update_url($(this).attr(attr)));
                    });
                  }
                  $(dom).find('[data-az-url]').each(function() {
                    var attr = $(this).attr('data-az-url');
                    $(this).attr(attr, update_url($(this).attr(attr)));
                  });
                  $(dom).find('[style*="background-image"]').each(function() {
                    var style = $(this).attr('style').replace(/background-image[: ]*url\(([^\)]+)\) *;/,
                      function(match, url) {
                        return match.replace(url, encodeURI(update_url(decodeURI(url))));
                      });
                    $(this).attr('style', style);
                  });
                }
                var template = $('<div>' + element.template + '</div>');
                template_element_urls(template);
                template = $(template).html();
                this.baseclass.prototype.params[i].value = template;
              }
              break;
            }
          }
          BaseElement.apply(this, arguments);
        }
        register_element(name, false, TemplateElement);
        mixin(TemplateElement.prototype, {
          baseclass: TemplateElement,
          template: template,
          baseurl: element_baseurl,
          path: path,
          name: name,
          icon: 'fa fa-cube',
          description: Drupal.t(''),
          thumbnail: thumbnail,
          params: [
            make_param_type({
              type: 'html',
              heading: Drupal.t('Content'),
              param_name: 'content',
              value: '',
            }),
          ].concat(TemplateElement.prototype.params),
          show_settings_on_create: false,
          is_container: true,
          has_content: true,
          section: section,
          category: Drupal.t('Template-elements'),
          is_template_element: true,
          editable: ['.az-editable'].concat(editable),
          styleable: ['.az-styleable'].concat(styleable),
          sortable: ['.az-sortable'].concat(sortable),
          synchronizable: ['.az-synchronizable'].concat(synchronizable),
          restoreable: ['.az-restoreable'].concat(restoreable),
          containable: ['.az-containable'].concat(containable),
          restore_nodes: {},
          contained_elements: {},
          show_controls: function() {
            if (window.glazed_editor) {
              var element = this;
              BaseElement.prototype.show_controls.apply(this, arguments);
              var editor_opener = function() {
                if (glazed_elements.edit_stack.length > 0) {
                  var args = glazed_elements.edit_stack.shift();
                  $(args.node).css('outline-width', '2px');
                  $(args.node).css('outline-style', 'dashed');
                  var interval = setInterval(function() {
                    if ($(args.node).css('outline-color') != 'rgb(255, 0, 0)')
                      $(args.node).css('outline-color', 'rgb(255, 0, 0)');
                    else
                      $(args.node).css('outline-color', 'rgb(255, 255, 255)');
                  }, 100);
                  setTimeout(function() {
                    clearInterval(interval);
                    $(args.node).css('outline-color', '');
                    $(args.node).css('outline-width', '');
                    $(args.node).css('outline-style', '');
                    open_editor(args.node, args.edit, args.style, function() {
                      if (glazed_elements.edit_stack.length > 0) {
                        var s1 = $(args.node).width() * $(args.node).height();
                        var s2 = $(glazed_elements.edit_stack[0].node).width() * $(
                          glazed_elements.edit_stack[0].node).height();
                        if (s2 / s1 < 2) {
                          editor_opener();
                        }
                        else {
                          glazed_elements.edit_stack = [];
                        }
                      }
                    });
                  }, 500);
                }
              }

              function open_editor(node, edit, style, callback) {
                var params = [];
                var image = '';
                var link = '';
                var icon = '';
                var content = $.trim($(node).text());
                if (content != '') {
                  content = $(node).html();
                }
                else {
                  content = '&nbsp;&nbsp;&nbsp;';
                }
                if (edit) {
                  if ($(node).is(icon_selector)) {
                    for (var i = 0; i < icons.length; i++) {
                      if ($(node).is(icons[i])) {
                        icon = icons[i].split('.');
                        icon.shift();
                        icon = icon.join(' ');
                        break;
                      }
                    }
                    params.push(make_param_type({
                      type: 'icon',
                      heading: Drupal.t('Icon'),
                      param_name: 'icon',
                    }));
                  }
                  else {
                    if ($(node).prop("tagName") != 'IMG') {
                      if (content != '') {
                        params.push(make_param_type({
                          type: 'textarea',
                          heading: Drupal.t('Content'),
                          param_name: 'content',
                        }));
                      }
                    }
                    else {
                      image = $(node).attr('src');
                      params.push(make_param_type({
                        type: 'image',
                        heading: Drupal.t('Image'),
                        param_name: 'image',
                        description: Drupal.t('Select image from media library.'),
                      }));
                    }
                    if ($(node).prop("tagName") == 'A') {
                      link = $(node).attr('href');
                      params.push(make_param_type({
                        type: 'link',
                        heading: Drupal.t('Link'),
                        param_name: 'link',
                        description: Drupal.t('Content link (url).'),
                      }));
                    }
                  }
                }
                if (style) {
                  params.push(make_param_type({
                    type: 'textfield',
                    heading: Drupal.t('Content classes'),
                    param_name: 'el_class',
                    description: Drupal.t(
                      'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.'
                    )
                  }));
                  var param_type = make_param_type({
                    type: 'style',
                    heading: Drupal.t('Content style'),
                    param_name: 'style',
                    description: Drupal.t('Style options.'),
                    tab: Drupal.t('Style')
                  });
                  if (edit)
                    params.push(param_type);
                  else
                    params.unshift(param_type);
                }
                $(node).removeClass('editable-highlight');
                $(node).removeClass('styleable-highlight');
                $(node).removeClass(icon);
                var classes = $(node).attr('class');
                $(node).addClass(icon);
                if (typeof classes === typeof undefined || classes === false) {
                  classes = '';
                }
                var styles = '';
                for (var name in node.style) {
                  if ($.isNumeric(name)) {
                    styles = styles + node.style[name] + ': ' + node.style.getPropertyValue(node.style[
                      name]) + '; ';
                  }
                }
                styles = rgb2hex(styles);
                styles = styles.replace(/\-value\: /g, ': ');
                styles = styles.replace('border-top-color', 'border-color');
                styles = styles.replace('border-top-left-radius', 'border-radius');
                styles = styles.replace('border-top-style', 'border-style');
                styles = styles.replace('background-position-x: 50%; background-position-y: 50%;',
                  'background-position: center;');
                styles = styles.replace('background-position-x: 50%; background-position-y: 100%;',
                  'background-position: center bottom;');
                styles = styles.replace('background-repeat-x: no-repeat; background-repeat-y: no-repeat;',
                  'background-repeat: no-repeat;');
                styles = styles.replace('background-repeat-x: repeat;', 'background-repeat: repeat-x;');
                BaseParamType.prototype.show_editor(params, {
                  name: Drupal.t('Content'),
                  attrs: {
                    'content': content,
                    'link': link,
                    'image': image,
                    'el_class': classes,
                    'style': styles,
                    'icon': icon
                  }
                }, function(values) {
                  if (edit) {
                    if (icon != '') {
                      $(node).removeClass(icon);
                      values['el_class'] = values['el_class'] + ' ' + values['icon'];
                    }
                    if ($(node).prop("tagName") == 'A') {
                      $(node).attr('href', values['link']);
                    }
                    if ($(node).prop("tagName") == 'IMG') {
                      $(node).attr('src', values['image']);
                    }
                    else {
                      if (content != '' && values['content'] != '') {
                        $(node).html(values['content']);
                      }
                      else {
                        $(node).html('&nbsp;&nbsp;&nbsp;');
                      }
                    }
                  }
                  if (style) {
                    $(node).attr('class', values['el_class']);
                    $(node).attr('style', values['style']);
                  }
                  element.attrs['content'] = $(element.dom_content_element).html();
                  element.restore_content();
                  synchronize();
                  able();
                  callback();
                });
              }

              function make_node_signature(dom) {
                var cdom = $(dom).clone();
                $(cdom).find('*').each(function() {
                  var elem = this;
                  while (elem.attributes.length > 0)
                    elem.removeAttribute(elem.attributes[0].name);
                });
                var html = $(cdom).html();
                html = html.replace(/\s*/g, '');
                return html;
              }

              function synchronize() {
                sortable_disable();
                for (var i = 0; i < element.synchronizable.length; i++) {
                  $(element.dom_content_element).find(element.synchronizable[i]).each(function() {
                    if ($(this).closest('[data-az-restore]').length == 0) {
                      $(this).find('.editable-highlight').removeClass('editable-highlight');
                      $(this).find('.styleable-highlight').removeClass('styleable-highlight');
                      $(this).find('.sortable-highlight').removeClass('sortable-highlight');
                      $(this).find('[class=""]').removeAttr('class');
                      $(this).find('[style=""]').removeAttr('style');
                      var synchronized = $(this).data('synchronized');
                      if (synchronized) {
                        for (var i = 0; i < synchronized.length; i++) {
                          $(synchronized[i]).html($(this).html());
                        }
                      }
                      if ($(this).data('current-state')) {
                        $(document).trigger("glazed_synchronize", {
                          from_node: this,
                          old_state: $(this).data('current-state'),
                          new_state: $(this).html()
                        });
                      }
                      else {
                        $(document).trigger("glazed_synchronize", {
                          from_node: this,
                          old_state: make_node_signature(this),
                          new_state: $(this).html()
                        });
                      }
                      $(this).data('current-state', make_node_signature(this));
                      element.attrs['content'] = $(element.dom_content_element).html();
                      element.restore_content();
                    }
                  });
                }
                able();
              }
              $(document).on("glazed_synchronize", function(sender, data) {
                sortable_disable();
                for (var i = 0; i < element.synchronizable.length; i++) {
                  $(element.dom_content_element).find(element.synchronizable[i]).each(function() {
                    if ($(this).closest('[data-az-restore]').length == 0) {
                      $(this).find('.editable-highlight').removeClass('editable-highlight');
                      $(this).find('.styleable-highlight').removeClass('styleable-highlight');
                      $(this).find('.sortable-highlight').removeClass('sortable-highlight');
                      $(this).find('[class=""]').removeAttr('class');
                      $(this).find('[style=""]').removeAttr('style');
                      if (this != data.from_node) {
                        if (make_node_signature(this) == data.old_state) {
                          var synchronized = $(data.from_node).data('synchronized');
                          if (!synchronized)
                            synchronized = [];
                          synchronized.push(this);
                          synchronized = $.unique(synchronized);
                          $(data.from_node).data('synchronized', synchronized);

                          synchronized = $(this).data('synchronized');
                          if (!synchronized)
                            synchronized = [];
                          synchronized.push(data.from_node);
                          synchronized = $.unique(synchronized);
                          $(this).data('synchronized', synchronized);

                          $(this).html(data.new_state);
                          element.attrs['content'] = $(element.dom_content_element).html();
                          element.restore_content();
                        }
                      }
                    }
                  });
                }
                able();
              });

              function sortable_disable() {
                for (var i = 0; i < element.sortable.length; i++) {
                  $(element.dom_content_element).find(element.sortable[i]).each(function() {
                    if ($(this).hasClass('ui-sortable')) {
                      if ($(this).data('sortable')) {
                        $(this).data('sortable', false);
                        $(this).sortable('destroy');
                        $(this).find('.ui-sortable-handle').removeClass('ui-sortable-handle');
                      }
                    }
                  });
                }
              }

              function sortable_enable() {
                for (var i = 0; i < element.sortable.length; i++) {
                  $(element.dom_element).find(element.sortable[i]).each(function() {
                    if ($(this).closest('[data-az-restore]').length == 0) {
                      $(this).data('sortable', true);
                      $(this).sortable({
                        items: '> *',
                        placeholder: 'az-sortable-placeholder',
                        forcePlaceholderSize: true,
                        start: function(event, ui) {
                          $(ui.item).removeClass('sortable-highlight').find(
                            '.az-sortable-controls').remove();
                        },
                        update: function(event, ui) {
                          element.attrs['content'] = $(element.dom_content_element).html();
                          element.restore_content();
                          synchronize();
                        },
                        over: function(event, ui) {
                          ui.placeholder.attr('class', ui.helper.attr('class'));
                          ui.placeholder.removeClass('ui-sortable-helper');
                          ui.placeholder.addClass('az-sortable-placeholder');
                        }
                      });
                    }
                  });
                }
              }

              function able() {
                for (var i = 0; i < element.restoreable.length; i++) {
                  $(element.dom_element).find(element.restoreable[i]).off('mouseenter.az-restoreable').on(
                    'mouseenter.az-restoreable',
                    function() {
                      $(this).addClass('restoreable-highlight');
                    });
                  $(element.dom_element).find(element.restoreable[i]).off('mouseleave.az-restoreable').on(
                    'mouseleave.az-restoreable',
                    function() {
                      $(this).removeClass('restoreable-highlight');
                    });
                  $(element.dom_element).find(element.restoreable[i]).off('click.az-restoreable').on(
                    'click.az-restoreable',
                    function(e) {
                      if ($(this).is('[data-az-restore]')) {
                        var params = [];
                        params.push(make_param_type({
                          type: 'html',
                          heading: Drupal.t('HTML'),
                          param_name: 'html',
                        }));
                        var id = $(this).attr('data-az-restore');
                        var html = element.restore_nodes[id];
                        BaseParamType.prototype.show_editor(params, {
                          name: Drupal.t('Content'),
                          attrs: {
                            'html': html
                          }
                        }, function(values) {
                          element.restore_nodes[id] = values['html'];
                          element.restore_content();
                          element.update_dom();
                          synchronize();
                        });
                        return false;
                      }
                    });
                }
                for (var i = 0; i < element.styleable.length; i++) {
                  $(element.dom_element).find(element.styleable[i]).off('mouseenter.az-styleable').on(
                    'mouseenter.az-styleable',
                    function() {
                      if ($(this).closest('[data-az-restore]').length == 0)
                        $(this).addClass('styleable-highlight');
                    });
                  $(element.dom_element).find(element.styleable[i]).off('mouseleave.az-styleable').on(
                    'mouseleave.az-styleable',
                    function() {
                      if ($(this).closest('[data-az-restore]').length == 0)
                        $(this).removeClass('styleable-highlight');
                    });
                  $(element.dom_element).find(element.styleable[i]).off('click.az-styleable').on(
                    'click.az-styleable',
                    function(e) {
                      if ($(this).closest('[data-az-restore]').length == 0) {
                        if ($(this).parent().closest('.styleable-highlight, .editable-highlight').length ==
                          0) {
                          glazed_elements.edit_stack.push({
                            node: this,
                            edit: false,
                            style: true,
                          });
                          editor_opener();
                          return false;
                        }
                        else {
                          glazed_elements.edit_stack.push({
                            node: this,
                            edit: false,
                            style: true,
                          });
                        }
                      }
                    });
                }
                for (var i = 0; i < element.editable.length; i++) {
                  $(element.dom_element).find(element.editable[i]).off('mouseenter.az-editable').on(
                    'mouseenter.az-editable',
                    function() {
                      if ($(this).closest('[data-az-restore]').length == 0)
                        $(this).addClass('editable-highlight');
                    });
                  $(element.dom_element).find(element.editable[i]).off('mouseleave.az-editable').on(
                    'mouseleave.az-editable',
                    function() {
                      if ($(this).closest('[data-az-restore]').length == 0)
                        $(this).removeClass('editable-highlight');
                    });
                  $(element.dom_element).find(element.editable[i]).off('click.az-editable').on(
                    'click.az-editable',
                    function(e) {
                      if ($(this).closest('[data-az-restore]').length == 0) {
                        if ($(this).parent().closest('.styleable-highlight, .editable-highlight').length ==
                          0) {
                          glazed_elements.edit_stack.push({
                            node: this,
                            edit: true,
                            style: true,
                          });
                          editor_opener();
                          return false;
                        }
                        else {
                          glazed_elements.edit_stack.push({
                            node: this,
                            edit: true,
                            style: true,
                          });
                        }
                      }
                    });
                }
                var sort_stack = [];
                var sorted_node = null;
                var timeoutId = null;

                function show_controls(node) {
                  if ($(node).hasClass('sortable-highlight')) {
                    $(node).find('.az-sortable-controls').remove();
                    var controls = $('<div class="az-sortable-controls"></div>').appendTo(node);
                    var clone = $('<div class="az-sortable-clone glyphicon glyphicon-repeat" title="' + Drupal.t('Clone') + '"></div>').appendTo(controls).click(
                      function() {
                        sortable_disable();
                        $(node).removeClass('sortable-highlight').find('.az-sortable-controls').remove();
                        $(node).clone().insertAfter(node);
                        element.attrs['content'] = $(element.dom_content_element).html();
                        element.restore_content();
                        synchronize();
                        able();
                        return false;
                      });
                    $(clone).css('line-height', $(clone).height() + 'px').css('font-size', $(clone).height() /
                      2 + 'px');
                    var remove = $('<div class="az-sortable-remove glyphicon glyphicon-trash" title="' + Drupal.t('Remove') + '"></div>').appendTo(controls).click(
                      function() {
                        sortable_disable();
                        $(node).removeClass('sortable-highlight').find('.az-sortable-controls').remove();
                        $(node).remove();
                        element.attrs['content'] = $(element.dom_content_element).html();
                        element.restore_content();
                        synchronize();
                        able();
                        return false;
                      });
                    $(remove).css('line-height', $(remove).height() + 'px').css('font-size', $(remove).height() /
                      2 + 'px');
                  }
                }
                $(element.dom_element).off('mousemove.az-able').on('mousemove.az-able', function() {
                  if (sorted_node != null && $(sorted_node).hasClass('sortable-highlight')) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function() {
                      show_controls(sorted_node);
                    }, 1000);
                  }
                });
                for (var i = 0; i < element.sortable.length; i++) {
                  (function(i) {
                    $(element.dom_element).find(element.sortable[i]).find('> *').off(
                      'mouseenter.az-sortable').on('mouseenter.az-sortable', function() {
                      if ($(this).closest('[data-az-restore]').length == 0) {
                        var node = this;
                        $(element.dom_element).find('.az-sortable-controls').remove();
                        $(element.dom_element).find('.sortable-highlight').removeClass(
                          'sortable-highlight');
                        if (sorted_node !== null) {
                          clearTimeout(timeoutId);
                        }

                        $(node).addClass('sortable-highlight');
                        sort_stack.push(node);
                        sorted_node = node;
                        timeoutId = setTimeout(function() {
                          show_controls(node);
                        }, 1000);
                      }
                    });
                    $(element.dom_element).find(element.sortable[i]).find('> *').off(
                      'mouseleave.az-sortable').on('mouseleave.az-sortable', function() {
                      if ($(this).closest('[data-az-restore]').length == 0) {
                        var node = this;
                        $(element.dom_element).find('.az-sortable-controls').remove();
                        $(element.dom_element).find('.sortable-highlight').removeClass(
                          'sortable-highlight');
                        if (sorted_node !== null) {
                          clearTimeout(timeoutId);
                        }

                        sort_stack.pop();
                        if (sort_stack.length > 0) {
                          node = sort_stack[sort_stack.length - 1]
                          $(node).addClass('sortable-highlight');

                          sorted_node = node;
                          timeoutId = setTimeout(function() {
                            show_controls(node);
                          }, 1000);
                        }
                        else {
                          sorted_node = null;
                        }
                      }
                    });
                  })(i);
                }
                sortable_enable();
              }
              able();
              synchronize();
            }
          },
          restore_content: function() {
            var element = this;
            var content = $('<div>' + this.attrs['content'] + '</div>');
            for (var id in this.restore_nodes) {
              $(content).find('[data-az-restore="' + id + '"]').html(this.restore_nodes[id]);
            }
            $(document).trigger('glazed_restore', {
              dom: content
            });
            this.attrs['content'] = $(content).html();
          },
          get_content: function() {
            this.restore_content();
            return BaseElement.prototype.get_content.apply(this, arguments);
          },
          restore: function(dom) {
            BaseElement.prototype.restore.apply(this, arguments);
            for (var id in this.restore_nodes) {
              $(dom).find('[data-az-restore="' + id + '"]').html(this.restore_nodes[id]);
            }
            $(document).trigger('glazed_restore', {
              dom: dom
            });
            $(dom).find('[data-az-restore]').removeAttr('data-az-restore');
          },
          showed: function($) {
            BaseElement.prototype.showed.apply(this, arguments);
            var element = this;
            if (element.section) {
              var container = $(element.dom_element).parent().closest('.container, .container-fluid');
              var container_path = $(element.dom_element).parentsUntil('.container, .container-fluid');
              var popup = $(element.dom_element).parent().closest('.az-popup-ctnr');
              var popup_path = $(element.dom_element).parentsUntil('.az-popup-ctnr');

              if ((container.length > 0 && popup.length == 0) || (container.length > 0 && popup.length >
                  0 && container_path.length < popup_path.length))
                $(element.dom_content_element).find('.container, .container-fluid').each(
                  function() {
                    $(this).removeClass(p + 'container');
                    $(this).removeClass(p + 'container-fluid');
                    element.attrs['content'] = $(element.dom_content_element).html();
                    element.restore_content();
                    element.section = false;
                  });
            }
          },
          render: function($) {
            var element = this;
            this.dom_element = $('<div class="az-element az-template ' + this.attrs['el_class'] +
              '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = $('<div></div>').appendTo(this.dom_element);
            var content = '<div>' + this.attrs['content'] + '</div>';
            content = $(content);
            element.restore_nodes = {};
            for (var i = 0; i < this.restoreable.length; i++) {
              $(content).find(this.restoreable[i]).each(function() {
                var id = _.uniqueId('r');
                $(this).attr('data-az-restore', id);
                element.restore_nodes[id] = $(this).html();
              });
            }
            this.attrs['content'] = $(content).html();
            $(this.attrs['content']).appendTo(this.dom_content_element);
            BaseElement.prototype.render.apply(this, arguments);
          },
        });
      }
      this.template_elements_loaded = true;
      make_glazed_extend();
      this.try_render_unknown_elements();
      $(function() {
        if (window.glazed_editor && Object.keys(elements).length > 0 && glazed_containers.length > 0) {
          var menu = {
            '_': []
          };
          for (var path in elements) {
            var folders = path.split('|');
            folders.pop();
            var current = menu;
            for (var i = 0; i < folders.length; i++) {
              if (!(folders[i] in current))
                current[folders[i]] = {
                  '_': []
                };
              current = current[folders[i]];
            }
            current['_'].push(elements[path]);
          }
          var panel = $('<div id="az-template-elements" class="az-left-sidebar glazed"></div>').appendTo(
            'body');
          var welcome = $('<div id="az-template-elements-welcome" class="glazed">' + Drupal.t(
            'Open the left panel to add Glazed drag and drop snippets.') + '</div>').appendTo(panel).hide();
          setTimeout(function(){ $(welcome).fadeIn(); }, 500);
          setTimeout(function(){ $(welcome).animate({height:'toggle'},600); }, 10000);
          $(panel).hover(function() {
            $(welcome).remove();
          });
          $('<div class="glazed-snippets-header clearfix"><img src="'
            + window.glazed_baseurl
            + 'images/glazed-logo-white.png">'
            + '<h3>' + Drupal.t('Glazed Snippets') + '</h3>'
            + '</div>')
            .appendTo(panel);

          function build_menu(item) {
            if (Object.keys(item).length === 1 && ('_' in item))
              return null;
            var m = $('<ul class="nav az-nav-list"></ul>');
            for (var name in item) {
              if (name != '_') {
                var li = $('<li></li>').appendTo(m).on('mouseenter', function() {
                  $(this).find('> .az-nav-list').css('display', 'block');
                });
                var it = item[name];
                (function(it) {
                  $('<a href="#">' + name + '</a>').appendTo(li).click(function() {
                    var menu_item = this;
                    $(thumbnails).empty();
                    $(thumbnails).css('display', 'block');
                    $(panel).addClass('az-thumbnails');

                    function get_all_thumbnails(item) {
                      for (var name in item) {
                        if (name == '_') {
                          for (var i = 0; i < item[name].length; i++) {
                            // $('<div class="az-thumbnail" data-az-base="' + item[name][i].name +
                            //   '" style="background-image: url(' + encodeURI(item[name][i].thumbnail) +
                            //   '); background-position: center center; background-size: cover;"></div>'
                            // ).appendTo(thumbnails);
                            $('<img class="az-thumbnail" data-az-base="' + item[name][i].name +
                              '" src="' + encodeURI(item[name][i].thumbnail) +
                              '">'
                            ).appendTo(thumbnails);
                          }
                        }
                        else {
                          get_all_thumbnails(item[name]);
                        }
                      }
                    }
                    get_all_thumbnails(it);
                    $(panel).off('mouseleave').on('mouseleave', function() {
                      if (!dnd) {
                        $(panel).css('left', '');
                        $(panel).removeClass('az-thumbnails');
                        $(thumbnails).css('overflow-y', 'scroll');
                        $(thumbnails).css('display', 'none');
                      }
                    });
                    var dnd = false;
                    var scrollTop = 0;
                    $(thumbnails).sortable({
                      items: '.az-thumbnail',
                      connectWith: '.az-ctnr',
                      start: function(event, ui) {
                        dnd = true;
                        $(panel).css('left', '0px');
                        $(thumbnails).css('overflow-y', 'visible');
                        scrollTop = $(window).scrollTop();
                        $(window).on('scroll.template-elements-sortable', function() {
                          $(window).scrollTop(scrollTop);
                        });
                      },
                      stop: function(event, ui) {
                        dnd = false;
                        $(panel).css('left', '');
                        $(panel).removeClass('az-thumbnails');
                        $(thumbnails).css('overflow-y', 'scroll');
                        $(thumbnails).css('display', 'none');
                        $(window).off('scroll.template-elements-sortable');
                      },
                      update: function(event, ui) {
                        var container = glazed_elements.get_element($(ui.item).parent().closest(
                          '[data-az-id]').attr('data-az-id'));
                        var postition = 0;
                        var children = $(ui.item).parent().find('[data-az-id], .az-thumbnail');
                        for (var i = 0; i < children.length; i++) {
                          if ($(children[i]).hasClass('az-thumbnail')) {
                            postition = i;
                            break;
                          }
                        }
                        var element = glazed_elements.create_element(container, $(ui.item).attr(
                          'data-az-base'), postition, function() {});
                        $(ui.item).detach();
                        $(menu_item).click();
                        $(window).scrollTop(scrollTop);
                      },
                      placeholder: 'az-sortable-placeholder',
                      forcePlaceholderSize: true,
                      over: function(event, ui) {
                        ui.placeholder.attr('class', ui.helper.attr('class'));
                        ui.placeholder.removeClass('ui-sortable-helper');
                        ui.placeholder.addClass('az-sortable-placeholder');
                      }
                    });
                    return false;
                  });
                })(it);
                $(li).append(build_menu(item[name]));
              }
            }
            return m;
          }
          $(panel).append(build_menu(menu));
          $(panel).find('> .az-nav-list > li').on('mouseleave', function() {
            $(this).find('.az-nav-list').css('display', 'none');
          });
          var thumbnails = $('<div id="az-thumbnails"></div>').appendTo(panel);
        }
      });
    },
    create_cms_elements: function(elements) {
      for (var key in elements) {
        var base = 'az_' + key;
        var CMSElement = function(parent, position) {
          CMSElement.baseclass.apply(this, arguments);
        };
        register_element(base, false, CMSElement);

        // Create object.
        var object = {
          name: elements[key],
          icon: 'fa fa-drupal',
          description: Drupal.t(''),
          category: 'CMS',
          instance: key,
          params: [
            make_param_type({
              type: 'cms_settings',
              heading: Drupal.t('Settings'),
              param_name: 'settings',
              instance: key,
            })
          ],
          show_settings_on_create: true,
          is_container: true,
          has_content: true,
          is_cms_element: true,
          get_button: function() {
            // Remove text "Block:" from name.
            var name = this.name.replace(/^Block: /, '');
            return '<div class="well text-center pull-left text-overflow glazed-cms" data-az-element="' + this.base + '"><i class="' + this.icon +
              '"></i>' + name + '</div>';
          },
          // Render button with attribute data-az-tag.
          get_button_with_tag: function() {
            var tag = '';
            // Remove text "View:" from name.
            var name = this.name.replace(/^View: /, '');
            if ($.inArray(window.glazed_views_tags, this.base > -1)) {
              tag = window.glazed_views_tags[this.base];
            }
            return '<div class="well text-center pull-left text-overflow glazed-cms" data-az-element="' + this.base + '" data-az-tag="' + tag +
              '"><i class="' + this.icon + '"></i>' + name + '</div>';
          },
          get_content: function() {
            return '';
          },
          showed: function($) {
            CMSElement.baseclass.prototype.showed.apply(this, arguments);
            if ('content' in this.attrs && this.attrs['content'] != '') {
              $(this.dom_content_element).append(this.attrs['content']);
              this.attrs['content'] = '';
            }
            else {
              var element = this;
              glazed_add_js({
                path: 'vendor/jquery.waypoints/lib/jquery.waypoints.min.js',
                loaded: 'waypoint' in $.fn,
                callback: function() {
                  $(element.dom_element).waypoint(function(direction) {
                    var container = element.parent.get_my_container();
                    var data = {
                      display_title: element.attrs['display_title'],
                      override_pager: element.attrs['override_pager'],
                      items: element.attrs['items'],
                      offset: element.attrs['offset'],
                      contextual_filter: element.attrs['contextual_filter'],
                      toggle_fields: element.attrs['toggle_fields'],
                    }
                    glazed_builder_load_cms_element(element.instance, element.attrs['settings'], container.attrs['container'], data,
                      function(data) {
                        $(element.dom_content_element).empty();
                        $(element.dom_content_element).append(data);
                        Drupal.attachBehaviors($(element.dom_content_element));
                      }, true);
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
            this.dom_element = $('<div class="az-element az-cms-element ' + this.attrs['el_class'] +
              '" style="' + this.attrs['style'] + '"></div>');
            this.dom_content_element = $('<div></div>').appendTo(this.dom_element);
            CMSElement.baseclass.prototype.render.apply(this, arguments);
          }
        };

        if (key.match(/^block-/)) {
          object.params.push(make_param_type({
            type: 'checkbox',
            heading: Drupal.t('Show title'),
            param_name: 'display_title',
            content: 'yes',
            value: {
              'yes': Drupal.t('Yes')
            }
          }));
        }

        // Condition for check views and if contextual filter enabled.
        if (key.match("^view-")) {
          var param_type_items = {
            type: 'textfield',
            heading: Drupal.t('Items to display'),
            param_name: 'items',
            description: Drupal.t('The number of items to display. Enter 0 for no limit.'),
            can_be_empty: true,
            dependency: {
              'element': 'override_pager',
              'value': ['yes']
            }
          };
          // Skip over views that are deleted but still in our views settings cache
          if (!(window.glazed_cms_element_views_settings.hasOwnProperty(base))) {
            continue;
          }
          if (window.glazed_cms_element_views_settings[base].view_display_type == 'block') {
            param_type_items.heading = Drupal.t('Items to display:');
            param_type_items.description = Drupal.t('The number of items to display. Enter 0 for no limit.');
          } else {
            param_type_items.heading = Drupal.t('Items per page:');
            param_type_items.description = Drupal.t('The number to display per page. Enter 0 for no limit.');
          }
          if (window.glazed_cms_element_views_settings[base].title) {
            object.params.push(make_param_type({
              type: 'checkbox',
              heading: Drupal.t('Show title'),
              param_name: 'display_title',
              content: 'yes',
              value: {
                'yes': Drupal.t('Yes')
              },
            }));
          }
          object.params.push(make_param_type({
            type: 'dropdown',
            heading: Drupal.t('Override pager'),
            param_name: 'override_pager',
            value: {
              'no': Drupal.t('No'),
              'yes': Drupal.t('Yes'),
            },
          }));

          if (window.glazed_cms_element_views_settings[base].pager.items_per_page)
            param_type_items.value = window.glazed_cms_element_views_settings[base].pager.items_per_page;
          object.params.push(make_param_type(param_type_items));
          var param_type_offset = {
            type: 'textfield',
            heading: Drupal.t('Pager Offset'),
            param_name: 'offset',
            description: Drupal.t('The number of items to skip.'),
            can_be_empty: true,
            dependency: {
              'element': 'override_pager',
              'value': ['yes']
            }
          };

          if (window.glazed_cms_element_views_settings[base].pager.offset)
            param_type_offset.value = window.glazed_cms_element_views_settings[base].pager.offset;
          object.params.push(make_param_type(param_type_offset));
          if (window.glazed_cms_element_views_settings[base].contextual_filter)
            object.params.push(make_param_type({
              type: 'textfield',
              heading: Drupal.t('Contextual filter:'),
              param_name: 'contextual_filter',
              description: Drupal.t('Separate contextual filter values with a "/". For example, 40/12/10.'),
              can_be_empty: true
            }));
          if (window.glazed_cms_element_views_settings[base].use_fields) {
            var toggleFields = {
              type: 'checkboxes',
              heading: Drupal.t('Field settings'),
              param_name: 'toggle_fields',
              value: {},
              tab: Drupal.t('Toggle Fields'),
            }
            for (var id in  window.glazed_cms_element_views_settings[base].field_list) {
              var item = window.glazed_cms_element_views_settings[base].field_list[id];
              toggleFields.value[id] = item;
            }
              if (window.glazed_cms_element_views_settings[base].field_values !='')
                toggleFields.content = window.glazed_cms_element_views_settings[base].field_values;
            object.params.push(make_param_type(toggleFields));
          }
        }

        // Add basic params.
        object.params = object.params.concat(CMSElement.prototype.params);
        mixin(CMSElement.prototype, object);
      }
      this.cms_elements_loaded = true;
      make_glazed_extend();
      this.try_render_unknown_elements();
    },
    create_element: function(container, base, position, pre_render_callback) {
      var depth = container.get_nested_depth(base);
      if (depth < BaseElement.prototype.max_nested_depth) {

        var constructor = BaseElement.prototype.elements[base];
        if (container instanceof ContainerElement && container.parent == null && !constructor.prototype.section) {
          var section = new SectionElement(container, position);
          section.update_dom();
          var child = new constructor(section, false);
          pre_render_callback(child);
          child.update_dom();
          container.update_empty();
          section.update_empty();
        }
        else {
          var child = new constructor(container, position);
          pre_render_callback(child);
          child.update_dom();
          container.update_empty();
        }
        return child;
      }
      else {
        alert(Drupal.t('Element can not be added. Max nested depth reached.'));
      }
      return false;
    },
    make_elements_modal: function(container, pre_render_callback) {
      var disallowed_elements = container.get_all_disallowed_elements();
      var tabs = {};
      for (var id in BaseElement.prototype.elements) {
        if (BaseElement.prototype.elements[id].prototype.hidden)
          continue;
        if (container.base != 'az_popup') {
          if (disallowed_elements.indexOf(BaseElement.prototype.elements[id].prototype.base) >= 0)
            continue;
        }

        // Without sidebar elements.
        if (BaseElement.prototype.elements[id].prototype.category != 'Template-elements') {

          // Split CMS elements for Blocks and Views.
          if ((BaseElement.prototype.elements[id].prototype.category == 'CMS')) {
            var itemName = BaseElement.prototype.elements[id].prototype.name.match(/^Block/) ? 'Blocks' :
              'Views';
            var blockViews = 'az_block-views-cms';
            if (BaseElement.prototype.elements[id].prototype.base.indexOf(blockViews) < 0) {
              if (!(itemName in tabs)) {
                tabs[itemName] = [];
              }
              tabs[itemName].push(BaseElement.prototype.elements[id]);
            }
          }
          else {
            if (!(BaseElement.prototype.elements[id].prototype.category in tabs)) {
              tabs[BaseElement.prototype.elements[id].prototype.category] = [];
            }
            tabs[BaseElement.prototype.elements[id].prototype.category].push(BaseElement.prototype.elements[id]);
          }
        }
      }
      var elements_tabs = $('<div id="az-elements-tabs"></div>');
      var i = 0;
      var menu = '<ul class="nav nav-tabs">';
      for (var title in tabs) {
        i++;
        if (title === '')
          title = Drupal.t('Content');
        menu += '<li><a href="#az-elements-tab-' + i + '" data-toggle="tab">' + title + '</a></li>';
      }
      if (window.glazed_online)
        menu += '<li><a href="#az-elements-tab-templates" data-toggle="tab">' + Drupal.t("Saved templates") +
        '</a></li>';
      menu += '</ul>';
      $(elements_tabs).append(menu);
      i = 0;
      var tabs_content = $('<div class="tab-content"></div>');
      // Save views tab id.
      var viewsIndexTab = 0;
      for (var title in tabs) {
        i++;
        var tab = $('<div id="az-elements-tab-' + i + '" class="tab-pane clearfix"></div>');
        // Check if elements is view.
        if (title == 'Views') {
          viewsIndexTab = i;
          for (var j = 0; j < tabs[title].length; j++) {
            // Use render function for set data-az-tag.
            $(tab).append(tabs[title][j].prototype.get_button_with_tag());
          }
        }
        else {
          for (var j = 0; j < tabs[title].length; j++) {
            $(tab).append(tabs[title][j].prototype.get_button());
          }
        }
        $(tabs_content).append(tab);
      }
      // Create unique tags element for create options.
      var tags = [];
      for (var key in window.glazed_views_tags) {
        if (tags.indexOf(window.glazed_views_tags[key]) == -1) {
          tags.push(window.glazed_views_tags[key]);
        }
      }

      // Filter container
      var tagsFilter = "<div class='filter-tags'><label>" + Drupal.t('Filter by tag') +
        "</label><select><option value='all_views'>" + Drupal.t('show all') + "</option>";
      for (var key in tags) {
        // Set options.
        tagsFilter = tagsFilter + '<option value="' + tags[key] + '">' + tags[key].replace(/_/g, ' ') +
          '</option>';
      }
      tagsFilter = tagsFilter + '</select></div>';
      tagsFilter = $(tagsFilter);
      // Function for triger all views element with extra data.
      tagsFilter.find('select').bind('change', function() {
        var dataTag = this.options[this.selectedIndex].value;
        tabs_content.find('#az-elements-tab-' + viewsIndexTab + ' .well').trigger('filtredData', dataTag);
      });

      // Show and hide eleements.
      tabs_content.find('#az-elements-tab-' + viewsIndexTab + ' .well').bind('filtredData', function(event, tag) {
        var $this = $(this);
        if (tag == 'all_views') {
          // Show all elements.
          $this.show();
        }
        else {
          if ($this.attr('data-az-tag') != tag) {
            $this.hide();
          }
          else {
            $this.show();
          }
        }
      });
      // Added filter object.
      $(tabs_content).find('#az-elements-tab-' + viewsIndexTab).prepend(tagsFilter);
      if (window.glazed_online)
        tab = $('<div id="az-elements-tab-templates" class="tab-pane clearfix"></div>');
      $(tabs_content).append(tab);
      $(elements_tabs).append(tabs_content);

      $('#az-elements-modal').remove();
      var header = '<div class="modal-header"><span class="close" data-dismiss="modal" aria-hidden="true">&times;</span><h4 class="modal-title text-center">' + '<img src="' + window.glazed_baseurl +
        'images/glazed-logo-white.png">' + '</h4></div>';
      var elements_modal = $('<div id="az-elements-modal" class="modal glazed" style="display:none"><div class="modal-dialog modal-lg"><div class="modal-content">' + header + '<div class="modal-body"></div></div></div></div>');
      $('body').prepend(elements_modal);
      $(elements_modal).find('.modal-body').append(elements_tabs);
      $(elements_tabs).find('> ul a:first')[fp + 'tab']('show');
      $(elements_modal).find('[data-az-element]').click(function() {
        var key = $(this).attr('data-az-element');
        var child = glazed_elements.create_element(container, key, false, pre_render_callback);
        if (child) {
          $('#az-elements-modal')[fp + 'modal']("hide");
          if (child.show_settings_on_create) {
            child.edit();
          }
        }
      });
      if (window.glazed_online)
        $(elements_tabs).find('a[href="#az-elements-tab-templates"]').on('shown.bs.tab', function(e) {
          //e.target
          glazed_get_templates(function(templates) {
            var tab_templates = $(elements_tabs).find('#az-elements-tab-templates');
            $(tab_templates).empty();
            for (var i = 0; i < templates.length; i++) {
              var name = templates[i];
              var button = '<div class="well text-center pull-left text-overflow glazed-saved" data-az-template="' + name +
                '"><i class="glyphicon glyphicon-floppy-disk"></i><div>' + name +
                '</div></div>';
              button = $(button).appendTo(tab_templates).click(function() {
                var key = $(this).attr('data-az-template');
                glazed_load_template(key, function(shortcode) {
                  var length = container.children.length;
                  BaseElement.prototype.parse_shortcode.call(container, shortcode);
                  for (var i = length; i < container.children.length; i++) {
                    container.children[i].recursive_render();
                  }
                  for (var i = length; i < container.children.length; i++) {
                    $(container.dom_content_element).append(container.children[i].dom_element);
                  }
                  if (window.glazed_editor) {
                    container.update_empty();
                    container.update_sortable();
                  }
                  container.recursive_showed();
                  $('#az-elements-modal')[fp + 'modal']("hide");
                });
              });
              $('<span class="fa fa-trash-o" data-az-template="' + name + '"></span>').appendTo(button).click(
                function() {
                  var name = $(this).attr('data-az-template');
                  glazed_delete_template(name);
                  $(tab_templates).find('[data-az-template="' + name + '"]').remove();
                });
            }
          });
        });
    },
    show: function(container, pre_render_callback) {
      $('#az-elements-modal').remove();
      this.make_elements_modal(container, pre_render_callback);
      $('#az-elements-modal')[fp + 'modal']('show');
      $('#az-elements-modal #az-elements-tabs').find('> ul a:first')[fp + 'tab']('show');
    },
    showTemplates: function(container, pre_render_callback) {
      $('#az-elements-modal').remove();
      this.make_templates_modal(container, pre_render_callback);
      $('#az-elements-modal')[fp + 'modal']('show');
      $('#az-elements-modal #az-elements-tabs').find('> ul a:first')[fp + 'tab']('show');
    },
    make_templates_modal: function(container, pre_render_callback) {
      var tabs = {};
      var elements_tabs = $('<div id="az-elements-tabs"></div>');
      var i = 0;
      var menu = '<ul class="nav nav-tabs">';
      if (window.glazed_online)
        menu += '<li><a href="#az-elements-tab-templates" data-toggle="tab">' + Drupal.t("layouts") +
          '</a></li>';
      menu += '</ul>';
      $(elements_tabs).append(menu);
      var tabs_content = $('<div class="tab-content"></div>');
      // Save views tab id.

      if (window.glazed_online)
        tab = $('<div id="az-elements-tab-templates" class="tab-pane clearfix"></div>');
      $(tabs_content).append(tab);
      $(elements_tabs).append(tabs_content);

      $('#az-elements-modal').remove();
      var header = '<div class="modal-header"><span class="close" data-dismiss="modal" aria-hidden="true">&times;</span><h4 class="modal-title text-center">' + '<img src="' + window.glazed_baseurl +
        'images/glazed-logo-white.png">' + '</h4></div>';
      var elements_modal = $('<div id="az-elements-modal" class="modal glazed" style="display:none"><div class="modal-dialog modal-lg"><div class="modal-content">' + header + '<div class="modal-body"></div></div></div></div>');
      $('body').prepend(elements_modal);
      $(elements_modal).find('.modal-body').append(elements_tabs);
      if (window.glazed_online)
          //e.target
        glazed_get_page_templates(function(data) {
          var tab_templates = $(elements_tabs).find('#az-elements-tab-templates');
          var columns = [];
          var categories = [];
          columns[0] = $('<div class="col-md-4"></div>');
          columns[1] = $('<div class="col-md-4"></div>');
          columns[2] = $('<div class="col-md-4"></div>');
          var col = 0;
          $(tab_templates).empty();
          if ($.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
              col = i % 3;
              var title = data[i].title;
              var uuid = data[i].uuid;
              var $button = $('<div class="page-template text-center pull-left text-overflow glazed-saved" data-az-template="' + uuid +
                '"><div class="lead">' + title + '</div></div>');
              if (data[i].image != '') {
                var $image = $('<img class="template-image" src="' + data[i].image + '"></img>');
                $image.appendTo($button);
              } else {
                var $icon = $('<i class="glyphicon glyphicon-floppy-disk"></i>');
                $icon.appendTo($button);
              }
              $button.appendTo(columns[col]).click(function () {
                var key = $(this).attr('data-az-template');
                glazed_load_page_template(key, function (shortcode) {
                  var length = container.children.length;
                  BaseElement.prototype.parse_shortcode.call(container, shortcode);
                  for (var i = length; i < container.children.length; i++) {
                    container.children[i].recursive_render();
                  }
                  for (var i = length; i < container.children.length; i++) {
                    $(container.dom_content_element).append(container.children[i].dom_element);
                  }
                  if (window.glazed_editor) {
                    container.update_empty();
                    container.update_sortable();
                  }
                  container.recursive_showed();
                  $('#az-elements-modal')[fp + 'modal']("hide");
                  $(window).trigger('CKinlineAttach');
                });
              });
              columns[0].appendTo(tab_templates);
              columns[1].appendTo(tab_templates);
              columns[2].appendTo(tab_templates);
            }
          } else {
            $(data).appendTo(tab_templates);
          }
        });
    },
    get_element: function(id) {
      return this.elements_instances[id];
    },
    delete_element: function(id) {
      $(document).trigger("glazed_delete_element", id);
      delete this.elements_instances[id];
    },
    add_element: function(id, element, position) {
      this.elements_instances[id] = element;
      $(document).trigger("glazed_add_element", {
        id: id,
        position: position
      });
    },
  });
