angular.module('app.routes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider){
        $routeProvider
            .when('/',{
               templateUrl: 'app/views/pages/home.html'
            })
            .when('/login', {
                templateUrl : 'app/views/pages/login.html',
                controller : 'mainController',
                controllerAs: 'login'
            })
            .when('/reminders', {
                templateUrl: 'app/views/pages/reminders/list.html',
                controller: 'reminderController',
                controllerAs: 'list'
            })
            .when('/reminders/create',{
                templateUrl: 'app/views/pages/reminders/create.html',
                controller: 'listAddReminderController',
                controllerAs: 'reminder'
            })
            .when('/signup', {
                templateUrl : 'app/views/pages/signup.html',
                controller : 'userSignupController',
                controllerAs: 'signup'
            });

        //get rid of the hash in the url
        $locationProvider.html5Mode(true);
    });