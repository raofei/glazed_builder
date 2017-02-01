
  function AccordionElement(parent, position) {
    AccordionElement.baseclass.apply(this, arguments);
    if (!position || typeof position !== 'boolean') {
      this.add_toggle();
    }
  }
  register_animated_element('az_accordion', true, AccordionElement);
  mixin(AccordionElement.prototype, {
    name: Drupal.t('Collapsibles'),
    icon: 'pe pe-7s-menu',
    // description: Drupal.t('Bootstrap Collapsibles'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t("Collapsed?"),
        param_name: 'collapsed',
        value: {
          'yes': Drupal.t("Yes"),
        },
      }),
    ].concat(AccordionElement.prototype.params),
    is_container: true,
    controls_base_position: 'top-left',
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    show_controls: function() {
      if (window.glazed_editor) {
        AccordionElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.add').remove();
        $(this.controls).find('.paste').remove();
        $('<span title="' + title("Add toggle") + '" class="control add-toggle btn btn-default glyphicon glyphicon-plus-sign" > </span>').appendTo(this.controls)
          .click({
            object: this
          }, this.click_add_toggle);
      }
    },
    update_sortable: function() {
      if (window.glazed_editor) {
        $(this.dom_element).sortable({
          axis: 'y',
          items: '> .az-toggle',
          handle: '> .controls > .drag-and-drop',
          update: this.update_sorting,
          placeholder: 'az-sortable-placeholder',
          forcePlaceholderSize: true,
          //          tolerance: "pointer",
          //          distance: 1,
          over: function(event, ui) {
            ui.placeholder.attr('class', ui.helper.attr('class'));
            ui.placeholder.removeClass('ui-sortable-helper');
            ui.placeholder.addClass('az-sortable-placeholder');
          }
        });
      }
    },
    click_add_toggle: function(e) {
      e.data.object.add_toggle();
      return false;
    },
    add_toggle: function() {
      var child = new ToggleElement(this, false);
      child.update_dom();
      this.update_dom();
    },
    update_dom: function() {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].update_dom();
      }
      AccordionElement.baseclass.prototype.update_dom.apply(this, arguments);
    },
    showed: function($) {
      AccordionElement.baseclass.prototype.showed.apply(this, arguments);
      $(this.dom_element).find('> .az-toggle > .in').removeClass(p + 'in');
      $(this.dom_element).find('> .az-toggle > .collapse:not(:first)')[fp + 'collapse']({
        'toggle': false,
        'parent': '#' + this.id
      });
      $(this.dom_element).find('> .az-toggle > .collapse:first')[fp + 'collapse']({
        'toggle': this.attrs['collapsed'] != 'yes',
        'parent': '#' + this.id
      });
    },
    render: function($) {
      this.dom_element = $('<div id="' + this.id + '" class="az-element az-accordion panel-group ' +
        this.attrs['el_class'] + '" style="' + this.attrs['style'] + '"></div>');
      this.dom_content_element = this.dom_element;
      AccordionElement.baseclass.prototype.render.apply(this, arguments);
    },
  });