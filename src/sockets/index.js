/**
 * 
 * not used write now. Is part of a Masterthesis 
 * and creates problems with other socket connections, 
 * implmentation have to be profe 
 * 	
 * 
 */
const socketio = require('@feathersjs/socketio');
const clipboard = require('./clipboard');

module.exports = (app) => {
	//const app = this;

	// configure your socket here
	// make use of a namespace io.of('<namespace>') and connect it as <url>/<namespace>;
	/*app.configure(clipboard);


	app.configure(socketio((io) => {
	io.use((socket, next) => {
			app.passport.authenticate('jwt')(socket.handshake)
				.then((payload) => {
					socket.client.userId = payload.data.account.userId;
					next();
				})
				.catch((error) => {
					next(new Error('Authentication error'));
				});
		});*/
	}));
};
