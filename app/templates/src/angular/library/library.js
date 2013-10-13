// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('<%= config.angular.appModuleName.camelized %>.config', [])
    .value('<%= config.angular.appModuleName.camelized %>.config', {
        debug: true
    });

// Modules
angular.module('<%= config.angular.appModuleName.camelized %>.controllers', []);
angular.module('<%= config.angular.appModuleName.camelized %>.directives', []);
angular.module('<%= config.angular.appModuleName.camelized %>.filters', []);
angular.module('<%= config.angular.appModuleName.camelized %>.services', []);
angular.module('<%= config.angular.appModuleName.camelized %>',
    [
        '<%= config.angular.appModuleName.camelized %>.config',
        '<%= config.angular.appModuleName.camelized %>.controllers',
        '<%= config.angular.appModuleName.camelized %>.directives',
        '<%= config.angular.appModuleName.camelized %>.filters',
        '<%= config.angular.appModuleName.camelized %>.services'<% if (config.angular.includeModules.resource){ %>,
        'ngResource'<% } %><% if (config.angular.includeModules.cookies){ %>,
        'ngCookies'<% } %><% if (config.angular.includeModules.sanitize){ %>,
        'ngSanitize'<% } %>
    ]);
