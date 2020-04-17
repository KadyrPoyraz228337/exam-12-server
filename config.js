const path = require('path'),
  rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public', 'uploads'),
  port: 8000,
  facebook: {
    appId: '792770797914348',
    appSecret: '10903dccd8573ac996f315ea1ed29084'
  },
  mongooseDb: {
    link: 'mongodb://localhost:27017/app',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  }
};