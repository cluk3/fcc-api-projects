var moment = require('moment')

module.exports = function (req, res) {
  
  function toDateObj (date) {
    var dateObj = {
      unix: null,
      natural: null
    }
    
    if (date.isValid()) {
      dateObj.unix = date.unix()
      dateObj.natural = date.format('MMMM D, YYYY')
    }
    
    return dateObj
  }
  
  var date = moment(req.params.date)
  var result = toDateObj(date)

  if (result.unix === null) {
    date = moment.unix(parseInt(req.params.date))
    result = toDateObj(date)
  }

  res.send(result)
}