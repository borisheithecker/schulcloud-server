/* eslint-disable global-require */
const mailHooks = require('./hooks/mails');

module.exports = function setup() {
	const app = this;

	const MailService = require('./service')(app);
	const HashService = require('./hash')(app);

	app.use('/mails', new MailService());
	app.use('/hash', new HashService());

	app.service('/mails').hooks(mailHooks);
};
