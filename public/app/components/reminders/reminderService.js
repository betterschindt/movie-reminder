angular.module('reminderService', [])
    .factory('Reminder', function ($http) {
        //create the object
        var reminderFactory = {};
        //get all reminders
        reminderFactory.all = function () {
            return $http.get('/user_api/me');
        };
        return reminderFactory;
    });