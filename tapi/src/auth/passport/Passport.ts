import passport from "passport";
import { Strategy } from "@superfaceai/passport-twitter-oauth2";
import { Express } from "express";
import session from "express-session";

declare module "express-session" {
	interface SessionData {
		redirectOnSuccess?: string;
	}
}

export default class Passport {
	static init(server: Express): void {
		passport.serializeUser(function (user, done) {
			done(null, user);
		});
		passport.deserializeUser(function (obj: Express.User, done) {
			done(null, obj);
		});

		server.use(passport.initialize());
		server.use(
			session({
				secret: process.env.SESSION_SECRET ?? "oh you are cute",
				resave: false,
				saveUninitialized: true,
				cookie: { maxAge: 60000 },
			})
		);
	}

	static addStrategy(name: string, strategy: Strategy): void {
		passport.use(name, strategy);
	}
}
