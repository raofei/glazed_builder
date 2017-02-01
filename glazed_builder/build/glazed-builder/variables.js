

  /**
   * Set up core variables
   */
  window.glazed_backend = true;

  window.glazed_title = {
    'Drag and drop': Drupal.t('Drag and drop element.'),
    'Add': Drupal.t('Add new element into current element area.'),
    'Edit': Drupal.t('Open settings form to change element properties, set CSS styles and add CSS classes.'),
    'Paste': Drupal.t('Paste elements into current element area from clipboard copied into it before.'),
    'Copy': Drupal.t('Copy element or contained elements to clipboard.'),
    'Clone': Drupal.t('Clone current element.'),
    'Remove': Drupal.t('Delete current element'),
    'Save as template': Drupal.t('Save element or contained elements as template to template library.'),
    'Save container': Drupal.t('Save to server all elements which placed in current container element.'),
  };

  if (!('glazed_editor' in window))
    window.glazed_editor = false;

  var glazed_frontend = false;
  var p = '';
  var fp = '';
  var glazed_js_waiting_callbacks = {};
  var glazed_loaded_js = {};
  var glazed_elements = {};
  var glazed_containers = [];
  var glazed_containers_loaded = {};

  var glazed_animations = {
    "": Drupal.t('No animation'),
    "bounce": Drupal.t('bounce'),
    "float": Drupal.t('float'),
    "floatSmall": Drupal.t('floatSmall'),
    "floatLarge": Drupal.t('floatLarge'),
    "pulse": Drupal.t('pulse'),
    "shake": Drupal.t('shake'),
    "wobble": Drupal.t('wobble'),
    "jello": Drupal.t('jello'),
    "fadeIn": Drupal.t('fadeIn'),
    "fadeInDown": Drupal.t('fadeInDown'),
    "fadeInDownBig": Drupal.t('fadeInDownBig'),
    "fadeInLeft": Drupal.t('fadeInLeft'),
    "fadeInLeftBig": Drupal.t('fadeInLeftBig'),
    "fadeInRight": Drupal.t('fadeInRight'),
    "fadeInRightBig": Drupal.t('fadeInRightBig'),
    "fadeInUp": Drupal.t('fadeInUp'),
    "fadeInUpBig": Drupal.t('fadeInUpBig'),
    "fadeOut": Drupal.t('fadeOut'),
    "fadeOutDown": Drupal.t('fadeOutDown'),
    "fadeOutDownBig": Drupal.t('fadeOutDownBig'),
    "fadeOutLeft": Drupal.t('fadeOutLeft'),
    "fadeOutLeftBig": Drupal.t('fadeOutLeftBig'),
    "fadeOutRight": Drupal.t('fadeOutRight'),
    "fadeOutRightBig": Drupal.t('fadeOutRightBig'),
    "fadeOutUp": Drupal.t('fadeOutUp'),
    "fadeOutUpBig": Drupal.t('fadeOutUpBig'),
    "flipInX": Drupal.t('flipInX'),
    "flipInY": Drupal.t('flipInY'),
    "zoomIn": Drupal.t('zoomIn'),
    "zoomInDown": Drupal.t('zoomInDown'),
    "zoomInLeft": Drupal.t('zoomInLeft'),
    "zoomInRight": Drupal.t('zoomInRight'),
    "zoomInUp": Drupal.t('zoomInUp'),
    "zoomOut": Drupal.t('zoomOut'),
    "zoomOutDown": Drupal.t('zoomOutDown'),
    "zoomOutLeft": Drupal.t('zoomOutLeft'),
    "zoomOutRight": Drupal.t('zoomOutRight'),
    "zoomOutUp": Drupal.t('zoomOutUp'),
    "slideInDown": Drupal.t('slideInDown'),
    "slideInLeft": Drupal.t('slideInLeft'),
    "slideInRight": Drupal.t('slideInRight'),
    "slideInUp": Drupal.t('slideInUp'),
    "slideOutDown": Drupal.t('slideOutDown'),
    "slideOutLeft": Drupal.t('slideOutLeft'),
    "slideOutRight": Drupal.t('slideOutRight'),
    "slideOutUp": Drupal.t('slideOutUp'),
  };

  // Legacy variables, don't throw out they can be referenced in field values.
  var fp = '';
  var p = ''