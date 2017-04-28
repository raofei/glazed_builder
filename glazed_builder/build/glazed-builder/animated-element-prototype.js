
  function AnimatedElement(parent, position) {
    AnimatedElement.baseclass.apply(this, arguments);
  }
  extend(AnimatedElement, BaseElement);
  mixin(AnimatedElement.prototype, {
    params: [
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Animation start'),
        param_name: 'an_start',
        tab: Drupal.t('Animation'),
        value: {
          '': Drupal.t('No animation'),
          'appear': Drupal.t('On appear'),
          'hover': Drupal.t('On hover'),
          'click': Drupal.t('On click'),
          'trigger': Drupal.t('On trigger'),
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Animation in'),
        param_name: 'an_in',
        tab: Drupal.t('Animation'),
        value: glazed_animations,
        dependency: {
          'element': 'an_start',
          'value': ['appear', 'hover', 'click', 'trigger']
        },
      }),
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Animation out'),
        param_name: 'an_out',
        tab: Drupal.t('Animation'),
        value: glazed_animations,
        dependency: {
          'element': 'an_start',
          'value': ['hover', 'trigger']
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Hidden'),
        param_name: 'an_hidden',
        tab: Drupal.t('Animation'),
        value: {
          'before_in': Drupal.t("Before in-animation"),
          'after_in': Drupal.t("After in-animation"),
        },
        dependency: {
          'element': 'an_start',
          'value': ['appear', 'hover', 'click', 'trigger']
        },
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Infinite'),
        param_name: 'an_infinite',
        tab: Drupal.t('Animation'),
        value: {
          'yes': Drupal.t("Yes"),
        },
        dependency: {
          'element': 'an_start',
          'value': ['appear', 'hover', 'click', 'trigger']
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Appear Boundary'),
        param_name: 'an_offset',
        tab: Drupal.t('Animation'),
        max: '100',
        description: Drupal.t('In percent. (50% is center, 100% is bottom of screen)'),
        value: '100',
        dependency: {
          'element': 'an_start',
          'value': ['appear']
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Duration'),
        param_name: 'an_duration',
        tab: Drupal.t('Animation'),
        max: '3000',
        description: Drupal.t('In milliseconds.'),
        value: '1000',
        step: '50',
        dependency: {
          'element': 'an_start',
          'value': ['appear', 'hover', 'click', 'trigger']
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('In-delay'),
        param_name: 'an_in_delay',
        tab: Drupal.t('Animation'),
        max: '10000',
        description: Drupal.t('In milliseconds.'),
        value: '0',
        dependency: {
          'element': 'an_start',
          'value': ['appear', 'hover', 'click', 'trigger']
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Out-delay'),
        param_name: 'an_out_delay',
        tab: Drupal.t('Animation'),
        max: '10000',
        description: Drupal.t('In milliseconds.'),
        value: '0',
        dependency: {
          'element': 'an_start',
          'value': ['hover', 'trigger']
        },
      }),
      make_param_type({
        type: 'bootstrap_slider',
        heading: Drupal.t('Parent number'),
        param_name: 'an_parent',
        tab: Drupal.t('Animation'),
        max: '10',
        min: '0',
        description: Drupal.t(
          'Define the number of Parent Containers the animation should attempt to break away from.'),
        value: '1',
        dependency: {
          'element': 'an_start',
          'value': ['hover', 'click']
        },
      }),
      make_param_type({
        type: 'textfield',
        heading: Drupal.t('Name for animations'),
        param_name: 'an_name',
        hidden: true,
      }),
    ].concat(AnimatedElement.prototype.params),
    set_in_timeout: function() {
      var element = this;
      element.in_timeout = setTimeout(function() {
        element.clear_animation();
        $(element.dom_element).css('opacity', '');
        $(element.dom_element).removeClass('animated');
        $(element.dom_element).removeClass(element.attrs['an_in']);
        $(element.dom_element).removeClass(element.attrs['an_out']);
        element.animation_in = false;
        element.animation_out = false;
        $(element.dom_element).css('animation-duration', element.attrs['an_duration'] + 'ms');
        $(element.dom_element).css('-webkit-animation-duration', element.attrs['an_duration'] + 'ms');
        $(element.dom_element).addClass('animated');
        element.animated = true;
        if (element.attrs['an_infinite'] == 'yes') {
          $(element.dom_element).addClass('infinite');
        }
        $(element.dom_element).addClass(element.attrs['an_in']);
        element.animation_in = true;
      }, Math.round(element.attrs['an_in_delay']));
    },
    start_in_animation: function() {
      var element = this;
      if ($(element.dom_element).parents('.glazed-animations-disabled').length == 0) {
        if (element.attrs['an_in'] != '') {
          if (element.animated) {
            if (element.animation_out) {
              //still out-animate
              element.set_in_timeout();
            }
            else {
              if (element.out_timeout > 0) {
                //plan to in-animate
                clearTimeout(element.out_timeout);
                if (!element.hidden_after_in) {
                  element.set_in_timeout();
                }
              }
            }
          }
          else {
            //no animate, no plan
            element.set_in_timeout();
          }
        }
      }
    },
    set_out_timeout: function() {
      var element = this;
      element.out_timeout = setTimeout(function() {
        element.clear_animation();
        $(element.dom_element).css('opacity', '');
        $(element.dom_element).removeClass('animated');
        $(element.dom_element).removeClass(element.attrs['an_in']);
        $(element.dom_element).removeClass(element.attrs['an_out']);
        element.animation_in = false;
        element.animation_out = false;
        $(element.dom_element).css('animation-duration', element.attrs['an_duration'] + 'ms');
        $(element.dom_element).css('-webkit-animation-duration', element.attrs['an_duration'] + 'ms');
        $(element.dom_element).addClass('animated');
        element.animated = true;
        if (element.attrs['an_infinite'] == 'yes') {
          $(element.dom_element).addClass('infinite');
        }
        $(element.dom_element).addClass(element.attrs['an_out']);
        element.animation_out = true;
      }, Math.round(element.attrs['an_out_delay']));
    },
    start_out_animation: function() {
      var element = this;
      if ($(element.dom_element).parents('.glazed-animations-disabled').length == 0) {
        if (element.attrs['an_out'] != '') {
          if (element.animated) {
            if (element.animation_in) {
              //still in-animate
              element.set_out_timeout();
            }
            else {
              if (element.in_timeout > 0) {
                //plan to in-animate
                clearTimeout(element.in_timeout);
                if (!element.hidden_before_in) {
                  element.set_out_timeout();
                }
              }
            }
          }
          else {
            //no animate, no plan
            element.set_out_timeout();
          }
        }
      }
    },
    clear_animation: function() {
      if (this.animation_in) {
        if (this.hidden_before_in) {
          $(this.dom_element).css('opacity', '1');
        }
        if (this.hidden_after_in) {
          $(this.dom_element).css('opacity', '0');
        }
      }
      if (this.animation_out) {
        if (this.hidden_before_in) {
          $(this.dom_element).css('opacity', '0');
        }
        if (this.hidden_after_in) {
          $(this.dom_element).css('opacity', '1');
        }
      }
      if ($(this.dom_element).hasClass('animated')) {
        $(this.dom_element).css('animation-duration', '');
        $(this.dom_element).css('-webkit-animation-duration', '');
        $(this.dom_element).removeClass('animated');
        this.animated = false;
        $(this.dom_element).removeClass('infinite');
        $(this.dom_element).removeClass(this.attrs['an_in']);
        $(this.dom_element).removeClass(this.attrs['an_out']);
        this.animation_in = false;
        this.animation_out = false;
      }
    },
    end_animation: function() {
      this.in_timeout = 0;
      this.out_timeout = 0;
      if (this.animation_in) {
        this.clear_animation();
        if (this.attrs['an_start'] == 'hover' && !this.hover) {
          if (this.attrs['an_in'] != this.attrs['an_out']) {
            this.start_out_animation();
          }
        }
      }
      if (this.animation_out) {
        this.clear_animation();
        if (this.attrs['an_start'] == 'hover' && this.hover) {
          if (this.attrs['an_in'] != this.attrs['an_out']) {
            this.start_in_animation();
          }
        }
      }
    },
    trigger_start_in_animation: function() {
      if (this.attrs['an_start'] == 'trigger') {
        this.start_in_animation();
      }
      else {
        AnimatedElement.baseclass.prototype.trigger_start_in_animation.apply(this, arguments);
      }
    },
    trigger_start_out_animation: function() {
      if (this.attrs['an_start'] == 'trigger') {
        this.start_out_animation();
      }
      else {
        AnimatedElement.baseclass.prototype.trigger_start_out_animation.apply(this, arguments);
      }
    },
    animation: function() {
      var element = this;
      element.hidden_before_in = _.indexOf(element.attrs['an_hidden'].split(','), 'before_in') >= 0;
      element.hidden_after_in = _.indexOf(element.attrs['an_hidden'].split(','), 'after_in') >= 0;
      if (element.hidden_before_in) {
        $(element.dom_element).css('opacity', '0');
      }
      if (element.hidden_after_in) {
        $(element.dom_element).css('opacity', '1');
      }

      var parent_number = element.attrs['an_parent'];
      if (parent_number == '') {
        parent_number = 1;
      }
      parent_number = Math.round(parent_number);
      var i = 0;
      var parent = $(element.dom_element);
      while (i < parent_number) {
        parent = $(parent).parent().closest('[data-az-id]');
        i++;
      }
      if (element.attrs['an_start'] != '') {
        element.in_timeout = 0;
        element.out_timeout = 0;
        element.animated = false;
        element.animation_in = false;
        element.animation_out = false;
        var callback = function() {
          $(parent).off('click.az_animation' + element.id);
          $(parent).off('mouseenter.az_animation' + element.id);
          $(parent).off('mouseleave.az_animation' + element.id);
          switch (element.attrs['an_start']) {
            case 'click':
              $(parent).on('click.az_animation' + element.id, function() {
                if (!element.animated) {
                  element.start_in_animation();
                }
              });
              break;
            case 'appear':
              element.add_js({
                path: 'vendor/jquery.waypoints/lib/jquery.waypoints.min.js',
                loaded: 'waypoint' in $.fn,
                callback: function() {
                  $(element.dom_element).waypoint(function(direction) {
                    if (!element.animated) {
                      element.start_in_animation();
                    }
                  }, {
                    offset: element.attrs['an_offset'] + '%',
                    handler: function(direction) {
                      this.destroy()
                    },
                  });
                  $(document).trigger('scroll');
                }
              });
              break;
            case 'hover':
              $(parent).on('mouseenter.az_animation' + element.id, function() {
                element.hover = true;
                element.start_in_animation();
              });
              $(parent).on('mouseleave.az_animation' + element.id, function() {
                element.hover = false;
                element.start_out_animation();
              });
              break;
            case 'trigger':
              break;
            default:
              break;
          }
        };
        element.add_css('vendor/animate.css/animate.min.css', false, function() {
          callback();
        });
      }
    },
    update_scroll_animation: function() {
      // Function here for legacy support
      return false;
    },
    showed: function($) {
      AnimatedElement.baseclass.prototype.showed.apply(this, arguments);
      this.an_name = '';
      if ('an_name' in this.attrs && this.attrs['an_name'] != '') {
        this.an_name = this.attrs['an_name'];
        glazed_elements.elements_instances_by_an_name[this.an_name] = this;
      }
      if ('an_start' in this.attrs && this.attrs['an_start'] != '' && this.attrs['an_start'] != 'no') {
        this.animation();
      }
    },
    render: function($) {
      if ('an_name' in this.attrs && this.attrs['an_name'] != '') {
        $(this.dom_element).attr('data-an-name', this.attrs['an_name']);
      }
      AnimatedElement.baseclass.prototype.render.apply(this, arguments);
    }
  });

  function register_animated_element(base, is_container, Element) {
    extend(Element, AnimatedElement);
    Element.prototype.base = base;
    Element.prototype.is_container = is_container;
    AnimatedElement.prototype.elements[base] = Element;
    AnimatedElement.prototype.tags[base] = Element;
    if (is_container) {
      for (var i = 1; i < AnimatedElement.prototype.max_nested_depth; i++) {
        AnimatedElement.prototype.tags[base + '_' + i] = Element;
      }
    }
  }