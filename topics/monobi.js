angular.module('problems', ['ngMaterial', 'ngSanitize'])
    .controller('prompt', ['$scope', '$timeout', function($scope, $timeout) {
	const rand_num = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var count = function (n, t) {
	    $scope.timer = n;
	    if (n === 0)
		return;

	    $timeout(count, t, true, n - 1, t);
	};

	const ops = ['+', '-'];
	const vars = ['x', 'y', 'z'];
	const get_term = function (pos = true) {
	    const nvars = rand_num(1, 3);
	    /* choose random number of vars */
	    const shf_vars = vars.sort(_ => .5 - Math.random());
	    const vs = shf_vars.slice(0, nvars);
	    /* choose random exponents */
	    const shf_exp = vs.map(_ => rand_num(1, 3));
	    return { cf: (rand_num(0, 1) || pos ? 1 : -1) * rand_num(1, 10),
		     variable: vs, exp: shf_exp };
	};

	const term_to_str = function (term, caret=false) {
	    var s = '';
	    if (term.cf === -1)
		s += '-';
	    else if (term.cf !== 1)
		s += term.cf;

	    for (var i = 0; i < term.variable.length; i++) {
		s += term.variable[i];
		if (term.exp > 1) {
		    if (!caret)
			s += term.exp[i].toString().sup();
		    else
			s += '^(' + term.exp[i] + ')';
		}
	    }
	    return s;
	};

	const add_star = function (expr) {
	    for (var i = expr.length - 2; i >= 0; i--) {
		if (vars.indexOf(expr[i]) > -1 && vars.indexOf(expr[i + 1]) > -1)
		    expr = expr.substring(0, i + 1) + '*' + expr.substring(i + 1);
	    }
	    return expr;
	};

	$scope.gen_prob = function () {
	    $scope.prob = {};
	    $scope.prob.monomial = get_term(false);
	    $scope.prob.binomial = [get_term(false), get_term()];
	    $scope.prob.op = ops[rand_num(0, 1)];

	    $scope.problem = term_to_str($scope.prob.monomial);
	    $scope.problem += ' (' + term_to_str($scope.prob.binomial[0]);
	    $scope.problem += ' ' + $scope.prob.op + ' ';
	    $scope.problem += term_to_str($scope.prob.binomial[1]) + ')';

	    var prob_str = term_to_str($scope.prob.monomial, true) + '*('
		+ term_to_str($scope.prob.binomial[0], true) + $scope.prob.op
		+ term_to_str($scope.prob.binomial[1], true) + ')';

	    $scope.prob.parsed = math.parse(add_star(prob_str));
	};

	$scope.check = function () {
	    count(2, 100);
	    if ($scope.answer === null) {
		$scope.status = 1;
		return;
	    }

	    /* check answer */
	    var correct = true;
	    try {
		var ans_parsed = math.parse(add_star($scope.answer));
		var ans_dict = {};
		for (var i = 0; i < 100; i++) {
		    for (var j = 0; j < vars.length; j++)
			ans_dict[vars[j]] = rand_num(-100, 100);

		    if (ans_parsed.eval(ans_dict) !== $scope.prob.parsed.eval(ans_dict)) {
			correct = false;
			break;
		    }
		}
	    } catch (e) {
		correct = false;
	    }

	    if (correct) {
		if ($scope.status !== 2)
		    $scope.status = 2;
		else
		    $scope.go_next();
	    } else {
		$scope.status = 1;
	    }
	};

	$scope.go_next = function () {
	    $scope.answer = null;
	    $scope.status = 0; /* 0: first try, 1: incorrect, 2: solved */
	    $scope.timer = 0;
	    $scope.gen_prob();
	};

	$scope.press = function (ev) {
	    if (ev.which === 13)
		$scope.check();
	};

	$scope.go_next();
    }]);
