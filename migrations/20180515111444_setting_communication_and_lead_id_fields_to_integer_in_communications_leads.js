
exports.up = function (knex, Promise) {
  const alter = knex.schema.alterTable('communications_leads', table => {
    table.integer('communication_id').notNull().alter();
    table.integer('lead_id').notNull().alter();
  });

  return alter;
};

exports.down = function (knex, Promise) {
  const alter = knex.schema.alterTable('communications_leads', table => {
    table.string('communication_id').notNull().alter();
    table.string('lead_id').notNull().alter();
  });

  return alter;
};