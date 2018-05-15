const knex = require('knex')({
  client: 'postgresql',
  connection: {
    user: 'postgres',
    password: 'peanut',
    database: 'postinfo-connect',
    host: 'localhost',
    port: '5432'
  }
});

const util = require('util');
const async = require('async');

class Database {
  constructor() {

  }

  // Inserts single record into specified table.
  createRecord(record, tableName) {
    const timeNow = new Date(Date.now()).toISOString();
    record.created_at = timeNow;
    record.updated_at = timeNow;
    return knex(tableName)
           .insert(record);
  }

  // Updates single record into specified table.
  updateRecord(record, tableName, updateKey, updateValue) {
    const timeNow = new Date(Date.now()).toISOString();
    record.updated_at = timeNow;
    return knex(tableName)
           .where(updateKey, updateValue)
           .update(record)
  }

  // Returns true if value for a column in specified table exists
  verifyRecord(verifyKey, verifyValue, tableName) {
    return knex(tableName)
      .count('*')
      .where(verifyKey, verifyValue)
      .then(result => {
        return (result[0].count > 0);
      })
  }

  // Returns all columns of single row of given table
  getRecord(recordKey, recordValue, tableName) {
    return knex(tableName)
           .select('*')
           .where(recordKey, recordValue)
  }
  
  upsertLead (lead) {
    const timeNow = new Date(Date.now()).toISOString();
    lead.created_at = timeNow;
    lead.updated_at = timeNow;
    const instagramUsername = lead.instagram_username;
    const campaignName = lead.campaign;
    delete lead.campaign;
    return new Promise((resolve, reject) => {
      const insert = knex('leads').insert(lead);
      const uploadLead = Object.assign({}, lead);
      delete uploadLead.instagram_username;
      delete uploadLead.created_at;

      const update = knex('leads')
        .update(uploadLead)
        // .where('instagram_username', instagramUsername)

      const query = util.format(
        '%s ON CONFLICT (instagram_username) DO UPDATE SET %s',
        insert.toString(),
        formatConflictKeys(uploadLead)
      )

      this.raw(query)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  upsertCampaignsLeads(insertObj) {
    return new Promise((resolve, reject) => {
      const insert = knex('campaigns_leads').insert(insertObj);
      const query = util.format(
        '%s ON CONFLICT (campaign_id, lead_id) DO UPDATE SET %s;',
        insert.toString(),
        'updated_at = EXCLUDED.updated_at, active = EXCLUDED.active'
      )
      console.log(query);
      this.raw(query)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  getLeadIdsByUsernames(usernames) {
    return knex('leads')
      .select('id')
      .where('instagram_username', 'in', usernames)
  }

  getLeadsByCampaignId(campaignId) {
    const subquery = knex('campaigns_leads').select('lead_id').where('campaign_id', campaignId)
    return knex('leads')
           .select('*')
           .where('id', 'in', subquery)
  }

  raw(query) {
    return new Promise((resolve, reject) => {
      knex.raw(query)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      })
    })
  }
}

const formatConflictKeys = obj => {
  var conflictValues = [];
  Object.keys(obj).forEach(key => {
    if (obj[key] != '') {
      conflictValues.push(key + ' = ' + 'EXCLUDED.' + key)
    }
  })

  return conflictValues;
}

const spreadFormattedValues = (keys, arrValues) => {
  const formattedArrValues = arrValues.map(values => {
    return formatValuesByKeys(keys, values);
  });
  return formattedArrValues;
}
const formatValuesByKeys = (keys, values) => {
  const formattedValues = keys.map(key => {
    return values[key];
  })
  return formattedValues;
}

module.exports = Database;