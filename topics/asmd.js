angular.module('problems', ['ngMaterial'])
    .controller('prompt', ['$scope', function($scope) {
	var get_prob = function () {
	    return "111";
	};

	$scope.answer = null;
	$scope.problem = get_prob();

	$scope.check = function () {

	};
    }]);
