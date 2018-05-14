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

// Testing endpoint to return time as string
app.get('/test', (req, res) => {
  const timeNow = new Date();
  res.send('the datetime is: ' + timeNow);
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
    console.log(req.body.leads);
  } else {
    console.log('invalid key, not uploading');
  }
})

http.listen(PORT || 5760, () => {
  console.log('listening on port: ', PORT || 5760);
})