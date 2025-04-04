import { Strategy } from "@superfaceai/passport-twitter-oauth2";

export default class TwitterAuth {
	static getStrategy(baseUrl: string): Strategy {
		return new Strategy(
			{
				clientID: process.env.TWITTER_CLIENT_ID as string,
				clientSecret: process.env.TWITTER_API_SECRET as string,
				clientType: "confidential",
				callbackURL: `${baseUrl}/auth/twitter/callback?picka-ti=materina`,
			},
			(
				accessToken: string,
				refreshToken: string,
				profile: any,
				done: (arg0: null, arg1: any) => any
			) => {
				return done(
					null,
					Object.assign(
						{},
						{ access: accessToken, refresh: refreshToken, profile }
					)
				);
			}
		);
	}
}
