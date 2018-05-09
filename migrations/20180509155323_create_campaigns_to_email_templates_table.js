
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('campaigns_email_templates', table => {
    table.increments('id').notNull();

    table.string('campaign_id').notNull();
    table.string('email_template_id').notNull();
    table.boolean('active').defaultTo(true);
    table.integer('position');
    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('campaigns_email_templates');

  return query;
};