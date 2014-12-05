var _ = require('underscore');
var definitions = require('./definitions');
var repl = require('./repl');
var scope = require('./scope');

var Scope = scope.Scope;

var global_scope = new Scope(definitions.global_scope);

var pretty = function(prog, indent) {
    return JSON.stringify(prog, function(key, value) {
        if (_.isFunction(value)) {
            var name = value.name || "(anonymous)";
            return "function " + name;
        }
        return value;
    }, 2);
};

var log = function() {
    console.log(">>> " + Array.prototype.slice.call(arguments).map(pretty).join("\n"));
};

var interpret = function(prog, parent_scope) {
    if (typeof(parent_scope) == 'undefined') {
        parent_scope = global_scope;
    }

    if (typeof prog == 'string') {
        // A bound name, return its actual value
        return interpret(parent_scope.get(prog),
                         parent_scope);
    } else if (! (prog instanceof Array)) {
        // Some primitive value, like a number, will evaluate to itself
        return prog;
    }

    if (prog.length == 0) {
        // The empty list (NIL) also evaluates to itself
        return [];
    }

    switch (prog[0]) {
    case 'lambda':
        var formal_parameters = prog[1];
        var lambda_body = prog[2];

        return function() {
            if (formal_parameters.length != arguments.length) {
                throw new Error("Wrong number of args, " + arguments.length + " instead of " + formal_parameters.length);
            }

            // Bind the parameters to variables in the local scope.
            var scope = this.push();
            _.zip(formal_parameters, arguments).forEach(
                function(binding) {
                    scope.set(binding[0], binding[1]);
                });

            return interpret(lambda_body, scope);
        };
    case 'let':
        var scope = parent_scope.push();
        var bindings = prog[1];
        var body = prog[2];
        bindings.forEach(function(bind) {
            scope.set(bind[0], interpret(bind[1], parent_scope));
        });
        return interpret(body, scope);
    case 'quote':
        return prog[1];
    default:
        // Something else, hopefully a function...
    }

    var prog_eval = prog.map(function(arg) {
        return interpret(arg, parent_scope);
    });

    var fun = prog_eval[0];
    var args = prog_eval.slice(1);
    return fun.apply(parent_scope, args);
};

if (require.main === module) {
    repl.repl(interpret);
}

module.exports = {
    interpret: interpret
};
