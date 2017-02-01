
  /**
   * Allow extending of glazed element via window.glazed_extend.exampleElement
   * @todo test and document
   */
  function make_glazed_extend() {
    if ('glazed_extend' in window) {
      for (var base in window.glazed_extend) {
        var element = window.glazed_extend[base];
        var params = [];
        if ('params' in element)
          params = element.params;
        delete element.params;
        var registered_element = BaseElement.prototype.elements[base];
        if (!('extended' in registered_element)) {
          registered_element.extended = true;
          mixin(registered_element.prototype, element);
          for (var i = 0; i < params.length; i++) {
            var param = make_param_type(params[i]);
            registered_element.prototype.params.push(param);
          }
        }
      }
    }
  }
  make_glazed_extend();

  // Update object content.
  function updateEventData(e) {

    // Search all text elements.
    var domContent = [];

    $(document).find('.az-element.az-text, .az-element.az_blockquote').each(function() {
      var $this = $(this);
      if ($this.children('.ckeditor-inline').length > 0) {
        domContent[$this.attr('data-az-id')] = $this.children('.ckeditor-inline').html();
      }
    });
    // Update parent element.
    if (e.data.object.id in domContent) {
      e.data.object.attrs.content = domContent[e.data.object.id];
    }

    // Recursive function for update child elements.
    function recursive_update(elem) {
      for (var i = 0; i < elem.children.length; i++) {
        recursive_update(elem.children[i]);
      }
      if (elem.id in domContent) {
        elem.attrs.content = domContent[elem.id];
      }
    }

    // Update child elements of parent.
    for (var i = 0; i < e.data.object.children.length; i++) {
      recursive_update(e.data.object.children[i]);
    }

  }

  // Message to prevent leaving page without saving
  var attachOnLoad = function() {
    $(
      'button.control.add:not(.attachOnLoadBinded-processed), button.control.edit:not(.attachOnLoadBinded-processed), .az-empty:not(.attachOnLoadBinded-processed), button.control.remove:not(.attachOnLoadBinded-processed), #az-thumbnails:not(.attachOnLoadBinded-processed)'
    ).once('attachOnLoadBinded', function() {
      $(this).bind('mousedown', function() {
        window.attachOnLoad = true;
      });
    });
  };

  $(window).load(function() {

    attachOnLoad();

    $('button.control.save-container').once('attachOnLoad', function() {
      $(this).bind('click', function() {
        attachOnLoad();
        window.attachOnLoad = false;
      });
    });

    $('body').once('windowBeforeunload', function() {
      $(window).bind('beforeunload', function() {
        if (typeof window.attachOnLoad !== 'undefined' && window.attachOnLoad) {
          return ' ';
        }
      });
    });

  });
  // Added inline ckeditor.
  Drupal.behaviors.CKinlineAttach = {
    attach: function() {
      // Elements for add ckeditor-inline.
      var items = '.az-element.az-text, .az-element.az_blockquote';

      // Attach window function for load ckeditor-inline.
      $(window).bind('CKinlineAttach', function() {
        function ckeditor_add_inline_editor() {

          // Turn off automatic editor creation first.
          CKEDITOR.disableAutoInline = true;

          // Don't add spaces to empty blocks
          CKEDITOR.config.fillEmptyBlocks = false;
          // Disabling content filtering.
          CKEDITOR.config.allowedContent = true;
          // Prevent wrapping inline content in paragraphs
          CKEDITOR.config.autoParagraph = false;

          // Theme integration
          CKEDITOR.config.contentsCss = ['//cdn.jsdelivr.net/bootstrap/3.3.5/css/bootstrap.min.css'];
          if (typeof window.Drupal.settings.glazed != "undefined" && typeof window.Drupal.settings.glazed.glazedPath.length != "undefined") {
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
          var toolbar = [{
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'RemoveFormat']
          }, {
            name: 'colors',
            items: ['TextColor']
          }, {
            name: 'styles',
            items: ['Format', 'Styles', 'FontSize']
          }, {
            name: 'paragraph',
            items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'BulletedList',
              'NumberedList'
            ]
          }, {
            name: 'links',
            items: ['Link', 'Unlink']
          }, {
            name: 'insert',
            items: ['Image', 'Table']
          }, {
            name: 'clipboard',
            items: ['Undo', 'Redo']
          }, ];

          CKEDITOR.config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;60/60px;72/72px;90/90px;117/117px;144/144px';

          // Don't move about our Glazed Builder stylesheet link tags
          CKEDITOR.config.protectedSource.push(/<link.*?>/gi);

          // Search glazed containers.
          $('body').find('.glazed').each(function() {
            if ($(this).hasClass('glazed-editor')) {
              $(this).find(items).each(function() {

                var $text = $(this);
                // Replaced only ckeditor-inline containers.
                if (!$text.find('.ckeditor-inline').length) {
                  $controls = $text.find('.controls').appendTo('body');
                  $text.wrapInner("<div class='ckeditor-inline' contenteditable='true' />");
                  $text.prepend($controls);

                  // Initialized editor.
                  var editor = $text.find('.ckeditor-inline')[0];
                  if (typeof editor != "undefined") {
                    $(editor).bind('click', function (event) {
                      // Make sure the toolbar is not overridden after editing
                      // text in modal window.
                      CKEDITOR.config.toolbar = toolbar;
                      CKEDITOR.inline(editor);
                      $(this).off(event);
                    });
                  }
                }
              });
            }
            $(this).find('.ckeditor-inline').bind('click', function() {
              // Added message to prevent leaving page without saving.
              window.attachOnLoad = true;
            });
          });
        }
        // Check exist CKEDITOR.
        if ('CKEDITOR' in window) {
          ckeditor_add_inline_editor();
        }
        else {
          // Load CKEDITOR.
          glazed_add_js({
            path: 'vendor/ckeditor/ckeditor.js',
            callback: function() {
              if (_.isObject(CKEDITOR)) {
                ckeditor_add_inline_editor();
              }
            }
          });
        }
      }).trigger('CKinlineAttach');

      // Update dom elements after save.
      $('button.control.save-container').on('click', function() {
        window.attachOnLoad = false;
        $(window).trigger('CKinlineAttach');
      });

      // Disable and inline ckeditor-inline.
      $('.controls .control.toggle-editor').bind('click', function() {
        var container = '.wrap-containers .glazed';
        $(container).each(function() {
          var $this = $(this);
          if ($this.hasClass('glazed-editor')) {
            $this.find('.az-element.az-text .ckeditor-inline, .az-element.az_blockquote .ckeditor-inline').each(function () {
              var $this = $(this);
              $this.attr('contenteditable', true);

              // Initialized editor.
              var editor = $this[0];
              if (typeof editor != "undefined") {
                $(editor).bind('click', function (event) {
                  CKEDITOR.inline(editor);
                  $(this).off(event);
                });
              }
            });
          }
          else {
            $(this).find('.az-element.az-text .ckeditor-inline, .az-element.az_blockquote .ckeditor-inline').each(function () {
              var $this = $(this);
              $this.attr('contenteditable', false);
              $this.off('click');
            });

            // Destroy instances.
            for (var name in CKEDITOR.instances) {
              CKEDITOR.instances[name].destroy();
            }
          }
        });
      });

      // Remove Glazed Builder Popovers on Click Body
      $(document).on('click', function (e) {
        if (!$(e.target).is('.glazed-builder-popover')) {
          $('.glazed-builder-popover').popover('hide');
        }
      });
    }
  }

})(window.jQuery);
