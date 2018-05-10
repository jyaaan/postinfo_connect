
exports.up = function (knex, Promise) {
  const query = knex.schema.createTable('email_templates', table => {
    table.increments('id').notNull();

    table.string('name').notNull();
    table.unique('name');
    table.string('body', 5000);
    table.string('subject', 500);
    table.boolean('active').defaultTo(false);

    table.timestamp('created_at').notNull();
    table.timestamp('updated_at').notNull();
  });

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.dropTable('email_templates');

  return query;
};