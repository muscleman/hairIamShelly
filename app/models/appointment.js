var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  ObjectId = Schema.ObjectId;


var appointmentSchema = Schema({
	date 				: Date,
	title				: String,
	allDay				: Boolean,
	start				: Date,
	end  				: Date,
	editable			: {type: Boolean, default: true},
	startEditable		: {type: Boolean, default: true},
	durationEditable	: {type: Boolean, default: true},
	resourceEditable	: {type: Boolean, default: true},
	rendering			: String,
	overlap				: {type: Boolean, default: false},
	color  				: {type: String, default: 'blue'},
	backgroundColor		: {type: String, default: 'red'},
	borderColor			: {type: String, default: 'black'},
	textColor			: {type: String, default: 'white'},
});

module.exports = mongoose.model('Appointment', appointmentSchema);
