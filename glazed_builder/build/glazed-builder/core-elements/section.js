
  function SectionElement(parent, position) {
    SectionElement.baseclass.apply(this, arguments);
  }
  register_animated_element('az_section', true, SectionElement);
  mixin(SectionElement.prototype, {
    name: Drupal.t('Section'),
    icon: 'et et-icon-focus',
    // description: Drupal.t('Bootstrap grid container'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Full Width'),
        param_name: 'fluid',
        value: {
          'yes': Drupal.t("Yes"),
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('100% Height'),
        param_name: 'fullheight',
        value: {
          'yes': Drupal.t("Yes"),
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Background Effect'),
        param_name: 'effect',
        tab: Drupal.t('Background Effects'),
        value: {
          '': Drupal.t('Simple Image'),
          'fixed': Drupal.t('Fixed Image'),
          'parallax': Drupal.t('Parallax Image'),
          'youtube': Drupal.t('YouTube Video'),
        },
        description: Drupal.t('Select the effect you want to apply to the section background.')
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Parallax speed'),
        param_name: 'parallax_speed',
        tab: Drupal.t('Background Effects'),
        value: 20,
        dependency: {
          'element': 'effect',
          'value': ['parallax']
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Parallax Mode'),
        param_name: 'parallax_mode',
        tab: Drupal.t('Background Effects'),
        value: {
          'fixed': Drupal.t('Fixed'),
          'scroll': Drupal.t('Local'),
        },
        dependency: {
          'element': 'effect',
          'value': ['parallax']
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Video Play Options'),
        param_name: 'video_options',
        tab: Drupal.t('Background Effects'),
        description: Drupal.t('Select options for the video.'),
        value: {
          'loop': Drupal.t("Loop"),
          'mute': Drupal.t("Muted"),
        },
        dependency: {
          'element': 'effect',
          'value': ['youtube']
        },
      }),
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('YouTube Video URL'),
        param_name: 'video_youtube',
        tab: Drupal.t('Background Effects'),
        description: Drupal.t('Enter the YouTube video URL.'),
        dependency: {
          'element': 'effect',
          'value': ['youtube']
        },
      }),
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Start Time in seconds'),
        param_name: 'video_start',
        tab: Drupal.t('Background Effects'),
        description: Drupal.t('Enter time in seconds from where video start to play.'),
        value: '0',
        dependency: {
          'element': 'effect',
          'value': ['youtube']
        },
      }),
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Stop Time in seconds'),
        param_name: 'video_stop',
        tab: Drupal.t('Background Effects'),
        description: Drupal.t('Enter time in seconds where video ends.'),
        value: '0',
        dependency: {
          'element': 'effect',
          'value': ['youtube']
        },
      }),
    ].concat(SectionElement.prototype.params),
    is_container: true,
    controls_base_position: 'top-left',
    section: true,
    //    disallowed_elements: ['az_section'], - section is useful for popup element which can be placed anywhere
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    showed: function($) {
      SectionElement.baseclass.prototype.showed.apply(this, arguments);
      var element = this;
      switch (this.attrs['effect']) {
        case 'parallax':
          this.add_js_list({
            paths: ['vendor/jquery.parallax/jquery.parallax.js',
              'vendor/jquery.waypoints/lib/jquery.waypoints.min.js'
            ],
            loaded: 'waypoint' in $.fn && 'parallax' in $.fn,
            callback: function() {
              $(element.dom_element).waypoint(function(direction) {
                var background_position = $(element.dom_element).css('background-position');
                var match = background_position.match(/([\w%]*) [\w%]/);
                if (match == null)
                  var v = '50%';
                else
                  var v = match[1];
                $(element.dom_element).css('background-attachment', element.attrs['parallax_mode']);
                $(element.dom_element).css('background-position', v + ' 0');
                $(element.dom_element).parallax(v, element.attrs['parallax_speed'] / 100);
              }, {
                offset: '100%',
                handler: function(direction) {
                  this.destroy()
                },
              });
              $(document).trigger('scroll');
            }
          });
          break;
        case 'fixed':
          $(element.dom_element).css('background-attachment', 'fixed');
          break;
        case 'youtube':
          function youtube_parser(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[7].length == 11) {
              return match[7];
            }
            else {
              return false;
            }
          }
          var loop = _.indexOf(element.attrs['video_options'].split(','), 'loop') >= 0;
          var mute = _.indexOf(element.attrs['video_options'].split(','), 'mute') >= 0;
          this.add_css('vendor/jquery.mb.YTPlayer/dist/css/jquery.mb.YTPlayer.min.css', 'mb_YTPlayer' in $.fn,
            function() {});
          this.add_js_list({
            paths: ['vendor/jquery.mb.YTPlayer/dist/jquery.mb.YTPlayer.min.js',
              'vendor/jquery.waypoints/lib/jquery.waypoints.min.js'
            ],
            loaded: 'waypoint' in $.fn && 'mb_YTPlayer' in $.fn,
            callback: function() {
              $(element.dom_element).waypoint(function(direction) {
                $(element.dom_element).attr('data-property', "{videoURL:'" + youtube_parser(element.attrs[
                    'video_youtube']) + "',containment: '*[data-containment-id-" + element.ytContainmentId + "]'" +
                  ", showControls:false, autoPlay:true, loop:" + loop.toString() + ", mute:" +
                  mute.toString() + ", startAt:" + element.attrs['video_start'] + ", stopAt:" +
                  element.attrs['video_stop'] + ", opacity:1, addRaster:false, quality:'default'}");
                $(element.dom_element).mb_YTPlayer();
                $(element.dom_element).playYTP();
              }, {
                offset: '100%',
                handler: function(direction) {
                  this.destroy()
                },
              });
              $(document).trigger('scroll');
            }
          });
          break;
        default:
          break;
      }
    },

    render: function($) {
      this.ytContainmentId = Math.random().toString(36).substr(2, 5);
      this.dom_element = $('<div data-containment-id-' + this.ytContainmentId + ' class="az-element az-section ' + this.attrs['el_class'] +
        ' " style="' + this.attrs['style'] + '"></div>');
      if (this.attrs['fullheight'] == 'yes')
        this.dom_element.css('height', '100vh');
      if (this.attrs['fluid'] == 'yes')
        this.dom_content_element = $('<div class="az-ctnr container-fluid"></div>').appendTo(this.dom_element);
      else
        this.dom_content_element = $('<div class="az-ctnr container"></div>').appendTo(this.dom_element);
      SectionElement.baseclass.prototype.render.apply(this, arguments);
    },
  });
