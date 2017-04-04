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