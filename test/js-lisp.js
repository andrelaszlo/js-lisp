var jslisp = require('../js-lisp');

exports.testOperatorPlus = function(test){
	test.expect(1);
	test.equal(jslisp.interpret(['+', 1, 2]), 3);
	test.done();
};

exports.testNestedCalls = function(test){
	test.expect(1);
	test.equal(jslisp.interpret(['+', 1, ['+', 1, 1]]), 3);
	test.done();
};

exports.testMultiplyAndFirst = function(test){
	test.expect(1);
	test.equal(jslisp.interpret(['*', 2, ['head', 3, 8]]), 6);
	test.done();
};
