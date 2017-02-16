
var mysql = require('mysql');
var inquirer = require('inquirer');

var myproduct;
var myquantity;
var currentstock;
var myprice;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db',
});

connection.connect();

function viewProducts() {
connection.query('SELECT pro.id, pro.product_name, dep.department_name, pro.price, pro.stock_quantity FROM products pro LEFT JOIN departments dep ON dep.id = pro.department_id', function (error, results, fields)
	{
		//this show the current products
		// console.log(results);
		console.log(' ');
		console.log('WELCOME TO BAMAZON');
		console.log('------------------------------------------------------------------');
		console.log(' ID |  PRODUCT')
		if (!error) {
			for (var i = 0; i < results.length; i++){
				console.log('------------------------------------------------------------------');
		    	console.log("  "+results[i].id+" | "+results[i].product_name+" | "+
		    				results[i].department_name+'\r\n'+"    | "+ "Price: $"+
		    				results[i].price+" | "+ "In Stock: "+results[i].stock_quantity);
			    }
			}
			console.log('\n');
			return buyProducts();
	});
};

viewProducts();

function buyProducts() {
	inquirer.prompt([
	{type: "input",
	  name: "product_id",
	  message: "Select the Item Id of Product you wish to purchase:"}
	]).then(function(data){
		myproduct = data.product_id;
		console.log(myproduct);
			if(currentstock == 0){
				console.log('Were currently out of stock! Please select another product!');
				return viewProducts();
			} else {

			connection.query('SELECT * from products where id ='+ myproduct, function (error, results, fields) {
				// console.log(results);
				console.log(' ');
				console.log('You have selected: ');
				console.log('---------------------------------------------------------------------');
		    	console.log(" ID: "+results[0].id+" | "+results[0].product_name+" | "+
		    				 "Price: $"+results[0].price+" | "+ "In Stock: "+results[0].stock_quantity);
				console.log('---------------------------------------------------------------------');
				console.log(' ');
				currentstock = results[0].stock_quantity;
				myprice = results[0].price;
				return quantityProducts();
				// console.log(currentstock);
			})
		}
	});
}
//stop here focus next project 40 https://codingbootcamp.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=2635f304-cd34-4bef-9cf7-1057b4111082
//use oldliri samples and rewatched video start a 40

function quantityProducts() {

			inquirer.prompt([
			{type: "input",
			  name: "quantity",
			  message: "How many units would you like to buy?"}
			]).then(function(data){

					// console.log(myproduct);
					myquantity = data.quantity;
					console.log(myquantity);
				//do an insert into mysql 
					if (myquantity > currentstock) {
						console.log("Insufficient quantity! Please select the right amount!")
						return quantityProducts();
					} else {
						var actualprice = parseFloat(myquantity) * parseFloat(myprice);
						var totalprice = actualprice.toFixed(2);
						console.log("Your Total is $" + totalprice);

						//for product update
						var newstock = parseFloat(currentstock) - parseFloat(myquantity);
						console.log(newstock+ " left");

						// connection.query('INSERT into sales SET ?', {
						// 	beer_id : data.beer_id,
						// 	dranker_id : dranker
						// }, function (error, results, fields) {
						// 	console.log('insert complete')
						// });
		}
	});
}

//write update function
function updateProducts(myproduct, myproduct){
	connection.query("UPDATE " + table + " SET ? WHERE ?", [{
		name : 'bruno beer'
	  }, {
	  	id : id
	  }], function(err, res) { 
	  	if (err) return console.log(err);
	  	console.log('update completed!')
	  });
}

// function insertIntoTable(name, type, abv, table){
//   connection.query("INSERT INTO " + table + " SET ?", {
//       name: name,
//       type: type,
//       abv: abv
//     }, function(err, res) { console.log('completed!')});
// }

// function deleteFromTable(id, table){
// 	connection.query("DELETE FROM " + table + " WHERE ?", {
// 	    id: id
// 	  }, function(err, res) { 
// 	  	if (err) return console.log(err);
// 	  	console.log('delete completed!')
// 	  });
// }

// //write update function
// function updateTable(id, table){
// 	connection.query("UPDATE " + table + " SET ? WHERE ?", [{
// 		name : 'bruno beer'
// 	  }, {
// 	  	id : id
// 	  }], function(err, res) { 
// 	  	if (err) return console.log(err);
// 	  	console.log('update completed!')
// 	  });
// }

// //write delete function


// // insertIntoTable('beer', 'i dont know beer', 100, 'beers');
// // deleteFromTable(7, 'beers');
// updateTable(1, 'beers');








