import { Router } from "express";
import passport from "passport";

export const socialRoutes = Router();

socialRoutes.get(
	"/auth/twitter",
	passport.authenticate("twitter", {
		scope: ["tweet.read", "users.read", "offline.access"],
		keepSessionInfo: true,
		session: true,
	})
);

socialRoutes.get(
	"/auth/twitter/callback",
	passport.authenticate("twitter"),
	(req, res) => {
		const redirectUrl = process.env.REDIRECT_URL ?? "/";
		if (req.user != null) {
			//@ts-expect-error
			delete req.user._raw;
			//@ts-expect-error
			delete req.user._json;
		}
		res.redirect(
			encodeURI(`${redirectUrl}?user=` + JSON.stringify(req.user ?? ""))
		);
	}
);
