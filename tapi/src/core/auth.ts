import { Express } from "express";
import Passport from "../auth/passport/Passport";
import TwitterAuth from "../auth/twitter/TwitterAuth";

export default function initAuth(server: Express): void {
	Passport.addStrategy(
		"twitter",
		TwitterAuth.getStrategy(process.env.BASE_URL ?? "")
	);
	Passport.init(server);
}
