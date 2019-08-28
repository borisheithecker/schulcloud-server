const feathersSwagger = require('feathers-swagger');
const path = require('path');

module.exports = function swaggerSetup(app) {
	app.configure(feathersSwagger({
		/* example configuration */
		docsPath: '/docs',
		basePath: '/',
		host: '',
		uiIndex: path.join(__dirname, 'swagger.html'),
		securityDefinitions: {
			bearer: {
				type: 'apiKey',
				name: 'Authorization',
				in: 'header',
			},
		},
		security: [
			{
				bearer: [],
			},
		],
		specs: {
			schemes: ['http', 'https'],
			info: {
				title: 'Schul-Cloud API',
				description: 'This is the Schul-Cloud API.',
				termsOfServiceUrl: 'https://github.com/schulcloud/schulcloud-server/blob/master/LICENSE',
				contact: {
					name: 'support',
					email: 'info@schul-cloud.org',
				},
				license: {
					name: 'GPL-3.0',
					url: 'https://github.com/schulcloud/schulcloud-server/blob/master/LICENSE',
				},
				version: '0.0.1',
			},
		},
	}));
};
