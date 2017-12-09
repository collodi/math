angular.module('problems', ['ngMaterial'])
    .controller('prompt', ['$scope', function($scope) {
	var rand_num = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var ops = ['+', '-', '\xd7', '\xf7'];
	var get_prob = function () {
	    var prob = [];
	    var nterms = rand_num(2, 4);
	    for (var i = 0; i < nterms - 1; i++)
		prob.push(ops[rand_num(0, 3)]);

	    for (var i = 0; i < nterms; i++) {
		var n = rand_num(-100, 100);
		if (n < 0)
		    n = '(' + n + ')';

		prob.splice(2 * i, 0, n);
	    }

	    return prob.join(' ');
	};

	$scope.answer = null;
	$scope.problem = get_prob();

	$scope.check = function () {
	    if ($scope.answer.includes('+') || $scope.answer.includes('-')
		|| $scope.answer.includes('*') || $scope.answer.includes('/'))
		return false;

	    var ans = eval($scope.answer.replace(' ', ''));
	    var prob = eval($scope.problem.replace('\xd7', '*').replace('\xf7', '/'));

	    if (Math.abs(ans - prob) < 0.0001)
		return true;
	    return false;
	};
    }]);
