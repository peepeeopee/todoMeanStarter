angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.newTask != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData.newTask)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			var todoId = id//|$scope.todos[id]._id

			if(todoId){
				Todos.delete(todoId)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
			} else {
				$scope.loading = false
			}

		};

		$scope.updateTodo = function(task){
			$scope.loading = true;

			var todoUpdateTarget = task
			if(todoUpdateTarget){
				Todos.update(todoUpdateTarget)
				.success(function(data){
					$scope.loading = false;
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.todos = data; // assign our new list of todos
				})
			} else {
				$scope.loading = false
			}
		};

		//Apply dates
		$scope.scheduleTodos = function(){
			Todos.schedule()
			.success(function(data) {
				$scope.showDates = true
				$scope.todos = data;
				$scope.loading = false;
			})
			/*var todoBackUp = $scope.todos
			try {
				$scope.todos
				.sort(
				  function (previous, current){
					return current.duration - previous.duration
				})
				.sort(
				  function (previous, current){
					return current.priority - previous.priority
				})
				.map(Todos.organise,[])

				$scope.showDates = true
			} catch (e) {
				console.log(e)
			}*/

			$('.shortcut').click(function() {
			    $(this).attr('target', '_blank');
			});

		}
	}]);
