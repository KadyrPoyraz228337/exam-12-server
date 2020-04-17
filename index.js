const
  express = require('express'),
  mongoose = require('mongoose'),
  config = require('./config'),
  users = require('./routes/users'),
  app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const run = async () => {
  await mongoose.connect(config.mongooseDb.link, config.mongooseDb.options);

  app.use('/users', users);

  app.listen(config.port, async () => {
    console.log(`HTTP server start on ${config.port} port!`);
  })
};

run().catch(error => {
  console.error(error);
});