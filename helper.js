exports.exec = function(cmd, cb) {
    var process = require('child_process');
    var parts = cmd.split(/\s+/g);
    var p = process.spawn(parts[0], parts.slice(1), {stdio: 'inherit'});
    p.on('exit', function(code) {
        var err = null;
        if(code) {
            err = new Error('command "' + cmd + '" exited with wrong status code "' + code + '"');
            err.code = code;
            err.cmd = cmd;
        }
        if(cb) cb(err);
    });
};

exports.series = function(cmds, cb) {
    var execNext = function() {
        exports.exec(cmds.shift(), function(err) {
            if(err) {
                cb(err);
            }
            else {
                if(cmds.length) {
                    execNext();
                }
                else {
                    cb(null);
                }
            }
        });
    };
    execNext();
};