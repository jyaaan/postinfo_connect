
exports.up = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.string('html_body', 5000);
    table.string('status').defaultTo('Unsent');
    table.integer('lead_id').notNull();
    table.integer('campaign_id').notNull();
    table.timestamp('sent_at');
    table.timestamp('scheduled_for');
    table.string('message_id');
    table.string('response_to_id');
  })

  return query;
};

exports.down = function (knex, Promise) {
  const query = knex.schema.table('communications', table => {
    table.dropColumn('html_body');
    table.dropColumn('status');
    table.dropColumn('lead_id');
    table.dropColumn('campaign_id');
    table.dropColumn('sent_at');
    table.dropColumn('scheduled_for');
    table.dropColumn('message_id');
    table.dropColumn('response_to_id');
  });

  return query;
};