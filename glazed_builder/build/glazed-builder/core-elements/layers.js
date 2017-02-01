
  function LayersElement(parent, position) {
    LayersElement.baseclass.apply(this, arguments);
  }
  register_animated_element('az_layers', true, LayersElement);
  mixin(LayersElement.prototype, {
    name: Drupal.t('Positioned Layers'),
    icon: 'et et-icon-layers',
    description: Drupal.t('Free Positioning'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Width'),
        param_name: 'width',
        description: Drupal.t('For example 100px, or 50%.'),
        value: '100%',
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Height'),
        param_name: 'height',
        max: '10000',
        value: '500',
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Responsive?'),
        param_name: 'responsive',
        value: {
          'yes': Drupal.t("Yes"),
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Original width'),
        param_name: 'o_width',
        hidden: true,
      }),
    ].concat(LayersElement.prototype.params),
    show_settings_on_create: true,
    is_container: true,
    controls_base_position: 'top-left',
    disallowed_elements: ['az_layers'],
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    zindex_normalize: function() {
      var zindexes = [];
      for (var i = 0; i < this.children.length; i++) {
        if (isNaN(parseInt(this.children[i].attrs['pos_zindex']))) {
          this.children[i].attrs['pos_zindex'] = 0;
        }
        zindexes.push(parseInt(this.children[i].attrs['pos_zindex']));
      }
      zindexes = _.sortBy(zindexes, function(num) {
        return num;
      });
      zindexes = _.uniq(zindexes);
      for (var i = 0; i < this.children.length; i++) {
        var ind = _.sortedIndex(zindexes, parseInt(this.children[i].attrs['pos_zindex']));
        $(this.children[i].dom_element).css("z-index", ind);
        this.children[i].attrs['pos_zindex'] = ind;
      }
    },
    update_sortable: function() {
      if (window.glazed_editor) {
        var element = this;
        element.zindex_normalize();

        function store_position(dom_element) {
          var id = $(dom_element).closest('[data-az-id]').attr('data-az-id');
          var el = glazed_elements.get_element(id);
          el.attrs['pos_left'] = parseInt($(dom_element).css("left")) / ($(element.dom_content_element).width() /
            100) + "%";
          el.attrs['pos_top'] = parseInt($(dom_element).css("top")) / ($(element.dom_content_element).height() /
            100) + "%";
          el.attrs['pos_width'] = parseInt($(dom_element).css("width")) / ($(element.dom_content_element).width() /
            100) + "%";
          el.attrs['pos_height'] = parseInt($(dom_element).css("height")) / ($(element.dom_content_element).height() /
            100) + "%";
          to_percents(dom_element);
          element.attrs['o_width'] = $(element.dom_element).width();
          $(document).trigger("glazed_update_element", id);
        }

        function to_percents(dom_element) {
          $(dom_element).css("left", parseInt($(dom_element).css("left")) / ($(element.dom_content_element).width() /
            100) + "%");
          $(dom_element).css("top", parseInt($(dom_element).css("top")) / ($(element.dom_content_element).height() /
            100) + "%");
          $(dom_element).css("width", parseInt($(dom_element).css("width")) / ($(element.dom_content_element).width() /
            100) + "%");
          $(dom_element).css("height", parseInt($(dom_element).css("height")) / ($(element.dom_content_element)
            .height() / 100) + "%");
        }
        $(this.dom_content_element).resizable({
          //          containment: "parent",
          start: function(event, ui) {
            for (var i = 0; i < element.children.length; i++) {
              var dom_element = element.children[i].dom_element;
              to_percents(dom_element);
            }
          },
          stop: function(event, ui) {
            element.attrs['width'] = parseInt($(element.dom_content_element).css("width")) / ($(element.dom_element)
              .width() / 100) + "%";
            $(element.dom_content_element).width(element.attrs['width']);
            element.attrs['height'] = $(element.dom_content_element).height();
            $(document).trigger("glazed_update_element", element.id);
          }
        });
        for (var i = 0; i < this.children.length; i++) {
          if (!$.isNumeric($(this.children[i].dom_element).css("z-index"))) {
            $(this.children[i].dom_element).css("z-index", 0);
          }
          if (this.children[i].controls == null) {
            this.children[i].show_controls();
          }
          if (this.children[i].attrs['pos_top'] == null) {
            this.children[i].attrs['pos_top'] = '50%';
          }
          if (this.children[i].attrs['pos_left'] == null) {
            this.children[i].attrs['pos_left'] = '50%';
          }
          if (this.children[i].attrs['pos_width'] == null) {
            this.children[i].attrs['pos_width'] = '50%';
          }
          if (this.children[i].attrs['pos_height'] == null) {
            this.children[i].attrs['pos_height'] = '50%';
          }
          if (this.children[i].controls.find('.width100').length == 0)
            $('<span title="' + title("100% width") + '" class="control width100 btn btn-default glyphicon glyphicon-resize-horizontal" > </span>').appendTo(this
              .children[i].controls).click({
              object: this.children[i]
            }, function(e) {
              e.data.object.attrs['pos_left'] = '0%';
              $(e.data.object.dom_element).css("left", '0%');
              e.data.object.attrs['pos_width'] = '100%';
              $(e.data.object.dom_element).css("width", '100%');
              return false;
            });
          if (this.children[i].controls.find('.heigth100').length == 0)
            $('<span title="' + title("100% heigth") + '" class="control heigth100 btn btn-default glyphicon glyphicon-resize-vertical" > </span>').appendTo(this.children[
              i].controls).click({
              object: this.children[i]
            }, function(e) {
              e.data.object.attrs['pos_top'] = '0%';
              $(e.data.object.dom_element).css("top", '0%');
              e.data.object.attrs['pos_height'] = '100%';
              $(e.data.object.dom_element).css("height", '100%');
              return false;
            });
          if (this.children[i].controls.find('.forward').length == 0)
            $('<span title="' + title("Bring forward") + '" class="control forward btn btn-default glyphicon glyphicon-arrow-up" > </span>').appendTo(this.children[
              i].controls).click({
              object: this.children[i]
            }, function(e) {
              if ($.isNumeric($(e.data.object.dom_element).css("z-index"))) {
                $(e.data.object.dom_element).css("z-index", Math.round($(e.data.object.dom_element).css(
                  "z-index")) + 1);
                e.data.object.attrs['pos_zindex'] = $(e.data.object.dom_element).css("z-index");
              }
              else {
                $(e.data.object.dom_element).css("z-index", 0);
                e.data.object.attrs['pos_zindex'] = 0;
              }
              element.zindex_normalize();
              return false;
            });
          if (this.children[i].controls.find('.backward').length == 0)
            $('<span title="' + title("Send backward") + '" class="control backward btn btn-default glyphicon glyphicon-arrow-down" > </span>').appendTo(this.children[
              i].controls).click({
              object: this.children[i]
            }, function(e) {
              if ($.isNumeric($(e.data.object.dom_element).css("z-index"))) {
                if (Math.round($(e.data.object.dom_element).css("z-index")) > 0) {
                  $(e.data.object.dom_element).css("z-index", Math.round($(e.data.object.dom_element).css(
                    "z-index")) - 1);
                  e.data.object.attrs['pos_zindex'] = $(e.data.object.dom_element).css("z-index");
                }
              }
              else {
                $(e.data.object.dom_element).css("z-index", 0);
                e.data.object.attrs['pos_zindex'] = 0;
              }
              element.zindex_normalize();
              return false;
            });

          $(this.children[i].dom_element).draggable({
            handle: "> .controls > .drag-and-drop",
            containment: "#" + this.id,
            scroll: false,
            snap: "#" + this.id + ", .az-element",
            //connectToSortable: '.az-ctnr',
            stop: function(event, ui) {
              store_position(this);
            }
          });
          $(this.children[i].dom_element).resizable({
            containment: "#" + this.id,
            stop: function(event, ui) {
              store_position(this);
            }
          });
        }
      }
    },
    show_controls: function() {
      if (window.glazed_editor) {
        LayersElement.baseclass.prototype.show_controls.apply(this, arguments);
        this.update_sortable();
        var element = this;
        $(this.dom_content_element).dblclick(function(e) {
          if (e.which == 1) {
            glazed_elements.show(element, function(new_element) {
              new_element.attrs['pos_top'] = e.offsetY.toString() + 'px';
              new_element.attrs['pos_left'] = e.offsetX.toString() + 'px';
            });
          }
        });
      }
    },
    attach_children: function() {
      LayersElement.baseclass.prototype.attach_children.apply(this, arguments);
      if (window.glazed_editor)
        this.update_sortable();
    },
    showed: function($) {
      LayersElement.baseclass.prototype.showed.apply(this, arguments);
      var element = this;
      $(window).off('resize.az_layers' + element.id);
      if (this.attrs['responsive'] == 'yes') {
        function get_element_font_size(el, attr) {
          var v = '';
          var match = el.attrs[attr].match(/font-size[: ]*([\-\d\.]*)(px|%|em) *;/);
          if (match != null)
            v = match[1];
          return v;
        }

        function update_font_sizes(el, ratio) {
          //hover font size not updated !!!
          var fs = get_element_font_size(el, 'style');
          if (fs != '') {
            fs = fs * ratio;
            $(el.dom_element).css('font-size', fs + 'px');
          }
          for (var i = 0; i < el.children.length; i++)
            update_font_sizes(element.children[i], ratio);
        }

        $(window).on('resize.az_layers' + element.id, function() {
          var width = $(element.dom_element).width();
          if (!('o_width' in element.attrs) || element.attrs['o_width'] == '')
            element.attrs['o_width'] = width;
          var ratio = width / element.attrs['o_width'];
          $(element.dom_element).css('font-size', ratio * 100 + '%');
          $(element.dom_content_element).css('height', element.attrs['height'] * ratio + 'px');
          update_font_sizes(element, ratio);
        });
        $(window).trigger('resize');
      }
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-layers ' + this.attrs['el_class'] + '" style="' + this.attrs[
        'style'] + '"><div id="' + this.id + '" class="az-ctnr"></div></div>');
      this.dom_content_element = $(this.dom_element).find('.az-ctnr');
      $(this.dom_content_element).css('width', this.attrs['width']);
      $(this.dom_content_element).css('height', this.attrs['height']);
      LayersElement.baseclass.prototype.render.apply(this, arguments);
    },
  });