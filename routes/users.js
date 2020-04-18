const
  path = require('path'),
  express = require('express'),
  multer = require('multer'),
  {nanoid} = require('nanoid'),
  axios = require("axios"),
  UserService = require('../services/UserService'),
  User = require('../models/User'),
  config = require('../config'),
  router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cd) => cd(null, config.uploadPath),
  filename: (req, file, cd) => cd(null, nanoid() + path.extname(file.originalname))
});
const upload = multer({storage});

  router.post('/', upload.single('avatarImage'), async (req, res) => {
  let
    name = req.body.username,
    displayName = req.body.displayName,
    password = req.body.password,
    avatarImage = req.body.avatarImage;
  try {
    if (req.file) avatarImage = req.file.filename;

    const service = new UserService();
    const {user, token} = await service.singUp(name, displayName, password, avatarImage);

    return res.send({...user, token})
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.delete('/sessions', async (req, res) => {
  try {
    const token = req.get('Authorization').split(' ')[1];

    const service = new UserService();
    const success = await service.logout(token);

    res.send(success);
  } catch (e) {
    res.send({message: 'Logout success'});
  }
});

router.post('/sessions', async (req, res) => {
  try {
    const
      password = req.body.password,
      username = req.body.username;

    const service = new UserService();
    const {user, token} = await service.login(username, password);

    return res.send({...user, token});
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/facebook', async (req, res) => {
  try {
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;

    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

    const resp = await axios.get(url);
    const data = resp.data.data;

    if (data.error) {
      return res.status(401).send({message: 'token incorrect'})
    }

    if (req.body.id !== data.user_id) {
      return res.status(401).send({message: 'User ID incorrect'})
    }

    let user = await User.findOne({facebookId: req.body.id});

    if (!user) {
      await User.create({
        username: req.body.id,
        displayName: req.body.name,
        password: nanoid(),
        avatarImage: req.body.picture.data.url,
        facebookId: req.body.id,
        token: nanoid()
      })
    } else {
      await User.update({username: req.body.id}, {
        token: nanoid()
      });
    }

    const updatedUser =  await User.findOne({facebookId: req.body.id});

    res.send(updatedUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;