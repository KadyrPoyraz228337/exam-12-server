const
  express = require('express'),
  cors = require("cors"),
  mongoose = require('mongoose'),
  config = require('./config'),
  users = require('./routes/users'),
  pictures = require('./routes/pictures'),
  app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const run = async () => {
  await mongoose.connect(config.mongooseDb.link, config.mongooseDb.options);

  app.use('/users', users);
  app.use('/pictures', pictures);

  app.listen(config.port, async () => {
    console.log(`HTTP server start on ${config.port} port!`);
  })
};

run().catch(error => {
  console.error(error);
});