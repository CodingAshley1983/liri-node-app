var inquirer = require("inquirer");
var axios = require("axios")
var Spotify = require('node-spotify-api')
var fs = require("fs")
var moment = require("moment")
// var random= require("random.txt")

var spotify = new Spotify({
    id: "76eb9b9e39a84fbb8e515d8577aff93e",
    secret: "9c2392d6a6a443c9924141ce9cf33b50"
});

//start-up function
function startUp() {

    //using inquirer to ask questions
    inquirer.prompt([{
        type: "list",
        message: "what command would you like to do?",
        name: "command",
        choices: ["concert-this", "movie-this", "spotify-this-song", "do-what-it-says"]

    }]).then(function (answers) {
        console.log(answers)
        switch (answers.command) {
            case "concert-this":
                console.log("concert-this")
                concertThis();
                break;
            case "movie-this":
                console.log("movie-this")
                movieThis();
                break;
            case "spotify-this-song":
                console.log("spotify-this");
                spotifyThis();
                break;
            case "do-what-it-says":
                console.log("do-what-it-says");
                doWhat();
                break;



        }

    })

}
//When selecting to search movie IMDB
function movieThis() {
    inquirer.prompt([{
        type: "input",
        message: "What movie do you want to search for?",
        name: "movie"

    }]).then(function (answers) {

        var movie = answers.movie
        var URL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy"
        axios.get(URL).then(function (response) {
            console.log(
                "Movie Title: " + response.data.Title + "\n",
                "Year: " + response.data.Year + "\n",
                "IMDB Rating: " + response.data.imdbRating + "\n",
                "Rotten tomatoes rating: " + response.data.Ratings[1] + "\n",
                "Country:" + response.data.Country + "\n",
                "Language: " + response.data.Language + "\n",
                "Plot: " + response.data.Plot + "\n",
                "Actors: " + response.data.Actors



            )
        })

    })

}
//when Concert-Search is chosen
function concertThis() {
    inquirer.prompt([{
        type: "input",
        message: "What artist do you want to see?",
        name: "concert"

    }]).then(function (answers) {

        var concert = answers.concert

        var URL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp"
        axios.get(URL).then(function (response) {

            response.data.forEach(element => {
                console.log("Venue: ", element.venue["name"]),
                    console.log("City: ", element.venue["city"]),
                    console.log("Date of Event: " + moment(element.datetime).format("MM/DD/YYYY"));


            })





        });

    })
}

//when spotify song search is chosen
function spotifyThis() {
    inquirer.prompt([{
        type: "input",
        message: "What song do you want to Spotify-search?",
        name: "song"

    }]).then(function (answers) {

        var song = answers.song
    
        spotify.search({
            type: "track",
            query: song
        }, function (err, data) {
            if (err) {
                theSign();
                return console.log(err);
            }
            console.log("Searching...")
            console.log(data.tracks.items)


            var songs = data.tracks.items

            if(songs[0].name==="undefined"){
                theSign();
            }
            for (i = 0; i < songs.length; i++) {
                console.log(
                    "Artist: ", songs[i].artists[0].name, "\n",
                    "Song Name: ", songs[i].name, "\n",
                    "Album: ", songs[i].album.name, "\n",
                    "Preview link: ", songs[i].preview_url, "\n",
                    "____________________________________________"
                )
            }
        })

    });
}

//If the Spotify song is null or mispelled- searches The Sign
function theSign() {

    spotify.search({
        type: "track",
        query: "I saw the sign"
    }, function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("Couldn't understand your song choice, serach I Saw The Sign...")
        console.log(data.tracks.items)
        var songs = data.tracks.items
        for (i = 0; i < songs.length; i++) {
            console.log(
                "Artist: ", songs[i].artists[0].name, "\n",
                "Song Name: ", songs[i].name, "\n",
                "Album: ", songs[i].album.name, "\n",
                "Preview link: ", songs[i].preview_url, "\n",
                "____________________________________________"
            )
        }
    })

}
//When "Do what it says" is selected...draws from whatever is listed in the random.txt file and searches Spotify
function doWhat(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        spotify.search({
            type: "track",
            query: dataArr[1]
        }, function (error, data) {
            if (error) {
                return console.log(error);
            }
            console.log("Searching Do What It Says...")
            console.log(data.tracks.items)
            var songs = data.tracks.items
            for (i = 0; i < songs.length; i++) {
                console.log(
                    "Artist: ", songs[i].artists[0].name, "\n",
                    "Song Name: ", songs[i].name, "\n",
                    "Album: ", songs[i].album.name, "\n",
                    "Preview link: ", songs[i].preview_url, "\n",
                    "____________________________________________"
                )
            }
        })

      
      });
      

}


startUp();