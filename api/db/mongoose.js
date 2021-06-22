// this folder contains the database connection 
 const mongoose = require('mongoose');

 mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => {
     console.log('mongoose works');
 })
 .catch((e) => {
    console.log('Error' + e)  
 });

//  to prevent deprecation warning in mongoDB
 mongoose.set('useCreateIndex', true);
 mongoose.set('useFindAndModify', false);

 module.exports = mongoose
