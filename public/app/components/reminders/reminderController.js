angular.module('reminderController', ['reminderService'])
    .controller('reminderController', function($rootScope, $routeParams, Reminder ) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        Reminder.all()
            .success(function(data) {
                vm.processing = false;
                console.dir(data);
                vm.reminders = data.reminders;
            });
    })

    .controller('listAddReminderController', function( Auth, User, omdb ) {
        var vm = this;

        vm.reminderData = {};

        var onSuccess = function(data){
            vm.reminderData.title = data.data.Title;
            vm.reminderData.director = data.data.Director;
            vm.reminderData.genre = data.data.Genre;
            vm.reminderData.shortDesc = data.data.Plot;
            vm.reminderData.poster = data.data.Poster;
        };
        var onError = function(reason){
            console.log(reason);
        };


        vm.type = 'create';
        vm.lookup = false;
        vm.getMovieFromImdb = function(){
            omdb.getMovieInfo( vm.imdbData.title )
                .then(onSuccess, onError);
        };

        vm.saveReminder = function(isValid) {
            //isValid is for form validation
            if( isValid ){
                vm.processing = true;
                // clear the error
                vm.message = '';

                Auth.getUser()
                    .then(function(data) {
                        vm.processing = false;
                        vm.user = data.data;
                        //save user with new reminder added
                        vm.user.reminders.push( vm.reminderData );

                        //now save user
                        User.updateReminders( vm.user )
                            .success(function(data) {
                                vm.processing = false;

                                // clear the form
                                vm.reminderData = {};
                                vm.reminders = vm.user.reminders;

                                // bind the message from our API to vm.message
                                vm.message = data.message;
                            });
                    });
            }
        };

    });

