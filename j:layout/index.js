'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , art = require('../lib/art')
    , chalk = require('chalk');

var JLayoutGenerator = module.exports = function JLayoutGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(JLayoutGenerator, yeoman.generators.Base);

JLayoutGenerator.prototype.readConfig = function readConfig() {
    this.jablConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'jabl.json')));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function(){
        console.log('\n' + chalk.yellow('Done!') + '\n');
    });
};

JLayoutGenerator.prototype.showWelcome = function showWelcome() {

    // Don't show welcome if called directly with answers passed in
    if(this.options.answers) return;

    console.log(art.clear);
    console.log(art.welcome);
    console.log(art.title(this.pkg.version));
    console.log(chalk.yellow('Create a Jade layout') + ' (Ctrl-C to quit)');
    console.log('\n');
};

JLayoutGenerator.prototype.askFor = function askFor() {

    // Build a config object
    var buildConfig = function(props){

        var _ = yeoman.generators.Base.prototype._;

        return {

            // Originally a camelized string like "myLayout"
            layoutName: {

                // String originally entered by user
                original: props.layoutName,

                // Camelized e.g. myService
                camelized: _.camelize(props.layoutName),

                // Dasherized e.g. my-layout
                dasherized: _.dasherize(props.layoutName),

                // Slugified (whitespace replaced by dashes) e.g. mylayout
                slugified: _.slugify(_.humanize(props.layoutName)),

                // Array of parts e.g. ['my', 'layout']
                parts: _.dasherize(props.layoutName).split('-'),

                // Underscored e.g. my_layout
                underscored: _.underscored(props.layoutName),

                // Classified e.g. MyService
                classified: _.classify(_.underscored(props.layoutName))
            }

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
            name: 'layoutName',
            message: 'What\'s the name of the layout you wish to create?',
            default: 'myLayout',
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.camelize(underscored);
            }
        }
    ];

    this.prompt(prompts, function (props) {

        this.config = buildConfig(props);

        cb();
    }.bind(this));
};

JLayoutGenerator.prototype.createFiles = function createFiles() {
    this.template('layout.jade', 'src/jade/layouts/' + this.config.layoutName.camelized + '.jade');
};
