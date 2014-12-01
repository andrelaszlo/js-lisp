var global_scope = {

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
};

/*
 * Bind all the names from Math as `js` forms or values in the global scope.
 * This will make `PI` and `sqrt` available, for example.
 */
Object.getOwnPropertyNames(Math).forEach(function(name) {
    if (typeof Math[name] == 'function') {
        global_scope[name] = ['js', Math[name]];
    } else {
        global_scope[name] = Math[name];
    }
});

module.exports = {
    global_scope: global_scope
};
