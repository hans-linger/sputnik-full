export enum SocketEventTypes {
	Authorize = "Authorize",
	Logout = "Logout",
	AuthOk = "AuthOk",
	AuthFail = "AuthFail",
	UserOnline = "UserOnline",
	UserOffline = "UserOffline",
	OfferCreated = "OfferCreated",
	OfferRevoked = "OfferRevoked",
	BargainProposed = "BargainProposed",
	BargainRejected = "BargainRejected",
	BargainRevoked = "BargainRevoked",
	BargainAccepted = "BargainAccepted",
}

export type SocketEvent = {
	type: SocketEventTypes;
	data: any;
};

export function isSocketEvent(obj: any): obj is SocketEvent {
	return (
		obj != null &&
		typeof obj === "object" &&
		["type", "data"].every(x => x in obj) &&
		obj["type"] in SocketEventTypes
	);
}

export type SocketEventHandler = (data: any) => void | Promise<void>;
