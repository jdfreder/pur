import {run} from './run';

export function dealias(alias) {
    if (/^win/.test(process.platform)) {
        return Promise.resolve(alias);
    } else {
        return new Promise(resolve => {
            run("bash -l -c 'alias -p'").then(aliasString => {
                let aliases = aliasString.split('\n').map(alias => alias.trim());
                let aliasMap = {};
                for (let i = 0; i < aliases.length; i++) {
                    if (aliases[i].length > 0 && aliases[i].indexOf('alias ') === 0) {
                        let aliasSet = aliases[i].slice(6).split('=');
                        aliasMap[aliasSet[0]] = aliasSet[1].slice(1, -1);
                    }
                }
                resolve(aliasMap[alias]);
            });
        });
    }
}