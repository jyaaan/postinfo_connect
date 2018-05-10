
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('campaigns_leads', table => {
    table.increments('id').notNull();

    table.string('campaign_id').notNull();
    table.string('lead_id').notNull();
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('campaigns_leads');

  return query;
};