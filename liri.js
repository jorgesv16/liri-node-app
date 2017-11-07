var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var twitterKeys = require("./keys.js");
var request = require("request");
var fs = require("fs");

var command = process.argv[2];

var tweets = new Twitter(twitterKeys);

var spotify = new Spotify({
  id: "796913f8d18b481987e06e6470e7fe7d",
  secret: "e3ed9dceb4464b4eb28a6e395ea7a5b6"
});


// GET SONG/MOVIE NAME
var name = "";
for (var i = 3; i < process.argv.length; i++) {
	name += process.argv[i] + ' ';
}
name = name.trim();

function chooseCommand(command, name) {
	switch (command) {

		// TWITTER COMMAND CASE
		case "my-tweets": 
			getTweets();
			break;


		// SPOTIFY COMMAND CASE
		case "spotify-this-song": 
			if (name.length === 0) {
				name = "The Sign";
			}
			getSong(name);
			break;


		// MOVIE COMMAND CASE
		case "movie-this":
			if (name.length === 0) {
				name = "Mr. Nobody"
			} 
			getMovie(name);
			break;


		// TXT FILE COMMAND
		case "do-what-it-says": 
			fs.readFile("./random.txt", "utf8", function(err, data) {
				var dataArr = data.split(",");
				command = dataArr[0];
				name = dataArr[1];
				chooseCommand(command, name);
			});
			break;

		default:
			console.log("invalid command");
	}
}

chooseCommand(command, name);

function getTweets() {
	tweets.get("search/tweets", {q: "@warriors", count: 20}, function(error, tweet, response) {
		if(error) throw error;
		for (var i = 0; i < 20; i++) {
			console.log("-----------------------------------------");
			console.log("Date created: " + tweet.statuses[i].created_at.slice(0, 16) + "\n" + tweet.statuses[i].text);
			console.log("-----------------------------------------");
		}
	});
}

function getSong(songName) {
	spotify.search({type: 'track', query: songName, limit: 1}, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		console.log("-----------------------------------------");
		console.log("Artist(s): " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].external_urls.spotify + "\nAlbum name: " + data.tracks.items[0].album.name);
		console.log("-----------------------------------------");
	});
}

function getMovie(movieName) {
	request("http://www.omdbapi.com/?t=" + movieName +"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("-----------------------------------------");
			console.log("Title: " + JSON.parse(body).Title); 
			console.log("Release Year: " + JSON.parse(body).Year); 
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating); 
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country of Origin: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("-----------------------------------------");
		}
	});
}



