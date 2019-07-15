const { FilePermissionModel } = require('../model');
const RoleModel = require('../../role/model');
const { teamsModel } = require('../../teams/model');

const createPermission = (refId, refPermModel = 'user', permissions) => {
	const newPermission = new FilePermissionModel({
		refId,
		refPermModel,
	});
	// override permissions
	if (permissions) {
		Object.entries(permissions).forEach(([key, value]) => {
			newPermission[key] = value;
		});
	}

	return newPermission;
};

const getRoles = () => RoleModel.find({
	$or: [
		{ name: 'student' },
		{ name: 'teacher' },
	],
})
	.lean()
	.exec();

const getRoleIdByName = (roles, name) => {
	const role = roles.find(r => r.name === name);
	return role._id;
};

const setRefId = (perm) => {
	if (!perm.refId) {
		perm.refId = perm._id;
	}
	return perm;
};

const courseHandler = async (permissions, studentCanEdit) => {
	const roles = await getRoles();
	const studentRoleId = getRoleIdByName(roles, 'student');
	const teacherRoleId = getRoleIdByName(roles, 'teacher');

	permissions.push(createPermission(
		studentRoleId,
		'role',
		{
			write: Boolean(studentCanEdit),
			create: false,
			delete: false,
		},
	));

	permissions.push(createPermission(
		teacherRoleId,
		'role',
		{
			create: false,
			delete: false,
		},
	));

	return permissions;
};

const teamHandler = async (owner) => {
	const [teamObject, teamRoles] = await Promise.all([
		teamsModel.findOne({ _id: owner }).lean().exec(),
		RoleModel.find({ name: /^team/ }).lean().exec(),
	]);
	const { filePermission: defaultPermissions } = teamObject;

	return teamRoles.map(({ _id: roleId }) => {
		const defaultPerm = defaultPermissions.find(({ refId }) => roleId.equals(refId));

		return defaultPerm || createPermission(roleId, 'role');
	});
};

const createDefaultPermissions = async (userId, type, { studentCanEdit, sendPermissions = [], owner }) => {
	let permissions = [createPermission(userId)];
	let teamDefaultPermissions = [];

	if (type === 'course') {
		permissions = await courseHandler(permissions, studentCanEdit);
	} else if (type === 'teams' && sendPermissions.length <= 0) {
		teamDefaultPermissions = await teamHandler(owner);
	}

	return [...permissions, ...sendPermissions, ...teamDefaultPermissions].map(setRefId);
};

module.exports = {
	createPermission,
	createDefaultPermissions,
};
