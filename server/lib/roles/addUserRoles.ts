import _ from 'underscore';

import type { IRole, IUser } from '../../../definition/IUser';
import type { IRoom } from '../../../definition/IRoom';
import { Users, Roles } from '../../../app/models/server/raw';
import { DetailedError } from '../../../lib/utils/DetailedError';
import { insertRole } from './insertRole';

export const addUserRolesAsync = async (userId: IUser['_id'], roleIds: IRole['_id'][], scope?: IRoom['_id']): Promise<boolean> => {
	if (!userId || !roleIds?.length) {
		return false;
	}

	const user = await Users.findOneById(userId);
	if (!user) {
		throw new DetailedError('error-invalid-user', 'Invalid user', {
			function: 'RocketChat.authz.addUserRoles',
		});
	}

	// if (!Array.isArray(roleIds)) {
	// 	// TODO: remove this check
	// 	roleIds = [roleIds];
	// }

	const options = {
		projection: {
			_id: 1,
		},
	};

	const existingRoles = await Roles.findByNames<Pick<IRole, '_id'>>(roleIds, options).toArray();
	const existingRoleIds = _.pluck(existingRoles, '_id');
	const invalidRoleIds = _.difference(roleIds, existingRoleIds);

	for (const role of invalidRoleIds) {
		if (!role) {
			continue;
		}

		insertRole({
			name: role,
			description: '',
			protected: false,
			scope: 'Users',
		});
	}

	await Roles.addUserRoles(userId, roleIds, scope);
	return true;
};

export const addUserRoles = (...args: Parameters<typeof addUserRolesAsync>): boolean => Promise.await(addUserRolesAsync(...args));