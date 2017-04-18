 var Client 			= require('./models/client');
 var Appointment 		= require('./models/appointment');
 var jwt             	= require('jsonwebtoken');
 var path            	= require('path');
 var _   				= require('lodash');
 


module.exports = function(app) {

	app.post('/api/authenticate', function(req, res){
		 Client.findOne({email : {$regex: req.body.email, $options: "i"}}).select('+password').exec()
			.then(function(client){
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
			})
			.catch(function(err){
				if (err) throw err;

			});
	});

	app.post('/api/register', function(req, res){
		var client = new Client(req.body);
		client.save()
			.then(function(data){
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
			})
			.catch(function(err){
				if (err.code === 11000){
					return res.status(403).send({message: 'Registration failed. That email already taken!'});
				}
				return res.status(403).send({message: err.message});
			});
	});


	function ensureAuthorized(req, res, next){
		var token;
		if (_.has(req, 'headers.authorization'))
			token = req.headers.authorization.replace('Bearer ', '');
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

	// api Appointments---------------------------------------------------------------------
	// get all appointments
	app.get('/api/appointment', ensureAuthorized, function(req, res) {
		// use mongoose to get all clients in the database
		Appointment.find()
		.then(function(appointments) {
			res.json(appointments); // return all todos in JSON format
		})
		.catch(function(err){
			if (err)
			{
				console.log(err);
				res.send(err);
			}
			
		});
	});

	app.post('/api/appointment', ensureAuthorized, function(req, res) {
		// console.log(res.locals.decoded._id);
		// console.log(req.body);
		// return res.status(304).send({message: 'Forced Error!'});
		Client.findOne({_id: res.locals.decoded._id})
			.then(function(client){
				if (client){
					Appointment.findOne({_id: req.body._id})
						.then(function(appointment){
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
						})
						.catch(function(err){
							if (err)
								res.send(err);
						});				
				}
			})
			.catch(function(err){
				if (err)
					res.send(err);
			});
	});

	//update existing appointment
	app.put('/api/appointment', ensureAuthorized, function(req, res) {
		// return res.status(304).send({message: 'Forced Error!'});
		Client.findOne({_id: res.locals.decoded._id})
			.then(function(client){
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
			})
			.catch(function(err){
				if (err)
					res.send(err);

			});
	});

	//delete appointment
	app.delete('/api/appointment', ensureAuthorized, function(req, res) {
		// console.log(req.query._id);
		//return res.status(304).send({message: 'Forced Error!'});
		Client.findOne({_id: res.locals.decoded._id})
			.then(function(client){
				if (client){
					if (Appointment.remove({_id: req.query._id})
						.then(function(appointment){
							res.send(appointment);
						})
						.catch(function(err){
							if (err)
								res.send(err);

						}));
				}
			})
			.catch(function(err){
				if (err)
					res.send(err);
			});
	});

	// api Appointments---------------------------------------------------------------------

	// api Clients---------------------------------------------------------------------
	//get all clients
	// app.get('/api/clients', ensureAuthorized,  function(req, res) {
	// 	// use mongoose to get all clients in the database
	// 	Client.find()
	// 		.then(function(clients) {
	// 			res.json(clients); // return all clients in JSON format
	// 		})
	// 		.catch(function(err){
	// 			if (err)
	// 			{
	// 				console.log(err);
	// 				res.send(err);
	// 			}

	// 		});
	// });


	app.get('/api/clients', function(req, res) {
		// use mongoose to get all clients in the database
		Client.find().sort('firstName').exec()
			.then(function(clients) {
				var v = _(clients)
						.groupBy(function(x){
							return x.firstName.charAt(0);
						})
						.map(function(value, key){
							return {
								letter: key,
								clients: value
							};
						})
						.value();
					
				console.log(v);
				res.json(v); // return all clients in JSON format
			})
			.catch(function(err){
				if (err)
				{
					console.log(err);
					res.send(err);
				}

			});
	});

	//update existing client
	app.put('/api/client', ensureAuthorized, function(req, res) {
		console.log(req.body.admin);
		var updateData = {
					firstName				: req.body.firstName,
					lastName				: req.body.lastName,
					admin					: req.body.admin,
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
		if (Client.findOneAndUpdate({_id: req.body._id}, {$set: updateData})
			.then(function(client){
				res.json(req.body);
			})
			.catch(function(err){
				if (err)
					res.send(err);

			})
		);
	});

	//delete client
	app.delete('/api/client', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id})
			.then(function(client){
				if (client){
					if (Client.remove({_id: res.locals.decoded._id}, function(err, appointment){
						if (err)
							res.send(err);
						res.send(appointment);
					}));
				}
			})
			.catch(function(err){
				if (err)
					res.send(err);

			});
	});


	//get one client
	app.get('/api/client', ensureAuthorized,  function(req, res) {
		//console.log('/api/client');
		Client.findOne({_id: res.locals.decoded._id})
			.then(function(client) {
				console.log(client.dob);
				res.json(client); // return client in JSON format
			})
			.catch(function(err){
				if (err)
					res.send(err);
			});
	});

	//add new client
	app.post('/api/client', ensureAuthorized, function(req, res) {
		Client.findOne({_id: res.locals.decoded._id})
			.then(function(client){
				var newClient = {};
				if (!client){
					newClient = new Client(req.body);
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
			})
			.catch(function(err){
				if (err)
					res.send(err);

			});
	});

	// application -------------------------------------------------------------
	app.get('/*', function(req, res) {
		res.sendFile(path.resolve('public/index.html'));// load the single view file (angular will handle the page changes on the front-end)
	});
};