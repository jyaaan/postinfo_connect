const async = require('async');

class Leads {
  constructor(database) {
    this.database = database;
  }
  create(leads) {
    var errorHistory = [];
    var validLeadUsernames = [];
    var campaignId;

    this.database.getRecords('name', leads[0].campaign, 'campaigns')
    .then(result => {
      if (result.length > 0) {
        var campaign = result[0];
        campaignId = result[0].id;
        if (campaign.stage == 'Planned') {
          async.eachSeries(leads, (lead, next) => {
            this.database.upsertLead(lead)
            .then(leadAdd => {
              // console.log('raw return: ', leadAdd);
              validLeadUsernames.push(lead.instagram_username);
              next();
            })
            .catch(err => {
              // console.error(err);
              errorHistory.push({
                instagram_username: lead.instagram_username,
                error: 'Upsert error' + err
              })
              next();
            })
          }, err => {
            console.log('there were ' + errorHistory.length + ' errors.');
            console.log(errorHistory);
            const timeNow = new Date(Date.now()).toISOString();
            this.database.getLeadIdsByUsernames(validLeadUsernames)
            .then(ids => {
              const campaignsLeadsInserts = ids.map(idObj => {
                return {
                  lead_id: idObj.id,
                  campaign_id: campaignId,
                  created_at: timeNow,
                  updated_at: timeNow,
                  active: false
                }
              })
              this.database.upsertCampaignsLeads(campaignsLeadsInserts)
              .then(resultQuery => {
                console.log(resultQuery);
              })
              .catch(err => {
                console.log('error upserting campaign leads join rows');
                console.error(err);
              })
            })
          })
        } else {
          console.error('Campaign stage not set to Planned');
        }
      } else {
        console.error('Campaign not found');
      }

    })
  }

  assignToCampaign(leadId, campaignId) {

  }
}

module.exports = Leads;