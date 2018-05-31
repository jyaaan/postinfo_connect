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

        // Can only add leads to Planned campaigns
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
            this.database.getLeadsByUsernames(validLeadUsernames)
            .then(leads => {
              const validLeads = leads.filter(lead => { return lead.stage == 'New' });
              const campaignsLeadsInserts = validLeads.map(lead => {
                return {
                  lead_id: lead.id,
                  campaign_id: campaignId,
                  created_at: timeNow,
                  updated_at: timeNow,
                  active: true
                }
              })
              this.database.upsertCampaignsLeads(campaignsLeadsInserts)
              .then(resultQ => {
                const leadIds = validLeads.map(lead => { return lead.id });
                this.database.setLeadStages(leadIds, 'Working')
                .then(resultQuery => {
                  console.log(resultQuery);
                })
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

  getLeadByEmail(email) {
    return this.database.getRecords('email', email, 'leads');
  }

  getLeadByUsername(username) {
    return this.database.getRecords('instagram_username', username, 'leads');
  }

  getAssociatedCommunications(leadId) {
    return this.database.getRecords('lead_id', leadId, 'communications');
  }

  deactivateCommunications(leadId, status) {
    this.database.updateRecord({ status: status }, 'communications', 'lead_id', leadId)
    .then(console.log)
    .catch(console.error);
  }

  deactivateAssociatedCampaigns(leadId) {
    this.database.updateRecord({ active: false }, 'campaigns_leads', 'lead_id', leadId)
    .then(console.log)
    .catch(console.error);
  }

  assignToCampaign(leadId, campaignId) {

  }
}

module.exports = Leads;