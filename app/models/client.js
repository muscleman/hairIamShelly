var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  ObjectId = Schema.ObjectId;


var clientSchema = new Schema({
	_id							: {type: mongoose.Schema.Types.ObjectId, index: true, required: true, auto: true},
	firstName					: String,
	lastName					: String,
	password					: String,
	admin						: Boolean,
	dob							: Date,
	date        				: {type: Date, default: Date.now},
	phoneHome					: String,
	phoneWork					: String,
	address						: String,
	city						: String,
	state						: String,
	zip							: String,
	cell						: String,
	email						: {type: String, unique: true},
	occupation					: String,
	employer					: String,
	preferredAptDay				: String,
	time						: String,
	allergies					: String,
	commonHairProducts 			: String,
	commonRetailProducts 		: String,
	referred					: String,
	clientRemarks 				: String,
	active						: {type: Boolean, default: true},
	appointments 				: [{type: Schema.Types.ObjectId, ref: 'Appointment'}]
});


module.exports = mongoose.model('Client', clientSchema);
