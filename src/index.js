console.log("Hello world");


var express = require("express");
var fetch = require("node-fetch");
var cheerio = require("cheerio");

var app = express();
// http://www.dopopoco.ro/meniu-individual-timisoara

function processText(text){
	var $ = cheerio.load(text);

	var listItems = Array.from($("#tiles").children("li"));
	return listItems.map(function(li){
		return {
			title : $(li).find(".title").text()
		};
	}};
};

app.get("/hello", function(req, res){
	var dopopocoSite = fetch("http://www.dopopoco.ro/meniu-individual-timisoara");

	var textResponse = dopopocoSite.then(function(response){
		return response.text();

	});
	textResponse.then(function(text){
		res.send processText(text);
	});

});


app.listen(3000, function(){
	console.log("Server ");
});