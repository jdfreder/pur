"use strict";

import * as child_process from 'child_process';

/**
 * Run a shell command
 * @param  {string} cmd
 * @return {Promise<stdout, stderr>} Promise with standard output and error results
 */
export function run(cmd) {
    return new Promise((res, rej) => {
        child_process.exec(cmd, function(error, stdout, stderr) {
            if (error !== null) {
                rej(error);
            } else {
                res(stdout, stderr);
            }
        });
    });
}

/**
 * Spawn a subprocess
 * @param  {string} cmd
 * @param  {function(string)} stdoutCb
 * @param  {function(string)} stdinCb 
 * @param  {function(string)} stderrCb
 * @param  {string} cwd
 * @return {Process}
 */
export function spawn(cmd, args, stdoutCb, stdinCb, stderrCb, cwd) {
    let originalCwd = process.cwd();
    process.chdir(cwd);
    
    var childProcess = child_process.spawn(cmd, args, {});
    childProcess.stdout.on('data', data => stdoutCb(String(data)));
    childProcess.stdin.on('data', data => stdinCb(String(data)));
    childProcess.stderr.on('data', data => stderrCb(String(data)));
    
    process.chdir(originalCwd);
}
