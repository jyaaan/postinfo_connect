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
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.error(err);
    })
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

  activate(campaignId) {
    this.database.getRecords('id', campaignId, 'campaigns')
    .then(campaign => {
      if (campaign.length > 0) {
        // later check if campaign is already active and reject
        this.database.updateRecord({stage: 'Active'}, 'campaigns', 'id', campaign[0].id)
        .then(console.log)
        .catch(console.error)
        // get all leads
        this.getActiveLeads(campaign[0].id)
        .then(leads => {
          // console.log(leads);
          // get all active templates
          this.templates.getTemplatesForCampaign(campaign[0].id)
          .then(templates => {
            leads.forEach(lead => {
              templates.forEach(template => {
                let bodies = this.templates.generateBody(lead, template[0].name);
                const communication = {
                  body: bodies.body,
                  subject: template[0].subject,
                  from: 'alext@truefluence.io',
                  to: lead.email,
                  html_body: bodies.htmlBody,
                  lead_id: lead.id,
                  campaign_id: campaign[0].id,
                  email_template_id: template[0].id,
                  scheduled_for: template[0].scheduled_for
                }
                this.communications.createCommunication(communication);
              })
            })
          })
        })
        .catch(err => {
          console.error(err);
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
            this.getActiveLeads(campaign[0].id)
              .then(leads => {
                this.communications.getCommunicationsByCampaign(campaignId)
                .then(comms => {
                  let timeNow = new Date(Date.now());
                  const sendableComms = comms.filter(comm => {
                    return comm.status == 'Unsent' && comm.scheduled_for < timeNow;
                  })
                  resolve(sendableComms);
                })
                .catch(err => {
                  reject(err);
                })
              })
              .catch(err => {
                reject(err);
              })

            // for each lead, create communications and relationships

            // upsert communications and relationships
          } else {
            console.log('campaign_id: ' + campaignId + ' - does not exist');
          }
        })
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

  // deactivate the campaign-lead connection
  // find lead userid, find all campaigns_leads, set active to false
  deactivateByEmail(email, status) {
    this.leads.getLeadByEmail(email)
    .then(leads => {
      // console.log(leads[0].id);
      this.leads.deactivateAssociatedCampaigns(leads[0].id);
      this.leads.deactivateCommunications(leads[0].id, status);
    })
    .catch(console.error);
  }

  deactivateByUsername(username, status) {
    this.leads.getLeadByUsername(username)
      .then(leads => {
        // console.log(leads[0].id);
        this.leads.deactivateAssociatedCampaigns(leads[0].id);
        this.leads.deactivateCommunications(leads[0].id, status);
      })
      .catch(console.error);
  }
}

module.exports = Campaigns;