
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('campaigns', table => {
    table.increments('id').notNull();

    table.string('name').notNull();
    table.unique('name');
    table.integer('lead_count');
    table.integer('drip_count');
    table.string('stage').defaultTo('Planned');
    table.string('description', 5000);
    table.integer('step').defaultTo(0);
    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
    table.timestamp('started_at');
    table.timestamp('ended_at');
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('campaigns');

  return query;
};