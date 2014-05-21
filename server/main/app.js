var express = require('express');
var app = express();
var routers = {};
var NoteRouter = express.Router();
routers.NoteRouter = NoteRouter;
var checkUser = require('./config.js').checkUser;
var saveMindMap = require('./config.js').saveMindMap;
require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);

module.exports = exports = app;

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.status(200).sendfile('../app/index.html');
});

app.post('/save', function(req, res) {
  // console.log(req.body);
  saveMindMap(req.body, res);
  res.status(200).send('Hello');
});

app.get('/login', function(req,res) {
  res.set('Content-Type', 'text/html');
  res.status(200).sendfile('../app/login.html');
});

app.post('/login', function(req, res) {
  checkUser(req.body, res);
});





