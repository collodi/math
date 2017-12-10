angular.module('problems', ['ngMaterial'])
    .controller('prompt', ['$scope', '$timeout', '$document', function($scope, $timeout, $document) {
	var rand_num = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var lim = 30;
	var ops = ['+', '-', '\xd7', '\xf7'];
	var get_prob = function () {
	    var prob = [];
	    var nterms = rand_num(2, 4);
	    for (var i = 0; i < nterms - 1; i++)
		prob.push(ops[rand_num(0, 3)]);

	    for (var i = 0; i < nterms; i++) {
		var n = rand_num(-lim, lim);
		if (n < 0)
		    n = '(' + n + ')';
		else if (n === 0 && prob[2 * i - 1] === '\xf7')
		    n += rand_num(1, lim);

		prob.splice(2 * i, 0, n);
	    }
	    return prob.join(' ');
	};

	var count = function (n, t) {
	    $scope.timer = n;
	    if (n === 0)
		return;

	    $timeout(count, t, true, n - 1, t);
	};

	$scope.check = function () {
	    if ($scope.status === 2) {
		$scope.go_next();
		return;
	    }

	    count(2, 100);
	    $scope.status = 1;
	    if ($scope.answer === null)
		return;

	    var ans = eval($scope.answer.replace(' ', ''));
	    var prob = eval($scope.problem.replace(/\xd7/g, '*').replace(/\xf7/g, '/'));
	    if (Math.abs(ans - prob) < 0.0001)
		$scope.status = 2;
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
