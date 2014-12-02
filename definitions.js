var args_as_array = function(args) {
    return Array.prototype.slice.call(args);
}

var global_scope = {

    // Built-in function declarations. These all take two arguments: the
    // current scope and an argument list.
    '+': function() {
        return args_as_array(arguments).reduce(function(a, b){ return a+b; }, 0);
    },
    '*': function() {
        return args_as_array(arguments).reduce(function(a, b){ return a*b; }, 1);
    },
    'head': function() { // TODO: exception if empty list
        return args_as_array(arguments)[0];
    },
    'tail': function() {
        return args_as_array(arguments).slice(1);
    },
    'list' : function() {
        return args_as_array(arguments);
    }
};

/*
 * Bind all the names from Math as `js` forms or values in the global scope.
 * This will make `PI` and `sqrt` available, for example.
 */
Object.getOwnPropertyNames(Math).forEach(function(name) {
    global_scope[name] = Math[name];
});

module.exports = {
    global_scope: global_scope
};
