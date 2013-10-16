'use strict';

describe('<%= config.serviceName.camelized %>', function() {

    var service;

    // Load module
    beforeEach(module('<%= jablConfig.angular.appModuleName.camelized %>'));

    beforeEach(inject(['$injector', function ($injector) {

        // Create service
        service = $injector.get('<%= config.serviceName.camelized %>');
    }]));


    it('should exist', function() {
        expect(service).toBeDefined();
    });

});