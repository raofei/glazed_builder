
  function ToggleElement(parent, position) {
    ToggleElement.baseclass.apply(this, arguments);
  }
  register_element('az_toggle', true, ToggleElement);
  mixin(ToggleElement.prototype, {
    name: Drupal.t('Toggle'),
    params: [
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Toggle title'),
        param_name: 'title',
        value: Drupal.t('Title')
      }),
    ].concat(ToggleElement.prototype.params),
    hidden: true,
    is_container: true,
    controls_base_position: 'top-left',
    // show_parent_controls: true,
    get_empty: function() {
      return '<div class="az-empty"><div class="top-left well"><h1>↖</h1>' + '<span class="glyphicon ' +
       'glyphicon-plus-sign"></span>' + Drupal.t(
          ' add a new toggle.') + '</div></div>';
    },
    get_my_shortcode: function() {
      return this.get_children_shortcode();
    },
    clone: function() {
      //ToggleElement.baseclass.prototype.clone.apply(this, arguments);
      var shortcode = ToggleElement.baseclass.prototype.get_my_shortcode.apply(this, arguments);
      $('#glazed-clipboard').html(encodeURIComponent(shortcode));
      this.parent.paste(this.parent.children.length);
    },
    render: function($) {
      var type ='panel-default';
      if (this.parent.attrs['type'] != '')
        type = this.parent.attrs['type'];
      this.dom_element = $('<div class="az-element az-toggle panel ' + type + ' ' + this.attrs[
          'el_class'] + '" style="' + this.attrs['style'] + '"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#' +
        this.parent.id + '" href="#' + this.id + '">' + this.attrs['title'] + '</a></h4></div><div id="' +
        this.id + '" class="panel-collapse collapse"><div class="panel-body az-ctnr"></div></div></div>');
      this.dom_content_element = $(this.dom_element).find('.panel-body');
      ToggleElement.baseclass.prototype.render.apply(this, arguments);
    },
  });