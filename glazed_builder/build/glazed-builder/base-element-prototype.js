
  function BaseElement(parent, position) {
    if (glazed_frontend)
      this.id = _.uniqueId('f');
    else
      this.id = _.uniqueId('b');
    if (parent != null) {
      this.parent = parent;
      if (typeof position === 'boolean') {
        if (position)
          parent.children.push(this);
        else
          parent.children.unshift(this);
      }
      else {
        parent.children.splice(position, 0, this);
      }
    }
    //
    this.children = [];
    this.dom_element = null;
    this.dom_content_element = null;
    this.attrs = {};
    for (var i = 0; i < this.params.length; i++) {
      if (_.isString(this.params[i].value))
        this.attrs[this.params[i].param_name] = this.params[i].value;
      else {
        if (!this.params[i].hidden)
          this.attrs[this.params[i].param_name] = '';
        //      if (_.isArray(this.params[i].value)) {
        //        this.attrs[this.params[i].param_name] = this.params[i].value[0];
        //      } else {
        //        if (_.isObject(this.params[i].value)) {
        //          var keys = _.keys(this.params[i].value);
        //          this.attrs[this.params[i].param_name] = keys[0];
        //        } else {
        //          this.attrs[this.params[i].param_name] = null;
        //        }
        //      }
      }
    }
    this.controls = null;
    glazed_elements.add_element(this.id, this, position);
  }
  var classes = {};
  if ('glazed_classes' in window) {
    classes = window.glazed_classes;
  }
  BaseElement.prototype = {
    el_classes: $.extend({
      "optgroup-bootstrap": Drupal.t('Bootstrap classes'),
      "bg-default": Drupal.t('Background default style'),
      "bg-primary": Drupal.t('Background primary style'),
      "bg-success": Drupal.t('Background success style'),
      "center-block": Drupal.t('Block align center'),
      "clearfix": Drupal.t('Clearfix'),
      "hidden-lg": Drupal.t('Hidden on large devices, desktops (≥1200px)'),
      "hidden-md": Drupal.t('Hidden on medium devices, desktops (≥992px)'),
      "hidden-sm": Drupal.t('Hidden on small devices, tablets (≥768px)'),
      "hidden-xs": Drupal.t('Hidden on extra small devices, phones (<768px)'),
      "lead": Drupal.t('Text Lead style'),
      "pull-left": Drupal.t('Pull left'),
      "pull-right": Drupal.t('Pull right'),
      "small": Drupal.t('Text small style'),
      "stpe-dropshadow stpe-dropshadow--curved-hz1 stpe-dropshadow--curved": Drupal.t('Curved Horiztonal Drop Shadow'),
      "stpe-dropshadow stpe-dropshadow--curved-hz2 stpe-dropshadow--curved": Drupal.t('Curved Horizontal Double Drop Shadow'),
      "stpe-dropshadow stpe-dropshadow--curved-vt2 stpe-dropshadow--curved": Drupal.t('Curved vertical double shadow'),
      "stpe-dropshadow stpe-dropshadow--lifted": Drupal.t('Lifted Drop Shadow'),
      "stpe-dropshadow stpe-dropshadow--perspective": Drupal.t('Perspective Drop Shadow'),
      "stpe-dropshadow stpe-dropshadow--raised": Drupal.t('Raised Drop Shadow'),
      "text-center": Drupal.t('Text align center'),
      "text-default": Drupal.t('Text default style'),
      "text-justify": Drupal.t('Text align justify'),
      "text-left": Drupal.t('Text align left'),
      "text-muted": Drupal.t('Text muted style'),
      "text-primary": Drupal.t('Text primary style'),
      "text-right": Drupal.t('Text align right'),
      "text-success": Drupal.t('Text success style'),
      "visible-lg-block": Drupal.t('Visible on large devices, desktops (≥1200px)'),
      "visible-md-block": Drupal.t('Visible on medium devices, desktops (≥992px)'),
      "visible-sm-block": Drupal.t('Visible on small devices, tablets (≥768px)'),
      "visible-xs-block": Drupal.t('Visible on extra small devices, phones (<768px)'),
      "well": Drupal.t('Well'),
    },classes),

    elements: {},
    tags: {},
    max_nested_depth: 3,
    name: '',
    category: '',
    description: '',
    params: [
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Utility classes'),
        param_name: 'el_class',
        description: Drupal.t('Add classes for Bootstrap effects or Glazed theme colors and utilities.')
      }),
      make_param_type({
        type: 'style',
        heading: Drupal.t('Style'),
        param_name: 'style',
        description: Drupal.t('Style options.'),
        tab: Drupal.t('Style')
      }),
      make_param_type({
        type: 'style',
        heading: Drupal.t('Hover style'),
        param_name: 'hover_style',
        important: true,
        description: Drupal.t('Hover style options.'),
        tab: Drupal.t('Hover style')
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Left'),
        param_name: 'pos_left',
        tab: Drupal.t('Placement'),
        max: '1',
        step: '0.01',
        hidden: true,
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Right'),
        param_name: 'pos_right',
        tab: Drupal.t('Placement'),
        max: '1',
        step: '0.01',
        hidden: true,
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Top'),
        param_name: 'pos_top',
        tab: Drupal.t('Placement'),
        max: '1',
        step: '0.01',
        hidden: true,
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Bottom'),
        param_name: 'pos_bottom',
        tab: Drupal.t('Placement'),
        max: '1',
        step: '0.01',
        hidden: true,
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Width'),
        param_name: 'pos_width',
        tab: Drupal.t('Placement'),
        max: '1',
        step: '0.01',
        hidden: true,
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Height'),
        param_name: 'pos_height',
        tab: Drupal.t('Placement'),
        max: '1',
        step: '0.01',
        hidden: true,
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Z-index'),
        param_name: 'pos_zindex',
        tab: Drupal.t('Placement'),
        hidden: true,
      }),
    ],
    icon: '',
    thumbnail: '',
    is_container: false,
    has_content: false,
    frontend_render: false,
    show_settings_on_create: false,
    wrapper_class: '',
    weight: 0,
    hidden: false,
    disallowed_elements: [],
    controls_base_position: 'center',
    show_parent_controls: false,
    highlighted: true,
    style_selector: '',
    section: false,
    controls_position: function() {
      if (!this.is_container || this.has_content) {
        var element_height = $(this.dom_element).height();
        var frame_height = $(window).height();
        if (element_height > frame_height) {
          var window_top = $(window).scrollTop();
          var control_top = $(this.controls).offset().top;
          var element_position_top = $(this.dom_element).offset().top;
          var new_position = (window_top - element_position_top) + frame_height / 2;
          if (new_position > 40 && new_position < element_height) {
            $(this.controls).css('top', new_position);
          }
          else if (new_position > element_height) {
            $(this.controls).css('top', element_height - 40);

          }
          else {
            $(this.controls).css('top', 40);
          }
        }
      }
    },
    update_controls_zindex: function() {
      set_highest_zindex(this.controls);
    },
    show_controls: function() {
      if (window.glazed_editor) {
        var element = this;
        this.controls = $('<div class="controls btn-group btn-group-xs"></div>').prependTo(this
          .dom_element);
        $(element.dom_element).addClass('az-element--controls-' + element.controls_base_position);
        setTimeout(function() {
          element.update_controls_zindex();
        }, 3000);

        $('<span title="' + title("Drag and drop") + '" class="control drag-and-drop btn btn-default glyphicon glyphicon-move"><span class="control-label">' + this.name + '</span></span>').appendTo(this.controls);

        if (this.is_container && !this.has_content) {
          $('<span title="' + title("Add") + '" class="control add btn btn-default glyphicon glyphicon-plus"> </span>').appendTo(this.controls).click({
            object: this
          }, this.click_add);
          $('<span title="' + title("Paste") + '" class="control paste btn btn-default glyphicon glyphicon-hand-down"> </span>').appendTo(this.controls).click({
            object: this
          }, this.click_paste);
        }

        $('<span title="' + title("Edit") + '" class="control edit btn btn-default glyphicon glyphicon-pencil"> </span>').appendTo(this.controls).click({
          object: this
        }, this.click_edit);
        $('<span title="' + title("Copy") + '" class="control copy btn btn-default glyphicon glyphicon-briefcase"> </span>').appendTo(this.controls).click({
          object: this
        }, this.click_copy);
        $('<span title="' + title("Clone") + '" class="control clone btn btn-default glyphicon glyphicon-repeat"> </span>').appendTo(this.controls).click({
          object: this
        }, this.click_clone);
        $('<span title="' + title("Remove") + '" class="control remove btn btn-default glyphicon glyphicon-trash"> </span>').appendTo(this.controls).click({
          object: this
        }, this.click_remove);
        if (window.glazed_online)
          $('<span title="' + title('Save as template') + '" class="control save-template btn btn-default glyphicon glyphicon-floppy-save"> </span>').appendTo(
            this.controls).click({
            object: this
          }, this.click_save_template);
        this.update_empty();

        setTimeout(function() {
          element.controls_position();
        }, 1000);
        $(window).scroll(function() {
          element.controls_position();
        });

        $(element.dom_element).hover(
          function() {
            $(this).find('> .controls').addClass('controls--show');
          }, function() {
            $(this).find('> .controls').removeClass('controls--show');
          }
        );

        if (element.show_parent_controls) {
          _.defer(function() {
            var parent = element.parent;
            if (_.isString(element.show_parent_controls)) {
              parent = glazed_elements.get_element($(element.dom_element).closest(element.show_parent_controls)
                .attr('data-az-id'));
            }
            function update_controls(element) {
              $(parent.controls).attr('data-az-cid', $(element.dom_element).attr('data-az-id'));
              var offset = $(element.dom_element).offset();
              offset.top = offset.top - parseInt($(element.dom_element).css('margin-top'));
              $(parent.controls).offset(offset);
              offset.left = offset.left + $(parent.controls).width() - 1;
              $(element.controls).offset(offset);
            }
            // Simultaneous show/hide of child and parent controls on child element hover
            $(element.dom_element).off('mouseenter').on('mouseenter', function() {
              $(element.dom_element).data('hover', true);
              if ($(element.dom_element).parents('.glazed-editor').length > 0) {
                $(parent.controls).addClass('controls--show');
                $(element.controls).addClass('controls--show');
                update_controls(element);
              }
            });
            $(element.dom_element).off('mouseleave').on('mouseleave', function() {
              $(element.dom_element).data('hover', false);
              if ($(element.dom_element).parents('.glazed-editor').length > 0) {
                $(parent.controls).removeClass('controls--show');
                $(element.controls).removeClass('controls--show');
              }
            });

            // Showing/Hiding when mousing over element controls that are outside the element itself
            // for example row/column controls.This uses setInterval for difficult situations, like
            // when you hover row controls and the column controls need to show. @todo fix this mess
            setInterval(function() {
              if ($(element.dom_element).parents('.glazed-editor').length > 0) {
                if (!$(element.dom_element).data('hover') && !$(parent.controls).data('hover')) {
                  $(element.controls).removeClass('controls--show');
                }
                if ($(element.dom_element).data('hover')) {
                  update_controls(element);
                  $(element.controls).addClass('controls--show');
                }
                var e = glazed_elements.get_element($(parent.controls).closest('[data-az-cid]').attr(
                  'data-az-cid'));
                if (!_.isUndefined(e)) {
                  $(parent.controls).css('opacity', $(e.controls).css('opacity'));
                  if ($(e.controls).hasClass('controls--show')) {
                    $(parent.controls).addClass('controls--show');
                  }
                  else {
                     $(parent.controls).removeClass('controls--show');
                  }
                }
                if (_.isUndefined($(parent.controls).data('showparentcontrols'))) {
                  $(parent.controls).off('mouseenter').on('mouseenter', function() {
                    $(parent.controls).data('hover', true);
                    var el = glazed_elements.get_element($(this).closest('[data-az-cid]').attr(
                      'data-az-cid'));
                    if (!_.isUndefined(el))
                      $(el.controls).addClass('controls--show');
                  });
                  $(parent.controls).off('mouseleave').on('mouseleave', function() {
                    $(parent.controls).data('hover', false);
                  });
                  $(parent.controls).data('showparentcontrols', true);
                }
              }
            }, 100);
          });
        }
      }
    },
    get_empty: function() {
      //→←↑↓↖↗↘↙
      // return '<div class="az-empty"><div class="top well"><strong>' + Drupal.t('Click to put an element here.') +
      return '<div class="az-empty"></div>';
    },
    update_empty: function() {
      if (window.glazed_editor) {
        if ((this.children.length == 0 && this.is_container && !this.has_content) || (this.has_content && this.attrs[
            'content'] == '')) {
          $(this.dom_content_element).find('> .az-empty').remove();
          var empty = $(this.get_empty()).appendTo(this.dom_content_element);
          var pos = '';
          if ($(empty).find('.bottom').length == 0)
            pos = 'bottom';
          if ($(empty).find('.top').length == 0)
            pos = 'top';
          $(empty).click(function(e) {
            if (e.which == 1) {
              var id = $(this).closest('[data-az-id]').attr('data-az-id');
              glazed_elements.show(glazed_elements.get_element(id), function(element) {});
            }
          });
        }
        else {
          $(this.dom_content_element).find('> .az-empty').remove();
        }
      }
    },
    get_button: function() {
      if (this.thumbnail == '') {
        return '<div class="well text-center pull-left text-overflow" data-az-element="' + this.base + '"><i class="' + this.icon +
          '"></i><div>' + this.name + '</div><div class="text-muted small">' +
          this.description + '</div></div>';
      }
      else {
        return '<div class="well pull-left" data-az-element="' + this.base +
          '" style="background-image: url(' + encodeURI(this.thumbnail) +
          '); background-position: center center; background-size: cover;"></div>';
      }
    },
    click_add: function(e) {
      e.data.object.add();
      return false;
    },
    add: function() {
      glazed_elements.show(this, function(element) {});
    },
    update_sortable: function() {
      if (window.glazed_editor) {
        if (this.is_container && !this.has_content || (this instanceof UnknownElement)) {
          $(this.dom_content_element).sortable({
            items: '> .az-element',
            connectWith: '.az-ctnr',
            handle: '> .controls > .drag-and-drop',
            update: this.update_sorting,
            placeholder: 'az-sortable-placeholder',
            forcePlaceholderSize: true,
            //            tolerance: "pointer",
            //            distance: 1,
            over: function(event, ui) {
              ui.placeholder.attr('class', ui.helper.attr('class'));
              ui.placeholder.removeClass('ui-sortable-helper');
              ui.placeholder.addClass('az-sortable-placeholder');
              //$(this).closest('[data-az-id]')
            }
          });
        }
      }
    },
    replace_render: function() {
      var dom_element = this.dom_element;
      var dom_content_element = this.dom_content_element;
      if (dom_element != null) {
        this.render($);
        $(dom_element).replaceWith(this.dom_element);
        if (dom_content_element != null) {
          $(this.dom_content_element).replaceWith(dom_content_element);
        }
      }
      if (window.glazed_editor)
        this.show_controls();
    },
    update_dom: function() {
      this.detach_children();
      $(this.dom_element).remove();
      this.parent.detach_children();
      this.render($);
      this.attach_children();
      if (window.glazed_editor)
        this.show_controls();
      this.parent.attach_children();
      if (window.glazed_editor) {
        this.update_sortable();
        this.update_empty();
      }
      this.showed($);
    },
    get_hover_style: function() {
      if ('hover_style' in this.attrs)
        return '<style><!-- .hover-style-' + this.id + ':hover ' + this.style_selector +
          ' { ' + this.attrs['hover_style'] + '} --></style>';
      else
        return '';
    },
    restore: function(dom) {},
    recursive_restore: function(dom) {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].recursive_restore(dom);
      }
      this.restore(dom);
    },
    showed: function($) {
      if ('pos_left' in this.attrs && this.attrs['pos_left'] != '')
        $(this.dom_element).css("left", this.attrs['pos_left']);
      if ('pos_right' in this.attrs && this.attrs['pos_right'] != '')
        $(this.dom_element).css("right", this.attrs['pos_right']);
      if ('pos_top' in this.attrs && this.attrs['pos_top'] != '')
        $(this.dom_element).css("top", this.attrs['pos_top']);
      if ('pos_bottom' in this.attrs && this.attrs['pos_bottom'] != '')
        $(this.dom_element).css("bottom", this.attrs['pos_bottom']);
      if ('pos_width' in this.attrs && this.attrs['pos_width'] != '')
        $(this.dom_element).css("width", this.attrs['pos_width']);
      if ('pos_height' in this.attrs && this.attrs['pos_height'] != '')
        $(this.dom_element).css("height", this.attrs['pos_height']);
      if ('pos_zindex' in this.attrs && this.attrs['pos_zindex'] != '')
        $(this.dom_element).css("z-index", this.attrs['pos_zindex']);
      if ('hover_style' in this.attrs && this.attrs['hover_style'] != '') {
        $('head').find('#hover-style-' + this.id).remove();
        $('head').append(this.get_hover_style());
        $(this.dom_element).addClass('hover-style-' + this.id);
      }
    },
    render: function($) {
      $(this.dom_element).attr('data-az-id', this.id);
    },
    trigger_start_in_animation: function() {
      for (var i = 0; i < this.children.length; i++) {
        if ('trigger_start_in_animation' in this.children[i]) {
          this.children[i].trigger_start_in_animation();
        }
      }
    },
    trigger_start_out_animation: function() {
      for (var i = 0; i < this.children.length; i++) {
        if ('trigger_start_out_animation' in this.children[i]) {
          this.children[i].trigger_start_out_animation();
        }
      }
    },
    update_data: function() {
      $(this.dom_element).attr('data-azb', this.base);
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        if (param.param_name in this.attrs) {
          var value = this.attrs[param.param_name];
          if ((value == '' && param.can_be_empty || value != '') && (param.param_name !== 'content') && (value !==
              param.value)) {
            //if (param.param_name !== 'content') {
            if (!param.safe) {
              value = encodeURIComponent(value);
            }
            $(this.dom_element).attr('data-azat-' + param.param_name, value);
          }
        }
      }

      if (this.dom_content_element != null) {
        $(this.dom_content_element).attr('data-azcnt', 'true');
      }
    },
    recursive_update_data: function() {
      this.update_data();
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].recursive_update_data();
      }
    },
    recursive_clear_animation: function() {
      if ('clear_animation' in this)
        this.clear_animation();
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].recursive_clear_animation();
      }
    },
    recursive_showed: function() {
      this.showed($);
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].recursive_showed();
      }
    },
    update_sorting_children: function() {
      var options = $(this.dom_content_element).sortable('option');
      var children = [];
      $(this.dom_content_element).find(options.items).each(function() {
        children.push(glazed_elements.get_element($(this).attr('data-az-id')));
      });
      this.children = children;
      for (var i = 0; i < this.children.length; i++)
        this.children[i].parent = this;
      this.update_empty();
    },
    update_sorting: function(event, ui) {
      var element = glazed_elements.get_element($(ui.item).closest('[data-az-id]').attr('data-az-id'));
      if (element) {
        ui.source = glazed_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
        ui.from_pos = element.get_child_position();
        ui.source.update_sorting_children();
        ui.target = glazed_elements.get_element($(ui.item).parent().closest('[data-az-id]').attr('data-az-id'));
        if (ui.source.id != ui.target.id)
          ui.target.update_sorting_children();
        ui.to_pos = element.get_child_position();
        $(document).trigger("glazed_update_sorting", ui);
      }
    },
    click_edit: function(e) {
      // Update object content.
      updateEventData(e);

      e.data.object.edit();
      return false;
    },
    edit: function() {
      BaseParamType.prototype.show_editor(this.params, this, this.edited);
    },
    edited: function(attrs) {
      //this.attrs = attrs;
      for (var name in attrs) {
        this.attrs[name] = unescapeParam(attrs[name]);
      }
      this.update_dom();
      $(document).trigger("glazed_edited_element", this.id);
    },
    attrs2string: function() {
      var attrs = '';
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        if (param.param_name in this.attrs) {
          var value = this.attrs[param.param_name];
          if ((value == '' && param.can_be_empty || value != '') && (param.param_name !== 'content') && (value !==
              param.value)) {
            //if (param.param_name !== 'content') {
            if (!param.safe) {
              value = encodeURIComponent(value);
            }
            attrs += param.param_name + '="' + value + '" ';
          }
        }
      }
      return attrs;
    },
    get_content: function() {
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        if (param.param_name === 'content') {
          if (param.type == "html") {
            return encodeURIComponent(this.attrs['content']);
          }
        }
      }
      return this.attrs['content'];
    },
    set_content: function(content) {
      var value = unescapeParam(content);
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        if (param.param_name === 'content') {
          if (param.type == "html") {
            // Support lingering legacy content: try with base64 decoding first
            try {
              value = decodeURIComponent(atob(value.replace(/^#E\-8_/, '')));
            } catch (e) {
              value = decodeURIComponent(value.replace(/^#E\-8_/, ''));
            }
            this.attrs['content'] = value;
            return;
          }
        }
      }
      this.attrs['content'] = value;
    },
    parse_attrs: function(attrs) {
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        if (param.param_name in attrs) {
          if (!param.safe) {
            var value = unescapeParam(attrs[param.param_name]);
            // Support lingering legacy content: try with base64 decoding first
            try {
              this.attrs[param.param_name] = decodeURIComponent(atob(value.replace(/^#E\-8_/, '')));
            } catch (e) {
              this.attrs[param.param_name] = decodeURIComponent(value.replace(/^#E\-8_/, ''));
            }
          }
          else {
            this.attrs[param.param_name] = unescapeParam(attrs[param.param_name]);
          }
        }
        else {
          if ('value' in param && _.isString(param.value)) {
            this.attrs[param.param_name] = param.value;
          }
        }
      }
      for (var name in attrs) {
        if (!(name in this.attrs)) {
          this.attrs[name] = attrs[name];
        }
      }
      $(document).trigger("glazed_edited_element", this.id);
    },
    get_nested_depth: function(base) {
      var depth = 0;
      if (this.parent != null) {
        depth += this.parent.get_nested_depth(base);
      }
      if (this.base == base) {
        depth++;
      }
      return depth;
    },
    get_my_shortcode: function() {
      var tags = _.keys(BaseElement.prototype.elements);
      var nested_counter = _.object(tags, Array.apply(null, new Array(tags.length)).map(Number.prototype.valueOf,
        0));
      var shortcode = this.get_shortcode(nested_counter);
      return shortcode;
    },
    get_children_shortcode: function() {
      var tags = _.keys(BaseElement.prototype.elements);
      var nested_counter = _.object(tags, Array.apply(null, new Array(tags.length)).map(Number.prototype.valueOf,
        0));
      var shortcode = '';
      for (var i = 0; i < this.children.length; i++) {
        shortcode += this.children[i].get_shortcode(nested_counter);
      }
      return shortcode;
    },
    get_shortcode: function(nested_counter) {
      nested_counter[this.base]++;
      var contain_shortcode = '';
      for (var i = 0; i < this.children.length; i++) {
        contain_shortcode += this.children[i].get_shortcode(nested_counter);
      }
      if (this.base == 'az_unknown') {
        shortcode = contain_shortcode;
      }
      else {
        var base = '';
        if (nested_counter[this.base] == 1) {
          base = this.base;
        }
        else {
          var c = nested_counter[this.base] - 1;
          base = this.base + '_' + c;
        }

        var attrs = this.attrs2string();
        var shortcode = '[' + base + ' ' + attrs + ']';
        if (this.is_container) {
          if (this.has_content) {
            shortcode += this.get_content() + '[/' + base + ']';
          }
          else {
            shortcode += contain_shortcode + '[/' + base + ']';
          }
        }
      }
      nested_counter[this.base]--;
      return shortcode;
    },
    parse_shortcode: function(content) {
      var tags = _.keys(BaseElement.prototype.tags).join('|'),
        reg = glazed.shortcode.regexp(tags),
        matches = $.trim(content).match(reg);
      if (_.isNull(matches)) {
        if (content.length == 0) {
          return;
        }
        else {
          if (content.substring(0, 1) == '[' && content.slice(-1) == ']')
            this.parse_shortcode('[az_unknown]' + content + '[/az_unknown]');
          else
            this.parse_shortcode('[az_row][az_column width="1/1"][az_text]' + content +
              '[/az_text][/az_column][/az_row]');
        }
      }
      _.each(matches, function(raw) {
        var sub_matches = raw.match(glazed_regexp(tags));
        var sub_content = sub_matches[5];
        var sub_regexp = new RegExp('^[\\s]*\\[\\[?(' + _.keys(BaseElement.prototype.tags).join('|') +
          ')(?![\\w-])');
        var atts_raw = glazed.shortcode.attrs(sub_matches[3]);
        var shortcode = sub_matches[2];

        if (this.get_nested_depth(shortcode) > BaseElement.prototype.max_nested_depth)
          return;

        var constructor = UnknownElement;
        if (shortcode in BaseElement.prototype.tags) {
          constructor = BaseElement.prototype.tags[shortcode];
        }
        if (this instanceof ContainerElement && this.parent == null && !constructor.prototype.section) {
          this.parse_shortcode('[az_section]' + content + '[/az_section]');
          return;
        }
        var element = new constructor(this, true);
        element.parse_attrs(atts_raw.named);

        var settings = BaseElement.prototype.tags[shortcode].prototype;

        if (_.isString(sub_content) && sub_content.match(sub_regexp) && (settings.is_container === true)) {
          element.parse_shortcode(sub_content);
        }
        else if (_.isString(sub_content) && sub_content.length && shortcode === 'az_row') {
          element.parse_shortcode('[az_column width="1/1"][az_text]' + sub_content + '[/az_text][/az_column]');
        }
        else if (_.isString(sub_content) && sub_content.length && shortcode === 'az_column' && !(sub_content.substring(
            0, 1) == '[' && sub_content.slice(-1) == ']')) {
          element.parse_shortcode('[az_text]' + sub_content + '[/az_text]');
        }
        else if (_.isString(sub_content)) {
          if (settings.has_content === true) {
            element.set_content(sub_content);
          }
          else {
            if (sub_content != '')
              element.parse_shortcode('[az_unknown]' + sub_content + '[/az_unknown]');
          }
        }
      }, this);
    },
    parse_html: function(dom_element) {
      var element = this;
      if (($(dom_element).children().closest_descendents('[data-azb]').length == 0) && ($.trim($(dom_element).html())
          .length > 0)) {
        var row = new RowElement(element, false);
        row.children = [];
        var column = new ColumnElement(row, false);
        var constructor = BaseElement.prototype.elements['az_text'];
        var child = new constructor(column, false);
        child.attrs['content'] = $(dom_element).html();
        child.update_dom();
        if ('update_empty' in element)
          element.update_empty();
        if ('update_empty' in column)
          column.update_empty();
        if ('update_empty' in row)
          row.update_empty();
      }
      else {
        $(dom_element).children().closest_descendents('[data-azb]').each(function() {
          var tag = $(this).attr('data-azb');
          var constructor = UnknownElement;
          if (tag in BaseElement.prototype.tags) {
            constructor = BaseElement.prototype.tags[tag];
          }
          var child = new constructor(element, true);

          if (glazed_frontend) {
            glazed_elements.elements_instances[child.id] = null;
            delete glazed_elements.elements_instances[child.id];
            child.id = $(this).attr('data-az-id');
            glazed_elements.elements_instances[child.id] = child;
          }

          child.dom_element = $(this);
          var attrs = {};
          $($(this)[0].attributes).each(function() {
            if (this.nodeName.indexOf('data-azat') >= 0) {
              attrs[this.nodeName.replace('data-azat-', '')] = this.value;
            }
          });
          child.parse_attrs(attrs);
          if (child.is_container) {
            var cnt = $(this).closest_descendents('[data-azcnt]');
            if (cnt.length > 0) {
              child.dom_content_element = $(cnt);
              if (child.has_content) {
                if (child instanceof UnknownElement) {
                  child.attrs['content'] = $(cnt).wrap('<div></div>').parent().html();
                  $(cnt).unwrap();
                }
                else {
                  child.attrs['content'] = $(cnt).html();
                }
              }
              else {
                child.parse_html(cnt);
              }
            }
          }
        });
      }
    },
    recursive_render: function() {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].recursive_render();
      }
      if (glazed_frontend) {
        if (this.frontend_render) {
          this.detach_children();
          this.parent.detach_children();
          this.render($);
          this.attach_children();
          this.parent.attach_children();
        }
      }
      else {
        this.render($);
        this.attach_children();
      }
      if (window.glazed_editor) {
        this.show_controls();
        this.update_sortable();
      }
    },
    detach_children: function() {
      for (var i = 0; i < this.children.length; i++) {
        $(this.children[i].dom_element).detach();
      }
    },
    attach_children: function() {
      for (var i = 0; i < this.children.length; i++) {
        $(this.dom_content_element).append(this.children[i].dom_element);
      }
    },
    click_copy: function(e) {
      e.data.object.copy();
      return false;
    },
    copy: function() {
      var shortcode = this.get_my_shortcode();
      $('#glazed-clipboard').html(encodeURIComponent(shortcode));
    },
    click_paste: function(e) {
      e.data.object.paste(0);
      return false;
    },
    paste: function(start) {
      var shortcode = decodeURIComponent($('#glazed-clipboard').html());
      if (shortcode != '') {
        var length = this.children.length;
        BaseElement.prototype.parse_shortcode.call(this, shortcode);

        var new_children = [];
        for (var i = length; i < this.children.length; i++) {
          this.children[i].recursive_render();
          new_children.push(this.children[i]);
        }
        this.children = this.children.slice(0, length);

        this.children.splice.apply(this.children, [start, 0].concat(new_children));

        this.detach_children();
        this.attach_children();
        this.update_empty();
        this.update_sortable();
        this.recursive_showed();
      }
    },
    click_save_template: function(e) {
      e.data.object.save_template();
      return false;
    },
    save_template: function() {
      var shortcode = this.get_my_shortcode();
      var name = window.prompt(Drupal.t('Enter template name'), '');
      if (name != '' && name != null)
        glazed_save_template(name, shortcode);
    },
    click_clone: function(e) {
      // Update object content.
      updateEventData(e);

      e.data.object.clone();
      return false;
    },
    clone: function() {
      this.copy();
      for (var i = 0; i < this.parent.children.length; i++) {
        if (this.parent.children[i].id == this.id) {
          this.parent.paste(i);
          break;
        }
      }

      // Added inline ckeditor.
      $(window).trigger('CKinlineAttach');
    },
    click_remove: function(e) {
      e.data.object.remove();
      return false;
    },
    remove: function() {
      glazed_elements.delete_element(this.id);
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].remove();
      }
      $(this.dom_element).remove();
      for (var i = 0; i < this.parent.children.length; i++) {
        if (this.parent.children[i].id == this.id) {
          this.parent.children.splice(i, 1);
          break;
        }
      }
      this.parent.update_empty();
    },
    get_child_position: function() {
      for (var i = 0; i < this.parent.children.length; i++) {
        if (this.parent.children[i].id == this.id) {
          return i;
          break;
        }
      }
      return -1;
    },
    add_css: function(path, loaded, callback) {
      var container = this.get_my_container();
      container.css[window.glazed_baseurl + path] = true;
      if (!loaded) {
        window.glazed_add_css(path, callback);
      }
    },
    add_js_list: function(options) {
      var container = this.get_my_container();
      for (var i = 0; i < options.paths.length; i++) {
        container.js[window.glazed_baseurl + options.paths[i]] = true;
      }
      window.glazed_add_js_list(options);
    },
    add_js: function(options) {
      var container = this.get_my_container();
      container.js[window.glazed_baseurl + options.path] = true;
      window.glazed_add_js(options);
    },
    add_external_js: function(url, callback) {
      var container = this.get_my_container();
      container.js[url] = true;
      window.glazed_add_external_js(url, callback);
    },
    get_my_container: function() {
      if (this instanceof ContainerElement) {
        return this;
      }
      else {
        return this.parent.get_my_container();
      }
    },
    get_all_disallowed_elements: function() {
      if ('parent' in this) {
        var disallowed_elements = _.uniq(this.parent.get_all_disallowed_elements().concat(this.disallowed_elements));
        return disallowed_elements;
      }
      else {
        return this.disallowed_elements;
      }
    }
  };

  function register_element(base, is_container, Element) {
    extend(Element, BaseElement);
    Element.prototype.base = base;
    Element.prototype.is_container = is_container;
    BaseElement.prototype.elements[base] = Element;
    BaseElement.prototype.tags[base] = Element;
    if (is_container) {
      for (var i = 1; i < BaseElement.prototype.max_nested_depth; i++) {
        BaseElement.prototype.tags[base + '_' + i] = Element;
      }
    }
  }
