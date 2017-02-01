  {
    base: 'az_counter',
    name: Drupal.t('Number Counter'),
    icon: 'et et-icon-hourglass',
    // description: Drupal.t('Count up or down'),
    params: [{
      type: 'textfield',
      heading: Drupal.t('Start'),
      param_name: 'start',
      description: Drupal.t('Enter the number to start counting from.'),
      value: '0',
    }, {
      type: 'textfield',
      heading: Drupal.t('End'),
      param_name: 'end',
      description: Drupal.t('Enter the number to count up to.'),
      value: '100',
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Font Size'),
      param_name: 'fontsize',
      max: '200',
      description: Drupal.t('Select the font size for the counter number.'),
      value: '30',
      formatter: true,
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Speed'),
      param_name: 'speed',
      max: '10000',
      description: Drupal.t('Select the speed in ms for the counter to finish.'),
      value: '2000',
    }, {
      type: 'dropdown',
      heading: Drupal.t('Thousand Seperator'),
      param_name: 'seperator',
      description: Drupal.t('Select a character to seperate thousands in the end number.'),
      value: {
        '': Drupal.t('None'),
        ',': Drupal.t('Comma'),
        '.': Drupal.t('Dot'),
        ' ': Drupal.t('Space'),
      },
    }, {
      type: 'textfield',
      heading: Drupal.t('Prefix'),
      param_name: 'prefix',
      description: Drupal.t('Enter any character to be shown before the number (i.e. $).'),
    }, {
      type: 'textfield',
      heading: Drupal.t('Postfix'),
      param_name: 'postfix',
      description: Drupal.t('Enter any character to be shown after the number (i.e. %).'),
    }, ],
    show_settings_on_create: true,
    showed: function($) {
      this.baseclass.prototype.showed.apply(this, arguments);
      var element = this;
      this.add_js_list({
        paths: ['vendor/jquery-countTo/jquery.countTo.min.js',
          'vendor/jquery.waypoints/lib/jquery.waypoints.min.js'
        ],
        loaded: 'waypoint' in $.fn && 'countTo' in $.fn,
        callback: function() {
          $(element.dom_element).waypoint(function(direction) {
            $(element.dom_element).find('#' + element.id).countTo({
              from: Math.round(element.attrs['start']),
              to: Math.round(element.attrs['end']),
              speed: Math.round(element.attrs['speed']),
              refreshInterval: 50,
              seperator: element.attrs['seperator'],
              formatter: function(value, options) {
                return element.attrs['prefix'] + value.toFixed(0).replace(/\B(?=(?:\d{3})+(?!\d))/g, options.seperator) + element.attrs[
                    'postfix'];
              }
            });
          }, {
            offset: '100%',
            handler: function(direction) {
              this.destroy()
            },
          });
          $(document).trigger('scroll');
          //        $(element.dom_element).waypoint({
          //          handler: function() {
          //          }
          //        });
        }
      });
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-counter"><div id="' + this.id + '" class="' + this.attrs[
          'el_class'] + '" style="' + this.attrs['style'] + '">' + this.attrs['start'] + '</div></div>');
      $(this.dom_element).find('#' + this.id).css('font-size', this.attrs['fontsize'] + 'px');
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
