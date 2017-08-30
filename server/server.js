var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo',{
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: 'Go home',
  completed: true,
  completedAt: new Date().getTime()
});

newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
}).catch((e) => {
  console.log('Unable to save todo',e);
})
