var bcrypt				= require('bcryptjs');

var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  ObjectId = Schema.ObjectId;


var clientSchema = new Schema({
	_id							: {type: mongoose.Schema.Types.ObjectId, index: true, required: true, auto: true},
	firstName					: {type: String, required: true},
	lastName					: {type: String, required: true},
	password					: {type: String, required: true},
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
	email						: {type: String, required: true, unique: true},
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

clientSchema.path('email').validate(function(value, done){
	this.model('Client').count({'email' : value}, function(err, count){
		if (err) {
			return done(err);
		}
		done(!count);
	});
	} ,	
	'Email already exists');


clientSchema.pre('save', function(next){
	var client = this;
	if (this.isModified('password') || this.isNew){
		bcrypt.genSalt(10, function(err, salt){
			if (err){
				return next(err);
			}
			bcrypt.hash(client.password, salt, function(err, hash){
				if (err){
					return next(err);
				}
				client.password = hash;
				next();
			});
		});
	} else{
		return next();
	}
});


clientSchema.methods.comparePassword = function(password, callBack){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if (err){
			return callBack(err);
		}
		callBack(null, isMatch);
	});
};


module.exports = mongoose.model('Client', clientSchema);
