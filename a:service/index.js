'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , art = require('../lib/art')
    , chalk = require('chalk');

var AServiceGenerator = module.exports = function AServiceGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(AServiceGenerator, yeoman.generators.Base);

AServiceGenerator.prototype.readConfig = function readConfig() {
    this.jablConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'jabl.json')));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function(){
        console.log('\n' + chalk.yellow('Done!') + '\n');
    });
};

AServiceGenerator.prototype.showWelcome = function showWelcome() {
    console.log(art.clear);
    console.log(art.welcome);
    console.log(art.title(this.pkg.version));
    console.log(chalk.yellow('Create an AngularJS service') + ' (Ctrl-C to quit)');
    console.log('\n');
};

AServiceGenerator.prototype.askFor = function askFor() {

    // Build a config object
    var buildConfig = function(props){

        var _ = yeoman.generators.Base.prototype._;

        return {

            // Originally a camelized string like "myService"
            serviceName: {

                // String originally entered by user
                original: props.serviceName,

                // Camelized e.g. myService
                camelized: _.camelize(props.serviceName),

                // Dasherized e.g. my-service
                dasherized: _.dasherize(props.serviceName),

                // Slugified (whitespace replaced by dashes) e.g. myservice
                slugified: _.slugify(_.humanize(props.serviceName)),

                // Array of parts e.g. ['my', 'service']
                parts: _.dasherize(props.serviceName).split('-'),

                // Underscored e.g. my_service
                underscored: _.underscored(props.serviceName),

                // Classified e.g. MyService
                classified: _.classify(_.underscored(props.serviceName))

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
            name: 'serviceName',
            message: 'What\'s the name of the service you wish to create?',
            default: 'myService',
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.camelize(underscored);
            }
        },
        {
            name: 'directory',
            message: 'In which directory would you like to create the service?',
            default: 'services',
            validate: function (name) {
                if (/^services.*/.test(name)) return true;
                return 'The directory name must start with "services" e.g. "services/subdir"';
            }
        }
    ];

    this.prompt(prompts, function (props) {

        this.config = buildConfig(props);
        cb();
    }.bind(this));
};

AServiceGenerator.prototype.createSrc = function createSrc() {
    var dest = 'src/js/src/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('service.js', dest  + '/' + this.config.serviceName.camelized + '.js');
};

AServiceGenerator.prototype.createUnitTest = function createUnitTest() {
    var dest = 'src/js/test/unit/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('serviceSpec.js', dest  + '/' + this.config.serviceName.camelized + 'Spec.js');
};
