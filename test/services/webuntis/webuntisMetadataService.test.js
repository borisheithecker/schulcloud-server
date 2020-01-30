const { expect } = require('chai');

const app = require('../../../src/app');
const testObjects = require('../helpers/testObjects')(app);

const webuntisMetadataService = app.service('webuntisMetadata');
const { webuntisMetadataModel } = require('../../../src/services/webuntis/model');
const { datasourceRunModel } = require('../../../src/services/datasources/model');

describe('webuntis metadata service', () => {
	let server;
	before((done) => {
		server = app.listen(0, done);
	});

	after((done) => {
		server.close(done);
		testObjects.cleanup();
	});

	it('registered the webuntis metadata service', () => {
		expect(app.service('webuntisMetadata')).to.not.be.undefined;
	});

	it('internal call can CREATE metadata', async () => {
		const datasource = await testObjects.createTestDatasource({
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const createResult = await webuntisMetadataService.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'mathe',
		});
		expect(createResult).to.not.be.undefined;
		expect(createResult.datasourceRunId).to.equal(run._id);

		await webuntisMetadataModel.deleteOne({ _id: createResult._id }).lean().exec();
		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('internal call can FIND metadata', async () => {
		const datasource = await testObjects.createTestDatasource({
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const metadata = await webuntisMetadataModel.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'deutsch',
		});

		const result = await webuntisMetadataService.find({ query: { datasourceRunId: run._id } });

		expect(result).to.not.be.undefined;
		expect(Array.isArray(result.data)).to.be.true;
		expect(result.total).to.eq(1);

		await webuntisMetadataModel.deleteOne({ _id: metadata._id }).lean().exec();
		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('internal call can GET metadata', async () => {
		const datasource = await testObjects.createTestDatasource({
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const metadata = await webuntisMetadataModel.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'sport',
		});

		const result = await webuntisMetadataService.get(metadata._id);

		expect(result).to.not.be.undefined;
		expect(result.datasourceRunId.toString()).to.eq(run._id.toString());

		await webuntisMetadataModel.deleteOne({ _id: metadata._id }).lean().exec();
		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('internal call can REMOVE metadata', async () => {
		const datasource = await testObjects.createTestDatasource({
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const metadata = await webuntisMetadataModel.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'kunst',
		});

		const result = await webuntisMetadataService.remove(metadata._id);
		expect(result).to.not.be.undefined;

		const checkResult = await webuntisMetadataModel.findById(metadata._id);
		expect(checkResult).to.be.null;

		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('admin can FIND metadata belonging to his school.', async () => {
		const school = await testObjects.createTestSchool();
		const admin = await testObjects.createTestUser({ roles: ['administrator'], schoolId: school._id });
		const datasource = await testObjects.createTestDatasource({
			schoolId: admin.schoolId,
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const metadata = await webuntisMetadataModel.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'Traumdeutung',
		});
		const params = await testObjects.generateRequestParamsFromUser(admin);
		params.query = { datasourceRunId: run._id };
		const result = await webuntisMetadataService.find(params);
		expect(result).to.not.be.undefined;
		expect(Array.isArray(result.data)).to.be.true;
		expect(result.total).to.eq(1);
		expect(result.data[0].datasourceRunId.toString()).to.eq(run._id.toString());

		await webuntisMetadataModel.deleteOne({ _id: metadata._id }).lean().exec();
		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('admin can not GET metadata.', async () => {
		const school = await testObjects.createTestSchool();
		const admin = await testObjects.createTestUser({ roles: ['administrator'], schoolId: school._id });
		const datasource = await testObjects.createTestDatasource({
			schoolId: admin.schoolId,
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const metadata = await webuntisMetadataModel.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'physik',
		});
		const params = await testObjects.generateRequestParamsFromUser(admin);
		try {
			await webuntisMetadataService.get(metadata._id, params);
			throw new Error('should have failed');
		} catch (err) {
			expect(err.message).to.not.equal('should have failed');
			expect(err.code).to.eq(405);
		}
		await webuntisMetadataModel.deleteOne({ _id: metadata._id }).lean().exec();
		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('admin can not FIND metadata belonging to a different scool', async () => {
		const userSchool = await testObjects.createTestSchool();
		const datasourceSchool = await testObjects.createTestSchool();
		const admin = await testObjects.createTestUser({ roles: ['administrator'], schoolId: userSchool._id });
		const datasource = await testObjects.createTestDatasource({
			schoolId: datasourceSchool._id,
			config: { target: 'none' },
			name: 'datasource',
		});
		const run = await app.service('datasourceRuns').create({ datasourceId: datasource._id });
		const metadata = await webuntisMetadataModel.create({
			datasourceRunId: run._id,
			teacher: 'Renz',
			class: '2a',
			room: '0-23',
			subject: 'Telekinetik',
		});
		const params = await testObjects.generateRequestParamsFromUser(admin);
		params.query = { datasourceRunId: run._id };
		try {
			await webuntisMetadataService.find(params);
			throw new Error('should have failed');
		} catch (err) {
			expect(err.message).to.not.equal('should have failed');
			expect(err.code).to.eq(404);
		}

		await webuntisMetadataModel.deleteOne({ _id: metadata._id }).lean().exec();
		await datasourceRunModel.deleteOne({ _id: run._id }).lean().exec();
	});

	it('admin can not CREATE metadata');

	it('admin can not REMOVE metadata');

	it('admin can not UPDATE metadata');

	it('admin can not PATCH metadata');
});
