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

module.exports = {
    Scope: Scope
};
