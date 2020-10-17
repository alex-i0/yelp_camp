import chalk from 'chalk';

const log = (message, type) => {
    let consoleLogContent = null;
    switch (type) {
        case 'error':
            consoleLogContent = chalk.red(message);
            break;
        case 'success':
            consoleLogContent = chalk.green(message);
            break;
        case 'info':
            consoleLogContent = chalk.blue(message);
            break;
        default:
            consoleLogContent = chalk.yellow(message);
            break;
    }
    return console.log(consoleLogContent);
};

export default log;
