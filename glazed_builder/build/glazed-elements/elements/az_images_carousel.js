  {
    base: 'az_images_carousel',
    name: Drupal.t('Image carousel'),
    icon: 'et et-icon-pictures',
    // description: Drupal.t('Image Slider'),
    params: [{
      type: 'images',
      heading: Drupal.t('Images'),
      param_name: 'images',
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Interval'),
      param_name: 'interval',
      max: '10000',
      value: '5000',
    }, {
      type: 'checkbox',
      heading: Drupal.t('Hide'),
      param_name: 'hide',
      value: {
        'pagination_control': Drupal.t("Hide pagination control"),
        'prev_next_buttons': Drupal.t("Hide prev/next buttons"),
      },
    }, {
      type: 'textfield',
      heading: Drupal.t('Alt attribute'),
      param_name: 'alt',
      description: Drupal.t('Topic of image carousel'),
      can_be_empty: true,
      value: '',
      tab: Drupal.t('SEO'),
    }, {
      type: 'textfield',
      heading: Drupal.t('Title attribute'),
      param_name: 'title',
      description: Drupal.t('Additional information about the images'),
      can_be_empty: true,
      value: '',
      tab: Drupal.t('SEO'),
    },],
    show_settings_on_create: true,
    showed: function($) {
      this.baseclass.prototype.showed.apply(this, arguments);
      var element = this;
      $(this.dom_element)['carousel']({
        interval: this.attrs['interval'],
        pause: 'hover',
      });
    },
    render: function($) {
      var id = this.id;
      var element = this;
      var images = this.attrs['images'].split(',');
      this.dom_element = $('<div id="' + this.id + '" class="az-element az-images-carousel carousel ' +
        'slide ' + this.attrs['el_class'] + '" data-ride="carousel" style="' + this.attrs['style'] +
        '"></div>');
      var hide = this.attrs['hide'].split(',');
      if ($.inArray('pagination_control', hide) < 0) {
        var indicators = $('<ol class="carousel-indicators"></ol>');
        for (var i = 0; i < images.length; i++) {
          $(indicators).append('<li data-target="#' + this.id + '" data-slide-to="' + i + '"></li>');
        }
        $(this.dom_element).append(indicators);
      }

      var inner = $('<div class="carousel-inner"></div>');
      for (var i = 0; i < images.length; i++) {
        var item = $('<img class="item" style="width:100%" src="' + images[i] + '" alt="' + this.attrs['alt'] + '" title="' + this.attrs['title'] + '">').appendTo(inner);
      }
      $(this.dom_element).append(inner);
      if ($.inArray('prev_next_buttons', hide) < 0) {
        var controls = $('<a class="left carousel-control" href="#' + this.id +
          '" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#' +
          this.id + '" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>');
        $(this.dom_element).append(controls);
      }

      $(this.dom_element).find('.carousel-indicators li:first').addClass(p + 'active');
      $(this.dom_element).find('.carousel-inner .item:first').addClass(p + 'active');
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
