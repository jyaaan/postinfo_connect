class Campaigns {
  constructor(database) {
    this.database = database;
  }

  getAssociatedLeads(campaignId) {

  }

  upsertCampaignsEmailTemplates(obj) {
    const dateString = obj.scheduled_for;
    obj.scheduled_for = new Date(obj.scheduled_for).toISOString();
    this.database.upsertCampaignsEmailTemplates(obj)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.error(err);
    })
  }

  activate(campaignId) {
    this.database.getRecord('id', campaignId, 'campaigns')
    .then(campaign => {
      if (campaign.length > 0) {
        // get all leads

        // get all active templates

        // for each lead, create communications and relationships

        // upsert communications and relationships
      } else {
        console.log('campaign_id: ' + campaignId + ' - does not exist'); 
      }
    })
  }
}

module.exports = Campaigns;