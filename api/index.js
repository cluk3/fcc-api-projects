var express = require('express');
var router = express.Router();
var urlshort = require('./urlshort');
var isa = require('./isa');


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
router.get('/urlshort/:shortcut', urlshort.index);

router.get('/urlshort/new/*', urlshort.new);

router.get('/urlshort', function(req, res) {
  res.render('urlshort', { title: 'Urlshort Microservice' });
});

/* GET Image Search Abstraction Layer Microservice. */
router.get('/isa', function(req, res) {
  res.render('isa', { title: 'Image Search Abstraction Layer Microservice' });
});

router.get('/isa/search/latest', isa.latest);
router.get('/isa/:query', isa.new);

/* GET File Metadata Microservice. */
router.get('/fm', function(req, res) {
  res.render('fm', { title: 'File Metadata Microservice' });
});

router.post('/fm/api', require('./fm'));

module.exports = router;
