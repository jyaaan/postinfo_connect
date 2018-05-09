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

// Testing endpoint to return time as string
app.get('/test', (req, res) => {
  const timeNow = new Date();
  res.send('the datetime is: ' + timeNow);
})

http.listen(PORT || 5760, () => {
  console.log('listening on port: ', PORT || 5760);
})