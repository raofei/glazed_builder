  {
    base: 'az_video',
    name: Drupal.t('Video'),
    icon: 'et et-icon-video',
    // description: Drupal.t('YouTube / Vimeo video'),
    params: [{
      type: 'textfield',
      heading: Drupal.t('Video link'),
      param_name: 'link',
      description: Drupal.t('Link Youtube or Vimeo video'),
    }, {
      type: 'textfield',
      heading: Drupal.t('Video width'),
      param_name: 'width',
      description: Drupal.t('For example 100px, or 50%.'),
      value: '100%',
    }, {
      type: 'image',
      heading: Drupal.t('Image'),
      param_name: 'image',
      description: Drupal.t('Select image from media library.'),
    }, {
      type: 'checkbox',
      heading: Drupal.t('Themed Play Button'),
      param_name: 'play',
      value: {
        'yes': Drupal.t("Yes"),
      },
    },],
    show_settings_on_create: true,
    showed: function($) {
      this.baseclass.prototype.showed.apply(this, arguments);
      var $domElement = $(this.dom_element);
      $domElement.find('.az-video-play, .az-video-icon').bind('click', function () {
        var $iframe = $domElement.find('iframe');
        $iframe.attr('src', $iframe.attr('src') + '&autoplay=1').show();
        $domElement.find('.az-video-play, .az-video-icon').hide();
      });
    },
    render: function($) {
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
      function vimeo_parser(url) {
        var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
        return m ? m[2] || m[1] : false;
      }
      var url = youtube_parser(this.attrs['link']);
      if (url) {
        url = 'https://www.youtube.com/embed/' + url + '?rel=0&showinfo=0';
      }
      else {
        url = vimeo_parser(this.attrs['link']);
        if (url) {
          url = 'https://player.vimeo.com/video/' + url;
        }
        else {
          url = '';
        }
      }
      this.dom_element = $('<div class="az-element az-video embed-responsive embed-responsive-16by9 ' + this.attrs[
          'el_class'] + '" style="' + this.attrs['style'] + '"></div>');

      function renderVideo(url, style, width, height, image) {
        if ($.isNumeric(width))
          width = width + 'px';
        var iframe = $('<iframe src="' + url +
          '" type="text/html" webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder="0"></iframe>'
        );
        iframe.attr('style', style);
        if (width.length > 0)
          iframe.css('width', width);
        if (image != '') {
          iframe.css('z-index', 1).hide();
        }
        return iframe;
      }
      function renderPlayButton(image, width, height) {
        if (image.length > 0) {
          var playButton = $('<div class="az-video-play"></div>');
          playButton.css('background-image', 'url(' + image + ')')
            .css('background-position', 'center')
            .css('background-repeat', 'no-repeat')
            .css('background-size', 'cover')
            .css('cursor', 'pointer')
            .css('position', 'absolute')
            .css('height', '100%')
            .css('width', '100%');
          if ($.isNumeric(width))
            width = width + 'px';
          playButton.width(width );
          if ($.isNumeric(height))
            height = height + 'px';
          playButton.height(height + 'px');
          return playButton;
        } else {
          return '';
        }
      }

      var playButton = renderPlayButton(this.attrs['image'], this.attrs['width'], this.attrs['height']);
      if (playButton != '') {
        $(playButton).appendTo(this.dom_element);
      }

      var video = renderVideo(url, this.attrs['style'], this.attrs['width'], this.attrs['height'], this.attrs['image']);
      $(video).appendTo(this.dom_element);

      if (this.attrs['play']) {
        var $videoIcon = $('<i class="az-video-icon bg-primary glyphicon glyphicon-play fa-2x ' + this.attrs['icon'] + '"></i>');
        $videoIcon.appendTo(this.dom_element);
      }

      this.baseclass.prototype.render.apply(this, arguments);
    }
  },
