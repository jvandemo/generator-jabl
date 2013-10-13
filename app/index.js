'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , chalk = require('chalk');


var JablGenerator = module.exports = function JablGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(JablGenerator, yeoman.generators.Base);

JablGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var welcome =
        '\n\n' +
            '\n         __      ___.   .__' + '               .--------------------.' +
            '\n        |__|____ \\_ |__ |  |' + '             |   ' + chalk.yellow.bold('Welcome to JABL') + '    |' +
            '\n        |  \\__  \\ | __ \\|  |' + '              \'--------------------\'' +
            '\n        |  |/ __ \\| \\_\\ \\  |__' +
            '\n    /\\__|  (____  /___  /____/' + '     Jade + AngularJS + Bootstrap + LESS' +
            '\n    \\______|    \\/    \\/    ' +
            '\n\n'

    console.log(welcome);

    var prompts = [
        {
            name: 'appTitle',
            message: 'What\'s the title of the website you want to create?',
            default: 'My website'
        },
        {
            type: 'confirm',
            name: 'includeBootstrap',
            message: 'Would you like to include Twitter Bootstrap?',
            default: true
        },
        {
            type: 'confirm',
            name: 'includeAngular',
            message: 'Would you like to include AngularJS?',
            default: true
        },
        {
            name: 'angularAppModuleName',
            message: 'What would you like to call your AngularJS app module (for ng-app="")?',
            default: function (answers) {
                var slugified = yeoman.generators.Base.prototype._.slugify(answers.appTitle);
                return yeoman.generators.Base.prototype._.camelize(slugified);
            },
            when: function (answers) {
                return (answers.includeAngular === true);
            },
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.camelize(underscored);
            }
        },
        {
            type: 'checkbox',
            name: 'angularIncludeModules',
            message: 'Please check AngularJS options',
            choices: function (answers) {
                var appModuleName = answers.angularAppModuleName;
                return [
                    {
                        name: 'Include the angular-resource module',
                        value: 'resource'
                    },
                    {
                        name: 'Include the angular-cookies module',
                        value: 'cookies'
                    },
                    {
                        name: 'Include the angular-sanitize module',
                        value: 'sanitize'
                    }
                ];
            },
            // Convert array of choices to object with booleans
            filter: function (input) {
                var _ = yeoman.generators.Base.prototype._;
                return {
                    resource: _.contains(input, 'resource'),
                    cookies: _.contains(input, 'cookies'),
                    sanitize: _.contains(input, 'sanitize')
                }
            }
        }
    ];

    this.prompt(prompts, function (props) {

        // Build a config object
        this.config = {

            includeBootstrap: props.includeBootstrap,
            includeAngular: props.includeAngular,

            // Originally a humanized string like "My website"
            appTitle: {

                // String originally entered by user
                original: props.appTitle,

                // Camelized e.g. MyApp
                camelized: this._.camelize(this._.underscored(props.appTitle)),

                // Dasherized e.g. my-app
                dasherized: this._.dasherize(this._.underscored(props.appTitle)),

                // Slugified (whitespace replaced by dashes) e.g. myapp
                slugified: this._.slugify(props.appTitle),

                // Array of parts e.g. ['my', 'app']
                parts: this._.slugify(props.appTitle).split('-')
            }
        };

        // Add AngularJS config if included
        if(this.config.includeAngular){

            this.config.angular = {

                // Originally a camelized string like "myWebsite"
                appModuleName: {

                    // String originally entered by user
                    original: props.angularAppModuleName,

                    // Camelized e.g. MyApp
                    camelized: this._.camelize(props.angularAppModuleName),

                    // Dasherized e.g. my-app
                    dasherized: this._.dasherize(props.angularAppModuleName),

                    // Slugified (whitespace replaced by dashes) e.g. myapp
                    slugified: this._.slugify(this._.humanize(props.angularAppModuleName)),

                    // Array of parts e.g. ['my', 'app']
                    parts: this._.dasherize(props.angularAppModuleName).split('-')
                },
                includeModules: props.angularIncludeModules
            };
        }


        /*
        console.log('humanize: ' + this._.humanize(props.angularAppModuleName));
        console.log('camelize: ' + this._.camelize(props.angularAppModuleName));
        console.log('dasherize: ' + this._.dasherize(props.angularAppModuleName));
        console.log('slugify: ' + this._.slugify(props.angularAppModuleName));
        console.log('underscored: ' + this._.underscored(props.angularAppModuleName));
        console.log('final: ' + this._.camelize(this._.underscored(props.angularAppModuleName)));
        */

        cb();
    }.bind(this));
};



JablGenerator.prototype.angular = function app() {

    if(! this.config.includeAngular) return;

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Creating AngularJS directory structure...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.mkdir('src');
    this.mkdir('src/js');

    var camelized = this.config.angular.appModuleName.camelized;

    this.mkdir('src/js/src');
    this.mkdir('src/js/src/' + camelized);
    this.mkdir('src/js/src/' + camelized) + '/controllers';
    this.mkdir('src/js/src/' + camelized) + '/directives';
    this.mkdir('src/js/src/' + camelized) + '/services';
    this.mkdir('src/js/src/' + camelized) + '/filters';

    this.mkdir('src/js/test');
    this.mkdir('src/js/test/unit');
    this.mkdir('src/js/test/unit/' + camelized);
    this.mkdir('src/js/test/unit/' + camelized) + '/controllers';
    this.mkdir('src/js/test/unit/' + camelized) + '/directives';
    this.mkdir('src/js/test/unit/' + camelized) + '/services';
    this.mkdir('src/js/test/unit/' + camelized) + '/filters';

    this.template('src/angular/library/library.js', 'src/js/src/' + camelized + '/' + camelized + '.js');
    this.template('src/angular/library/library.prefix', 'src/js/src/' + camelized + '/' + camelized + '.prefix');
    this.template('src/angular/library/library.suffix', 'src/js/src/' + camelized + '/' + camelized + '.suffix');

    this.template('src/angular/test/unit/library/library.js', 'src/js/test/unit/' + camelized + '/' + camelized + '.js');

    return;
};

JablGenerator.prototype.bower = function projectfiles() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Generating package.json...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.copy('_package.json', 'package.json');
};

JablGenerator.prototype.package = function projectfiles() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Generating Bower configuration...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.copy('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
};

JablGenerator.prototype.git = function projectfiles() {
    this.copy('gitignore', '.gitignore');
};

JablGenerator.prototype.other = function projectfiles() {
    return;
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
