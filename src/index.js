console.log("Hello world");


var express = require("express");
var fetch = require("node-fetch");
var cheerio = require("cheerio");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db');


function storePizzas(pizzas){
	db.serialize(function() {
	  db.run("CREATE TABLE pizza (title TEXT, ingredients TEXT, pizza_place TEXT)");
	 
	  var stmt = db.prepare("INSERT INTO pizza(title, ingredients, pizza_place) VALUES (?, ?, ?)");
	  for (var i = 0; i < pizzas.length; i++) {
	  		var p = pizzas[i];
	      	stmt.run(p.title, p.ingredients, p.pizzaplace);
	  }
	  stmt.finalize();
	 
	  db.each("SELECT rowid AS id, title, ingredients, pizza_place FROM pizza", function(err, row) {
	  	  if(err){
	  	  	throw err;
	  	  }
	      console.log(row);
	  });
	});

}

var app = express();
// http://www.dopopoco.ro/meniu-individual-timisoara

function processText(text){
	var $ = cheerio.load(text);

	var listItems = Array.from($("#tiles").children("li"));
	return listItems.map(function(li){

		var prices = $(li).find(".pretVal");

		return {
			title : $(li).find(".title").text(),
			ingredients : $(li).find(".ingrediente").text().trim(),
			img : "http://www.dopopoco.ro" + $(li).find("a > img").attr("src"),
			pizzaplace : "Dopopoco",
			pret : [$(prices[0]).text(), $(prices[1]).text()]
		};
	});
};

app.get("/hello", function(req, res){
	var dopopocoSite = fetch("http://www.dopopoco.ro/meniu-individual-timisoara");

	var textResponse = dopopocoSite.then(function(response){
		return response.text();

	});
	textResponse.then(function(text){
		var pizzas = processText(text);
		storePizzas(pizzas);
		res.send(pizzas);
	});

});


app.listen(3000, function(){
	console.log("Server");
});



