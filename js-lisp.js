var _ = require('underscore');

var default_scope = {

    // Built-in function declarations. These all take two arguments: the
    // current scope and an argument list.
    '+': function(scope, args) {
        return args.reduce(function(a, b){ return a+b; }, 0);
    },
    '*': function(scope, args) {
        return args.reduce(function(a, b){ return a*b; }, 1);
    },
    'head': function(scope, args) { // TODO: exception if empty list
        return args[0];
    }
}

// Returns the parent scope of a scope
var scope_pop = function(scope) {
    if ('__parent_scope' in scope) {
        return scope['__parent_scope'];
    } else {
        return null;
    }
}

// Adds a child scope to its parent scope and returns the child scope.
var scope_push = function(parent_scope, child_scope) {
    child_scope['__parent_scope'] = parent_scope;
    return child_scope;
}

var scope_lookup = function(scope, key) {
    do {
        if (key in scope) {
            return scope[key];
        }
    } while (scope = scope_pop(scope));
    return null; // TODO: exceptions?
}

var interpret = function (prog, parent_scope) {
    if (typeof(parent_scope) == 'undefined') {
        parent_scope = default_scope;
    }

    if (typeof prog == 'string') {
        // A bound name, return it's actual value
        return scope_lookup(parent_scope, prog);
    } else if (! (prog instanceof Array)) {
        // Some primitive value, like a number, will evaluate to itself
        return prog;
    }

    if (prog.length == 0) {
        // The empty list (NIL) also evaluates to itself
        return [];
    }

    var fun_exp = prog[0];

    if (_.isArray(fun_exp) && fun_exp[0] === 'lambda') {
        // TODO: this only handles lambdas that are being invoked immediately
        var formal_parameters = fun_exp[1];
        var lambda_body = fun_exp[2];

        var lambda = function() {
            var args = Array.prototype.slice.call(arguments);
            if (formal_parameters.length != args.length) {
                throw new Error("Wrong number of args, " + args.length + " instead of " + formal_parameters.length);
            }

            // Bind the parameters to variables in the local scope.
            var scope = {};
            _.zip(formal_parameters, args).forEach(
                function(binding) {
                    scope[binding[0]] = binding[1];
                });
            scope_push(parent_scope, scope);

            return interpret(lambda_body, scope);
        };

        var actual_parameters = prog.slice(1).map(function(param) {
            return interpret(param, parent_scope);
        });

        return lambda.apply(null, actual_parameters);
    } else if (typeof fun_exp == 'string') {
        // Built-in or named function
        var fun = scope_lookup(parent_scope, fun_exp);
        var args = prog.slice(1).map(function(arg) {
            return interpret(arg, parent_scope);
        });
        return fun(parent_scope, args);
    } else {
        throw new Error(String(fun_exp) + ' is not a function name');
    }
}

var repl = function() {
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var prompt = "js-lisp> ";

    // This pretty bird was made by 'hjw'
    var welcome = "\
      __     \n\
  ___( o)>   JS-LISP \n\
  \\ <_. )    Ctrl-D to exit \n\
   `---'     Example input: ['+', 1, 2, 3]";
    console.log(welcome);

    rl.setPrompt(prompt);
    rl.prompt();

    rl.on('line', function(line) {
        if (line.trim() == "help") {
            console.log(welcome);
            rl.prompt();
            return;
        }
        try {
            var cmd = eval(line.trim());
            var result = interpret(cmd);
            console.log(result);
        } catch (e) {
            console.log("What the hell was that?");
            console.log(e.stack);
        }
        rl.prompt();
    }).on('close', function() {
        console.log('\nExiting');
        process.exit(0);
    });

}

if (require.main === module) {
    repl();
}

module.exports = {
    interpret: interpret,
    repl: repl,
};
