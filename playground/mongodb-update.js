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

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59a427cda96f472edeb1001f')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // }).catch((err) => {
  //   console.log('Could not update document',err);
  // });

  db.collection('Users').findOneAndUpdate({
    name: 'Jen'
  },{
    $set: {
      name: 'Marcell'
    },
    $inc: {
      age: 1
    }
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log('Unable to update user',err);
  });

  // db.close();
  console.log('Disconnected to MongoDB server');
});
