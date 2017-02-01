
  function SlideElement(parent, position) {
    SlideElement.baseclass.apply(this, arguments);
  }
  register_element('az_slide', true, SlideElement);
  mixin(SlideElement.prototype, {
    name: Drupal.t('Slide'),
    params: [].concat(SlideElement.prototype.params),
    hidden: true,
    // frontend_render: true,
    is_container: true,
    show_parent_controls: true,
    controls_base_position: 'top-left',
    get_empty: function() {
      return '<div class="az-empty"><div class="top-left well"><h1>↖</h1>' + '<span class="glyphicon ' +
       'glyphicon-plus-sign"></span>' + Drupal.t(' add a new slide.') + '</div></div>';
    },
    show_controls: function() {
      if (window.glazed_editor) {
        SlideElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.clone').remove();
        $(this.controls).find('.drag-and-drop').remove();
        $('<span class="control btn btn-default glyphicon">' + this.name + '</span>')
          .prependTo(this.controls);
      }
    },
    get_my_shortcode: function() {
      return this.get_children_shortcode();
    },
    edited: function() {
      SlideElement.baseclass.prototype.edited.apply(this, arguments);
      this.parent.update_dom();
    },
    render: function($) {
      var type = 'panel-default';
      if (this.parent.attrs['type'] != '')
        type = this.parent.attrs['type'];
      this.dom_element = $('<div class="az-element az-slide az-ctnr ' + this.attrs['el_class'] + ' clearfix" style="' + this.attrs['style'] + '"></div>');
      this.dom_content_element = this.dom_element;
      SlideElement.baseclass.prototype.render.apply(this, arguments);
    },
  });