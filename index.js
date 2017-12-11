angular.module('topics', ['ngMaterial'])
    .controller('topiclist', ['$scope', function($scope) {
	$scope.topics = [
	    { title: '+, -, \xd7, \xf7', link: 'asmd' },
	    { title: 'monomial \xd7 binomial', link: 'monobi' }
	];
    }]);
