export type ServerResponse = {
	status: "success" | "error";
	data: never;
};

export type ServerError = {
	status: "error";
	message: string;
};

export type ServerSuccess = {
	status: "success";
	data?: object;
};

export function isServerReply(obj: unknown): obj is ServerResponse {
	return (
		obj != null &&
		typeof obj === "object" &&
		"status" in obj &&
		["message", "data"].some((x) => x in obj)
	);
}

export function isServerError(obj: unknown): obj is ServerError {
	return isServerReply(obj) && "message" in obj && typeof obj["message"] === "string";
}

export function isServerSuccess(obj: unknown): obj is ServerSuccess {
	return isServerReply(obj) && obj["status"] === "success";
}

export function nonEmptyString(str: unknown): boolean {
	return typeof str === "string" && str.length > 0;
}

export async function timeout(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
