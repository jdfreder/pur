#!/usr/bin/env node
let glob = require('glob');
let args = process.argv.splice(2);
let configstore = require('configstore');
let conf = new configstore(require('../package.json').name);
let _ = require('underscore');

import {dealias} from './dealias';
import {isDir} from './file';
import {spawn} from './run';
import {printHeader, print} from './print';

// Look for --save to set an alias
let newAlias;
for (let i = 0; i < args.length; i++) {
    if (args[i].toLowerCase() === '--save') {
        newAlias = args.splice(i, 2)[1];
        break;
    }
}

// First arg may be an alias, check to see if it is.
if (conf.get(args[0])) {
    let paths = conf.get(args.splice(0, 1));
    args = paths.concat(args);
}

// Separate the paths from the arguments
let p = (new Promise(resolve => {
    
    //  If the first argument is a directory, assume an array of directories was
    //  passed.  Walk the arguments until a non-path is found.
    if (isDir(args[0])) {
        let paths = [];
        while (args.length > 0 && isDir(args[0])) {
            paths.push(args.splice(0,1)[0]);
        }
        resolve(paths);
    } else {
        
        // The first argument needs to be globbed, glob it.
        glob(args.splice(0,1)[0], {}, function (er, paths) {
            resolve(paths.filter(path => fs.lstatSync(path).isDirectory()));
        });
    }
})).catch(err => { 
    console.error('Globbing error: ', err);
    process.exit(1);

//  Save the path alias if specified
}).then(paths => {
    if (newAlias) {
        console.log('Saving alias ', newAlias);
        conf.set(newAlias, paths);
    }
    
    // Dealiasify the first command argument.
    if (args.length > 0) {
        return dealias(args.splice(0, 1)[0]).then(command => {
            return {paths: paths, args: command.concat(args)};
        });
    }
}).catch(err => { 
    console.error('Alias error: ', err);
    process.exit(1);

// Execute the command across each directory asynchronously.
}).then(kwargs => {
    let cmd = kwargs.args.splice(0, 1)[0];
    kwargs.paths.forEach((path, index) => {
        printHeader(index, [path, cmd, String(kwargs.args)].join(' '));
        spawn(cmd, kwargs.args, stdout => {
            print(index, false, stdout, path);
        }, stdin => {
            print(index, false, stdin, path);
        }, stderr => {
            print(index, true, stderr, path);
        }, path);
    });
    
}).catch(err => { 
    console.error('Launching error: ', err);
    process.exit(1);
});
