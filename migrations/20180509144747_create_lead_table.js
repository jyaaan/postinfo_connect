
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('leads', table => {
    table.increments('id').notNull();

    table.string('instagram_username').notNull();
    table.unique('instagram_username');
    table.string('instagram_id').defaultTo('');
    table.integer('follower_count');
    table.string('website');
    
    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
    table.timestamp('last_modified_at');
    table.timestamp('last_activity_at');

    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');
    table.string('stage').defaultTo('New');
    table.string('conversion_event');
    table.string('last_campaign_event');
    table.string('last_communication_event');
    table.string('email').notNull();
    table.string('source').notNull();
    table.string('source_details').defaultTo('');;
    table.jsonb('categories');
    table.string('notes', 5000);
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('leads');

  return query;
};