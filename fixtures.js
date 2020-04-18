const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/User');
const Picture = require('./models/Picture');

const run = async () => {
  await mongoose.connect(config.mongooseDb.link, config.mongooseDb.options);

  const collections = await mongoose.connection.db.listCollections().toArray();

  for (let coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name)
  }

  const [ramazan, kadyr] = await User.create({
    "username" : "ramazan",
    "displayName" : "Рамазан Пойраз",
    "password" : "$argon2i$v=19$m=4096,t=3,p=1$Hc36iYKuKlqb0adtADo36i/Tetw8L7rdGTzVW48/L3U$SWbjnLaA/HrpAIni35peftgnsViq1WVVqbMoODnuvmA", // 123
    "avatarImage" : "null",
    "token" : "4tmxA0JY-CicU30"
  }, {
    "username" : "kadyr",
    "displayName" : "Кадыр Пойраз",
    "password" : "$argon2i$v=19$m=4096,t=3,p=1$+kEXij/1/oS/RohECa53Uv3D5Ta1azK0qjBdCsLQrYg$BCynqzI0FHxtzyPOCDTDd/42YuZ6TQNdj8VOFzDWcbs", // 123
    "avatarImage" : "null",
    "token" : "XlkH5jNom2kELnS",
  });

  await Picture.create({
    user: kadyr,
    title: 'Самурай',
    image: 'самурай.jpg'
  }, {
    user: kadyr,
    title: 'Александр Пистолетов',
    image: 'пистолетов.jpeg'
  }, {
    user: ramazan,
    title: 'Зипуля',
    image: 'зипуля.jpg'
  }, {
    user: ramazan,
    title: 'Спортсмен',
    image: 'зипуля-занимаюсь-спортом.jpg'
  });

  mongoose.connection.close();
};

run().catch(e => {
  throw e
});