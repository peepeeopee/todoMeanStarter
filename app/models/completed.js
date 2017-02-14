var mongoose = require('mongoose')

module.exports = mongoose.model('Finished',{
  name : {type:String},
  priority : {type: Number},
  duration : {type: Number},
  locked : { type: Boolean, default: false},
  begin : {type: Date, default: null},
  end :  {type: Date, default: null},
  time: {type: Number}
},
'completed'
})
