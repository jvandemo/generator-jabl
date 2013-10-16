'use strict';

describe('<%= config.filterName.original %>', function() {

    var filter;

    // Load module
    beforeEach(module('<%= jablConfig.angular.appModuleName.camelized %>'));

    beforeEach(inject(function($filter) {

        // Create filter
        filter = $filter('<%= config.filterName.camelized %>');

    }));

    it('should do something', function() {

        // Sample test code:
        // expect(filter('someValue').toEqual('Something');
    });

});