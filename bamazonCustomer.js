
var mysql = require('mysql');
var inquirer = require('inquirer');

var myproduct;
var myquantity;
var currentstock;
var myprice;
var newstock;

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
		console.log('  WELCOME TO BAMAZON');
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
		// console.log(myproduct);
			if(currentstock == 0){
				console.log('  Were currently out of stock! Please select another product!');
				return viewProducts();
			} else {

			connection.query('SELECT * from products where id ='+ myproduct, function (error, results, fields) {
				// console.log(results);
				console.log(' ');
				console.log('  You have selected: ');
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


function quantityProducts() {

			inquirer.prompt([
			{type: "input",
			  name: "quantity",
			  message: "How many units would you like to buy?"}
			]).then(function(data){

					// console.log(myproduct);
					myquantity = data.quantity;
					// console.log(myquantity);
				   //do an insert into mysql 
					if (myquantity > currentstock) {
						console.log(' ');
						console.log('---------------------------------------------------------------------');
						console.log("  Insufficient quantity! Please select the right amount!");
						console.log('---------------------------------------------------------------------');
						console.log(' ');
						return quantityProducts();
					} else {
						var actualprice = parseFloat(myquantity) * parseFloat(myprice);
						var totalprice = actualprice.toFixed(2);

						console.log(' ');
						console.log('---------------------------------------------------------------------');
						console.log("  With a quantity of " + myquantity);
						console.log("  Your Total is $" + totalprice);
						console.log('---------------------------------------------------------------------');
						console.log(' ');

						//for product update of stock
						newstock = parseFloat(currentstock) - parseFloat(myquantity);
						// console.log(newstock+ " left");

						return confirmPurchase();
		}
	});
}

function confirmPurchase(){
		inquirer.prompt([
			{type: "confirm",
			  name: "purchase",
			  message: "Would Like to confirm your order?"}
			]).then(function(data){
				mypurchase= data.purchase;
				// console.log(mypurchase);
				if(mypurchase){
					console.log(' ');
					console.log('---------------------------------------------------------------------');
					console.log('  Your Order is Completed!');
					console.log('---------------------------------------------------------------------');
					console.log(' ');
					updateProducts(newstock, myproduct);
					insertIntoSales(myproduct, myquantity);
					return anotherPurchase();
				} else {
					console.log(' ');
					console.log('---------------------------------------------------------------------');
					console.log('  Back to Bamazon Products Lists!');
					console.log('---------------------------------------------------------------------');
					console.log(' ');
					return viewProducts();
		}
	});
}

function anotherPurchase(){
		inquirer.prompt([
			{type: "confirm",
			  name: "purchaseagain",
			  message: "Would Like to your Another product?"}
			]).then(function(data){
				mypurchaseagain= data.purchaseagain;
				// console.log(mypurchaseagain);
				if(mypurchaseagain){
					console.log(' ');
					console.log('---------------------------------------------------------------------');
					console.log('  Back to Bamazon Products Lists!');
					console.log('---------------------------------------------------------------------');
					console.log(' ');
					return viewProducts();
				} else {
					console.log(' ');
					console.log('---------------------------------------------------------------------');
					console.log('  Thank You For Your Service!');
					console.log('---------------------------------------------------------------------');
					console.log(' ');
					connection.end();
		}
	});
}

//write update function
//Update products set stock_quantity = [newstock] where id = [myproduct];
function updateProducts(newstock, myproduct){
	connection.query("UPDATE products SET ? WHERE ?", [{
		stock_quantity : newstock
	  }, {
	  	id : myproduct
	  }], function(err, res) { 
	  	if (err) return console.log(err);
	  	// console.log('Update Stock Quantity completed!')
	  });
}

function insertIntoSales(myproduct, myquantity){
  connection.query("INSERT INTO sales SET ?", {
      product_id: myproduct,
      quantity_purchased: myquantity
    }, function(err, res) {
    	 // console.log('Sales is Completed and Recorded!')
	});
}

