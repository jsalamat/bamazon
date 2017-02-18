var mysql = require('mysql');
var inquirer = require('inquirer');

var myproduct;
var currentproduct;
var currentstock;
var myquantity;
var newstock;

var newproduct;
var newdepartpentid;
var newprice;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db',
});

connection.connect();

function viewMenuOptions() {
		console.log(' ');
		console.log('------------------------------------------------------------------');
		console.log('  BAMAZON: Manager Menu');
		console.log('------------------------------------------------------------------');
	inquirer.prompt([
		{type: "list",
	    message: "List a set of menu options:",
	    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "QUIT"],
	    name: "managerchoice"}
	]).then(function(data) {
		console.log('==================================================================');
		console.log(' ');

		var mychoice = data.managerchoice;
		console.log(mychoice);
		switch (mychoice) {
        case "View Products for Sale":
            viewProductsSale();
            break;
        case "View Low Inventory":
            viewLessThanFive();
            break;
        case "Add to Inventory":
            addMore();
            break;
        case "Add New Product":
            addProduct();
            break;
        case "QUIT":
        	console.log("");
        	console.log('------------------------------------------------------------------');
        	console.log("Have a Nice Day!");
        	console.log('------------------------------------------------------------------');
        	console.log("");
            connection.end();
            break;
        default:
        	console.log("");
        	console.log('------------------------------------------------------------------');
            console.log('invalid entry, Please put right command: ');
            console.log('------------------------------------------------------------------');
            console.log('choices are:');
            console.log('	node bamazonCustomer.js   :FOR CUSTOMER VIEW');
            console.log('	node bamazonManager.js    :FOR MANAGER VIEW');
            console.log('	node bamazonSupervisor.js :FOR SUPERVISOR VIEW');
            console.log('------------------------------------------------------------------');

		}

	});
};

viewMenuOptions();



function viewProductsSale() {
connection.query('SELECT * FROM products', function (error, results, fields)
	{
		//this show the current products
		// console.log(results);
		console.log(' ');
		console.log('  Products On Sale');
		console.log('------------------------------------------------------------------');
		console.log(' ID |  PRODUCT                                      PRICE |  STOCK')
		if (!error) {
			for (var i = 0; i < results.length; i++){
				console.log('------------------------------------------------------------------');
		    	console.log("  "+results[i].id+" | "+results[i].product_name+"  |  "+"$"+results[i].price+"  |  "+ "In Stock: "+results[i].stock_quantity);
			    }
			}
			console.log('\n');
			return viewMenuOptions();
	});
};

function viewLessThanFive() {
connection.query('SELECT * FROM products where stock_quantity < 5', function (error, results, fields)
	{
		//this show the current products
		// console.log(results);
		console.log(' ');
		console.log('  Low Inventory');
		console.log('------------------------------------------------------------------');
		console.log(' ID |  PRODUCT                                      PRICE |  STOCK')
		if (!error) {
			for (var i = 0; i < results.length; i++){
				console.log('------------------------------------------------------------------');
		    	console.log("  "+results[i].id+" | "+results[i].product_name+"  |  "+"$"+results[i].price+"  |  "+ "In Stock: "+results[i].stock_quantity);
			    }
			}
			console.log('\n');
			return viewMenuOptions();
	});
};

function addMore() {
	inquirer.prompt([
	{type: "input",
	  name: "product_id",
	  message: "Select the Item Id of Product you wish to Increase Inventory"}
	]).then(function(data){
		 myproduct = data.product_id;
		// console.log(myproduct);

			connection.query('SELECT * from products where id ='+ myproduct, function (error, results, fields) {
				// console.log(results);
				console.log(' ');
				console.log('  You have selected: ');
				console.log('---------------------------------------------------------------------');
		    	console.log(" ID: "+results[0].id+" | "+results[0].product_name+" | "+
		    				 "Price: $"+results[0].price+" | "+ "In Stock: "+results[0].stock_quantity);
				console.log('---------------------------------------------------------------------');
				console.log(' ');
				currentproduct = results[0].product_name
				currentstock = results[0].stock_quantity;
				return confirmAdd();
				// console.log(currentproduct);
				// console.log(currentstock);
			})
	});
}

function confirmAdd() {

			inquirer.prompt([
			{type: "input",
			  name: "quantity",
			  message: "How many units would you like to add to "+ currentproduct+"?"}
			]).then(function(data, error){

					// console.log(myproduct);
					myquantity = data.quantity;
					// console.log(myquantity);
				   //do an insert into mysql 
					if (error) {
						console.log(' ');
						console.log('---------------------------------------------------------------------');
						console.log("  Error! Please select the right amount and value !");
						console.log('---------------------------------------------------------------------');
						console.log(' ');
						return viewMenuOptions();
					} else {
						//for product update of stock
						newstock = parseFloat(currentstock) + parseFloat(myquantity);

						console.log(' ');
						console.log('---------------------------------------------------------------------');
						console.log("  Your adding " + myquantity);
						console.log("  Your Total Stock for " + currentproduct + " are " + newstock);
						console.log('---------------------------------------------------------------------');
						console.log(' ');

						
						// console.log(newstock+ " left");
						updateProducts(newstock, myproduct);
						return viewMenuOptions();
		}
	});
}

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

function addProduct() {
		console.log(' ');
		console.log('------------------------------------------------------------------');
		console.log('  BAMAZON: New Product Menu');
		console.log('------------------------------------------------------------------');
	inquirer.prompt([
  {
    type: "input",
    message: "What is the name of new Product?",
    name: "product"
  },
  {
    type: "input",
    message: "What is the Retail Value?",
    name: "value"
  },
  {
    type: "list",
    message: "Which Department does the product belong to?",
    choices: ["Anime", "Movies", "Video Games", "Comics", "Music"],
    name: "newdepartment"
  },
  {
    type: "confirm",
    message: "Are you sure about adding this Product?",
    name: "confirm",
    default: true
  }
]).then(function(user) {

  // console.log(user);
  // console.log(JSON.stringify(user, null, 2));

  if (user.confirm) {
  	var mydepartment=user.newdepartment
  	switch (mydepartment) {
        case "Anime":
            newdepartpentid=1;
            break;
        case "Movies":
            newdepartpentid=2;
            break;
        case "Video Games":
            newdepartpentid=3;
            break;
        case "Comics":
            newdepartpentid=4;
            break;
         case "Music":
            newdepartpentid=5;
            break;
    }
    newproduct = user.product;
    newprice = user.value;
    console.log("");
    console.log("==============================================");
    console.log("  NEW PRODUCT ADDED!");
    console.log("==============================================");
    console.log("");
    console.log("  Product Name: " + newproduct);
    // console.log("  department id: "+ newdepartpentid);
    console.log("  department id: "+ mydepartment);
    console.log("  Price: $" + newprice);
    console.log("");
    console.log("==============================================");

    insertProducts(newproduct, newdepartpentid, newprice);
    return viewMenuOptions();
  }
  else {
    console.log("");
    console.log('=====================================================================');
    console.log(" Back to Options");
    console.log('=====================================================================');
    console.log("");
    return viewMenuOptions();
  }
});
}

function insertProducts(newproduct, newdepartpentid, newprice){
	connection.query("INSERT INTO products SET ?", {
		product_name : newproduct,
		department_id : newdepartpentid,
		price : newprice,
	  	stock_quantity : 5
	  }, function(err, res) { 
	  	if (err) return console.log(err);
	  	// console.log('Update Stock Quantity completed!')
	  });
}
