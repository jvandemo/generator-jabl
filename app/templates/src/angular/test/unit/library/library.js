'use strict';

// Set the jasmine fixture path
// jasmine.getFixtures().fixturesPath = 'base/';

describe('<%= config.angular.appModuleName.camelized %>', function() {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {

        // Get module
        module = angular.module('<%= config.angular.appModuleName.camelized %>');
        dependencies = module.requires;
    });

    it('should load config module', function() {
        expect(hasModule('<%= config.angular.appModuleName.camelized %>.config')).toBeTruthy();
    });

    it('should load controllers module', function() {
        expect(hasModule('<%= config.angular.appModuleName.camelized %>.controllers')).toBeTruthy();
    });

    it('should load filters module', function() {
        expect(hasModule('<%= config.angular.appModuleName.camelized %>.filters')).toBeTruthy();
    });

    it('should load directives module', function() {
        expect(hasModule('<%= config.angular.appModuleName.camelized %>.directives')).toBeTruthy();
    });

    it('should load services module', function() {
        expect(hasModule('<%= config.angular.appModuleName.camelized %>.services')).toBeTruthy();
    });

});
