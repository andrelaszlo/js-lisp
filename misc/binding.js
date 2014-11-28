/*
 Test some kind of unique symbols thing. They will not be garbage collected
 though, so maybe it's worth creating new symbols all the time? Erlang has the
 same problem when atoms are created on the fly. See
 http://prog21.dadgum.com/43.html for example.
 */

var s = function(name) {
    function Symbol(name) {
        var _name = name;
        this.getName = function() {
            return _name;
        };
        this.toString = function() {
            return "`" + _name + "`";
        };
    }
    var symbols = {};
    return function(name) {
        if (! (name in symbols)) {
            symbols[name] = new Symbol(name);
        }
        return symbols[name];
    };
}();

var x = s('x');
var x2 = s('x');
console.log("x: " + x);
console.log("x2: " + x2);
console.log("x == X2: ", x == x2);
