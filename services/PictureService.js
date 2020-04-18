const
  fs = require('fs'),
  Picture = require('../models/Picture');

module.exports = class PictureService {
  constructor() {
  }

  async addPicture(title, image, user) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!title || !image) {
          return reject({message: 'all fields must be filled!'})
        }

        const picture = await Picture.create({
          user: user._id,
          title,
          image
        });

        resolve(picture)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getPictures() {
    return new Promise(async (resolve, reject) => {
      try {
        const pictures = await Picture.find().populate('user', ['displayName']);

        resolve(pictures)
      } catch (e) {
        reject(e)
      }
    })
  }

  async removePicture(user, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const picture = await Picture.findOne({_id: id});

        if(picture.user.toString() !== user._id.toString()) {
          return reject({message: 'you cannot delete this picture'})
        }

        fs.unlinkSync('./public/uploads/'+picture.image);

        await Picture.deleteOne({_id: id});

        resolve('success')
      } catch (e) {
        reject(e)
      }
    })
  }

  async getAllUserPictures(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const pictures = await Picture.find({user: id});

        resolve(pictures)
      } catch (e) {
        reject(e)
      }
    })
  }

};