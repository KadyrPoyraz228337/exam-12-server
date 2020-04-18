const
  path = require('path'),
  express = require('express'),
  multer = require('multer'),
  {nanoid} = require('nanoid'),
  isAuth = require('../middlewares/isAuth'),
  PictureService = require('../services/PictureService'),
  UserService = require('../services/UserService'),
  config = require('../config'),
  router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cd) => cd(null, config.uploadPath),
  filename: (req, file, cd) => cd(null, nanoid() + path.extname(file.originalname))
});
const upload = multer({storage});

router.post('/', isAuth, upload.single('image'), async (req, res) => {
  try {
    let
      user = req.currentUser,
      title = req.body.title,
      image = req.body.image;

    if (req.file) image = req.file.filename;

    const service = new PictureService();
    const picture = await service.addPicture(title, image, user);

    res.send(picture);
  } catch (e) {
    res.status(500).send(e)
  }
});

router.get('/', async (req, res) => {
  try {
    const service = new PictureService();
    const pictures = await service.getPictures();

    res.send(pictures)
  } catch (e) {
    res.status(500).send(e)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const pictureService = new PictureService();
    const userService = new UserService();

    const user = await userService.getUserInfo(id);
    const pictures = await pictureService.getAllUserPictures(id);

    res.send({user, pictures})
  } catch (e) {
    console.log(e);
    res.status(500).send(e)
  }
});

router.delete('/:id', isAuth, async (req, res) => {
  try {
    const
      user = req.currentUser,
      id = req.params.id;

    const pictureService = new PictureService();
    const picture = await pictureService.removePicture(user, id);

    res.send(picture)
  } catch (e) {
    console.log(e);
    res.status(500).send(e)
  }
});

module.exports = router;