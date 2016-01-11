var co = require('co')
var mongoose = require("mongoose")
var Schema = mongoose.Schema
var SearchSchema = new Schema ({
  term: {
    type: String,
    required: true,
  },
  when: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  versionKey: false
})

var Search = mongoose.model('Search', SearchSchema)


var request = require('request')
var customSearchID = '&cx=011266525162830752356:y_gj1tycmua'
var apiKey = 'AIzaSyA8Vt94UQVHjKa8ODb-5Fc6WnfnlUFOpzE'
var fields = '&fields=items(link, snippet, image/contextLink)'

exports.new = function (req, res) {
  var query = '&q='+req.params.query
  var offset = parseInt(req.query.offset || 1)
  
  if (offset < 1 || offset > 50)
    return res.status(400).send({
      error: "Invalid offset"
    })
    
  var newSearch = new Search({
    term: req.params.query
  })
  
  newSearch.save().then(null, function (e) {
    if (e) console.log(e)
  })
    
  var url = 'https://www.googleapis.com/customsearch/v1?key='
    +apiKey+customSearchID+query+fields+'&start='+offset+'&searchType=image'
  
  request(url, {timeout: 1500}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var result = JSON.parse(body)
      return res.send(result.items)
    }
    if(error) {
      console.log(error)
      return res.status(500).end()
    }
    res.status(response.statusCode).end()
  })
}

exports.latest = function (req, res) {
  Search.find(null,'-_id').sort('-when').limit(10)
  .then(function (results) {
    res.send(results)
  })
  .then(null, function (e) {
    if (e) res.status(500).send({
      error: "Internal server error."
      
    })
  })
}