var chalk = require('chalk');

var art = module.exports;

art.welcome =
    '\n\n' +
        '\n         __      ___.   .__' + '               .--------------------.' +
        '\n        |__|____ \\_ |__ |  |' + '             |   ' + chalk.yellow.bold('Welcome to JABL') + '    |' +
        '\n        |  \\__  \\ | __ \\|  |' + '              \'--------------------\'' +
        '\n        |  |/ __ \\| \\_\\ \\  |__' +
        '\n    /\\__|  (____  /___  /____/' + '     Jade + AngularJS + Bootstrap + LESS' +
        '\n    \\______|    \\/    \\/    ' +
        '\n\n';