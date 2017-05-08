'use strict';

const request = require('request-promise-native');
const hooks = require('./hooks');

const REQUEST_TIMEOUT = 4000; // in ms

function toQueryString(paramsObject) {
	return Object
		.keys(paramsObject)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
		.join('&');
}

/**
 * Converts the Server-Request-Body to JsonApi-Body
 * @param body
 * @returns {object} - valid json-api body for calendar-service
 */
const convertEventToJsonApi = (body) => {
	return {
		data: [
			{
				type: "event",
				attributes: {
					summary: body.summary,
					location: body.location,
					description: body.description,
					dtstart: body.startDate,
					dtend: body.endDate || new Date(new Date(body.startDate).getTime() + body.duration).toISOString(),
					dtstamp: new Date,
					transp: "OPAQUE",
					sequence: 0,
					repeat_freq: body.frequency,
					repeat_wkst: body.weekday,
					repeat_until: body.repeat_until
				},
				relationships: {
					"scope-ids": [
						body.scopeId
					],
					"separate-users": true
				}
			}
		]
	};
};

class Service {
	constructor(options) {
		this.options = options || {};
	}

	create(data, params) {

		const serviceUrls = this.app.get('services') || {};

		const userId = (params.account ||{}).userId || params.payload.userId;
		const options = {
			uri: serviceUrls.calendar + '/events/',
			method: 'POST',
			headers: {
				'Authorization': userId
			},
			body: convertEventToJsonApi(data),
			json: true,
			timeout: REQUEST_TIMEOUT
		};

		return request(options).then(events => {
			events = (events.data || []).map(event => {
				return Object.assign(event, {
					title: event.summary,
					allDay: false, // TODO: find correct value
					start: Date.parse(event.dtstart),
					end: Date.parse(event.dtend),
					url: '' // TODO: add x-sc-field
				});
			});
			return events;
		});
	}

	find(params) {

		const serviceUrls = this.app.get('services') || {};

		const query = params.query;
		if(!('all' in query)) query.all = true;

		const userId = (params.account ||{}).userId || params.payload.userId;
		const options = {
			uri: serviceUrls.calendar + '/events?' + toQueryString(params.query),
			headers: {
				'Authorization': userId
			},
			json: true,
			timeout: REQUEST_TIMEOUT
		};

		return request(options).then(events => {
			events = (events.data || events || []).map(event => {
				return Object.assign(event, {
					title: event.summary,
					allDay: false, // TODO: find correct value
					start: Date.parse(event.dtstart),
					end: Date.parse(event.dtend)
				});
			});
			return events;
		});
	}

	setup(app, path) {
		this.app = app;
	}
}

module.exports = function () {
	const app = this;

	// Initialize our service with any options it requires
	app.use('/calendar', new Service());

	// Get our initialize service to that we can bind hooks
	const contentService = app.service('/calendar');

	// Set up our before hooks
	contentService.before(hooks.before);

	// Set up our after hooks
	contentService.after(hooks.after);
};

module.exports.Service = Service;
