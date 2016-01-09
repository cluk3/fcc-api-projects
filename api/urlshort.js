var co = require('co')
var mongoose = require("mongoose")
var Schema = mongoose.Schema
var UrlSchema = new Schema ({
  url: {
    type: String,
    required: true,
    unique: true
  },
  shortcut: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

var Url = mongoose.model('Url', UrlSchema)

exports.index = function (req, res) {
  
  var shortcut = req.params.shortcut
  Url.findOne({shortcut: shortcut})
  .then(function (result) {
    if (result) {
      /^https?:\/\//.test(result.url) ?
        res.redirect(result.url) :
        res.redirect('http://'+result.url)
    } else {
      res.send({
        error: "Short url not found"
      })
    }
  }).then(null, function (e) {
    if (e) console.log(e)
  })
  
}

exports.new = function (req, res) {
  
  var url = req.params[0]
  co(function* () {
    var result = yield Url.findOne({url: url})
    if (result)
      return res.send({
        original_url: result.url,
        short_url: req.hostname + '/urlshort/' + result.shortcut
      })
    result = (yield Url.find(null,'shortcut')
      .sort('-createdAt')
      .limit(1))[0]
    var newShortcut = '000'
    if(result) {
      if(result.shortcut === 'zzz')
        throw new Error('Max number of shortcuts reached')
      newShortcut = generateNextShorty(result.shortcut)
    }
    var newUrl = new Url({
      url: url,
      shortcut: newShortcut
    })
    var saved = yield newUrl.save()
    return res.send({
      original_url: saved.url,
      short_url: req.hostname + '/urlshort/' + saved.shortcut
    })
  }).catch(function(e) {
    if (e) console.log(e)
  })
  
}

function generateNextShorty (shorty) {
  // numbers: 48 -> 57
  // A-Z:    65 -> 90
  // a-z     97 -> 122
  var chars = shorty.split('').map(function(l) {
    return l.charCodeAt(0)
  })
  
  if((chars[2] = increaseShorty(chars[2])) === 48) {
    if((chars[1] = increaseShorty(chars[1])) === 48)
      chars[0] = increaseShorty(chars[0])
  }
  
  return chars.map(function (c) {
    return String.fromCharCode(c)
  }).join('')
  
  function increaseShorty(n) {
    var res
    switch(n) {
      case 57:
        res = 65
        break
      case 90:
        res = 97
        break
      case 122:
        res = 48
        break
      default:
        res = n + 1
    }
    return res
  }
}