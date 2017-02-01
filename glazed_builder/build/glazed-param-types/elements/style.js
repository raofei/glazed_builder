  {
    type: 'style',
    create: function() {
      this.important = false;
    },
    get_value: function() {
      var imp = '';
      if (this.important) {
        imp = ' !important';
      }
      var style = '';
      var margin_top = $(this.dom_element).find('[name="margin_top"]').val();
      if (margin_top != '') {
        if ($.isNumeric(margin_top))
          margin_top = margin_top + 'px';
        style += 'margin-top:' + margin_top + imp + ';';
      }
      var margin_bottom = $(this.dom_element).find('[name="margin_bottom"]').val();
      if (margin_bottom != '') {
        if ($.isNumeric(margin_bottom))
          margin_bottom = margin_bottom + 'px';
        style += 'margin-bottom:' + margin_bottom + imp + ';';
      }
      var margin_left = $(this.dom_element).find('[name="margin_left"]').val();
      if (margin_left != '') {
        if ($.isNumeric(margin_left))
          margin_left = margin_left + 'px';
        style += 'margin-left:' + margin_left + imp + ';';
      }
      var margin_right = $(this.dom_element).find('[name="margin_right"]').val();
      if (margin_right != '') {
        if ($.isNumeric(margin_right))
          margin_right = margin_right + 'px';
        style += 'margin-right:' + margin_right + imp + ';';
      }
      var border_top_width = $(this.dom_element).find('[name="border_top_width"]').val();
      if (border_top_width != '') {
        if ($.isNumeric(border_top_width))
          border_top_width = border_top_width + 'px';
        style += 'border-top-width:' + border_top_width + imp + ';';
      }
      var border_bottom_width = $(this.dom_element).find('[name="border_bottom_width"]').val();
      if (border_bottom_width != '') {
        if ($.isNumeric(border_bottom_width))
          border_bottom_width = border_bottom_width + 'px';
        style += 'border-bottom-width:' + border_bottom_width + imp + ';';
      }
      var border_left_width = $(this.dom_element).find('[name="border_left_width"]').val();
      if (border_left_width != '') {
        if ($.isNumeric(border_left_width))
          border_left_width = border_left_width + 'px';
        style += 'border-left-width:' + border_left_width + imp + ';';
      }
      var border_right_width = $(this.dom_element).find('[name="border_right_width"]').val();
      if (border_right_width != '') {
        if ($.isNumeric(border_right_width))
          border_right_width = border_right_width + 'px';
        style += 'border-right-width:' + border_right_width + imp + ';';
      }
      var padding_top = $(this.dom_element).find('[name="padding_top"]').val();
      if (padding_top != '') {
        if ($.isNumeric(padding_top))
          padding_top = padding_top + 'px';
        style += 'padding-top:' + padding_top + imp + ';';
      }
      var padding_bottom = $(this.dom_element).find('[name="padding_bottom"]').val();
      if (padding_bottom != '') {
        if ($.isNumeric(padding_bottom))
          padding_bottom = padding_bottom + 'px';
        style += 'padding-bottom:' + padding_bottom + imp + ';';
      }
      var padding_left = $(this.dom_element).find('[name="padding_left"]').val();
      if (padding_left != '') {
        if ($.isNumeric(padding_left))
          padding_left = padding_left + 'px';
        style += 'padding-left:' + padding_left + imp + ';';
      }
      var padding_right = $(this.dom_element).find('[name="padding_right"]').val();
      if (padding_right != '') {
        if ($.isNumeric(padding_right))
          padding_right = padding_right + 'px';
        style += 'padding-right:' + padding_right + imp + ';';
      }
      var color = $(this.dom_element).find('#' + this.color_id).val();
      if (color != '') {
        style += 'color:' + color + imp + ';';
      }
      var fontsize = $(this.dom_element).find('[name="fontsize"]').val();
      if (fontsize != 0) {
        if ($.isNumeric(fontsize))
          fontsize = Math.round(fontsize) + 'px';
        style += 'font-size:' + fontsize + imp + ';';
      }
      var border_color = $(this.dom_element).find('#' + this.border_color_id).val();
      if (border_color != '') {
        style += 'border-color:' + border_color + imp + ';';
      }
      var border_radius = $(this.dom_element).find('[name="border_radius"]').val();
      if (border_radius != 0) {
        if ($.isNumeric(border_radius))
          border_radius = Math.round(border_radius) + 'px';
        style += 'border-radius:' + border_radius + imp + ';';
      }
      var border_style = $(this.dom_element).find('select[name="border_style"] > option:selected').val();
      if (border_style != '') {
        style += 'border-style:' + border_style + imp + ';';
      }
      var bg_color = $(this.dom_element).find('#' + this.bg_color_id).val();
      if (bg_color) {
        style += 'background-color:' + bg_color + imp + ';';
      }
      var bg_image = $(this.dom_element).find('[name="bg_image"]').val();
      if (bg_image) {
        style += 'background-image: url(' + encodeURI(bg_image) + ');';
      }
      var background_style = $(this.dom_element).find('select[name="background_style"] > option:selected').val();
      if (background_style.match(/repeat/)) {
        style += 'background-repeat: ' + background_style + imp + ';';
      }
      else if (background_style.match(/cover|contain/)) {
        style += 'background-repeat: no-repeat;';
        style += 'background-size: ' + background_style + imp + ';';
      }
      var background_position = $(this.dom_element).find('select[name="background_position"] > option:selected').val();
      if (background_position != '') {
        style += 'background-position:' + background_position + imp + ';';
      }
      var opacity = $(this.dom_element).find('[name="opacity"]').val();
      if (opacity != 0) {
        style += 'opacity:' + opacity + imp + ';';
      }
      return style;
    },
    render: function(value) {
      value = value.replace(/!important/g, '');
      var output = '<div class="style row">';
      var match = null;
      var v = '';
      output += '<div class="layout col-sm-6">';
      output += '<div class="margin"><label>' + Drupal.t('Margin') + '</label>';
      match = value.match(/margin-top[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_top" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/margin-bottom[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_bottom" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/margin-left[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_left" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/margin-right[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="margin_right" type="text" placeholder="-" value="' + v + '">';
      output += '<div class="border"><label>' + Drupal.t('Border') + '</label>';
      match = value.match(/border-top-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_top_width" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/border-bottom-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_bottom_width" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/border-left-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_left_width" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/border-right-width[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="border_right_width" type="text" placeholder="-" value="' + v + '">';
      output += '<div class="padding"><label>' + Drupal.t('Padding') + '</label>';
      match = value.match(/padding-top[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_top" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/padding-bottom[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_bottom" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/padding-left[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_left" type="text" placeholder="-" value="' + v + '">';
      match = value.match(/padding-right[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<input name="padding_right" type="text" placeholder="-" value="' + v + '">';
      output += '<div class="content">';
      output += '</div></div></div></div>';
      output += '</div>';
      output += '<div class="settings col-sm-6">';
      output += '<div class="font form-group"><label>' + Drupal.t('Font color') + '</label>';
      this.color_id = _.uniqueId();
      match = value.match(/(^| |;)color[: ]*([#\dabcdef]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[2];
      output += '<div><input id="' + this.color_id + '" name="color" type="text" value="' + v + '"></div></div>';
      output += '<div class="border form-group"><label>' + Drupal.t('Border color') + '</label>';
      this.border_color_id = _.uniqueId();
      match = value.match(/border-color[: ]*([#\dabcdef]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div><input id="' + this.border_color_id + '" name="border_color" type="text" value="' + v +
        '"></div></div>';
      output += '<div class="background form-group"><label>' + Drupal.t('Background') + '</label>';
      this.bg_color_id = _.uniqueId();
      match = value.match(/background-color[: ]*([#\dabcdef]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div><input id="' + this.bg_color_id + '" name="bg_color" type="text" value="' + v +
        '"></div>';
      this.bg_image_id = _.uniqueId();
      match = value.match(/background-image[: ]*url\(([^\)]+)\) *;/);
      if (match == null)
        v = '';
      else
        v = decodeURI(match[1]);
      output += '<input id="' + this.bg_image_id + '" name="bg_image" class="form-control" type="text" value="' + v + '"></div>';
      match = value.match(/background-repeat[: ]*([-\w]*) *;/);
      if (match == null) {
        v = '';
      }
      else {
        if (match[1] == 'repeat') {
          v = match[1];
        }
        else {
          if (match[1] == 'repeat-x') {
            v = 'repeat-x';
          }
          else {
            match = value.match(/background-size[: ]*([-\w]*) *;/);
            if (match == null) {
              v = 'no-repeat';
            }
            else {
              v = match[1];
            }
          }
        }
      }
      output += '<div class="form-group"><label>' + Drupal.t('Background style') + '</label><div class="form-controls"><select name="background_style" class="form-control">';
      var background_styles = {
        '': Drupal.t("Theme defaults"),
        'cover': Drupal.t("Cover"),
        'contain': Drupal.t("Contain"),
        'no-repeat': Drupal.t("No Repeat"),
        'repeat': Drupal.t("Repeat"),
      };
      for (var key in background_styles) {
        if (key == v)
          output += '<option selected value="' + key + '">' + background_styles[key] + '</option>';
        else
          output += '<option value="' + key + '">' + background_styles[key] + '</option>';
      }
      output += '</select>';
      output += '</div>';
      output += '</div>';
      match = value.match(/background-position[: ]*([\s\w]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div class="form-group"><label>' + Drupal.t('Background position') + '</label><div class="form-controls"><select name="background_position" class="form-control">';
      var background_position = {
        '': Drupal.t("Theme defaults"),
        'center center': Drupal.t("Center  Center"),
        'left top': Drupal.t("Left Top"),
        'left center': Drupal.t("Left Center"),
        'left bottom': Drupal.t("Left Bottom"),
        'right top': Drupal.t("Right Top"),
        'right center': Drupal.t("Right Center"),
        'right bottom': Drupal.t("Right Bottom"),
        'center bottom': Drupal.t("Center Bottom"),
      };
      for (var key in background_position) {
        if (key == v)
          output += '<option selected value="' + key + '">' + background_position[key] + '</option>';
        else
          output += '<option value="' + key + '">' + background_position[key] + '</option>';
      }
      output += '</select>';
      output += '</div></div>';


      match = value.match(/border-style[: ]*(\w*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div class="form-group"><label>' + Drupal.t('Border style') + '</label><div class="form-controls"><select name="border_style" class="form-control">';
      var border_styles = {
        '': Drupal.t("Theme defaults"),
        'solid': Drupal.t("Solid"),
        'dotted': Drupal.t("Dotted"),
        'dashed': Drupal.t("Dashed"),
        'none': Drupal.t("None"),
      };
      for (var key in border_styles) {
        if (key == v)
          output += '<option selected value="' + key + '">' + border_styles[key] + '</option>';
        else
          output += '<option value="' + key + '">' + border_styles[key] + '</option>';
      }
      output += '</select>';
      output += '</div></div>';
      match = value.match(/font-size[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<div class="form-group"><label>' + Drupal.t('Font size') + '</label><div class="form-controls"><input name="fontsize" class="form-control bootstrap-slider" type="text" value="' + v + '"></div></div>';
      match = value.match(/border-radius[: ]*([\-\d\.]*)(px|%|em) *;/);
      if (match == null)
        v = '';
      else
        v = match[1] + match[2];
      output += '<div class="form-group"><label>' + Drupal.t('Border radius') + '</label><div class="form-controls"><input name="border_radius" class="form-control bootstrap-slider" type="text" value="' + v + '"></div></div>';
      match = value.match(/opacity[: ]*([\d\.]*) *;/);
      if (match == null)
        v = '';
      else
        v = match[1];
      output += '<div class="form-group"><label>' + Drupal.t('Opacity') +'</label><div class="form-controls"><input name="opacity" class="form-control bootstrap-slider" type="text" value="' + v + '"></div>';
      output += '</div>';
      output += '</div>';
      output += '</div>';
      this.dom_element = $(output);
    },
    opened: function() {
      image_select($(this.dom_element).find('input[name="bg_image"]'));
      colorpicker('#' + this.color_id);
      colorpicker('#' + this.border_color_id);
      colorpicker('#' + this.bg_color_id);
      initBootstrapSlider($(this.dom_element).find('input[name="opacity"]'), 0, 1, $(this.dom_element).find(
        'input[name="opacity"]').val(), 0.01);

      initBootstrapSlider($(this.dom_element).find('input[name="fontsize"]'), 0, 100, $(this.dom_element).find(
        'input[name="fontsize"]').val(), 1, true);
      initBootstrapSlider($(this.dom_element).find('input[name="border_radius"]'), 0, 100, $(this.dom_element).find(
        'input[name="border_radius"]').val(), 1);
    },
  },
