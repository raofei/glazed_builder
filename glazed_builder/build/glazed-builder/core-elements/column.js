
  function ColumnElement(parent, position) {
    ColumnElement.baseclass.call(this, parent, position);
  }

  register_element('az_column', true, ColumnElement);
  mixin(ColumnElement.prototype, {
    name: Drupal.t('Column'),
    params: [
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Column with'),
        param_name: 'width',
        hidden: true,
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Vertical Centering'),
        param_name: 'vertical_centering',
        value: {
          'yes': Drupal.t('Yes')
        },
      })
    ].concat(ColumnElement.prototype.params),
    hidden: true,
    is_container: true,
    controls_base_position: 'top-left',
    show_parent_controls: true,
    //    disallowed_elements: ['az_section'], - section is useful for popup element which can be placed anywhere
    show_controls: function() {
      if (window.glazed_editor) {
        ColumnElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.clone').remove();
        $(this.controls).find('.copy').remove();
        $(this.controls).find('.remove').remove();
      }
    },
    get_my_shortcode: function() {
      return this.get_children_shortcode();
    },
    update_width: function(width) {
      $(this.dom_element).removeClass(width2span(this.attrs['width'], this.parent.attrs['device']));
      this.attrs['width'] = width;
      $(this.dom_element).addClass(width2span(this.attrs['width'], this.parent.attrs['device']));
      $(document).trigger("glazed_update_element", this.id);
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-ctnr az-column ' + this.attrs['el_class'] + ' ' +
        width2span(this.attrs['width'], this.parent.attrs['device']) + '" style="' + this.attrs['style'] +
        '"></div>');
      this.dom_content_element = this.dom_element;
      if (this.attrs.vertical_centering && this.attrs.vertical_centering === 'yes') {
        this.dom_element.addClass('az-util-vertical-centering');
      }
      ColumnElement.baseclass.prototype.render.apply(this, arguments);
    },
  });
