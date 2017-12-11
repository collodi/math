angular.module('problems', ['ngMaterial'])
    .controller('prompt', ['$scope', '$timeout', function($scope, $timeout) {
	var rand_num = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var count = function (n, t) {
	    $scope.timer = n;
	    if (n === 0)
		return;

	    $timeout(count, t, true, n - 1, t);
	};

	var get_prob = function () {
	};

	$scope.check = function () {
	    count(2, 100);
	    $scope.status = 1;
	    if ($scope.answer === null)
		return;

	    if (/* right answer */) {
		if ($scope.status !== 2)
		    $scope.status = 2;
		else
		    $scope.go_next();
	    }
	};

	$scope.go_next = function () {
	    $scope.answer = null;
	    $scope.problem = get_prob();
	    $scope.status = 0; /* 0: first try, 1: incorrect, 2: solved */
	    $scope.timer = 0;
	};

	$scope.press = function (ev) {
	    if (ev.which === 13)
		$scope.check();
	};

	$scope.go_next();
    }]);
