<?php

/**
 * @file
 * Callbacks to import Carbide Builder configuration.
 */

/**
 * Form constructor for the remove tokens form.
 */
function glazed_builder_cb_import_form($form, &$form_state) {
  return confirm_form(
    $form,
    t('Are you sure you want to import Carbide Builder configuration?'),
    'admin/config/content/glazed_builder'
  );
}

/**
 * Form submission handler for remove tokens form.
 */
function glazed_builder_cb_import_form_submit($form, &$form_state) {
  $data = array();

  $instances = field_info_instances();
  foreach ($instances as $entity_type => $bundles) {
    foreach ($bundles as $bundle_name => $instances) {
      foreach ($instances as $field_name => $instance) {
        // Change field formatter.
        foreach ($instance['display'] as $display_name => $display_info) {
          if ($display_info['type'] == 'text_carbide_builder') {
            $instance['display'][$display_name]['type'] = 'text_glazed_builder';
            $instance['display'][$display_name]['module'] = 'glazed_builder';
            field_update_instance($instance);
          }
        }
        // Find all entities that should be updated.
        if ($instance['display']['default']['type'] == 'text_glazed_builder') {
          $query = new EntityFieldQuery();
          $query
            ->entityCondition('entity_type', $entity_type)
            ->entityCondition('bundle', $bundle_name);
          $result = $query->execute();
          if (isset($result[$entity_type])) {
            $ids = array_keys($result[$entity_type]);
            foreach ($ids as $id) {
              $data[] = array($id, $entity_type, $field_name);
            }
          }
        }
      }
    }
  }

  $operations[] = array('glazed_builder_copy_templates_process', array());

  foreach ($data as $record) {
    $operations[] = array('glazed_builder_update_cb_content_process', array($record));
  }

  $batch = array(
    'operations' => $operations,
    'finished' => 'glazed_builder_updated_cb_content_finished',
    'file' => drupal_get_path('module', 'glazed_builder') . '/glazed_builder.cb_import.inc',
  );

  batch_set($batch);
  batch_process('admin/config/content/glazed_builder');
}

/**
 * Duplicates user templates.
 */
function glazed_builder_copy_templates_process() {
  try {
    db_query('INSERT {glazed_user_templates} SELECT * FROM {carbide_user_templates};');
  }
  catch (PDOException $exception) {
    // Catch only "Duplicate entries" exception.
    if ($exception->getCode() != 23000) {
      throw $exception;
    }
  }
}

/**
 * Batch 'process' callback.
 */
function glazed_builder_update_cb_content_process($record, &$context) {
  list($entity_id, $entity_type, $field_name) = $record;
  $entities = entity_load($entity_type, array($entity_id));
  $entity = reset($entities);
  foreach ($entity->{$field_name} as $language => $items) {
    foreach ($items as $delta => $item) {
      $entity->{$field_name}[$language][$delta]['value'] = glazed_builder_update_cb_content($item['value']);
      if (!empty($item['summary'])) {
        $entity->{$field_name}[$language][$delta]['summary'] = glazed_builder_update_cb_content($item['summary']);
      }
    }
  }
  $context['results'][] = entity_save($entity_type, $entity);
}

/**
 * Batch 'finished' callback.
 */
function glazed_builder_updated_cb_content_finished($success, $results, $operations) {
  if ($success) {
    $message = format_plural(
      count($results),
      '1 entity successfully processed.',
      '@count entities successfully processed.'
    );
    drupal_set_message($message);
  }
}

/**
 * Replaces all occurrences of "carbide" with "glazed".
 */
function glazed_builder_update_cb_content($content) {
  $search = array(
    '/carbide',
    '-carbide',
    '.carbide',
  );
  $replace = array(
    '/glazed',
    '-glazed',
    '.glazed',
  );
  return str_replace($search, $replace, $content);
}
