  {
    base: 'az_panel',
    name: Drupal.t('Panel'),
    icon: 'et et-icon-focus',
    // description: Drupal.t('Content Panel'),
    params: [{
      type: 'textfield',
      heading: Drupal.t('Title'),
      param_name: 'title',
    },],
    is_container: true,
    controls_base_position: 'top-left',
    render: function($) {
      this.dom_element = $('<div class="az-element az-panel panel ' + this.attrs['el_class'] + ' ' +
        this.attrs['type'] + '" style="' + this.attrs['style'] + '"></div>');
      if (this.attrs['title'] != '') {
        var heading = $('<div class="panel-heading"><h3 class="panel-title">' + this.attrs[
            'title'] + '</div></div>');
        $(this.dom_element).append(heading);
      }
      var body = $('<div class="panel-body az-ctnr"></div>').appendTo(this.dom_element);
      this.dom_content_element = body;
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
