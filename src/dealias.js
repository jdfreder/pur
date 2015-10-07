import {run} from './run';

export function dealias(alias) {
    if (/^win/.test(process.platform)) {
        return Promise.resolve(alias);
    } else {
        return new Promise(resolve => {
            let command;
            if (process.platform === 'linux') {
                command = "bash -i -c 'alias -p'";
            } else {
                command = "bash -l -c 'alias -p'";
            }
            run(command).then(aliasString => {
                console.log('aliasString', aliasString);
                let aliases = aliasString.split('\n').map(alias => alias.trim());
                    console.log('aliases', aliases);
                for (let i = 0; i < aliases.length; i++) {
                    if (aliases[i].length > 0 && aliases[i].indexOf('alias ') === 0) {
                        let aliasSet = aliases[i].slice(6).split('=');
                        if (aliasSet[0] === alias) {
                            resolve(aliasSet[1].slice(1, -1).split(' '));
                            return;
                        }
                    }
                }
                resolve([alias]);
            });
        });
    }
}
