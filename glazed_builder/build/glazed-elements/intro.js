(function($) {
  var p = '';
  var fp = '';
  if ('glazed_prefix' in window) {
    p = window.glazed_prefix;
    fp = window.glazed_prefix.replace('-', '_');
  }

  function t(text) {
    if ('glazed_t' in window) {
      return window.glazed_t(text);
    } else {
      return text;
    }
  }

  var target_options = {
    '_self': Drupal.t('Same window'),
    '_blank': Drupal.t('New window'),
  };

  var colors = [];
  colors['brand'] = Drupal.t('Brand color');
  colors[''] = Drupal.t('Custom');
  colors['inherit'] = Drupal.t('Inherit');
  // Helped function for add button styles.
  function getButtonsStyle() {
    var keys = [p + 'btn-default', p + 'btn-primary', p + 'btn-success', p + 'btn-info', p + 'btn-warning', p + 'btn-danger', p + 'btn-link'];
    var value = [p + 'btn-default', p + 'btn-primary', p + 'btn-success', p + 'btn-info', p + 'btn-warning', p + 'btn-danger', p + 'btn-link'];
    for (var name in window.button_styles) {
      value.push(p + name);
      keys.push(window.button_styles[p + name]);
    }
    return _.object(keys, value);
  }
  var glazed_elements = [
