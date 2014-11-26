var default_scope = {
	'+': function(args) {
		return args.reduce(function(a, b){ return a+b; }, 0);
	},
}

function scope_lookup(scope, key) {
	while (scope != null) {
		if (key in scope) {
			return scope[key];
		} else if ('__parent_scope' in scope) {
			scope = scope['__parent_scope'];
		} else {
			scope = null;
		}
	}
	return null; // TODO: exceptions?
}

function interpret (prog, parent_scope) {
	if (typeof(parent_scope) == 'undefined') {
		parent_scope = default_scope;
	}
	var scope = {'__parent_scope': parent_scope};
	var fun_name = prog.shift();
	var fun = scope_lookup(scope, fun_name);
	return fun(prog);
}

module.exports = {
  interpret: interpret,
};


