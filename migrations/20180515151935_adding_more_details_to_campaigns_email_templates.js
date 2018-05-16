
exports.up = function (knex, Promise) {
  const query = knex.schema.table('campaigns_email_templates', table => {
    table.timestamp('scheduled_for');
  })

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('campaigns_email_templates', table => {
    table.dropColumn('scheduled_for');
  });

  return query;
};