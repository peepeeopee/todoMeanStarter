var mongoose = require('mongoose');

module.exports = mongoose.model('Todos', {
  name : {type:String},
  priority : {type: Number},
  duration : {type: Number},
  active : { type: Boolean, default: true},
  begin : {type: Date, default: null},
  end :  {type: Date, default: null}
},
'tasks'
);
