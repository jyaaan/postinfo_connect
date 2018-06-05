
exports.up = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.string('thread_id');
  })

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.dropColumn('thread_id');
  });

  return query;
};