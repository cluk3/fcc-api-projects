

module.exports = function (req, res) {
  var ip = req.get('x-forwarded-for')
  , language = req.get('accept-language').split(',')[0]
  , software = req.get('user-agent').split(' ')
  
  software = software[1].slice(1) + ' ' + software[2] + ' ' + software[3].slice(0,-1)
  
  var result = {
    ipaddress: ip,
    language: language,
    software: software
  }
  res.send(result)
}