const AdminUsers = require('./AdminUsers');
const UserLinkImportService = require('./UserLinkImportService');
const SkipRegistrationService = require('./SkipRegistration');
const RegistrationSchoolService = require('./registrationSchool');
const UsersModelService = require('./UsersModelService');
const UserService = require('./userService');
const MailRegistrationLink = require('./MailRegistrationLink');
const { RegistrationConsentService, registrationConsentServiceHooks } = require('./registrationConsent');

module.exports = {
	AdminUsers,
	UserLinkImportService,
	SkipRegistrationService,
	RegistrationSchoolService,
	UsersModelService,
	UserService,
	MailRegistrationLink,
	RegistrationConsentService,
	registrationConsentServiceHooks,
};
