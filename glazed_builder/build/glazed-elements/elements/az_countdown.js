  {
    base: 'az_countdown',
    name: Drupal.t('Countdown Timer'),
    icon: 'et et-icon-clock',
    // description: Drupal.t('Count to date/time'),
    params: [{
      type: 'dropdown',
      heading: Drupal.t('Countdown style'),
      param_name: 'countdown_style',
      description: Drupal.t('Select the style for the countdown element.'),
      value: {
        'plain': Drupal.t('Plain'),
        'style1': Drupal.t('Grid'),
        'style6': Drupal.t('3D Flip'),
        'style9': Drupal.t('Disc'),
        'style10': Drupal.t('Airport Style'),
        'style12': Drupal.t('Transparent'),
      },
    }, {
      type: 'dropdown',
      heading: Drupal.t('Date / Time Limitations'),
      param_name: 'counter_scope',
      description: Drupal.t('Select the countdown scope in terms of date and time.'),
      value: {
        'date': Drupal.t('Specify Date Only'),
        'date_time': Drupal.t('Specify Date and Time'),
        'repeating': Drupal.t('Specifiy Time Only (repeating on every day)'),
        'resetting': Drupal.t('Resetting Counter (set interval up to 24 hours)'),
      },
    }, {
      type: 'datetime',
      heading: Drupal.t('Date'),
      param_name: 'date',
      datepicker: true,
      description: Drupal.t('Select the date to which you want to count down to.'),
      formatDate: 'd.m.Y',
      dependency: {
        'element': 'counter_scope',
        'value': ['date']
      },
    }, {
      type: 'datetime',
      heading: Drupal.t('Date / Time'),
      param_name: 'date_time',
      timepicker: true,
      datepicker: true,
      description: Drupal.t('Select the date and time to which you want to count down to.'),
      formatDate: 'd.m.Y',
      formatTime: 'H',
      dependency: {
        'element': 'counter_scope',
        'value': ['date_time']
      },
    }, {
      type: 'datetime',
      heading: Drupal.t('Time'),
      param_name: 'time',
      timepicker: true,
      description: Drupal.t('Select the time on the day above to which you want to count down to.'),
      formatTime: 'H',
      dependency: {
        'element': 'counter_scope',
        'value': ['repeating']
      },
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Reset in Hours'),
      param_name: 'reset_hours',
      max: 24,
      description: Drupal.t('Define the number of hours until countdown reset.'),
      dependency: {
        'element': 'counter_scope',
        'value': ['resetting']
      },
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Reset in Minutes'),
      param_name: 'reset_minutes',
      max: 60,
      description: Drupal.t('Define the number of minutes until countdown reset.'),
      dependency: {
        'element': 'counter_scope',
        'value': ['resetting']
      },
    }, {
      type: 'bootstrap_slider',
      heading: Drupal.t('Reset in Seconds'),
      param_name: 'reset_seconds',
      max: 60,
      description: Drupal.t('Define the number of seconds until countdown reset.'),
      dependency: {
        'element': 'counter_scope',
        'value': ['resetting']
      },
    }, {
      type: 'link',
      heading: Drupal.t('Page Referrer'),
      param_name: 'referrer',
      description: Drupal.t('Provide an optional link to another site/page to be opened after countdown expires.'),
      dependency: {
        'element': 'counter_scope',
        'value': ['repeating', 'resetting']
      },
    }, {
      type: 'checkbox',
      heading: Drupal.t('Automatic Restart'),
      param_name: 'restart',
      description: Drupal.t('Switch the toggle if you want to restart the countdown after each expiration.'),
      value: {
        'yes': Drupal.t("Yes"),
      },
      dependency: {
        'element': 'counter_scope',
        'value': ['resetting']
      },
    }, {
      type: 'saved_datetime',
      param_name: 'saved',
    }, {
      type: 'checkbox',
      heading: Drupal.t('Display Options'),
      param_name: 'display',
      value: {
        'days': Drupal.t("Show Remaining Days"),
        'hours': Drupal.t("Show Remaining Hours"),
        'minutes': Drupal.t("Show Remaining Minutes"),
        'seconds': Drupal.t("Show Remaining Seconds"),
      },
    }, ],
    show_settings_on_create: true,
    frontend_render: true,
    showed: function($) {
      this.baseclass.prototype.showed.apply(this, arguments);
      var element = this;
      this.add_css('vendor/counteverest/css/counteverest.glazed.css', 'countEverest' in $.fn, function() {});
      this.add_js_list({
        paths: ['vendor/counteverest/js/vendor/jquery.counteverest.min.js',
          'vendor/datetimepicker/jquery.datetimepicker.js'
        ],
        loaded: 'countEverest' in $.fn && 'datetimepicker' in $.fn,
        callback: function() {
          var options = {};
          switch (element.attrs['countdown_style']) {
            case 'style6':
            function countEverestFlipAnimate($el, data) {
              $el.each(function(index) {
                var $this = $(this),
                  $flipFront = $this.find('.ce-flip-front'),
                  $flipBack = $this.find('.ce-flip-back'),
                  field = $flipBack.text(),
                  fieldOld = $this.attr('data-old');
                if (typeof fieldOld === 'undefined') {
                  $this.attr('data-old', field);
                }
                if (field != fieldOld) {
                  $this.addClass('ce-animate');
                  window.setTimeout(function() {
                    $flipFront.text(field);
                    $this
                      .removeClass('ce-animate')
                      .attr('data-old', field);
                  }, 800);
                }
              });
            }
              if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') >
                0) {
                $('html').addClass('internet-explorer');
              }

              options = {
                daysWrapper: '.ce-days .ce-flip-back',
                hoursWrapper: '.ce-hours .ce-flip-back',
                minutesWrapper: '.ce-minutes .ce-flip-back',
                secondsWrapper: '.ce-seconds .ce-flip-back',
                wrapDigits: false,
                onChange: function() {
                  countEverestFlipAnimate($(element.dom_element).find('.ce-countdown .ce-col>div'),
                    this);
                }
              }
              break;
            case 'style9':
            function deg(v) {
              return (Math.PI / 180) * v - (Math.PI / 2);
            }

            function drawCircle(canvas, value, max) {
              var circle = canvas.getContext('2d');

              circle.clearRect(0, 0, canvas.width, canvas.height);
              circle.lineWidth = 6;

              circle.beginPath();
              circle.arc(
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2 - circle.lineWidth,
                deg(0),
                deg(360 / max * (max - value)),
                false);
              circle.strokeStyle = '#282828';
              circle.stroke();

              circle.beginPath();
              circle.arc(
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2 - circle.lineWidth,
                deg(0),
                deg(360 / max * (max - value)),
                true);
              circle.strokeStyle = '#1488cb';
              circle.stroke();
            }
              options = {
                leftHandZeros: false,
                onChange: function() {
                  drawCircle($(element.dom_element).find('#ce-days').get(0), this.days, 365);
                  drawCircle($(element.dom_element).find('#ce-hours').get(0), this.hours, 24);
                  drawCircle($(element.dom_element).find('#ce-minutes').get(0), this.minutes, 60);
                  drawCircle($(element.dom_element).find('#ce-seconds').get(0), this.seconds, 60);
                }
              }
              break;
            case 'style10':
              var $countdown = $(element.dom_element).find('.ce-countdown');
              var firstCalculation = true;
              options = {
                leftHandZeros: true,
                dayLabel: null,
                hourLabel: null,
                minuteLabel: null,
                secondLabel: null,
                afterCalculation: function() {
                  var plugin = this,
                    units = {
                      days: this.days,
                      hours: this.hours,
                      minutes: this.minutes,
                      seconds: this.seconds
                    },
                  //max values per unit
                    maxValues = {
                      hours: '23',
                      minutes: '59',
                      seconds: '59'
                    },
                    actClass = 'active',
                    befClass = 'before';

                  //build necessary elements
                  if (firstCalculation == true) {
                    firstCalculation = false;

                    //build necessary markup
                    $countdown.find('.ce-unit-wrap div').each(function() {
                      var $this = $(this),
                        className = $this.attr('class'),
                        unit = className.substring(3);
                      value = units[unit],
                        sub = '',
                        dig = '';

                      //build markup per unit digit
                      for (var x = 0; x < 10; x++) {
                        sub += [
                          '<div class="ce-digits-inner">',
                          '<div class="ce-flip-wrap">',
                          '<div class="ce-up">',
                          '<div class="ce-shadow"></div>',
                          '<div class="ce-inn">' + x + '</div>',
                          '</div>',
                          '<div class="ce-down">',
                          '<div class="ce-shadow"></div>',
                          '<div class="ce-inn">' + x + '</div>',
                          '</div>',
                          '</div>',
                          '</div>'
                        ].join('');
                      }

                      //build markup for number
                      for (var i = 0; i < value.length; i++) {
                        dig += '<div class="ce-digits">' + sub + '</div>';
                      }
                      $this.append(dig);
                    });
                  }

                  //iterate through units
                  $.each(units, function(unit) {
                    var digitCount = $countdown.find('.ce-' + unit + ' .ce-digits').length,
                      maxValueUnit = maxValues[unit],
                      maxValueDigit,
                      value = plugin.strPad(this, digitCount, '0');

                    //iterate through digits of an unit
                    for (var i = value.length - 1; i >= 0; i--) {
                      var $digitsWrap = $countdown.find('.ce-' + unit + ' .ce-digits:eq(' + (i) +
                          ')'),
                        $digits = $digitsWrap.find('div.ce-digits-inner');

                      //use defined max value for digit or simply 9
                      if (maxValueUnit) {
                        maxValueDigit = (maxValueUnit[i] == 0) ? 9 : maxValueUnit[i];
                      }
                      else {
                        maxValueDigit = 9;
                      }

                      //which numbers get the active and before class
                      var activeIndex = parseInt(value[i]),
                        beforeIndex = (activeIndex == maxValueDigit) ? 0 : activeIndex + 1;

                      //check if value change is needed
                      if ($digits.eq(beforeIndex).hasClass(actClass)) {
                        $digits.parent().addClass('play');
                      }

                      //remove all classes
                      $digits
                        .removeClass(actClass)
                        .removeClass(befClass);

                      //set classes
                      $digits.eq(activeIndex).addClass(actClass);
                      $digits.eq(beforeIndex).addClass(befClass);
                    }
                  });
                }
              }
              break;
          }
          switch (element.attrs['counter_scope']) {
            case 'date':
              var d = Date.parseDate(element.attrs['date'], 'd.m.Y');
              if (d != null)
                $(element.dom_element).countEverest($.extend(options, {
                  day: d.getDate(),
                  month: d.getMonth() + 1,
                  year: d.getFullYear(),
                }));
              break;
            case 'date_time':
              var d = Date.parseDate(element.attrs['date_time'], 'd.m.Y H');
              if (d != null)
                $(element.dom_element).countEverest($.extend(options, {
                  day: d.getDate(),
                  month: d.getMonth() + 1,
                  year: d.getFullYear(),
                  hour: d.getHours()
                }));
              break;
            case 'repeating':
              var d = new Date();
              d.setHours(element.attrs['time']);
              if (d != null)
                $(element.dom_element).countEverest($.extend(options, {
                  day: d.getDate(),
                  month: d.getMonth() + 1,
                  year: d.getFullYear(),
                  hour: d.getHours(),
                  onComplete: function() {
                    if (element.attrs['referrer'] != '') {
                      window.location.replace(element.attrs['referrer']);
                    }
                  }
                }));
              break;
            case 'resetting':
              if (element.attrs['saved'] != '') {
                var saved = new Date(element.attrs['saved']);
                var interval = (Math.round(element.attrs['reset_hours']) * 60 * 60 + Math.round(element.attrs[
                    'reset_minutes']) * 60 + Math.round(element.attrs['reset_seconds'])) * 1000;
                if (element.attrs['restart'] == 'yes') {
                  var current = new Date();
                  var elapsed = current.getTime() - saved.getTime();
                  var k = elapsed / interval;
                  elapsed = elapsed - Math.floor(k) * interval;
                  var delta = interval - elapsed;
                  var d = new Date(current.getTime() + delta);
                  $(element.dom_element).countEverest($.extend(options, {
                    day: d.getDate(),
                    month: d.getMonth() + 1,
                    year: d.getFullYear(),
                    hour: d.getHours(),
                    minute: d.getMinutes(),
                    second: d.getSeconds(),
                    onComplete: function() {
                      if (element.attrs['referrer'] != '') {
                        window.location.replace(element.attrs['referrer']);
                      }
                    }
                  }));
                }
                else {
                  var d = new Date(saved.getTime() + interval);
                  $(element.dom_element).countEverest($.extend(options, {
                    day: d.getDate(),
                    month: d.getMonth() + 1,
                    year: d.getFullYear(),
                    hour: d.getHours(),
                    minute: d.getMinutes(),
                    second: d.getSeconds(),
                    onComplete: function() {
                      if (element.attrs['referrer'] != '') {
                        window.location.replace(element.attrs['referrer']);
                      }
                    }
                  }));
                }
              }
              break;
            default:
              break;
          }
        }
      });
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-countdown ' + this.attrs['el_class'] + '" style="' + this
          .attrs['style'] + '"></div>');
      var countdown = $('<div class="ce-countdown"></div>').appendTo(this.dom_element);
      switch (this.attrs['countdown_style']) {
        case 'style1':
          $(this.dom_element).addClass('ce-countdown--theme-1');
          if (_.indexOf(this.attrs['display'].split(','), 'days') >= 0)
            $(countdown).append(
              '<div class="ce-col"><span class="ce-days"></span> <span class="ce-days-label"></span></div>');
          if (_.indexOf(this.attrs['display'].split(','), 'hours') >= 0)
            $(countdown).append(
              '<div class="ce-col"><span class="ce-hours"></span> <span class="ce-hours-label"></span></div>');
          if (_.indexOf(this.attrs['display'].split(','), 'minutes') >= 0)
            $(countdown).append(
              '<div class="ce-col"><span class="ce-minutes"></span> <span class="ce-minutes-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'seconds') >= 0)
            $(countdown).append(
              '<div class="ce-col"><span class="ce-seconds"></span> <span class="ce-seconds-label"></span></div>'
            );
          break;
        case 'style6':
          $(this.dom_element).addClass('ce-countdown--theme-6 clearfix');
          if (_.indexOf(this.attrs['display'].split(','), 'days') >= 0)
            $(countdown).append(
              '<div class="ce-col col-md-3"><div class="ce-days"><div class="ce-flip-wrap"><div class="ce-flip-front bg-primary"></div><div class="ce-flip-back bg-primary"></div></div></div><span class="ce-days-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'hours') >= 0)
            $(countdown).append(
              '<div class="ce-col col-md-3"><div class="ce-hours"><div class="ce-flip-wrap"><div class="ce-flip-front bg-primary"></div><div class="ce-flip-back bg-primary"></div></div></div><span class="ce-hours-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'minutes') >= 0)
            $(countdown).append(
              '<div class="ce-col col-md-3"><div class="ce-minutes"><div class="ce-flip-wrap"><div class="ce-flip-front bg-primary"></div><div class="ce-flip-back bg-primary"></div></div></div><span class="ce-minutes-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'seconds') >= 0)
            $(countdown).append(
              '<div class="ce-col col-md-3"><div class="ce-seconds"><div class="ce-flip-wrap"><div class="ce-flip-front bg-primary"></div><div class="ce-flip-back bg-primary"></div></div></div><span class="ce-seconds-label"></span></div>'
            );
          break;
        case 'style9':
          $(this.dom_element).addClass('ce-countdown--theme-9');
          if (_.indexOf(this.attrs['display'].split(','), 'days') >= 0)
            $(countdown).append(
              '<div class="ce-circle"><canvas id="ce-days" width="408" height="408"></canvas><div class="ce-circle__values"><span class="ce-digit ce-days"></span><span class="ce-label ce-days-label"></span></div></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'hours') >= 0)
            $(countdown).append(
              '<div class="ce-circle"><canvas id="ce-hours" width="408" height="408"></canvas><div class="ce-circle__values"><span class="ce-digit ce-hours"></span><span class="ce-label ce-hours-label"></span></div></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'minutes') >= 0)
            $(countdown).append(
              '<div class="ce-circle"><canvas id="ce-minutes" width="408" height="408"></canvas><div class="ce-circle__values"><span class="ce-digit ce-minutes"></span><span class="ce-label ce-minutes-label"></span></div></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'seconds') >= 0)
            $(countdown).append(
              '<div class="ce-circle"><canvas id="ce-seconds" width="408" height="408"></canvas><div class="ce-circle__values"><span class="ce-digit ce-seconds"></span><span class="ce-label ce-seconds-label"></span></div></div>'
            );
          break;
        case 'style10':
          $(this.dom_element).addClass('ce-countdown--theme-10');
          if (_.indexOf(this.attrs['display'].split(','), 'days') >= 0)
            $(countdown).append(
              '<div class="ce-unit-wrap"><div class="ce-days"></div><span class="ce-days-label"></span></div>');
          if (_.indexOf(this.attrs['display'].split(','), 'hours') >= 0)
            $(countdown).append(
              '<div class="ce-unit-wrap"><div class="ce-hours"></div><span class="ce-hours-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'minutes') >= 0)
            $(countdown).append(
              '<div class="ce-unit-wrap"><div class="ce-minutes"></div><span class="ce-minutes-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'seconds') >= 0)
            $(countdown).append(
              '<div class="ce-unit-wrap"><div class="ce-seconds"></div><span class="ce-seconds-label"></span></div>'
            );
          break;
        case 'style12':
          $(this.dom_element).addClass('ce-countdown--theme-12');
          if (_.indexOf(this.attrs['display'].split(','), 'days') >= 0)
            $(countdown).append(
              '<div class="ce-col"><div class="ce-days ce-digits"></div> <span class="ce-days-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'hours') >= 0)
            $(countdown).append(
              '<div class="ce-col"><div class="ce-hours ce-digits"></div> <span class="ce-hours-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'minutes') >= 0)
            $(countdown).append(
              '<div class="ce-col"><div class="ce-minutes ce-digits"></div> <span class="ce-minutes-label"></span></div>'
            );
          if (_.indexOf(this.attrs['display'].split(','), 'seconds') >= 0)
            $(countdown).append(
              '<div class="ce-col"><div class="ce-seconds ce-digits"></div> <span class="ce-seconds-label"></span></div>'
            );
          break;
        default:
          if (_.indexOf(this.attrs['display'].split(','), 'days') >= 0)
            $(countdown).append('<span class="lead ce-days"></span> <span class="lead ce-days-label"></span> ');
          if (_.indexOf(this.attrs['display'].split(','), 'hours') >= 0)
            $(countdown).append(
              '<span class="lead ce-hours"></span> <span class="lead ce-hours-label"></span> ');
          if (_.indexOf(this.attrs['display'].split(','), 'minutes') >= 0)
            $(countdown).append(
              '<span class="lead ce-minutes"></span> <span class="lead ce-minutes-label"></span> ');
          if (_.indexOf(this.attrs['display'].split(','), 'seconds') >= 0)
            $(countdown).append(
              '<span class="lead ce-seconds"></span> <span class="lead ce-seconds-label"></span> ');
          break;
      }
      this.baseclass.prototype.render.apply(this, arguments);
    },
  },
