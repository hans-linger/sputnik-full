import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { readFileSync } from "node:fs";
import fastifyPassport from "@fastify/passport";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import { addStrategies } from "./strategies";
import path from "node:path";
import { fastifyCors } from "@fastify/cors";
import fjwt, { JWT } from "@fastify/jwt";
import { main } from "../main";
import { configDotenv } from "dotenv";
import AuthManager from "./AuthManager";
import { JwtData } from "../../types";

declare module "fastify" {
	export interface FastifyRequest {
		jwt: JWT;
		jwtData: JwtData;
	}
	export interface FastifyInstance {
		jwtauth: any;
	}
}

configDotenv({ override: true });

const key = readFileSync(
	path.join(__dirname, "../../../data/fastify-key")
).join("");

export async function useAuth(server: FastifyInstance): Promise<void> {
	server.register(fjwt, {
		secret: process.env.JWT_SECRET ?? "",
		decoratorName: "fastifyJwt",
	});
	server.decorate("jwtauth", async (req: FastifyRequest, res: FastifyReply) => {
		req.jwt = server.jwt;
		let token = req.cookies.access_token;
		if (token == null) {
			main().auth.setData(AuthManager.createUser());
			token = req.jwt.sign({
				address: main().auth.user.address,
			});
			await main().auth.updateUserToken(main().auth.user.address, token);
		}

		try {
			const decoded = req.jwt.verify<JwtData>(token);
			req.jwtData = { token, address: decoded.address };

			if (decoded?.address != null) {
				const user = await main().auth.getUserByAddress(decoded.address);
				if (user != null) {
					main().auth.setData(user);
					req.jwtData.user = user;
					res.setCookie("access_token", token, {
						path: "/",
						httpOnly: true,
						secure: true,
					});
					return;
				}
			}

			return;
		} catch (e) {
			main().auth.setData(AuthManager.createUser());
			token = req.jwt.sign({
				address: main().auth.user.address,
			});
			await main().auth.updateUserToken(main().auth.user.address, token);
			console.error(e);
		}

		res.setCookie("access_token", token, {
			path: "/",
			httpOnly: true,
			secure: true,
		});
	});
	server.addHook("preHandler", server.jwtauth);
	server.register(fastifyCors, {
		origin: main().config.frontendHost,
		credentials: true,
	});
	addStrategies();
	await server.register(fastifyCookie, {});
	await server.register(fastifySession, {
		secret: key,
		saveUninitialized: true,
		logLevel: "debug",
	});
	await server.register(fastifyPassport.initialize());
	await server.register(
		fastifyPassport.secureSession({
			session: true,
			keepSessionInfo: true,
		})
	);
}
