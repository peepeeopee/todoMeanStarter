var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    app.get('/api/todos/scheduled',function(req,res){
      Todo.find(function (err, todos) {

          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err) {
              res.send(err);
          }

          res.json(
            todos
            .sort(
    				  function (previous, current){
                if(current.priority == previous.priority){
                  return previous.duration - current.duration
                }
                return current.priority - previous.priority
    				})
    				/*.sort(
    				  function (previous, current){
    					return current.priority - previous.priority
    				})*/
            .map(function(current, index, array){
    				var currentTime = new Date()
    				if(current.locked){
    					return current
    				}

    				if (array[index-1]) {
    				  var previousEntry = array[index-1]
    				  current.begin = new Date(previousEntry.end)
    				  current.end = new Date(previousEntry.end.getTime() + current.duration*60000)//helperMethods.addMinutes(previousEntry.end, current.duration)
    				} else {
    				  current.begin = new Date(currentTime)
    				  current.end = new Date(currentTime.getTime() + current.duration*60000)//helperMethods.addMinutes(currentTime, current.duration)
    				}
    				//if beginning/end time is after 5pm or beginning/end time is before 8am
    				if (current.begin.getHours() >= 17 || current.begin.getHours() <= 8) {
    				  var newTime = new Date()
    				  newTime.setDate(current.begin.getDate() + 1)
    				  newTime.setHours(9)
    				  newTime.setMinutes(0)
    				  current.begin = new Date(newTime)
    				  current.end = new Date(current.begin.getTime() + current.duration*60000)
    				}

    				while(current.begin.getDay() == 6 || current.begin.getDay() == 0)
    				{
              current.begin.setDate(current.begin.getDate() + 1)
    					current.end.setDate(current.end.getDate() + 1)
    				}

    				return current
    		  })) // return all todos in JSON format
      });
    })


    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {
        var taskToBeInserted = req.body;

        Todo.create(taskToBeInserted,function(err,todo){
            if(err)
                res.send(err)

            getTodos(res)
        })

    });

    // update todo
    app.put('/api/todos',function(req, res){
      var task = req.body

      Todo.save(function(err,todo){
        if(err){
          console.log(err)
        }
      })

      Todo.findOneAndUpdate(
        {'_id':task._id},
        task,
        {upsert:false},
        function(err,doc){
          if(err){
            res.send(500,{error:err})
            return res.send('Updated successfully')
          }
        }
      )
      //query._id = new mongoose.mongo.ObjectID();
    })

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
