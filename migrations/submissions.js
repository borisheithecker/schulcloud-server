const database = require('../src/utils/database');
	const [refOwnerModel, owner] = doc.key.split('/');
	database.connect();