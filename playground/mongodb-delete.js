// const MongoClient = require('mongodb').MongoClient;
// // Notation ES6 Destructuring
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// var user = {name: 'Marcell', age: 25};
// // Notation ES6 Destructuring
// var {name: n} = user;
// console.log(n);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//   deleteMany
//   db.collection('Todos').deleteMany({
//     text: 'Eat lunch',
//     completed: false
// }).then((result) => {
//   console.log(result);
// }).catch((err) => {
//   console.log('Unable to delete docs',err);
// });
  // deleteOne
//   db.collection('Todos').deleteOne({
//     text: 'Eat lunch',
//     completed: false
// }).then((result) => {
//   console.log(result);
// });
  // findOneAndDelete
// db.collection('Todos').findOneAndDelete({
//   text: 'Eat lunch',
//   completed: false
// }).then((result) => {
//   console.log(result);
// })
db.collection('Users').deleteMany({name: 'Marcell'}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log('Could not delete documents',err);
});

db.collection('Users').findOneAndDelete({_id: new ObjectID('59a416ae3a97112868d99429')}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log('Could not delete documents',err);
});

  // db.close();
  console.log('Disconnected to MongoDB server');
});
