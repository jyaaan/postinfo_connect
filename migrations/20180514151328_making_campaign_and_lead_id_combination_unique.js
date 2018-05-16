
exports.up = function(knex, Promise) {
  const query = knex.schema.table('campaigns_leads', table => {
    table.unique(['campaign_id', 'lead_id']);
  });
  return query;
};

exports.down = function(knex, Promise) {
  const query = knex.schema.table('campaigns_leads', table => {
    table.dropUnique(['campaign_id', 'lead_id']);
  })

  return query;  
};