"use strict";

  var mongoose    = require('mongoose'),
      morgan      = require('morgan'),
    bodyParser  = require('body-parser'),
    middle      = require('./middleware');

// mongoose.connect(process.env.DB_URL || 'mongodb://localhost/mindmap-angular');
/*
 * Include all your global env variables here.
*/
console.log('dirname is ', __dirname);
module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(middle.cors);
  app.use(express.static('../app'));
  app.use('/bower_components', express.static('../bower_components'));
  app.use('/note', routers.NoteRouter);
  app.use(middle.logError);
  app.use(middle.handleError);
};