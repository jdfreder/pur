let chalk = require('chalk');

let lastIndex;
let colorIndex = 0;
let colors = {
    primary: {
        stderr: chalk.bgRed,
        stdio: chalk.bgWhite
    }, 
    alternate: [
        chalk.bgGreen,
        chalk.bgCyan
    ]
};

function paddedNumber(number) {
    let digits = Math.floor(Math.log10(number)) + 1;
    if (number === 0) digits = 1;
    switch (digits) {
        case 1:
            return '  ' + String(number) + ' ';
        case 2:
            return ' ' + String(number) + ' ';
        case 3:
            return String(number) + ' ';
        default:
            return String(number);
    }
}

function alternateColor(cellIndex) {
    if (lastIndex !== cellIndex) {
        if (++colorIndex > colors.alternate.length - 1) colorIndex = 0;
        lastIndex = cellIndex;
    }
    
    return colors.alternate[colorIndex];
}

export function printHeader(cellIndex, text) {
    let color = chalk.gray;
    text.split('\n').forEach(line => {        
        console.log(color(String(cellIndex) + ': ' + line));
    });
}

export function print(cellIndex, isError, text, header) {
    let isNew = lastIndex !== cellIndex;
    let color = isError ? colors.primary.stderr: colors.primary.stdio;
    let secondColor = alternateColor(cellIndex);
    if (isNew) {
        console.log(secondColor(chalk.bold(paddedNumber(cellIndex))) + ' ' + chalk.gray(header));
    }
    text.split('\n').forEach(line => {
        console.log(secondColor('   ') + color(' ') + ' ' + line);
    });
}
