var jslisp = require('../js-lisp');

/*
 Test helper function. Checks that an expression returns the expected value
 when evaluated.
 */
var interpretTest = function(expression, expected, deepEqual) {
    if (deepEqual === true) {
        return function(test) {
            test.expect(1);
            test.deepEqual(jslisp.interpret(expression), expected);
            test.done();
        };
    };
    return function(test) {
        test.expect(1);
        test.equal(jslisp.interpret(expression), expected);
        test.done();
    };
};

exports.testOperatorPlus = interpretTest(['+', 1, 2], 3);

exports.testOperatorMultiplication = interpretTest(['*', 3, 4], 12);

exports.testNestedCalls = interpretTest(['+', 1, ['+', 1, 1]], 3);

exports.testMultiplyAndHead = interpretTest(['*', 2, ['head', 3, 8]], 6);

exports.testTail = interpretTest(['tail', 3, 8, 6], [8, 6], true);

exports.testList = interpretTest(['list', 3, 8, 6], [3, 8, 6], true);

exports.testSimpleLambda = interpretTest(
    [['lambda', ['x', 'y'], ['*', 'x', 'y']],
     2, 3],
    6);

exports.testSimpleLet = interpretTest(
    ['let', [['x', 3], ['y', 4]],
     ['*', 'x', 'y']],
    12);

exports.testNestedLet = interpretTest(
    ['let', [['x', 3]],   // Bind x,
     ['*',
      ['let', [['x', 4]],
       'x'],              // then bind x in a new scope and return it.
      'x']],              // Multiply inner and outer x:
    12);                  // the result should not be 9 or 16

exports.testBoundLambda = interpretTest(
    ['let',
     [['square', ['lambda', ['x'], ['*', 'x', 'x']]]],
     ['+', ['square', 3], ['square', 4]]],
    25);

exports.testJsFunction = interpretTest(
    ['let',
     [['sqrt', Math.sqrt]],
     ['floor', ['sqrt', 15]]],
    3);

exports.testJsScope = interpretTest(
    ['let',
     [['x', 10]],
     [function(y) {return this.get('x') * y;}, 2]],
    20);

exports.testMathModule = interpretTest(
    ['pow', ['floor', 'PI'], 2],
    9
);
