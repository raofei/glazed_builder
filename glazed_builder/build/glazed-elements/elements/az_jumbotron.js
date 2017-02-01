  {
    base: 'az_jumbotron',
    name: Drupal.t('Jumbotron'),
    icon: 'et et-icon-megaphone',
    // description: Drupal.t('Big Box'),
    params: [],
    is_container: true,
    controls_base_position: 'top-left',
    render: function($) {
      this.dom_element = $('<div class="az-element az-ctnr az-jumbotron jumbotron ' + this.attrs[
          'el_class'] + '" style="' + this.attrs['style'] + '"></div>');
      this.dom_content_element = this.dom_element;
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
