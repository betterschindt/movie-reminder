angular.module('movieReminderApp', [ 'app.routes', 'mainController', 'userController', 'reminderController', 'reminderService', 'userService', 'authService', 'omdbService'])

// application configuration to integrate token into requests
    .config(function($httpProvider) {

        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });