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
