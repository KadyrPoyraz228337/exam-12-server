const
  argon2 = require('argon2'),
  User = require('../models/User'),
  crypto = require('crypto'),
  {nanoid} = require('nanoid');

module.exports = class UserService {
  constructor() {
  }

  async getUserInfo(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({_id: id});

        resolve({
          _id: user._id,
          username: user.username,
          displayName: user.displayName,
          avatarImage: user.avatarImage,
          facebookId: user.facebookId || null
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  async login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({username: username});
        if (!user) {
          return reject({message: 'Username or password not correct!'});
        } else {
          const correctPassword = await argon2.verify(user.password, password);
          if (!correctPassword) {
            return reject({message: 'Username or password not correct!'});
          }

          const token = this.createToken();
          await User.updateOne({username}, {
            token: token
          });

          resolve({
            user: {
              _id: user._id,
              username: user.username,
              displayName: user.displayName,
              avatarImage: user.avatarImage,
              role: user.role,
            },
            token
          })
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  async logout(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const message = {message: 'Logout success'};

        if (!token) resolve(message);

        const user = await User.findOne({token});

        if (!user) resolve(message);

        user.token = this.createToken();
        await user.save();

        resolve(message);
      } catch (e) {
        reject(e)
      }
    })
  }

  async singUp(username, displayName, password, avatarImage) {
    return new Promise((async (resolve, reject) => {
      try {
        if (!password) {
          return reject({message: 'User validation failed: password: Path `password` is required.'})
        }

        const salt = crypto.randomBytes(32);
        const hash = await argon2.hash(password, {salt});
        const token = this.createToken();

        const user = await User.create({
          username: username,
          displayName: displayName,
          password: hash,
          avatarImage: avatarImage,
          token: token,
        });

        resolve({
          user: {
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            avatarImage: user.avatarImage,
            role: user.role,
          },
          token
        })
      } catch (e) {
        if (e.name === 'MongoError') {
          return reject({message: 'A user with that username already exists'})
        }
        reject(e)
      }
    }))
  }

  createToken() {
    return nanoid(15)
  }
};