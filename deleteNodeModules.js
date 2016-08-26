/**
*@author sweetyx
*run  把该文件放在项目根目录下，执行 node deleteNodeModules.js
*desc 用来解决windows下删不掉node_modules目录的问题
*/
var os = require('os');
var fs = require('fs');
function execCmd(cmds) {
    if (os.platform() === 'win32') {
        // windows
        var opts = ["cmd", "/c"];
    } else {
        // mac linux
        var opts = [];
    }
    opts = opts.concat(cmds);
    var exec = require('child_process').exec;
    exec(opts.join(' '));
}
function deleteNodeModules(){
    var path = 'node_modules';
    if(fs.existsSync(path)){
        var files = fs.readdirSync(path);
        for (var i = 0; i < files.length; i++) {
            var p = files[i];
            var states = fs.statSync(path+'\\'+p);
            if(p==='.bin'){
                var dirPath = process.cwd()+'\\'+path+'\\'+p;
                console.log('current task : '+'remove dir:' + dirPath);
                execCmd(['rd/s/q',dirPath]);
            }
            else if(states.isDirectory()){
                console.log('current task : '+'npm uninstall ' + p);
                execCmd(['npm', 'uninstall',p]);
            }
            else{
                var filePath = process.cwd()+'\\'+path+'\\'+p;
                console.log('current task : '+'remove file:' + filePath);
                execCmd(['del/f/s/q',filePath]);
            }
        };
    }
}
deleteNodeModules();

