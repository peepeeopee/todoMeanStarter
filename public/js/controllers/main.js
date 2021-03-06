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
				//TODO Move auto scheduling to other section
				//$scope.scheduleTodos()
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
				$scope.reset()
				$scope.loading = false;
			} else {
				$scope.loading = false
			}
		};

		$scope.test = function(){
			alert('hello')
		}

		//Apply dates
		$scope.scheduleTodos = function(){
			Todos.schedule()
			.success(function(data) {
				$scope.showDates = true
				$scope.todos = data;
				$scope.loading = false;
			})

		}

		$scope.getTemplate = function (todo){
			if (!$scope.selected) {
				return '\\views\\displayRow.html'
			}

			if(todo._id === $scope.selected._id){
				return '\\views\\editRow.html'
			} else{
				return '\\views\\displayRow.html'
			}
		}

		$scope.reset = function (){
			$scope.selected = {}
		}

		$scope.editTodo = function (todo) {
			$scope.selected = angular.copy(todo)
		}

		$scope.$watch('todos',function(newValue,oldValue,scope){
			if($scope.loading){
				return
			}
			if(newValue.length && !oldValue){
				$scope.scheduleTodos()
				return
			}
			if(newValue.length == oldValue.length){
				return
			}
			$scope.scheduleTodos()
		}, true)
	}]);
