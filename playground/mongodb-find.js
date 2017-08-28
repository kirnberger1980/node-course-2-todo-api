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

  // db.collection('Todos').find({
  //     _id: new ObjectID('59a0268ba0b98e437c7401ec')  }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err) => {
  //   console.log('Unable to fetch docs', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos Count:',count);
  // },(err) => {
  //   console.log('Unable to fetch docs', err);
  // });

  db.collection('Users').find({name: 'Marcell'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs,undefined,2));
  }).catch((err) => {
    console.log('Unable to fetch docs',err);
  })
  // db.close();
  console.log('Disconnected to MongoDB server');
});
