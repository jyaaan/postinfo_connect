const pug = require('pug');
var h2p = require('html2plaintext');
const fs = require('fs');
const async = require('async');
const templatePath = require('path').join(__dirname, '/public/email_templates');

class Templates {
  constructor(database) {
    this.database = database;
  }

  createTemplate(template) {
    if (verifyFile(template.name)) {
      this.database.createRecord(template, 'email_templates')
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      })
    } else {
      console.error('Email template file name not found!');
    }
  }

  generateBody(lead, templateName) {
    const htmlBody = pug.renderFile(templatePath + '/' + templateName, {
      first_name: lead.first_name,
      remaining_days: lead.remaining_days
    })
    const body = h2p(htmlBody);
    return { htmlBody: htmlBody, body: body };
  }

  // returns all active template objects for a given campaign id
  getTemplatesForCampaign(campaignId) {
    var templates = [];
    return new Promise((resolve, reject) => {
      // query join table to get all email templates associated with campaign
      this.database.getRecords('campaign_id', campaignId, 'campaigns_email_templates')
      .then(allRelationships => {
        // filter for active templates to prevent re-sending same messaging.
        const relationships = allRelationships.filter(relationship => { return relationship.active });
        async.eachSeries(relationships, (relationship, next) => {
          // deactivate relationship being returned
          // this step should later be moved after confirmation of comm generation
          this.database.updateRecord({ active: false }, 'campaigns_email_templates', 'id', relationship.id)
          .then(result => {
            this.database.getRecords('id', relationship.email_template_id, 'email_templates')
            .then(template => {
              // adding send date to template to use when creating comms
              template[0].scheduled_for = relationship.scheduled_for;
              templates.push(template);
              next();
            })
            .catch(err => {
              console.error('Error aggregating all templates associated with campaign. \n Stopping.');
              reject(err);
            })
          })
        }, err => {
          resolve(templates);
        })
      })
    })
  }

}

const verifyFile = fileName => {
  return fs.existsSync(templatePath + '/' + fileName);
}

module.exports = Templates;