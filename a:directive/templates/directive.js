angular.module('<%= jablConfig.angular.appModuleName.camelized %>.directives')
    .directive('<%= config.directiveName.classified %>', ['$scope', function($scope){

        return {
            restrict: 'AE',
            link: function(scope, iElement, iAttrs){

            }
        };

    }]);