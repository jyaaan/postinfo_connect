
exports.up = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.unique(['campaign_id', 'lead_id', 'email_template_id']);
  });
  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.dropUnique(['campaign_id', 'lead_id', 'email_template_id']);
  })

  return query;
};