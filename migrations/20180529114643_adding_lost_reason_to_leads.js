
exports.up = function (knex, Promise) {
  const query = knex.schema.table('leads', table => {
    table.string('lost_reason', 2000);
  })

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('leads', table => {
    table.dropColumn('lost_reason');
  });

  return query;
};