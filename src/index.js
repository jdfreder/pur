#!/usr/bin/env node
let glob = require('glob');
let args = process.argv.splice(2);
let configstore = require('configstore');
let conf = new configstore(require('../package.json').name);
let fs = require('fs');
let _ = require('underscore');

import {dealias} from './dealias';

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

// Glob the path
let isDir = path => {
    try {        
        return fs.lstatSync(path).isDirectory();
    } catch(ex) {
        return false;
    }
};
let p = (new Promise(resolve => {
    if (isDir(args[0])) {
        let paths = [];
        while (args.length > 0 && isDir(args[0])) {
            paths.push(args.splice(0,1)[0]);
        }
        resolve(paths);
    } else {
        glob(args.splice(0,1)[0], {}, function (er, paths) {
            resolve(paths.filter(path => fs.lstatSync(path).isDirectory()));
        });
    }
})).then(paths => {
    if (args.length > 0) {
        dealias(args[0]).then(command => {
            console.log(command);
        });
    }
}).catch(err => { console.error(err); });
