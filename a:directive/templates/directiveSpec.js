'use strict';

describe('<%= config.directiveName.original %>', function() {

    var element;
    var $scope;

    // Load module
    beforeEach(module('<%= jablConfig.angular.appModuleName.camelized %>'));

    beforeEach(inject(function($rootScope, $controller) {

        // Create scope
        $scope = $rootScope.$new();

    }));

    it('should do something', inject(function($compile) {

        // Sample test code:
        // element = $compile('<div <%= config.directiveName.dasherized %>""></div>')(scope);
        // scope.$digest();
        // expect(element.html()).toBe('Something');
    }));

});