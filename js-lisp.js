var _ = require('underscore');

var Scope = function (initial, parent_scope) {
    var _bindings = initial;
    var _parent_scope = parent_scope || null;

    /* Return new scope with the current scope as parent */
    var push = function(initial) {
        var bindings = initial || {};
        return new Scope(bindings, this);
    };

    var set = function(name, value) {
        _bindings[name] = value;
    };

    var get = function(name) {
        if (name in _bindings) {
            return _bindings[name];
        } else if (_parent_scope) {
            return _parent_scope.get(name);
        }
        return undefined; // TODO: exceptions?
    };

    /* Get the global scope */
    var global = function() {
        if (_parent_scope) {
            return _parent_scope.global();
        } else {
            return this;
        }
    };

    var setGlobal = function(name, value) {
        var global_scope = global();
        global_scope.set(name, value);
    };

    return {
        set: set,
        get: get,
        push: push,
        global: global,
        setGlobal: setGlobal
    };
}

var global_scope = new Scope({

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
    },
    'floor': ['js', Math.floor]
});

var pretty = function(prog, indent) {
    return JSON.stringify(prog, function(key, value) {
        if (_.isFunction(value)) {
            var name = value.name || "(anonymous)";
            return "function " + name;
        }
        return value;
    }, 2);
}

var log = function() {
    console.log(">>> " + Array.prototype.slice.call(arguments).map(pretty).join("\n"));
}

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

        return function(parent_scope, args) {
            if (formal_parameters.length != args.length) {
                throw new Error("Wrong number of args, " + args.length + " instead of " + formal_parameters.length);
            }

            // Bind the parameters to variables in the local scope.
            var scope = parent_scope.push();
            _.zip(formal_parameters, args).forEach(
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
    case 'js':
        // A simpler way of using js functions directly
        var js_function = prog[1];
        return function(parent_scope, args) {
            return js_function.apply(parent_scope, args);
        };
    default:
        // Something else, hopefully a function...
    }

    var prog_eval = prog.map(function(arg) {
        return interpret(arg, parent_scope);
    });

    var fun = prog_eval[0];
    var args = prog_eval.slice(1);
    return fun(parent_scope, args);
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
