var jslisp = require('../js-lisp');

exports.testOperatorPlus = function(test){
	test.expect(1);
	test.equal(jslisp.interpret(['+', 1, 2]), 3);
	test.done();
};
