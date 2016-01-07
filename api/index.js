var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Cluk3\'s Microservices' });
});

/* GET Timestamp Microservice. */
router.get('/timestamp/:date',require('./timestamp'));

router.get('/timestamp', function (req, res) {
  res.render('timestamp', { title: 'Timestamp Microservice' });
});

/* GET Request Header Parser Microservice. */
router.get('/rhp', require('./rhp'));

/* GET URL Shortener Microservice. */
router.get('/urlshort', function(req, res) {
  res.send('URL Shortener Microservice');
});

/* GET Image Search Abstraction Layer Microservice. */
router.get('/isa', function(req, res) {
  res.send('Image Search Abstraction Layer Microservice');
});

/* GET File Metadata Microservice. */
router.get('/fm', function(req, res) {
  res.send('File Metadata Microservice');
});
module.exports = router;
