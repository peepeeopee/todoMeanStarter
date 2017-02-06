var mongoose = require('mongoose');

module.exports = mongoose.model('Todos', {
  name : String,
  priority : Number,
  duration : Number,
  active : Boolean,
  begin : Date,
  end : Date
},
'tasks'
);
