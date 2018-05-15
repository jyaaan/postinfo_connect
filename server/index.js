// Constants
const PORT = process.env.PORT;

// Server setup and initialization
const publicPath = require('path').join(__dirname, '/public');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const staticMiddleware = express.static(publicPath);
const http = require('http').createServer(app);

app.use(staticMiddleware);
app.use(bodyParser.json());

// Temporary classes for testing
// Nothing in production should be here
const pug = require('pug');
const templatePath = require('path').join(__dirname, '/public/email_templates');

const database = new (require('./database'))();
const leads = new (require('./leads'))(database);

app.get('/test-get', (req, res) => {
  database.getRecord('name', 'someone', 'campaigns')
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
    res.send(leads);
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

http.listen(PORT || 1560, () => {
  console.log('listening on port: ', PORT || 1560);
})