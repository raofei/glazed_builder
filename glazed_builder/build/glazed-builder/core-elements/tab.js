
  function TabElement(parent, position) {
    TabElement.baseclass.apply(this, arguments);
  }
  register_element('az_tab', true, TabElement);
  mixin(TabElement.prototype, {
    name: Drupal.t('Tab'),
    params: [
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Tab title'),
        param_name: 'title',
        value: Drupal.t('Title')
      }),
    ].concat(TabElement.prototype.params),
    hidden: true,
    is_container: true,
    controls_base_position: 'top-left',
    // show_parent_controls: true,
    get_empty: function() {
      return '<div class="az-empty"><div class="top-left well"><h1>↖</h1>' + '<span class="glyphicon ' +
       'glyphicon-plus-sign"></span>' + Drupal.t(' add a new tab.') + ' ' + Drupal.t(
          'Drag tab headers to change order.') + '</div></div>';
    },
    show_controls: function() {
      if (window.glazed_editor) {
        TabElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.drag-and-drop').remove();
        $('<span class="control btn btn-default glyphicon">' + this.name + '</span>')
          .prependTo(this.controls);
      }
    },
    get_my_shortcode: function() {
      return this.get_children_shortcode();
    },
    edited: function(attrs) {
      TabElement.baseclass.prototype.edited.apply(this, arguments);
      this.parent.update_dom();
      $('a[href="#' + this.id + '"]')[fp + 'tab']('show');
    },
    clone: function() {
      //TabElement.baseclass.prototype.clone.apply(this, arguments);
      var shortcode = TabElement.baseclass.prototype.get_my_shortcode.apply(this, arguments);
      $('#glazed-clipboard').html(encodeURIComponent(shortcode));
      this.parent.paste(this.parent.children.length);
      this.parent.update_dom();
    },
    remove: function() {
      TabElement.baseclass.prototype.remove.apply(this, arguments);
      this.parent.update_dom();
    },
    render: function($) {
      this.dom_element = $('<div id="' + this.id + '" class="az-element az-ctnr az-tab tab-pane ' +
        this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
      this.dom_content_element = this.dom_element;
      TabElement.baseclass.prototype.render.apply(this, arguments);
    },
  });