'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , art = require('../lib/art')
    , chalk = require('chalk');

var AControllerGenerator = module.exports = function AControllerGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(AControllerGenerator, yeoman.generators.Base);

AControllerGenerator.prototype.readConfig = function readConfig() {
    this.jablConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'jabl.json')));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function(){
        console.log('\n' + chalk.yellow('Done!') + '\n');
    });
};

AControllerGenerator.prototype.showWelcome = function showWelcome() {
    console.log(art.clear);
    console.log(art.welcome);
    console.log(art.title(this.pkg.version));
    console.log(chalk.yellow('Create an AngularJS controller') + ' (Ctrl-C to quit)');
    console.log('\n');
};

AControllerGenerator.prototype.askFor = function askFor() {

    // Build a config object
    var buildConfig = function(props){

        var _ = yeoman.generators.Base.prototype._;

        return {

            // Originally a classified string like "MyController"
            controllerName: {

                // String originally entered by user
                original: props.controllerName,

                // Camelized e.g. MyApp
                camelized: _.camelize(_.underscored(props.controllerName)),

                // Dasherized e.g. my-app
                dasherized: _.dasherize(_.underscored(props.controllerName)),

                // Slugified (whitespace replaced by dashes) e.g. myapp
                slugified: _.slugify(_.humanize(props.controllerName)),

                // Underscored e.g. my_app
                underscored: _.underscored(props.controllerName),

                // Classified e.g. MyCtrl
                classified: _.classify(_.underscored(props.controllerName)),

                // Array of parts e.g. ['my', 'app']
                parts: _.underscored(props.controllerName).split('_')
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
            name: 'controllerName',
            message: 'What\'s the name of the controller you wish to create?',
            default: 'MyCtrl',
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.classify(underscored);
            }
        },
        {
            name: 'directory',
            message: 'In which directory would you like to create the controller?',
            default: 'controllers',
            validate: function (name) {
                if (/^controllers.*/.test(name)) return true;
                return 'The directory name must start with "controllers" e.g. "controllers/subdir"';
            }
        }
    ];

    this.prompt(prompts, function (props) {

        this.config = buildConfig(props);

        cb();
    }.bind(this));
};

AControllerGenerator.prototype.createSrc = function createSrc() {
    var dest = 'src/js/src/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('controller.js', dest  + '/' + this.config.controllerName.camelized + '.js');
};

AControllerGenerator.prototype.createUnitTest = function createUnitTest() {
    var dest = 'src/js/test/unit/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('controllerSpec.js', dest  + '/' + this.config.controllerName.camelized + 'Spec.js');
};
