angular.module('problems', ['ngMaterial'])
    .controller('prompt', ['$scope', '$timeout', '$document', function($scope, $timeout, $document) {
	var rand_num = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var lim = 30;
	var ops = ['+', '-', '\xd7', '\xf7'];
	var get_prob = function () {
	    var nums = [];
	    var nterms = rand_num(2, 5);
	    /* choose numbers at random */
	    for (var i = 0; i < nterms; i++) {
		var n = rand_num(-lim, lim);
		if (n < 0)
		    n = '(' + n + ')';
		else if (n === 0)
		    n += rand_num(1, lim);

		nums.push(n);
	    }
	    /* insert parenthesis at random */
	    var nparen = rand_num(0, nterms - 2);
	    if (nterms > 2 && nparen > 0) {
		var pstart = rand_num(1, nterms - nparen) - 1;
		nums[pstart] = '(' + nums[pstart];
		nums[pstart + nparen] += ')';
	    }
	    /* choose & combine operators with numbers */
	    var prob = [];
	    for (var i = 0; i < nterms - 1; i++) {
		prob.push(nums[i]);
		prob.push(ops[rand_num(0, 3)]);
	    }
	    prob.push(nums[nterms - 1]);
	    return prob.join(' ');
	};

	var count = function (n, t) {
	    $scope.timer = n;
	    if (n === 0)
		return;

	    $timeout(count, t, true, n - 1, t);
	};

	$scope.check = function () {
	    count(2, 100);
	    $scope.status = 1;
	    if ($scope.answer === null)
		return;

	    var ans = eval($scope.answer.replace(' ', ''));
	    var prob = eval($scope.problem.replace(/\xd7/g, '*').replace(/\xf7/g, '/'));
	    if (Math.abs(ans - prob) < 0.0001) {
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
