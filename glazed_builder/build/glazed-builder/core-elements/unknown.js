
  function UnknownElement(parent, position) {
    UnknownElement.baseclass.apply(this, arguments);
  }
  register_element('az_unknown', true, UnknownElement);
  mixin(UnknownElement.prototype, {
    has_content: true,
    hidden: true,
    show_controls: function() {},
    update_empty: function() {},
    render: function($) {
      this.dom_element = $('<div class = "az-element"></div>');
      this.dom_content_element = this.dom_element;
      if ('content' in this.attrs) {
        var match = /\[[^\]]*\]([^\[]*)\[\/[^\]]*\]/.exec(this.attrs['content']);
        if (match) {
          $(this.dom_element).append(match[1]);
        }
      }
      UnknownElement.baseclass.prototype.render.apply(this, arguments);
    },
  });