const configDev = require('../config');
const mongoose = require('mongoose');
const fakeDB = require('./FakeDB');

return mongoose.connect(configDev.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, async (err) => {
  if (err) { 
    console.error(err); 
  } else {
    console.log("> Start populating our ATLAS DB with Fake data.");
    await fakeDB.populate();
    await mongoose.connection.close();
    console.log("> ATLAS DB has been populated...");
  }
});

