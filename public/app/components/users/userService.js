angular.module('userService', [])
    .factory('User', function ($http) {
        //create the object
        var userFactory = {};


        //get single user
        userFactory.get = function (id) {
            return $http.get('/user_api/users/' + id);
        };

        //get all users
        userFactory.all = function () {
            return $http.get('/user_api/users/');
        };

        //signup a user
        userFactory.signup = function (userData) {
            return $http.post('/user_api/signup', userData);
        };

        //update a user
        userFactory.update = function (userData) {
            return $http.put('/user_api/users/', userData);
        };
        //update a user's reminders
        userFactory.updateReminders = function (userData) {
            return $http.put('/user_api/users/reminders', userData);
        };
        //delete a user
        userFactory.delete = function (id) {
            return $http.delete('/user_api/users/' + id);
        };

        return userFactory;
    });