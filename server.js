const express = require('express');
var bodyParser = require('body-parser')
const helmet = require('helmet');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;


// ============== API

//Parses the body

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//GET all items
app.get('/items', (req, res) => {
	getItems((err, item) => {
		if(err) 
			res.status(500).send(err);
		
		res.send(item);
	});
});

//CREATE new item
app.put('/item', (req, res) => {
	console.log(req.body);
	saveItem(req.body.name, req.body.price, req.body.quantity, (err, item) => {
		if(err) 
			res.status(500).send(err);
		
		res.send(item);
	});
});

//GET a single item by name 
app.get('/item/:name', (req, res) => {
	getItem(req.params.name, (err, item) =>{
		if(err) 
			res.status(404).send(err);
		
		res.send(item);
	});
});

//DELETE item
app.delete('/item/:name', (req, res) => {
	deleteItem(req.params.name, (err, item) => {
		if(err) 
			res.status(500).send(err);
		
		res.send(item);
	});
});

//POST updates in existing object
app.post('/item/:name', (req, res) => {
	saveItem(req.params.name, req.body.price, req.body.quantity, (err, item) =>{
		if(err) 
			res.status(500).send(err);
		
		res.send(item);
	});	
});


// =============== functions


//Loads and Reads the JSON file data.json
function loadJson(callback){
	fs.readFile('data.json', (err, data) => {
		if(err)
			callback(err, null);
		
		let icecream = JSON.parse(data);
		console.log(icecream);
		callback(err, icecream);
	});
}

//Writes JSON data to file
function writeJson(icecream){
	let data = JSON.stringify(icecream);
	fs.writeFileSync('data.json', data);
}

//Creats and updates new and old items
function saveItem(name, price, quantity, callback){
	var items = loadJson((err, items) => {
		if(err)
			callback(err, null);
		
		var newItem = {name: name, price: price, quantity: quantity};
		checkItemName(name, (_err, itemIndex) => {
			if (itemIndex){
				let _item = items[itemIndex];
				
				if (!price){
					newItem.price = item.price;
				}
				
				if (!quantity){
					newItem.quantity = item.quantity;
				}
				
				items[itemIndex] = newItem;
			}
			else {
				items.push(newItem);
			}
			
			writeJson(items);
			callback(_err, newItem);
		});
	});
}

//Checks if the item exists with name
function checkItemName(name, callback){
	loadJson((err, items) => {
		if(err)
			callback(err, false);
		
		let itemIndex = items.findIndex(x => x.name === name);
		if (itemIndex >= 0){
			callback(err, itemIndex);
		}
		else{ 
		callback(err, false);
		}
	});
}

//Deletes items 
function deleteItem(name, callback){
	loadJson((err, items) => {
		let itemIndex = items.findIndex(x => x.name === name);
		if (itemIndex >= 0){
			items.splice(itemIndex);
			writeJson(items);
			callback(err);
		}
		else{
			callback(err, true);	
		}
	});
}

//Gets a single item within the JSON file
function getItem(name, callback){
	loadJson((err, items) => {
		let itemIndex = items.findIndex(x => x.name === name);
		if (itemIndex >= 0){
			callback(err, items[itemIndex]);
		} else {
			callback(new Error('no item found'), null);
		}
	});
}

//Displays all items in JSON file
function getItems(callback){
	loadJson((err, item) =>{
		callback(err, item);
	});
}
