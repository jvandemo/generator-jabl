'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , fs = require('fs')
    , art = require('../lib/art')
    , async = require('async');

var JablGenerator = module.exports = function JablGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {

        console.log('\n\n' + '------------------------------------------------------------------');
        console.log('Installing dependencies...');
        console.log('------------------------------------------------------------------' + '\n\n');

        this.installDependencies({
            skipInstall: options['skip-install'],
            callback: function() {
                // Emit a new event - dependencies installed
                this.emit('dependenciesInstalled');
            }.bind(this)
        });
    });

    this.on('dependenciesInstalled', function () {

        console.log('\n\n' + '------------------------------------------------------------------');
        console.log('Running GruntJS for the first time...');
        console.log('------------------------------------------------------------------' + '\n\n');

        this.spawnCommand('grunt', ['build']).on('exit',
            function() {
                // Emit a new event - dependencies installed
                this.emit('gruntFinished');
            }.bind(this)
        );
    });

    this.on('gruntFinished', function () {

        console.log('\n\n' + '------------------------------------------------------------------');
        console.log('THANK YOU');
        console.log('------------------------------------------------------------------' + '\n\n');

    });

};

util.inherits(JablGenerator, yeoman.generators.Base);

JablGenerator.prototype.showWelcome = function showWelcome() {
    console.log(art.welcome);
};

JablGenerator.prototype.showMenu = function showMenu() {

    var cb = this.async();

    // Show help if config already exists

    if (this.generatorName !== 'jabl') return cb();

    if (! fs.existsSync('jabl.json')) return cb();

    var prompts = [
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do? (Ctrl-C to quit)',
            choices: function (answers) {
                return [
                    new yeoman.inquirer.Separator('\n' + '---- AngularJS ----'),
                    {
                        name: 'Create AngularJS controller',
                        value: 'a:controller'
                    },
                    {
                        name: 'Create AngularJS directive',
                        value: 'a:directive'
                    },
                    {
                        name: 'Create AngularJS service',
                        value: 'a:service'
                    },
                    {
                        name: 'Create AngularJS filter',
                        value: 'a:filter'
                    },
                    new yeoman.inquirer.Separator('\n' + '---- JABL ----'),
                    {
                        name: 'Re-run JABL setup wizard',
                        value: 'setup'
                    },
                    {
                        name: 'Exit',
                        value: 'exit'
                    }
                ];
            }
        }
    ];

    this.prompt(prompts, function (props) {

        var action = props.action;

        if (action === 'setup') return cb();

        if (action === 'exit') return console.log('Have a great day!');

        if (action === 'a:controller') return this.env.run('jabl:a:controller');

    }.bind(this));



};

JablGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

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

JablGenerator.prototype.createConfigFile = function createConfigFile() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Creating config.json...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.write('jabl.json', JSON.stringify(this.config));
};

JablGenerator.prototype.createAngularFiles = function createAngularFiles() {

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

JablGenerator.prototype.createPackageJson = function createPackageJson() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Generating package.json...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.copy('_package.json', 'package.json');
};

JablGenerator.prototype.createBowerFiles = function createBowerFiles() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Generating Bower configuration...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.copy('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
};

JablGenerator.prototype.createGruntFiles = function createGruntFiles() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Generating GruntJS configuration...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.template('Gruntfile.js', 'Gruntfile.js');
};

JablGenerator.prototype.createKarmaFiles = function createKarmaFiles() {

    console.log('\n\n' + '------------------------------------------------------------------');
    console.log('Generating Karma configuration...');
    console.log('------------------------------------------------------------------' + '\n\n');

    this.template('karma-unit.conf.js', 'karma-unit.conf.js');
};

JablGenerator.prototype.createEmptyJavascriptLibrary = function createEmptyJavascriptLibrary() {
    this.write('public/js/' + this.config.appTitle.camelized + '.js', '');
    this.write('public/js/' + this.config.appTitle.camelized + '.min.js', '');
};

JablGenerator.prototype.createGitFiles = function createGitFiles() {
    this.copy('gitignore', '.gitignore');
};

JablGenerator.prototype.createOtherFiles = function createOtherFiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
