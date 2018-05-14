
exports.up = function (knex, Promise) {
  const query = knex.schema.table('leads', table => {
    table.boolean('do_not_contact');
  })

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('leads', table => {
    table.dropColumn('do_not_contact');
  });

  return query;
};