"use strict";

  var mongoose    = require('mongoose'),
      morgan      = require('morgan'),
    bodyParser  = require('body-parser'),
    middle      = require('./middleware');


var testData = [
    {
      "text": "Life",
      "parent": "null",
      "children": [
        {
          "text": "Animalia",
          "parent": "Top Level",
          "children": []
        },
        {
          "text": "Fungi",
          "parent": "Top Level"
        },
        {
          "text": "Bacteria",
          "parent": "Top Level"
        },
        {
          "text": "Protista",
          "parent": "Top Level"
        }
      ]
    }
  ];
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/server/db');
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

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // console.log('yay');
});
// var bob = mongoose.model('test', { name: 'Bob'});
// bob.save(function(err){
//   if(err){
//     console.log('friend');
//   }
// });

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    mindmaps: Array
});

var User = mongoose.model('User', userSchema);

var loginUser = new User({
   username: 'mario',
   password: 'itsamemario',
   mindmaps: testData
   });

  loginUser.save(function(err, loginUser) {
    if(err) return console.log(err);
    console.log(loginUser);
  })

exports.checkUser = function(user, res) {
  // if user is in the database, send back a positive response
    //hash key and respons
  User.find(
    {
      username: user.username,
      password: user.password
    }, 
      function (err, response) {
      if (err) {
        res.status(404).send('user not found');
        console.log('err is', err);
        return null;
      } else {
        if(response.length){
          console.log('user found'); 
          res.status(200).send(''); 
          return true;
        } else {
          console.log('user not found')
          res.status(404).send('fail'); 
          return null;
        }    
      }
  });
  //else send back error message
};

exports.saveMindMap = function(payload, res) {
  // if user is in the database, send back a positive response
    //hash key and respons
  console.log(payload);
  User.update(
    {
      username: payload['username']
    },
    payload,
    function (err, response) {
    if (err) {
      res.status(404).send('user not found');
      console.log('err is', err);
      return null;
    } else {
      if(response.length){
        console.log('user found and saved'); 
        console.log(response);
        res.status(200).send('success');
      } else {
        console.log('user not found and not saved')
        console.log(response);
        res.status(404).send('fail');      
      }
    }
  });
};
