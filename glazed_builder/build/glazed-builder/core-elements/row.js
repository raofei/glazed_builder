
  function RowElement(parent, position) {
    RowElement.baseclass.apply(this, arguments);
    this.columns = '';
    if (!position || typeof position !== 'boolean') {
      this.set_columns('1/2 + 1/2');
    }
    this.attrs['device'] = 'sm';
  }
  register_animated_element('az_row', true, RowElement);
  mixin(RowElement.prototype, {
    name: Drupal.t('Row'),
    icon: 'et et-icon-grid',
    // description: Drupal.t('Bootstap responsive row'),
    category: Drupal.t('Layout'),
    params: [
      make_param_type({
        type: 'dropdown',
        heading: Drupal.t('Device breakpoint'),
        param_name: 'device',
        value: {
          xs: Drupal.t('Extra small devices Phones (<768px)'),
          sm: Drupal.t('Small devices Tablets (≥768px)'),
          md: Drupal.t('Medium devices Desktops (≥992px)'),
          lg: Drupal.t('Large devices Desktops (≥1200px)')
        },
        description: Drupal.t('Bootstrap responsive grid breakpoints')
      }),
      make_param_type({
        type: 'checkbox',
        heading: Drupal.t('Equal Height Columns'),
        param_name: 'equal',
        value: {
          'yes': Drupal.t("Yes"),
        },
      }),
      ].concat(RowElement.prototype.params),
    is_container: true,
    controls_base_position: 'top-left',
    get_button: function() {
      return '<div class="well text-center text-overflow" data-az-element="' + this.base +
        '"><i class="' + this.icon + '"></i><div>' + this.name + '</div><div class="text-muted small">' + this.description + '</div></div>';
    },
    show_controls: function() {
      if (window.glazed_editor) {
        RowElement.baseclass.prototype.show_controls.apply(this, arguments);
        $(this.controls).find('.add').remove();
        $(this.controls).find('.paste').remove();
        var element = this;
        var controls = this.controls;
        var popoverContent = '<div class="row-layouts clearfix">';
        var layouts = [
          '1/1',
          '1/2 + 1/2',
          '1/3 + 1/3 + 1/3',
          '1/4 + 1/4 + 1/4 + 1/4',
          '1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6',
          '1/4 + 1/2 + 1/4',
          '1/6 + 4/6 + 1/6',
          '1/4 + 3/4',
          '3/4 + 1/4',
          '2/3 + 1/3',
          '1/3 + 2/3',
          '5/12 + 7/12',
        ];
        // Generate mini bootstrap grids http://codepen.io/jur/pen/PZbeaW
        var widths = '';
        for (var i = 0; i < layouts.length; i++) {
          popoverContent += '<div title="' + title('Set ' + layouts[i] + ' colums') + '" ' +
            '" data-az-columns="' + layouts[i] + '" ' +
            'class="az-mini-container control set-columns-layout"><div class="row">';
          widths = layouts[i].replace(' ', '').split('+');
          for (var j = 0; j < widths.length; j++) {
            popoverContent += '<div' + ' class="' + width2span(widths[j], 'xs') + '">' +
              '<div class="content"></div>' + '</div>';
          }
          popoverContent += '</div>';
          popoverContent += '</div>';
        }
        popoverContent +=
          '<small class="az-row-custom control set-columns-layout"><a href="#" class="glazed-util-text-muted text-small">Custom layout</a></small>';
        popoverContent += '</div>';

        var columns = $('<span title="' + title("Set row layout") + '" class="control set-columns btn btn-default glyphicon glyphicon-th"> </span>')
          .insertAfter(this.controls.find('.drag-and-drop'))
          [fp + 'popover']({
            animation: false,
            placement:'right',
            html: 'true',
            trigger: 'manual',
            //container: 'body',
            content: popoverContent,
          })
          .click(function() {
            $(columns)[fp + 'popover']('show') ;
            set_highest_zindex($(controls));
            set_highest_zindex($(controls).find('.popover'));
            $(controls).find('.popover .set-columns-layout').each(function() {
              $(this).click({
                object: element
              }, element.click_set_columns);
            });
            $(element.controls).mouseleave(function() {
              $(columns)[fp + 'popover']('hide');
              $(columns).css('display', '');
            });
          });
      }
    },
    update_sortable: function() {
      if (window.glazed_editor) {
        $(this.dom_element).sortable({
          axis: 'x',
          items: '> .az-column',
          handle: '> .controls > .drag-and-drop',
          update: this.update_sorting,
          placeholder: 'az-sortable-placeholder',
          forcePlaceholderSize: true,
          tolerance: "pointer",
          distance: 1,
          over: function(event, ui) {
            ui.placeholder.attr('class', ui.helper.attr('class'));
            ui.placeholder.removeClass('ui-sortable-helper');
            ui.placeholder.addClass('az-sortable-placeholder');
          },
        });
      }
    },
    update_sorting: function(event, ui) {
      RowElement.baseclass.prototype.update_sorting.apply(this, arguments);
      var element = glazed_elements.get_element($(this).closest('[data-az-id]').attr('data-az-id'));
      if (element) {
        for (var i = 0; i < element.children.length; i++) {
          element.children[i].update_empty();
        }
      }
    },
    update_dom: function() {
      RowElement.baseclass.prototype.update_dom.apply(this, arguments);
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].update_dom();
      }
    },
    click_set_columns: function(e) {
      var columns = $(this).attr('data-az-columns');
      if (columns == '' || columns == undefined) {
        if (e.data.object.columns == '') {
          columns = [];
          for (var i = 0; i < e.data.object.children.length; i++) {
            columns.push(e.data.object.children[i].attrs['width']);
          }
          e.data.object.columns = columns.join(' + ');
        }
        columns = window.prompt(Drupal.t('Enter bootstrap grid layout. For example 1/2 + 1/2.'), e.data.object.columns);
      }
      if (columns != '' && columns != null)
        e.data.object.set_columns(columns);
      return false;
    },
    set_columns: function(columns) {
      this.columns = columns;
      var widths = columns.replace(' ', '').split('+');
      if (this.children.length == 0) {
        for (var i = 0; i < widths.length; i++) {
          var child = new ColumnElement(this, true);
          child.update_dom();
          child.update_width(widths[i]);
        }
      }
      else {
        if (this.children.length == widths.length) {
          for (var i = 0; i < widths.length; i++) {
            this.children[i].update_width(widths[i]);
          }
        }
        else {
          if (this.children.length > widths.length) {
            var last_column = this.children[widths.length - 1];
            for (var i = 0; i < this.children.length; i++) {
              if (i < widths.length) {
                this.children[i].update_width(widths[i]);
              }
              else {
                var column = this.children[i];
                for (var j = 0; j < column.children.length; j++) {
                  column.children[j].parent = last_column;
                  last_column.children.push(column.children[j]);
                }
                column.children = [];
              }
            }
            last_column.update_dom();
            var removing_columns = this.children.slice(widths.length, this.children.length);
            for (var i = 0; i < removing_columns.length; i++) {
              removing_columns[i].remove();
            }
          }
          else {
            for (var i = 0; i < widths.length; i++) {
              if (i < this.children.length) {
                this.children[i].update_width(widths[i]);
              }
              else {
                var child = new ColumnElement(this, true);
                child.update_dom();
                child.update_width(widths[i]);
              }
            }
          }
        }
      }
      this.update_sortable();
    },
    showed: function($) {
      RowElement.baseclass.prototype.showed.apply(this, arguments);
    },
    render: function($) {
      this.dom_element = $('<div class="az-element az-row row ' + this.attrs['el_class'] + '" style="' +
        this.attrs['style'] + '"></div>');
      this.dom_content_element = this.dom_element;
      this.dom_element.addClass('az-row--' + this.attrs['device']);
      if (this.attrs['equal'] && this.attrs.equal === 'yes') {
        this.dom_element.addClass('az-row--equal-height');
      }
      RowElement.baseclass.prototype.render.apply(this, arguments);

    },
  });
