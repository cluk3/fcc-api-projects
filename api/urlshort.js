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
      /^http:\/\//.test(result.url) ?
        res.redirect(result.url) :
        res.redirect('http://'+result.url)
    } else {
      res.send({
        error: "Short url not found"
      })
    }
  })
}

exports.new = function (req, res) {
  var url = req.params[0]
  
  // check if the url is already in collection
  Url.findOne({url: url})
  .then(function (result) {
    
    // if it is send res
    if (result) {
      res.send({
        original_url: result.url,
        short_url: req.hostname + '/urlshort/' + result.shortcut
      })
    } else { //otherwise search last shorty and increase it
      
        Url.find(null,'shortcut')
        .sort('-createdAt')
        .limit(1)
        
        .then(function (doc) {
          var newShortcut = '000'
          doc = doc[0]
          if(doc) {
            if(doc.shortcut === 'zzz')
              throw new Error('Max number of shortcuts reached')
            newShortcut = generateNextShorty(doc.shortcut)
          }
          var newUrl = new Url({
            url: url,
            shortcut: newShortcut
          })
          return newUrl.save()
        })
        
        .then(function(doc) {
          console.log(doc)
          res.send({
            original_url: doc.url,
            short_url: req.hostname + '/urlshort/' + doc.shortcut
          })
        })
        
        .then(null, function(err) {
          if (err) console.log(err)
        })
    } // else end
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