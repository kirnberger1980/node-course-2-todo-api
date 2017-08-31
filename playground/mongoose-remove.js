const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js')

// Todo.remove({}).then((result) => console.log(result));

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()

Todo.findByIdAndRemove('59a82ab03e19a18025ff06ad').then((todo) => {
  console.log(todo);
})
