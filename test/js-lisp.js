var jslisp = require('../js-lisp');

var interpretTest = function(expression, expected) {
  return function(test) {
    test.expect(1);
    test.equal(jslisp.interpret(expression), expected);
    test.done();
  }
}

exports.testOperatorPlus = interpretTest(['+', 1, 2], 3);

exports.testNestedCalls = interpretTest(['+', 1, ['+', 1, 1]], 3);

exports.testMultiplyAndHead = interpretTest(['*', 2, ['head', 3, 8]], 6);

//exports.testSimpleLambda = interpretTest([['lambda', ['x', 'y'], ['*', 'x', 'y']], 2, 3], 6);

