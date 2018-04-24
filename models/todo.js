var mongoose = require("mongoose");


//todo Schema
var toDoSchema = new mongoose.Schema({
	toDo: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("toDo", toDoSchema);
