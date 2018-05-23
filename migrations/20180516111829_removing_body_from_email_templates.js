
exports.up = function (knex, Promise) {
  const query = knex.schema.table('email_templates', table => {
    table.dropColumn('body');
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('email_templates', table => {
    table.string('body', 5000);
  })

  return query;
};