const async = require('async');

class Campaigns {
  constructor(database, templates, leads, communications) {
    this.database = database;
    this.templates = templates;
    this.leads = leads;
    this.communications = communications;
  }

  getAssociatedLeads(campaignId) {
  }

  upsertCampaignsEmailTemplates(obj) {
    const dateString = obj.scheduled_for;
    obj.scheduled_for = new Date(obj.scheduled_for).toISOString();
    this.database.upsertCampaignsEmailTemplates(obj)
    .then(console.log)
    .catch(console.error)
  }

  generateEmailTest(templateId) {
    return new Promise((resolve, reject) => {
      this.database.getRecords('id', templateId, 'email_templates')
      .then(template => {
        console.log(template[0]);
        let bodies = this.templates.generateBody({ first_name: 'Stormie' }, template[0].name);
        const communication = {
          body: bodies.body,
          subject: template[0].subject,
          from: 'alext@truefluence.io',
          to: 'john.yamashiro@gmail.com',
          html_body: bodies.htmlBody,
          lead_id: 'poop',
          campaign_id: 'scoot',
          email_template_id: template[0].id,
          scheduled_for: template[0].scheduled_for
        }
        resolve(communication);
      })
    })
  }

  testRemainingDays(campaignId) {
    this.database.getRecords('id', campaignId, 'campaigns')
      .then(campaign => {
        const timeNow = new Date();
        console.log(campaign[0].ended_at);
        console.log(timeNow);
        console.log(Math.round((campaign[0].ended_at - timeNow) / 1000 / 60 / 60 / 24));
      })
  }

  activate(campaignId) {
    this.database.getRecords('id', campaignId, 'campaigns')
    .then(campaign => {
      if (campaign.length > 0) {
        // later check if campaign is already active and reject
        this.database.updateRecord({stage: 'Active'}, 'campaigns', 'id', campaign[0].id)
        .then(console.log)
        .catch(console.error)
        // get all active leads
        this.getActiveLeads(campaign[0].id)
        .then(leads => {
          // console.log(leads);
          // get all active templates
          this.getRecords('campaign_id', campaign[0].id, 'campaigns_leads')
          .then(rels => {
            console.log(rels[0]);
            // this.templates.getTemplatesForCampaign(campaign[0].id)
            // .then(templates => {
            //   // this is where you should generate days until.
            //   const remainingDays = daysUntil(campaign[0].ended_at);
            //   // async.eachSeries(leads, (lead, next) => {
                
            //   // })
            //   leads.forEach(lead => {
            //     templates.forEach(template => {
            //       lead.remaining_days = remainingDays;
            //       let bodies = this.templates.generateBody(lead, template[0].name);
            //       const communication = {
            //         body: bodies.body,
            //         subject: template[0].subject,
            //         from: 'alext@truefluence.io',
            //         to: lead.email,
            //         html_body: bodies.htmlBody,
            //         lead_id: lead.id,
            //         campaign_id: campaign[0].id,
            //         email_template_id: template[0].id,
            //         scheduled_for: template[0].scheduled_for
            //       }
            //       this.communications.createCommunication(communication);
            //     })
  
            //     this.database.updateRecord({
            //       stage: 'Working'
            //     }, 'leads', 'id', lead.id);
            //   })
            // })
          })
          .catch(console.error)
          })

        // for each lead, create communications and relationships

        // upsert communications and relationships
      } else {
        console.log('campaign_id: ' + campaignId + ' - does not exist'); 
      }
    })
  }

  getCommsToSend(campaignId) {
    return new Promise((resolve, reject) => {
      this.database.getRecords('id', campaignId, 'campaigns')
        .then(campaign => {
          if (campaign.length > 0) {
            // get all leads
            // wait why is this here?
            // this.getActiveLeadRelationships(campaign[0].id)
            //   .then(relationships => {
                this.communications.getCommunicationsByCampaign(campaignId)
                .then(comms => {
                  let timeNow = new Date(Date.now());
                  const sendableComms = comms.filter(comm => {
                    return comm.status == 'Unsent' && comm.scheduled_for < timeNow;
                  })
                  resolve(sendableComms);
                })
                .catch(reject)
              // })
              // .catch(reject)

            // for each lead, create communications and relationships

            // upsert communications and relationships
          } else {
            console.log('campaign_id: ' + campaignId + ' - does not exist');
          }
        })
    })
  }

  getActiveLeadRelationships(campaignId) {
    return new Promise((resolve, reject) => {
      this.database.getActiveLeadRelationshipsByCampaignId(campaignId)
      .then(resolve)
      .catch(reject)
    })
  }
  getActiveLeads(campaignId) {
    return new Promise((resolve, reject) => {
      this.database.getActiveLeadsByCampaignId(campaignId)
        .then(leads => {
          resolve(leads);
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  getEnrichedCommunications(campaignId) {
    let timeNow = new Date(Date.now());
    return new Promise((resolve, reject) => {
      this.communications.getCommunicationsByCampaign(campaignId)
      .then(comms => {
        const sendableComms = comms.filter(comm => {
          return comm.status == 'Unsent' && comm.scheduled_for < timeNow;
        })
        const validLeadIds = sendableComms.map(comm => {
          return comm.lead_id;
        })
        this.database.getRecordsByArray('lead_id', validLeadIds, 'campaigns_leads')
        .then(relationships => {
          sendableComms.forEach(comm => {
            comm.thread_id = relationships.filter(rel => { return rel.lead_id == comm.lead_id }).thread_id;
          })
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  // deactivate the campaign-lead connection
  // find lead userid, find all campaigns_leads, set active to false
  deactivateByEmail(email, status, stage) {
    this.leads.getLeadByEmail(email)
    .then(leads => {
      // console.log(leads[0].id);
      this.leads.deactivateAssociatedCampaigns(leads[0].id);
      this.leads.deactivateCommunications(leads[0].id, status);
      // set lead stage to whatever the new one is
      var reason = (stage == 'Unqualified' || stage == 'Paused') ? status : null;
      // console.log(reason);
      this.database.updateRecord({
        stage: stage,
        lost_reason: reason
      }, 'leads', 'id', leads[0].id)
      .then(console.log)
      .catch(console.error);
    })
    .catch(console.error);
  }

  deactivateByUsername(username, status, stage) {
    this.leads.getLeadByUsername(username)
    .then(leads => {
      // console.log(leads[0].id);
      this.leads.deactivateAssociatedCampaigns(leads[0].id);
      this.leads.deactivateCommunications(leads[0].id, status);
      // set lead stage to whatever the new one is
      var reason = (stage == 'Unqualified' || stage == 'Paused') ? status : null;
      // console.log(reason);
      this.database.updateRecord({
        stage: stage,
        lost_reason: reason
      }, 'leads', 'id', leads[0].id)
        .then(console.log)
        .catch(console.error);
    })
    .catch(console.error);
  }
}

const daysUntil = endDate => {
  const timeNow = new Date();
  return Math.round((endDate - timeNow) / 1000 / 60 / 60 / 24);
}

module.exports = Campaigns;