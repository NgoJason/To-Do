var express = require('express');
var router = express.Router();
var toDo       = require("../models/todo");

//index page
router.get("/list", isLoggedIn, (req,res) => {
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
router.get("/list/new", isLoggedIn, (req, res) =>{
	res.render("new")
});

//create(route) new to do
router.post("/list", isLoggedIn, (req, res) => {
		
	//get data and add to list array
	var toDoVar = req.body.todo;
	var author = {
		id:req.user._id,
		username: req.user.username
	}	
	var newToDo = { toDo: toDoVar, author: author}	
	//create new to do and add to DB
	
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
router.get("/list/:id", isLoggedIn, function(req,res){
	toDo.findById(req.params.id, function(err,foundToDo){
		if(err){
			res.redirect("/list");
		} else {
			res.render("show", {showToDo: foundToDo});
		}
	})
});

//edit route
router.get("/list/:id/edit", checkListOwnership, function(req,res){			  
  toDo.findById(req.params.id, function(err, foundToDo){
	 res.render("edit", {showToDo: foundToDo});
  });			
});

//update route
router.put("/list/:id", checkListOwnership, function(req,res){
	 toDo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updated){
		if(err){
			res.send("error");
		} else {
			res.redirect("/list");
		}
	});
});

//delete route
router.delete("/list/:id", checkListOwnership, function(req,res){
	toDo.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/list");
		} else{
			res.redirect("/list");
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

function checkListOwnership(req, res, next){
	//is user logged in
		if(req.isAuthenticated()){
		  
		  toDo.findById(req.params.id, function(err, foundToDo){
			if(err){
			res.redirect("back");

			} else {
				//does user own list?
				if(foundToDo.author.id.equals(req.user._id)){
				  next();
				} else {
				  res.redirect("back");	
				}
				
			}
		  });		
		} else {
			res.redirect("back");
		}
}

module.exports = router;