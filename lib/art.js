var chalk = require('chalk');

var art = module.exports;

// Welcome message
art.welcome =
    '\n' +
        '\n         __      ___.   .__' + '               .---------------------.' +
        '\n        |__|____ \\_ |__ |  |' + '             |    ' + chalk.yellow.bold('Welcome to JABL') + '    |' +
        '\n        |  \\__  \\ | __ \\|  |' + '              \'---------------------\'' +
        '\n        |  |/ __ \\| \\_\\ \\  |__' +
        '\n    /\\__|  (____  /___  /____/' + '     Jade + AngularJS + Bootstrap + LESS' +
        '\n    \\______|    \\/    \\/    ' +
        '\n\n';

art.title = function (version) {
    return version ? chalk.white.bold('JABL v' + version) : chalk.white.bold('JABL');
}

// General help
art.help =
    'Usage: ' + 'yo ' + chalk.yellow('[command]')
        + '\n\n' + 'Available commands supported by JABL are:' + '\n\n'
        + chalk.yellow('jabl:a:controller') + '\t' + 'Create AngularJS controller' + '\n'
        + chalk.yellow('jabl:a:directive') + '\t' + 'Create AngularJS directive' + '\n'
        + chalk.yellow('jabl:a:service') + '\t\t' + 'Create AngularJS service' + '\n'
        + chalk.yellow('jabl:a:filter') + '\t\t' + 'Create AngularJS filter' + '\n'
        + '\n'
        + chalk.yellow('jabl:j:layout') + '\t\t' + 'Create Jade layout' + '\n'
        + chalk.yellow('jabl:j:view') + '\t\t' + 'Create Jade view' + '\n'
        + '\n'
        + chalk.yellow('jabl --setup') + '\t\t' + 'Re-run JABL setup wizard' + '\n'
        + chalk.yellow('jabl --karma') + '\t\t' + 'Run karma unit tests' + '\n'
        + chalk.yellow('jabl --build') + '\t\t' + 'Build public JavaScript library (from /src files)' + '\n'
;

// Clear screen
art.clear = '\u001B[2J\u001B[0;0f'