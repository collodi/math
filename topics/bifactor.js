angular.module('problems', ['ngMaterial', 'ngSanitize'])
    .controller('prompt', ['$scope', '$timeout', function($scope, $timeout) {
	const rand_num = function (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const count = function (n, t) {
	    $scope.timer = n;
	    if (n === 0)
		return;

	    $timeout(count, t, true, n - 1, t);
	};

	const ops = ['+', '-'];
	const vars = ['x', 'y', 'z'];
	const get_term = function (rand = true) {
	    /* choose random exponents */
	    const shf_exp = Array.from(Array(vars.length), _ => rand_num(0, 1) * rand_num(1, 3));
	    return { cf: rand_num(1, 10), variable: vars,
		     exp: (rand ? shf_exp : Array.from(vars, _ => 0)) };
	};

	const term_to_str = function (term, caret=false) {
	    let s = '';
	    for (let i = 0; i < term.variable.length; i++) {
		if (term.exp[i] > 0)
		    s += term.variable[i];

		if (term.exp[i] > 1) {
		    if (!caret)
			s += term.exp[i].toString().sup();
		    else
			s += '^(' + term.exp[i] + ')';
		}
	    }

	    if (term.cf === -1 && s.length > 0)
		s = '-' + s;
	    else if (term.cf !== 1 || s.length === 0)
		s = term.cf + s;
	    return s;
	};

	const add_star = function (expr) {
	    for (let i = expr.length - 2; i >= 0; i--) {
		if ((vars.indexOf(expr[i]) > -1 || [')'].indexOf(expr[i]) > -1) &&
		    (vars.indexOf(expr[i + 1]) > -1 || ['('].indexOf(expr[i + 1]) > -1)) {
		    expr = expr.substring(0, i + 1) + '*' + expr.substring(i + 1);
		}
	    }
	    return expr;
	};

	const nonfactors = n => Array
	      .from(Array(n), (_, i) => i + 1)
	      .filter(i => i > 1 && n % i === 0)

	const random_coprimes = function (lim) {
	    let n1 = rand_num(1, lim),
		n2 = 0;

	    if (n1 > 1) {
		let nfs = nonfactors(n1);
		let range = Array.from(Array(lim), (_, i) => i);
		for (let i = 0; i < nfs.length; i++) {
		    for (let j = nfs[i]; j < lim; j += nfs[i])
			range[j] = 0;
		}
		range = range.filter(x => x !== 0);
		n2 = range[rand_num(0, range.length - 1)];
	    } else {
		n2 = rand_num(1, lim);
	    }

	    n1 = n1 * (rand_num(0, 1) ? -1 : 1);
	    /* we want n2 to be always positive (sign -> operator) */
	    return [n1, n2];
	};

	$scope.gen_prob = function () {
	    $scope.prob = {};
	    $scope.prob.factor = get_term();
	    $scope.prob.terms = [get_term(rand = false), get_term(rand = false)];
	    $scope.prob.op = ops[rand_num(0, 1)];

	    /* coefficient = coprimes */
	    [$scope.prob.terms[0].cf, $scope.prob.terms[1].cf] = random_coprimes(10);
	    /* give different variables */
	    let allvars = Array.from(vars, (_, i) => i)
		.sort(_ => Math.random(.5 - Math.random()))
		.slice(0, rand_num(2, vars.length - 1));

	    let t1nvar = rand_num(0, allvars.length - 1);
	    for (let i = 0; i < t1nvar; i++)
		$scope.prob.terms[0].exp[allvars[i]] = rand_num(1, 3);
	    for (let i = t1nvar; i < allvars.length; i++)
		$scope.prob.terms[1].exp[allvars[i]] = rand_num(1, 3);

	    /* parse before multiplying the factor */
	    let prob_str = term_to_str($scope.prob.terms[0], true)
		+ $scope.prob.op + term_to_str($scope.prob.terms[1], true);
	    $scope.prob.parsed_paren = math.parse(add_star(prob_str));

	    $scope.prob.terms.map(x => {
		x.cf *= $scope.prob.factor.cf;
		x.exp = x.exp.map((e, i) => e + $scope.prob.factor.exp[i]);
	    });

	    $scope.problem = term_to_str($scope.prob.terms[0]);
	    $scope.problem += ' ' + $scope.prob.op + ' ';
	    $scope.problem += term_to_str($scope.prob.terms[1]);

	    prob_str = term_to_str($scope.prob.terms[0], true)
		+ $scope.prob.op + term_to_str($scope.prob.terms[1], true);
	    $scope.prob.parsed_whole = math.parse(add_star(prob_str));
	};

	$scope.check = function () {
	    count(2, 100);
	    if ($scope.answer === null) {
		$scope.status = 1;
		return;
	    }

	    let ans = $scope.answer.match(/\((.+)\)/);
	    if (ans === null) {
		$scope.status = 1;
		return;
	    }

	    /* check answer */
	    let correct = true;
	    try {
		let ans_parsed_paren = math.parse(add_star(ans[1]));
		let ans_parsed_whole = math.parse(add_star($scope.answer));

		let ans_dict = {};
		for (let i = 0; i < 100; i++) {
		    for (let j = 0; j < vars.length; j++)
			ans_dict[vars[j]] = rand_num(-10, 10);

		    if (Math.abs(ans_parsed_paren.eval(ans_dict)) !== Math.abs($scope.prob.parsed_paren.eval(ans_dict)) || ans_parsed_whole.eval(ans_dict) !== $scope.prob.parsed_whole.eval(ans_dict)) {
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
