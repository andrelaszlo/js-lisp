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
    },
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
    var scope = {'__parent_scope': parent_scope};
    if (prog instanceof Array) {
        var fun_name = prog[0];
        var fun = scope_lookup(scope, fun_name);
        var args = prog.slice(1).map(function(arg) {
            return interpret(arg, scope); // TODO: new scope not needed
        });
        return fun(scope, args);
    } else {
        return prog;
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
