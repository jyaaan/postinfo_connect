
exports.up = function (knex, Promise) {
  const query = knex.schema.table('campaigns_email_templates', table => {
    table.unique(['campaign_id', 'email_template_id']);
  });
  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('campaigns_email_templates', table => {
    table.dropUnique(['campaign_id', 'email_template_id']);
  })

  return query;
};