'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const helpdeskService = app.service('helpdesk');
const chai = require('chai');

describe('helpdesk service', function() {

	const testProblem =
		{
			_id: '5836bb5664582c35df3bc215',
			subject: 'Dies ist ein Titel',
			currentTarget: 'Dies ist der CurrentState',
			targetState: 'Dies ist der TargetState',
			category: 'dashboard',
			schoolId: '5836bb5664582c35df3bc000'
		};

	before(function (done) {
		this.timeout(10000);
		helpdeskService.create(testProblem)
			.then(result => {
				done();
			});
	});


	after(function(done) {
		helpdeskService.remove(testProblem)
			.then(result => {
				done();
			});
	});

	it('registered the helpdesk service', () => {
		assert.ok(helpdeskService);
	});

	it('POST /helpdesk with valid data', () => {

		let postBody = {
			_id: '5836bb5664582c35df3bc215',
			subject: 'Dies ist ein Titel',
			currentTarget: 'Dies ist der CurrentState',
			targetState: 'Dies ist der TargetState',
			category: 'dashboard',
			schoolId: '5836bb5664582c35df3bc000'
		};

		return helpdeskService.create(postBody, { payload: {userId: '0000d213816abba584714c0a'}})
			.then(result => {
				assert.equal(result.statusCode, 200);
				assert.equal(result.data.id, '59199dbe8d4be221143cc866');
			}
		);
	});

	it('POST /helpdesk with invalid data', () => {

		let postBody = {
			_id: '5836bb5664582c35df3bc215',
			subject: 'Dies ist ein Titel',
			currentTarget: 'Dies ist der CurrentState',
			targetState: 'Dies ist der TargetState',
			category: 'dashboard'
		};

		return helpdeskService.create(postBody, { payload: {userId: '0000d213816abba584714c0a'}})
			.then(result => {
				assert.equal(result.statusCode, 500);
			}
		);
	});
});

