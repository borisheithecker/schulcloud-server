/* eslint-disable global-require */
const { Configuration } = require('@schul-cloud/commons');
const { warning } = require('../../../src/logger');

const Config = new Configuration();
Config.init(); // todo use singleton instead

const FEATURE_VIDEOCONFERENCE_ENABLED = Config.get('FEATURE_VIDEOCONFERENCE_ENABLED');

if (FEATURE_VIDEOCONFERENCE_ENABLED === true) {
	require('./index');
	require('./logic/index');
} else {
	warning('do not execute bbb tests, due FEATURE_VIDEOCONFERENCE_ENABLED has not been enabled');
}