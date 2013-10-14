'use strict';

describe('<%= config.controllerName.original %>', function() {

    var ctrl;
    var $scope;

    // Load module
    beforeEach(module('<%= jablConfig.angular.appModuleName.camelized %>'));

    beforeEach(inject(function($rootScope, $controller) {

        // Create scope
        $scope = $rootScope.$new();

        // Create controller
        ctrl = $controller('<%= config.controllerName.classified %>', {
            $scope: $scope
        });

    }));

    it('should be defined', function() {
        expect(ctrl).toBeDefined();
    });

});