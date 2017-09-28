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

app.post('/todos', authenticate, async (req, res) => {3
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  try {
    const doc = await todo.save();
    res.status(201).send(doc);
  } catch(e) {
    res.status(400).send(e);
  }
});

app.get('/todos', authenticate, async (req,res) => {
  try {
    const todos = await Todo.find({
      _creator: req.user._id
    });
    res.send({todos});
  } catch(e) {
    res.status(400).send(e);
  }
});

app.get('/todos/:id', authenticate, async (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const todo = await Todo.findOne({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  } catch(e) {
    res.status(400).send();
  }
});

app.delete('/todos/:id', authenticate, async (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  } catch(e) {
    res.status(400).send();
  }
});

app.put('/todos/:id', authenticate, async (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  try {
    const todo = await Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set :body}, {new: true});
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch(e) {
    res.status(400).send();
  }
});

app.post('/users', async (req,res) => {
  try{
    var user = new User(_.pick(req.body,['email','password']));
    user = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

// POST /users/login {email, password}

app.post('/users/login', async (req, res) => {
  const body = _.pick(req.body,['email','password']);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send({user});
  } catch(e) {
    res.status(400).send();
  }
});

app.delete('/users/me/token',authenticate, async (req,res) => {
  // req.token is set by authenticate method from the middleware
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log('Started on port',port);
});

module.exports = {app};
