import { FastifyInstance } from "fastify";
import passport from "@fastify/passport";
import { main } from "../core/main";
import { isTelegramAuthPayload, TwitterAuthPayload } from "../core/auth/types";

export function useAuthRoutes(server: FastifyInstance) {
	server.post("/auth/email", (req, res) => {});

	server.get(
		"/auth/google",
		passport.authenticate("google", { scope: ["profile"] })
	);

	server.get(
		"/auth/google/code",
		passport.authenticate(
			"google",
			{ scope: ["profile"], session: false },
			async (req, res) => {
				const currentUser = main().auth.user;
				try {
					const token = req.jwt.sign({
						address: currentUser.address,
						user: currentUser,
					});
					await main().auth.updateUserToken(currentUser.address, token);
					res.setCookie("access_token", token, {
						path: "/",
						httpOnly: true,
						secure: true,
					});
					res.send(currentUser);
				} catch (e) {
					console.error(e);
					res.send("");
				}
			}
		)
	);

	// server.get("/auth/twitter", passport.authenticate("twitter"));
	server.post("/auth/twitter/data", async (req, res) => {
		try {
			const payload = req.body;
			// @ts-expect-error
			delete payload.profile.provider;
			// @ts-expect-error
			payload.profile.photos = payload.profile.photos.map(p => p.value);
			// @ts-expect-error
			payload.profile.accountId = payload.profile.id;
			// @ts-expect-error
			delete payload.profile._raw;
			// @ts-expect-error
			delete payload.profile.id;
			// @ts-expect-error
			delete payload.profile._json;
			const user = await main().auth.loginOrCreateTwitter(
				payload as TwitterAuthPayload
			);
			if (user != null) {
				const token = req.jwt.sign({
					address: user.address,
				});
				await main().auth.updateUserToken(user.address, token);
				res.setCookie("access_token", main().auth.token, {
					path: "/",
					httpOnly: true,
					secure: true,
				});
			}
			res.send(user);
		} catch (e) {
			console.error(e);
			res.send("Error");
		}
	});

	server.post("/auth/telegram/data", async (req, res) => {
		const payload = req.body;
		if (isTelegramAuthPayload(payload)) {
			// create or login
			const user = await main().auth.loginOrCreateTelegram(payload);
		}
		await main().auth.updateUserToken(
			main().auth.user.address,
			main().auth.token
		);
		res.setCookie("access_token", main().auth.token, {
			path: "/",
			httpOnly: true,
			secure: true,
		});
		res.send(main().auth.user);
	});

	server.get("/auth/github", passport.authenticate("github"));
	server.get(
		"/auth/github/code",
		passport.authenticate("github", { session: false }, async (req, res) => {
			const currentUser = main().auth.user;
			const token = req.jwt.sign({
				address: currentUser.address,
			});
			await main().auth.updateUserToken(currentUser.address, token);
			res.setCookie("access_token", token, {
				path: "/",
				httpOnly: true,
				secure: true,
			});
			res.send(currentUser);
		})
	);
}
