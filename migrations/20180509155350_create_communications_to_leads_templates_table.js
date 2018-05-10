
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('communications_leads', table => {
    table.increments('id').notNull();

    table.string('communication_id').notNull();
    table.string('lead_id').notNull();
    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('communications_leads');

  return query;
};