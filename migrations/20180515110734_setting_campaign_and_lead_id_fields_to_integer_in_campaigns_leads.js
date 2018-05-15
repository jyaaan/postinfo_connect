
exports.up = function (knex, Promise) {
  const alter = knex.schema.alterTable('campaigns_leads', table => {
    table.integer('campaign_id').notNull().alter();
    table.integer('lead_id').notNull().alter();
  });

  return alter;
};

exports.down = function (knex, Promise) {
  const alter = knex.schema.alterTable('campaigns_leads', table => {
    table.string('campaign_id').notNull().alter();
    table.string('lead_id').notNull().alter();
  });

  return alter;
};
