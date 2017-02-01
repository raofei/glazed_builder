
  function TabsElement(parent, position) {
    TabsElement.baseclass.apply(this, arguments);
    if (!position || typeof position !== 'boolean') {
      this.add_tab();
    }
  }
  register_animated_element('az_tabs', true, TabsElement);
  mixin(TabsElement.prototype, {
    name: Drupal.t('Tabs'),
    icon: 'pe pe-7s-folder',
    // description: Drupal.t('Bootstrap content tabs'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Tab direction'),
        param_name: 'az_dirrection',
        value: {
          '': Drupal.t('Default'),
          'tabs-left': Drupal.t('Left'),
          'tabs-right': Drupal.t('Right'),
        },
      }),
    ].concat(TabsElement.prototype.params),
    is_container: true,
    controls_base_position: 'top-left',
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    show_controls: function() {
      if (window.glazed_editor) {
        TabsElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.add').remove();
        $(this.controls).find('.paste').remove();
        $('<span title="' + title("Add tab") + '" class="control add-tab btn btn-default ' +
         'glyphicon glyphicon-plus-sign" > </span>').appendTo(this.controls).click({
          object: this
        }, this.click_add_tab);
      }
    },
    update_sortable: function() {
      if (window.glazed_editor) {
        $(this.dom_element).sortable({
          axis: 'x',
          items: '> ul > li',
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
    update_sorting: function(event, ui) {
      var element = glazed_elements.get_element($(this).attr('data-az-id'));
      if (element) {
        var options = $(this).sortable('option');
        var children = [];
        $(this).find(options.items).each(function() {
          var id = $(this).find('a[data-toggle="tab"]').attr('href').replace('#', '');
          children.push(glazed_elements.get_element(id));
        });
        element.children = children;
        for (var i = 0; i < element.children.length; i++)
          element.children[i].parent = element;
        element.update_dom();
        $(document).trigger("glazed_update_sorting", ui);
      }
    },
    click_add_tab: function(e) {
      e.data.object.add_tab();
      return false;
    },
    add_tab: function() {
      var child = new TabElement(this, false);
      child.update_dom();
      this.update_dom();
      $(this.dom_element).find('a[href="#' + child.id + '"]')[fp + 'tab']('show');
    },
    showed: function($) {
      TabsElement.baseclass.prototype.showed.apply(this, arguments);
      $(this.dom_element).find('ul.nav-tabs li:first a')[fp + 'tab']('show');
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-tabs tabbable ' + this.attrs['el_class'] + this.attrs['az_dirrection'] + '" style="' + this.attrs[
        'style'] + '"></div>');
      var menu = '<ul class="nav nav-tabs" role="tablist">';
      for (var i = 0; i < this.children.length; i++) {
        menu += '<li><a href="#' + this.children[i].id + '" role="tab" data-toggle="tab">' + this.children[
          i].attrs['title'] + '</a></li>';
      }
      menu += '</ul>';
      $(this.dom_element).append(menu);
      var content = '<div id="' + this.id + '" class="tab-content"></div>';
      this.dom_content_element = $(content).appendTo(this.dom_element);
      TabsElement.baseclass.prototype.render.apply(this, arguments);
    },
  });