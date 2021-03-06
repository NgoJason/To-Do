var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var methodOverride = require("method-override");	
var toDo       = require("./models/todo");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var User       = require("./models/user");

//connect to mongoDB via mongoose
mongoose.connect("mongodb://localhost/to_do_app");

//passport setup
app.use(require("express-session")({
	secret:"Gunther and greta",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

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
app.get("/list", isLoggedIn, (req,res) => {
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
app.get("/list/new", isLoggedIn, (req, res) =>{
	res.render("new")
});

//create(route) new to do
app.post("/list", isLoggedIn, (req, res) => {
		
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
app.get("/list/:id", isLoggedIn, function(req,res){
	toDo.findById(req.params.id, function(err,foundToDo){
		if(err){
			res.redirect("/list");
		} else {
			res.render("show", {showToDo: foundToDo});
		}
	})
});

//edit route
app.get("/list/:id/edit", isLoggedIn, function(req,res){
	
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
app.delete("/list/:id", isLoggedIn, function(req,res){
	toDo.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/list");
		} else{
			res.redirect("/list");
		}
	});
});

//==============
//AUTH Routes
//==============

//show register form
app.get("/register", function(req, res){
	res.render('register');
});

//HANDLE SIGN UP LOGIC
app.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");	
		}
		passport.authenticate("local")(req,res, function(){
			res.redirect("/list");
		});
	});	
})

//show login form
app.get("/login", function(req, res){
	res.render("login");
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/list", 
	failureRedirect: "/login"
}) , function(req,res ){
	
});

//logout
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
})


//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

app.listen(3001, () =>{
  console.log("appstarted");
});

