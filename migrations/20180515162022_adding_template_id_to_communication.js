
exports.up = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.integer('email_template_id');
  })

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.dropColumn('email_template_id');
  });

  return query;
};