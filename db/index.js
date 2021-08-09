const configDev = require('../config');
const mongoose = require('mongoose');

require('./models/portfolio');
require('./models/blog');

exports.connect = () => {
  return mongoose.connect(configDev.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },(err) => {
    if (err) { 
      console.error(err); 
    } else {
      console.log("Connected to Mongo ATLAS DB.");
    }
  });
};
