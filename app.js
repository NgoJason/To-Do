var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var methodOverride = require("method-override");	

//connect to mongoDB via mongoose
mongoose.connect("mongodb://localhost/to_do_app");

//todo Schema
var toDoSchema = new mongoose.Schema({
	toDo: String
});

var toDo = mongoose.model("toDo", toDoSchema);

/*toDo.create({
	toDo: "lots of coding"

}, function(err,todo){
	if(err){
		console.log("ERROR");
		console.log(err);
	} else {
		console.log("Here is your new toDo");
		console.log(todo);
	}
});*/

//set up method override
app.use(methodOverride("_method"));

//set up body parser
app.use(bodyParser.urlencoded({extended: true}));

//set ejs files to shorten
app.set("view engine", "ejs");

//launch landing page
app.get("/", (req, res) => {
	res.render("landing");
});

//index page
app.get("/list", (req,res) => {
    //get all to dos from database
    toDo.find({}, function(err, todos){
    	if(err){
    		console.log("could not retrieve data from DB");
    		console.log(err);
    	} else {
    		res.render("list", {list:todos}); 
    	}
    });
     
       	
});

//form to create new to do
app.get("/list/new", (req, res) =>{
	res.render("new")
});

//create(route) new to do
app.post("/list", (req, res) => {
		
	//get data and add to list array
	var toDoVar = req.body.todo;	
	var newToDo = { toDo: toDoVar}	
	//create new to do and add to db
	toDo.create(newToDo, function(err, newToDoItem){
		if(err){
			console.log(err);
		} else {
			//redirect to list page
			res.redirect("/list");
		}
	});
	
});

//show route
app.get("/list/:id", function(req,res){
	toDo.findById(req.params.id, function(err,foundToDo){
		if(err){
			res.redirect("/list");
		} else {
			res.render("show", {showToDo: foundToDo});
		}
	})
});

//edit route
app.get("/list/:id/edit", function(req,res){
	
	toDo.findById(req.params.id, function(err, foundToDo){
		if(err){
			res.redirect("/list");

			} else {
				res.render("edit", {showToDo: foundToDo});
			}
	});
});

//update route
app.put("/list/:id", function(req,res){
	 toDo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updated){
		if(err){
			res.send("error");
		} else {
			res.redirect("/list");
		}
	});
});

//delete route
app.delete("/list/:id",function(req,res){
	toDo.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/list");
		} else{
			res.redirect("/list");
		}
	});
});

app.listen(3000, () =>{
  console.log("appstarted");
});

