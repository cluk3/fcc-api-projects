var multer = require('multer');
var upload = multer().single('temp');

module.exports = function (req, res) {
  upload(req, res, function (e) {
    if (e) {
      console.log(e)
      return res.status(500).end()
    }
    console.log(req.file)
    res.send({size: req.file.size})
  })
}


  