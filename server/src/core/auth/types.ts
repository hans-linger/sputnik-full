import { Balance } from "@prisma/client";

export type User = {
	id?: string; // MongoDB id
	address: string;
	email: string | null;
	twitter: TwitterProfile | null;
	google: GoogleProfile | null;
	github: GithubProfile | null;
	telegram: TelegramProfile | null;
	addresses: { chainId: string; address: string; balances: Balance[] }[];
};

export type TwitterAuthPayload = {
	access: string;
	refresh: string;
	profile: TwitterProfile;
};

export type TelegramAuthPayload = {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	photo_url: string;
	auth_date: number;
	hash: string;
};

export type TelegramProfile = {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	photos: string[];
};

export function isTelegramAuthPayload(
	obj: unknown
): obj is TelegramAuthPayload {
	return (
		obj != null &&
		typeof obj === "object" &&
		["id", "first_name", "last_name", "username", "photo_url", "hash"].every(
			x => x in obj
		)
	);
}

export type TwitterProfile = {
	accountId: string;
	username: string;
	displayName: string;
	photos: string[];
};

export type GoogleProfile = {
	id: string;
	displayName: string;
	photos: string[];
	name: {
		familyName: string;
		givenName: string;
	};
};

export type GithubProfile = {
	id: string;
	displayName: string;
	username: string;
	profileUrl: string;
	photos: string[];
};
