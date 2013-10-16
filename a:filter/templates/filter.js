angular.module('<%= jablConfig.angular.appModuleName.camelized %>.filters')
    .filter('<%= config.filterName.camelized %>', [function(){

        return function(input){

            // Do something with input

            return input;
        };

    }]);