'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , art = require('../lib/art')
    , chalk = require('chalk')
    , fs = require('fs');

var JViewGenerator = module.exports = function JViewGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(JViewGenerator, yeoman.generators.Base);

JViewGenerator.prototype.readConfig = function readConfig() {
    this.jablConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'jabl.json')));
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function(){
        console.log('\n' + chalk.yellow('Done!') + '\n');
    });
};

JViewGenerator.prototype.showWelcome = function showWelcome() {

    // Don't show welcome if called directly with answers passed in
    if(this.options.answers) return;

    console.log(art.clear);
    console.log(art.welcome);
    console.log(art.title(this.pkg.version));
    console.log(chalk.yellow('Create a Jade view') + ' (Ctrl-C to quit)');
    console.log('\n');
};

JViewGenerator.prototype.askFor = function askFor() {

    // Build a config object
    var buildConfig = function(props){

        var _ = yeoman.generators.Base.prototype._;

        return {

            // Originally a camelized string like "myView"
            viewName: {

                // String originally entered by user
                original: props.viewName,

                // Camelized e.g. myService
                camelized: _.camelize(props.viewName),

                // Dasherized e.g. my-view
                dasherized: _.dasherize(props.viewName),

                // Slugified (whitespace replaced by dashes) e.g. myview
                slugified: _.slugify(_.humanize(props.viewName)),

                // Array of parts e.g. ['my', 'view']
                parts: _.dasherize(props.viewName).split('-'),

                // Underscored e.g. my_view
                underscored: _.underscored(props.viewName),

                // Classified e.g. MyService
                classified: _.classify(_.underscored(props.viewName))
            },

            // Originally a camelized string like "myView"
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
            },

            directory: props.directory

        };
    }

    // If answers are passed in options, skip prompts
    if(this.options.answers){
        this.config = buildConfig(this.options.answers);
        return;
    }

    var layoutNames = fs.readdirSync(path.join(this.destinationRoot(), 'src/jade/layouts'));

    var cb = this.async();

    var prompts = [
        {
            name: 'viewName',
            message: 'What\'s the name of the view you wish to create?',
            default: 'myView',
            filter: function (name) {
                var underscored = yeoman.generators.Base.prototype._.underscored(name);
                return yeoman.generators.Base.prototype._.camelize(underscored);
            }
        },
        {
            name: 'layoutName',
            type: 'list',
            message: 'Select the layout you wish to extend from?',
            choices: layoutNames,
            default: 'default'
        },
        {
            name: 'directory',
            message: 'In which directory would you like to create the view?',
            default: 'public',
            validate: function (name) {
                if (/^public.*/.test(name)) return true;
                return 'The directory name must start with "public" e.g. "public/subdir"';
            }
        }
    ];

    this.prompt(prompts, function (props) {

        this.config = buildConfig(props);

        cb();
    }.bind(this));
};

JViewGenerator.prototype.createFiles = function createFiles() {

    var levels = this.config.directory.split('/');
    var pathToJadeRoot = '';
    for (var i=0; i<levels.length; i++){
        pathToJadeRoot = pathToJadeRoot + '../';
    }
    var layoutPath = pathToJadeRoot + 'layouts/' + this.config.layoutName.camelized;

    this.config.layoutPath = layoutPath;

    this.template('view.jade', 'src/jade/' + this.config.directory + '/' + this.config.viewName.camelized + '.jade');
};
