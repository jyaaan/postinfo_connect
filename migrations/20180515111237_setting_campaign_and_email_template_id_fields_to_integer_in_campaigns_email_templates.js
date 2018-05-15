
exports.up = function (knex, Promise) {
  const alter = knex.schema.alterTable('campaigns_email_templates', table => {
    table.integer('campaign_id').notNull().alter();
    table.integer('email_template_id').notNull().alter();
  });

  return alter;
};

exports.down = function (knex, Promise) {
  const alter = knex.schema.alterTable('campaigns_email_templates', table => {
    table.string('campaign_id').notNull().alter();
    table.string('email_template_id').notNull().alter();
  });

  return alter;
};