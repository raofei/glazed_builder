<?php

/**
 * @file
 * Callbacks to remove Glazed Builder tokens.
 */

/**
 * Form constructor for the remove tokens form.
 */
function glazed_builder_remove_tokens_form($form, &$form_state) {
  return confirm_form(
    array(),
    t('Are you sure you want to remove tokens?'),
    'admin/config/content/glazed_builder',
    t('This action cannot be undone.'),
    t('Remove tokens'),
    t('Cancel')
  );
}

/**
 * Form submission handler for remove tokens form.
 */
function glazed_builder_remove_tokens_form_submit($form, &$form_state) {
  $data = array();

  $instances = field_info_instances();
  foreach ($instances as $entity_type => $bundles) {
    foreach ($bundles as $bundle_name => $instances) {
      foreach ($instances as $field_name => $instance) {
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

  $operations = array();
  foreach (array_chunk($data, 10) as $portion) {
    $operations[] = array('glazed_builder_remove_tokens_process', array($portion));
  }

  $batch = array(
    'operations' => $operations,
    'finished' => 'glazed_builder_remove_tokens_finished',
    'file' => drupal_get_path('module', 'glazed_builder') . '/glazed_builder.remove_tokens.inc',
  );

  batch_set($batch);
  batch_process('admin/config/content/glazed_builder');
}

/**
 * Batch 'process' callback.
 */
function glazed_builder_remove_tokens_process($records, &$context) {
  foreach ($records as $record) {
    list($entity_id, $entity_type, $field_name) = $record;
    $entities = entity_load($entity_type, array($entity_id));
    $entity = reset($entities);
    foreach ($entity->{$field_name} as $language => $items) {
      foreach ($items as $delta => $item) {
        $entity->{$field_name}[$language][$delta]['value'] = glazed_builder_remove_base_url($item['value']);
        if (!empty($item['summary'])) {
          $entity->{$field_name}[$language][$delta]['summary'] = glazed_builder_remove_base_url($item['summary']);
        }
      }
    }
    $context['results'][] = entity_save($entity_type, $entity);
  }
}

/**
 * Batch 'finished' callback.
 */
function glazed_builder_remove_tokens_finished($success, $results, $operations) {
  if ($success) {
    $message = format_plural(
      count($results),
      '1 entity successfully processed.',
      '@count entities successfully processed.'
    );
    drupal_set_message($message);
  }
}
