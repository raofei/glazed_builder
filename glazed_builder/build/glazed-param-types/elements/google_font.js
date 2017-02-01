  {
    type: 'google_font',
    hidden: !'glazed_google_fonts' in window,
    get_value: function() {
      var font = $(this.dom_element).find('input[name="' + this.param_name + '"]').val();
      var subset = $(this.dom_element).find('input[name="' + this.param_name + '_subset"]').val();
      var variant = $(this.dom_element).find('input[name="' + this.param_name + '_variant"]').val();
      return font + '|' + subset + '|' + variant;
    },
    render: function(value) {
      var font = '';
      var subset = '';
      var variant = '';
      if (_.isString(value) && value != '' && value.split('|').length == 3) {
        font = value.split('|')[0];
        subset = value.split('|')[1];
        variant = value.split('|')[2];
      }
      var font_input = '<div class="col-sm-4"><label>' + this.heading + '</label><input class="form-control" name="' + this.param_name + '" type="text" value="' + font + '"></div>';
      var subset_input = '<div class="col-sm-4"><label>' + Drupal.t('Subset') + '</label><input class="form-control" name="' + this.param_name + '_subset" type="text" value="' + subset + '"></div>';
      var variant_input = '<div class="col-sm-4"><label>' + Drupal.t('Variant') + '</label><input class="' +
        'form-control" name="' + this.param_name + '_variant" type="text" value="' + variant + '"></div>';
      this.dom_element = $('<div class="form-group"><div class="row">' + font_input +
        subset_input + variant_input + '</div><p class="help-block">' + this.description +
        '</p></div>');
    },
    opened: function() {
      var element = this;
      var fonts = Object.keys(window.glazed_google_fonts);
      fonts = _.object(fonts, fonts);
      var font_select = null;
      var subset_select = null;
      var variant_select = null;
      font_select = chosen_select(fonts, $(this.dom_element).find('input[name="' + this.param_name + '"]'));
      $(font_select).chosen().change(function() {
        var f = Object.keys(window.glazed_google_fonts)[0];
        if ($(this).val() in window.glazed_google_fonts)
          f = window.glazed_google_fonts[$(this).val()];
        var subsets = {};
        for (var i = 0; i < f.subsets.length; i++) {
          subsets[f.subsets[i].id] = f.subsets[i].name;
        }
        var variants = {};
        for (var i = 0; i < f.variants.length; i++) {
          variants[f.variants[i].id] = f.variants[i].name;
        }

        $(subset_select).parent().find('.direct-input').click();
        subset_select = chosen_select(subsets, $(element.dom_element).find('input[name="' + element.param_name +
          '_subset"]'));

        $(variant_select).parent().find('.direct-input').click();
        variant_select = chosen_select(variants, $(element.dom_element).find('input[name="' + element.param_name +
          '_variant"]'));
      });
      $(font_select).chosen().trigger('change');
    },
  },
