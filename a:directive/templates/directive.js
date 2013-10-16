angular.module('<%= jablConfig.angular.appModuleName.camelized %>.directives')
    .directive('<%= config.directiveName.camelized %>', ['$scope', function($scope){

        return {
            restrict: 'AE',
            link: function(scope, iElement, iAttrs){

            }
        };

    }]);