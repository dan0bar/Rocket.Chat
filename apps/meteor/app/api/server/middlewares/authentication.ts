import { Request, Response, NextFunction } from 'express';

import { Users } from '../../../models/server';
import { oAuth2ServerAuth } from '../../../oauth2-server-config/server/oauth/oauth2-server';

export type AuthenticationMiddlewareConfig = {
	rejectUnauthorized: boolean;
};

export const defaultAuthenticationMiddlewareConfig = {
	rejectUnauthorized: true,
};

export function authenticationMiddleware(config: AuthenticationMiddlewareConfig = defaultAuthenticationMiddlewareConfig) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const { 'x-user-id': userId, 'x-auth-token': authToken } = req.headers;

		if (userId && authToken) {
			req.body.user = Users.findOneByIdAndLoginToken(userId, authToken);
		} else {
			req.body.user = oAuth2ServerAuth(req)?.user;
		}

		if (config.rejectUnauthorized && !req.body.user) {
			res.status(401).send('Unauthorized');
			return;
		}

		req.userId = req.body?.user?._id;

		next();
	};
}
