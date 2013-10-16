'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , art = require('../lib/art')
    , chalk = require('chalk');

var AFilterGenerator = module.exports = function AFilterGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(AFilterGenerator, yeoman.generators.Base);

AFilterGenerator.prototype.readConfig = function showWelcome() {
    this.jablConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'jabl.json')));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function(){
        console.log('\n' + chalk.yellow('Done!') + '\n');
    });
};

AFilterGenerator.prototype.showWelcome = function showWelcome() {
    console.log(art.clear);
    console.log(art.welcome);
    console.log(art.title(this.pkg.version));
    console.log(chalk.yellow('Create an AngularJS filter') + ' (Ctrl-C to quit)');
    console.log('\n');
};

AFilterGenerator.prototype.askFor = function askFor() {

    // Build a config object
    var buildConfig = function(props){

        var _ = yeoman.generators.Base.prototype._;

        return {

            // Originally a camelized string like "myFilter"
            filterName: {

                // String originally entered by user
                original: props.filterName,

                // Camelized e.g. myService
                camelized: _.camelize(props.filterName),

                // Dasherized e.g. my-filter
                dasherized: _.dasherize(props.filterName),

                // Slugified (whitespace replaced by dashes) e.g. myfilter
                slugified: _.slugify(_.humanize(props.filterName)),

                // Array of parts e.g. ['my', 'filter']
                parts: _.dasherize(props.filterName).split('-'),

                // Underscored e.g. my_filter
                underscored: _.underscored(props.filterName),

                // Classified e.g. MyService
                classified: _.classify(_.underscored(props.filterName))
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
            name: 'filterName',
            message: 'What\'s the name of the filter you wish to create?',
            default: 'myFilter',
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.camelize(underscored);
            }
        },
        {
            name: 'directory',
            message: 'In which directory would you like to create the filter?',
            default: 'filters',
            validate: function (name) {
                if (/^filters.*/.test(name)) return true;
                return 'The directory name must start with "filters" e.g. "filters/subdir"';
            }
        }
    ];

    this.prompt(prompts, function (props) {

        this.config = buildConfig(props);

        cb();
    }.bind(this));
};

AFilterGenerator.prototype.createSrc = function writeFiles() {
    var dest = 'src/js/src/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('filter.js', dest  + '/' + this.config.filterName.camelized + '.js');
};

AFilterGenerator.prototype.createUnitTest = function writeFiles() {
    var dest = 'src/js/test/unit/' + this.jablConfig.angular.appModuleName.camelized + '/' + this.config.directory;
    this.template('filterSpec.js', dest  + '/' + this.config.filterName.camelized + 'Spec.js');
};
