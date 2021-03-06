angular.module('todoService', [])

	// super simple service
	// each function returns a promise object
	.factory('Todos', ['$http',function($http) {
		return {
			//WEB API SECTION
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			},
			update : function(todoData){
				return $http.put('/api/todos', todoData)
			},
			schedule: function(){
				return $http.get('/api/todos/scheduled')
			}

		}
	}]);
