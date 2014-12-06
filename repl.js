var repeat = require('./helpers').repeat;

var repl = function(interpreter) {
    var readline = require('readline');
    var line_buffer = [];

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var prompt = "js-lisp> ";

    // This pretty bird was made by 'hjw'
    var welcome = "\
      __     \n\
  ___( o)>   JS-LISP \n\
  \\ <_. )    Ctrl-D to exit, Ctrl-C to reset input. \n\
   `---'     Example input: ['+', 1, 2, 3]";
    console.log(welcome);

    rl.setPrompt(prompt);
    rl.prompt();

    var exit = function() {
        console.log('\nExiting');
        process.exit(0);
    };

    var currentLevel = function() {
        var lines = line_buffer.join("\n");
        var opening_brackets = (lines.match(/\[/g) || []).length;
        var closing_brackets = (lines.match(/\]/g) || []).length;
        return Math.max(0, opening_brackets - closing_brackets);
    };

    var getMultilinePrompt = function(line_buffer) {
        var indent = prompt.length + currentLevel();
        return repeat(" ", indent);
    };

    rl.on('line', function(line) {
        rl.setPrompt(prompt);

        // REPL commands
        switch(line.trim().toLowerCase()) {
        case 'help':
            console.log(welcome);
            rl.prompt();
            return;
        case 'exit':
            exit();
        }

        // Try evaluating each line. If it's not proper JS, it might be
        // incomplete: add it to the buffer and wait for another line.
        try {
            line_buffer.push(line);
            var cmd = eval(line_buffer.join("\n"));
            var result = interpreter(cmd);
            line_buffer = [];
            if (result != undefined) {
                console.log(result);
            }
        } catch (ex) {
            switch (ex.name) {
            case 'SyntaxError':
                rl.setPrompt(getMultilinePrompt());
                break;
            default:
                console.log("What the hell was that?");
                console.log(ex.stack);
                line_buffer = [];
            }
        }
        rl.prompt();
    }).on('SIGINT', function() {
        rl.setPrompt(prompt);
        console.log("\nScratch that...");
        line_buffer = [];
        rl.prompt();
    }).on('close', function() {
        exit();
    });
};

module.exports = {
    repl: repl
};
