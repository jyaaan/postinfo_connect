
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('communications', table => {
    table.increments('id').notNull();

    table.string('body', 5000);
    table.string('subject', 500);
    table.string('from');
    table.string('to');
    table.string('notes', 5000);

    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('communications');

  return query;
};