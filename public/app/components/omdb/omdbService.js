angular.module('omdbService', [])
    .factory('omdb', function ($http) {
        //create the object
        var omdbFactory = {};
        //get movie data
        omdbFactory.getMovieInfo = function(movie_title){
            var search_type = 't';
            return $http.get("http://www.omdbapi.com/?"+search_type+"=" + movie_title);
        };
        return omdbFactory;
    });
