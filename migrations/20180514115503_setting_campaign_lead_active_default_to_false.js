
exports.up = function (knex, Promise) {
  const alter = knex.schema.alterTable('campaigns_leads', table => {
    table.boolean('active').defaultTo(false).alter();
  });

  return alter;
};

exports.down = function (knex, Promise) {
  const alter = knex.schema.alterTable('campaigns_leads', table => {
    table.boolean('active').defaultTo(true).alter();
  });

  return alter;
};
