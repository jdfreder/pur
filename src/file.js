let fs = require('fs');

// Checks if a path string is a directory
export function isDir(path) {
    try {        
        return fs.lstatSync(path).isDirectory();
    } catch(ex) {
        return false;
    }
}
