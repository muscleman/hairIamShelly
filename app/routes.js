 var Client 			= require('./models/client');
 var Appointment 		= require('./models/appointment');
 var jwt             	= require('jsonwebtoken');
 var path            	= require('path');


module.exports = function(app) {

	app.post('/api/authenticate', function(req, res){
		Client.findOne({email : req.body.email}, function(err, client){
			if (err) throw err;
			if (!client){
				return res.status(401).send({message: 'Authentication failed. User not found.'});
			} else if (client){
				//check if password matches
				client.comparePassword(req.body.password, function(err, isMatch){
					if (isMatch && !err){
						//if user is found and password is right
						var payLoad = {
							firstName : client.firstName,
							lastName : client.lastname,
							_id : client._id
						};
						//create a token
						var token = jwt.sign(payLoad, req.app.settings.superSecret, {
							expiresIn: 1440 // expires in 24 minutes
						});

						//return the information including token as JSON
						return res.status(200).send({
							token : token
						});
					} else {
						return res.status(401).send({message: 'Authentication failed. Wrong password'});
					}
				});
			}
		});
	});

	app.post('/api/register', function(req, res){
		var client = new Client(req.body);
		client.save(function(err){
			if (err){
				if (err.code === 11000){
					return res.status(403).send({message: 'Registration failed. That email already taken!'});
				}
				return res.status(403).send({message: err.message});
			} else {

					//if user is found and password is right
					var payLoad = {
						firstName : client.firstName,
						lastName : client.lastname,
						_id : client._id
					};
					//create a token
					var token = jwt.sign(payLoad, req.app.settings.superSecret, {
						expiresIn: 1440 // expires in 24 minutes
					});


					//return the information including token as JSON
					return res.status(200).send({token : token});
			}
		});
	});


	function ensureAuthorized(req, res, next){
		var token = req.headers.authorization.replace('Bearer ', '');
		if (token){
			 jwt.verify(token, req.app.settings.superSecret, function(err, decoded){
				if (err){
					return res.status(401).send({message: err});
				} else {
					res.locals.decoded = decoded;
					next();
				}
			});
		} else {
			return res.status(401).send({
				message: 'No Token provided'
			});
		}
	}

	// api ---------------------------------------------------------------------
	// get all appointments
	app.post('/api/appointments', ensureAuthorized, function(req, res) {
		// use mongoose to get all clients in the database
		Appointment.find(function(err, appointments) {
			if (err)
			{
				console.log(err);
				res.send(err);
			}
			res.json(appointments); // return all todos in JSON format
		});
	});

	//get all appointments
	app.post('/api/addAppointment', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id}, function(err, client){
			if (err)
				res.send(err);
			if (client){
				if (Appointment.findOne({_id: req.body._id}, function(err, appointment){
					if (err)
						res.send(err);
					if (!appointment){
						var newAppointment = new Appointment(req.body);
						newAppointment.backgroundColor = 'green';
						client.appointments.push(newAppointment);
						newAppointment.save(function(err, appointment){
							if (err)
								res.send(err);
							res.json(appointment);
						});
					}
				}));
			}
		});
	});

	app.post('/api/updateAppointment', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id}, function(err, client){
			if (err)
				res.send(err);
			if (client){
					var updateData = {
								title		: req.body.title,
								start		: req.body.start,
								end  		: req.body.end,
								backgroundColor : 'blue'
							};
					if (Appointment.findOneAndUpdate({_id: req.body._id}, {$set: updateData}, function(err, appointment){
						if (err)
							res.send(err);
						res.json(appointment);
					}));

			}
		});
	});

	app.post('/api/deleteAppointment', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id}, function(err, client){
			if (err)
				res.send(err);
			if (client){
				if (Appointment.remove({_id: req.body._id}, function(err, appointment){
					if (err)
						res.send(err);
					res.send(appointment);
				}));
			}
		});
	});

	// api ---------------------------------------------------------------------
	// get all clients
	app.get('/api/readClients', ensureAuthorized,  function(req, res) {
		// use mongoose to get all clients in the database
		Client.find(function(err, clients) {
			if (err)
			{
				console.log(err);
				res.send(err);
			}
			res.json(clients); // return all clients in JSON format
		});
	});

	app.get('/api/readClient', ensureAuthorized,  function(req, res) {
		// use mongoose to get all clients in the database
		Client.findOne({_id: res.locals.decoded._id}, function(err, client) {
			if (err)
			{
				res.send(err);
			}
			res.json(client); // return all clients in JSON format
		});
	});

	app.post('/api/addClient', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id}, function(err, client){
			if (err)
				res.send(err);
			var newClient = {};
			if (!client){
				newClient = new Client(req.body);
				newClient.password = bcrypt.hashSync('1234', bcrypt.genSaltSync(10));
				newClient.save(function(err, client){
					if (err)
					{
						res.send(err);
					}
					res.json(client);
				});

			} else {
				res.json(client);
			}
		});
	});

	app.post('/api/updateClient', ensureAuthorized, function(req, res) {
		var updateData = {
					firstName				: req.body.firstName,
					lastName				: req.body.lastName,
					dob						: req.body.dob,
					date        			: req.body.date,
					phoneHome				: req.body.phoneHome,
					phoneWork				: req.body.phoneWork,
					address					: req.body.address,
					city					: req.body.city,
					state					: req.body.state,
					zip						: req.body.zip,
					cell					: req.body.cell,
					email					: req.body.email,
					occupation				: req.body.occupation,
					employer				: req.body.employer,
					preferredAptDay			: req.body.preferredAptDay,
					time					: req.body.time,
					allergies				: req.body.allergies,
					commonHairProducts 		: req.body.commonHairProducts,
					commonRetailProducts 	: req.body.commonRetailProducts,
					referred				: req.body.referred,
					clientRemarks 			: req.body.clientRemarks
				};
		if (Client.findOneAndUpdate({_id: req.body._id}, {$set: updateData}, function(err, client){
			if (err)
				res.send(err);
			res.json(req.body);
		}));
	});

	app.post('/api/deleteClient', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id}, function(err, client){
			if (err)
				res.send(err);
			if (client){
				if (Client.remove({_id: res.locals.decoded._id}, function(err, appointment){
					if (err)
						res.send(err);
					res.send(appointment);
				}));
			}
		});
	});

	// application -------------------------------------------------------------
	app.get('/*', function(req, res) {
		//res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
		res.sendFile(path.resolve('public/index.html'));
	});
};