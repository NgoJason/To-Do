var mongoose = require("mongoose");


//todo Schema
var toDoSchema = new mongoose.Schema({
	toDo: String
});

module.exports = mongoose.model("toDo", toDoSchema);
