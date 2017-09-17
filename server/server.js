require('./config/config.js');

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// ES6 Destructuring
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
// heroku
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {3
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc) => {
    res.status(201).send(doc);
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.put('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set :body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

app.post('/users',(req,res) => {
  var user = new User(_.pick(req.body,['email','password']));
  user.save().then((user) => {
      return user.generateAuthToken();
    }).then((token) => {
      res.status(201).header('x-auth', token).send(user);
    }).catch((e) => {
    res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

// POST /users/login {email, password}

app.post('/users/login',(req, res) => {
  var body = _.pick(req.body,['email','password']);
  User.findByCredentials(body.email, body.password).then((user) =>  {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send({user});
    });
  }).catch((e) => {
    res.status(400).send();
  });
  // var email = req.body.email;
  // var password = req.body.password;
  // User.findOne({email}).then((user) => {
  //   if (!user) {
  //     return res.status(404).send();
  //   }
  //   res.header('x-auth',user.tokens[0].token).send({user});
  // }).catch((e) => res.status(400).send());
});

app.delete('/users/me/token',authenticate, (req,res) => {
  // req.token is set by authenticate method from the middleware
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, (e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log('Started on port',port);
});

module.exports = {app};
