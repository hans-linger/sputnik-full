import fastifyPassport from "@fastify/passport";
import { Strategy as TwitterStrategy } from "@superfaceai/passport-twitter-oauth2/dist/strategy";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { configDotenv } from "dotenv";
import { main } from "../main";

configDotenv({ override: true });

const twitterClientId = process.env.TWITTER_CLIENT_ID ?? "";
const twitterApiKey = process.env.TWITTER_API_KEY ?? "";
const twitterSecret = process.env.TWITTER_API_SECRET ?? "";

const googleId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

const githubId = process.env.GITHUB_CLIENT_ID ?? "";
const githubSecret = process.env.GITHUB_CLIENT_SECRET ?? "";

const frontendHost = process.env.FRONTEND_HOST ?? "";

if (
	twitterClientId == null ||
	twitterApiKey == null ||
	twitterSecret == null ||
	googleId == null ||
	googleSecret == null ||
	frontendHost == null
) {
	process.exit("Provide proper config");
}

export function addStrategies() {
	fastifyPassport.registerUserSerializer(async (user: any, request) => {
		return user.id;
	});
	fastifyPassport.registerUserDeserializer(async user => user);

	fastifyPassport.use(
		"bearer",
		new BearerStrategy(
			(token: string, done: (err: any, profile: any) => void) => {
				done(null, {});
			}
		)
	);

	fastifyPassport.use(
		"twitter",
		new TwitterStrategy(
			{
				clientType: "confidential",
				clientID: twitterClientId,
				clientSecret: twitterSecret,
				callbackURL: `${frontendHost}/auth/twitter/callback`,
				scope: ["users.read"],
			},
			(
				accessToken: string,
				refreshToken: string,
				profile: any,
				done: (err: any, profile: any) => void
			) => {
				return done(null, profile);
			}
		)
	);

	fastifyPassport.use(
		"google",
		new GoogleStrategy(
			{
				clientID: googleId,
				clientSecret: googleSecret,
				callbackURL: `${frontendHost}/auth/google/callback`,
				accessType: "profile",
			},
			async (
				accessToken: string,
				refreshToken: string,
				profile: any,
				done: (err: any, profile: any) => void
			) => {
				const user = await main().auth.loginOrCreateGoogle({
					id: profile.id,
					displayName: profile.displayName,
					photos:
						profile.photos != null && profile.photos.length != 0
							? profile.photos.map((x: { value: string }) => x.value)
							: [],
					name: {
						givenName: profile?.name?.givenName ?? "",
						familyName: profile?.name.familyName ?? "",
					},
				});
				return done(null, profile);
			}
		)
	);

	fastifyPassport.use(
		"github",
		new GithubStrategy(
			{
				clientID: githubId,
				clientSecret: githubSecret,
				callbackURL: `${frontendHost}/auth/github/callback`,
			},
			async (
				accessToken: string,
				refreshToken: string,
				profile: any,
				done: any
			) => {
				const user = await main().auth.loginOrCreateGithub({
					id: profile.id,
					displayName: profile.displayName,
					photos:
						profile.photos != null && profile.photos.length != 0
							? profile.photos.map((x: { value: string }) => x.value)
							: [],
					username: profile.username,
					profileUrl: profile.profileUrl,
				});
				done(null, profile);
			}
		)
	);
}
