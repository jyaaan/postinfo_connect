// Constants
const PORT = process.env.PORT;

// Server setup and initialization
const publicPath = require('path').join(__dirname, '/public');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const staticMiddleware = express.static(publicPath);
const http = require('http').createServer(app);
const async = require('async');

app.use(staticMiddleware);
app.use(bodyParser.json());

// Modules

var h2p = require('html2plaintext');

const database = new (require('./database'))();
const communications = new (require('./communications'))(database);
const leads = new (require('./leads'))(database);
const templates = new (require('./templates'))(database);
const campaigns = new (require('./campaigns'))(database, templates, leads, communications);

// Temporary classes for testing
// Nothing in production should be here
const pug = require('pug');
const templatePath = require('path').join(__dirname, '/public/email_templates');


app.get('/test-get', (req, res) => {
  database.getRecords('name', 'someone', 'campaigns')
    .then(result => {
      console.log(result);
    })
})

app.get('/pug', (req, res) => {
  res.send(pug.renderFile(templatePath + '/template.pug', {
    first_name: 'FIRST NAME'
  }))
  console.log(pug.renderFile(templatePath + '/template.pug', {
    first_name: 'FIRST NAME'
  }));
})

app.post('/upload-leads', (req, res) => {
  res.sendStatus(200);
  if (req.body.key == 'eatifyjohn') {
    leads.create(req.body.leads);
  } else {
    console.log('invalid key, not uploading');
  }
})

app.get('/test-send/:campaign_id', (req, res) => {
  database.getLeadsByCampaignId(req.params.campaign_id)
  .then(leads => {
    const emails = leads.map(lead => {
      const htmlBody = pug.renderFile(templatePath + '/template.pug', {
        first_name: lead.first_name
      })
      const body = h2p(htmlBody);

      return {
        email: lead.email,
        htmlBody: htmlBody,
        body: body,
        communication_id: 1
      }
    })
    res.send(emails);
  })
})

app.post('/create-campaign', (req, res) => {
  database.createRecord(req.body, 'campaigns')
  .then(result => {
      res.sendStatus(200);
      console.log(result);
    })
    .catch(err => {
      res.send(err)
      console.error(err);
    })
})

app.post('/update-campaign', (req, res) => {
  database.updateRecord(req.body, 'campaigns', 'name', req.body.name)
    .then(result => {
      res.sendStatus(200);
      console.log(result);
    })
    .catch(err => {
      res.send(err)
      console.error(err);
    })
})

// Upserts row into campaigns-email templates join table. Templates can only be added to a given campaign once
// Params: int campaign_id, int email_template_id, string (iso date format) scheduled_for e.g. "2015-03-25T12:00:00Z"
// Returns 200 on successful upsert.
app.post('/assign-template', (req, res) => {
  campaigns.upsertCampaignsEmailTemplates(req.body);
  res.sendStatus(200);
})

app.get('/activate-campaign/:campaignId', (req, res) => {
  res.sendStatus(200);
  campaigns.activate(req.params.campaignId);
})

app.get('/get-sendable/:campaignId', (req, res) => {
  campaigns.getCommsToSend(req.params.campaignId)
  .then(comms => {
    res.send(comms);
    // console.log(comms);
  })
})

app.get('/deactivate-email/:email/:status/:stage', (req, res) => {
  console.log(req.params);
  // deactivate the campaign-lead connection
  // find lead userid, find all campaigns_leads, set active to false
  // deactivate any existing communications as well.
  // do this by setting communication status to status
  // communications.setStatus();
  // update the lead's information by setting stage to status
  campaigns.deactivateByEmail(req.params.email, req.params.status, req.params.stage);
  res.sendStatus(200);
})

app.get('/deactivate-username/:username/:status/:stage', (req, res) => {
  console.log(req.params);
  campaigns.deactivateByUsername(req.params.username, req.params.status, req.params.stage);
  res.sendStatus(200);
})

app.get('/get-test-email/:templateId', (req, res) => {
  campaigns.generateEmailTest(req.params.templateId)
  .then(comm => {
    res.send(comm);
  })
})

app.get('/fix-message-id/:email/:message_id', (req, res) => {
  console.log(req.params);
  leads.getLeadByEmail(req.params.email)
  .then(lead => {
    database.getRecords('lead_id', lead[0].id, 'communications')
    .then(comms => {
      async.eachSeries(comms, (comm, next) => {
        database.updateRecord({ message_id: req.params.message_id }, 'communications', 'id', comm.id)
        .then(() => {
          next();
        })
      }, err => {
        res.sendStatus(200);
      })
    })
  })
})

app.post('/message-id', (req, res) => {
  console.log(req.body.communication_id, req.body.message_id);
  communications.markAsSent(req.body)
  .then(result => {
    console.log(result);
    res.sendStatus(200);
  })

  // database.updateRecord({ message_id: message_id }, 'communications', 'communication_id', communication_id)
  // .then(result => {

  // })
})

app.post('/create-template', (req, res) => {
  templates.createTemplate(req.body);
  res.sendStatus(200);
})

http.listen(PORT || 1560, () => {
  console.log('listening on port: ', PORT || 1560);
})