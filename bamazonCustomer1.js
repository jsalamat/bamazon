var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db',
});

connection.connect();

var myproduct;
var myquantity;
var currentstock;

function viewProducts() {
	connection.query('SELECT pro.id, pro.product_name,dep.department_name, pro.price, pro.stock_quantity FROM products pro LEFT JOIN departments dep ON dep.id = pro.department_id', function (error, results, fields)
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
		    	console.log("  "+results[i].id+" | "+results[i].product_name+" | "+results[i].department_name+
		    				'\r\n'+"    | "+ "Price: $"+results[i].price+" | "+ "In Stock: "+results[i].stock_quantity);
		    }
		}
		console.log('\n');
		buyProducts();
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
			// console.log(currentstock);
		})
	});
}