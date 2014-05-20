"use strict";

var express = require('express');
var app = express();
var routers = {};
var NoteRouter = express.Router();
routers.NoteRouter = NoteRouter;

require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);

module.exports = exports = app;

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.status(200).sendfile('../app/index.html');
});

app.post('/save', function(req, res) {
  console.log(req.body);
  res.status(200).send('Hello');
})

