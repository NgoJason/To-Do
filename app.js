var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var methodOverride = require("method-override");	
var toDo       = require("./models/todo");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var User       = require("./models/user");
var  listRoutes = require("./routes/list"),
	 authRoutes = require("./routes/index");

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
app.use(express.static(__dirname + "/public"));
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


app.use(listRoutes);
app.use(authRoutes);

app.listen(3001, () =>{
  console.log("appstarted");
});

