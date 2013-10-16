'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , art = require('../lib/art')
    , chalk = require('chalk');

var ADirectiveGenerator = module.exports = function ADirectiveGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(ADirectiveGenerator, yeoman.generators.Base);

ADirectiveGenerator.prototype.readConfig = function showWelcome() {
    this.jablConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'jabl.json')));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function(){
        console.log('\n' + chalk.yellow('Done!') + '\n');
    });
};

ADirectiveGenerator.prototype.showWelcome = function showWelcome() {
    console.log(art.clear);
    console.log(art.welcome);
    console.log(art.title(this.pkg.version));
    console.log(chalk.yellow('Create an AngularJS directive') + ' (Ctrl-C to quit)');
    console.log('\n');
};

ADirectiveGenerator.prototype.askFor = function askFor() {

    // Build a config object
    var buildConfig = function(props){

        var _ = yeoman.generators.Base.prototype._;

        return {

            // Originally a camelized string like "myDirective"
            directiveName: {

                // String originally entered by user
                original: props.directiveName,

                // Camelized e.g. myService
                camelized: _.camelize(props.directiveName),

                // Dasherized e.g. my-directive
                dasherized: _.dasherize(props.directiveName),

                // Slugified (whitespace replaced by dashes) e.g. mydirective
                slugified: _.slugify(_.humanize(props.directiveName)),

                // Array of parts e.g. ['my', 'directive']
                parts: _.dasherize(props.directiveName).split('-'),

                // Underscored e.g. my_directive
                underscored: _.underscored(props.directiveName),

                // Classified e.g. MyService
                classified: _.classify(_.underscored(props.directiveName))
            },

            directory: props.directory
        };
    }

    // If answers are passed in options, skip prompts
    if(this.options.answers){
        this.config = buildConfig(this.options.answers);
        return;
    }

    var cb = this.async();

    var prompts = [
        {
            name: 'directiveName',
            message: 'What\'s the name of the directive you wish to create?',
            default: 'myDirective',
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.camelize(underscored);
            }
        },
        {
            name: 'directory',
            message: 'In which directory would you like to create the directive?',
            default: 'directives',
            validate: function (name) {
                if (/^directives.*/.test(name)) return true;
                return 'The directory name must start with "directives" e.g. "directives/subdir"';
            }
        }
    ];

    this.prompt(prompts, function (props) {

        this.config = buildConfig(props);

        cb();
    }.bind(this));
};

ADirectiveGenerator.prototype.createSrc = function writeFiles() {
    var dest = 'src/js/src/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('directive.js', dest  + '/' + this.config.directiveName.camelized + '.js');
};

ADirectiveGenerator.prototype.createUnitTest = function writeFiles() {
    var dest = 'src/js/test/unit/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('directiveSpec.js', dest  + '/' + this.config.directiveName.camelized + 'Spec.js');
};
