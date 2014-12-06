// calculator
['+', 1, 2]
['+', 1, ['*', 2, 3]]
// bindings in a new scope
['let',
[['x', 10], ['y', 20]],
['*', 'x', 'y']]
// or bindings in the current scope
'x'
['set', 'x', 10]
'x'
// lambdas
['set', 'square',
['lambda', ['x'], ['*', 'x', 'x']]]
['square', 9]
// js integration
[function(x){ return "returning: " + x }, 10]
// that's all
exit
