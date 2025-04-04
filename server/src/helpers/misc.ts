import { Balance } from "@prisma/client";

export function nonEmptyString(str: any): boolean {
	return typeof str === "string" && str.length > 0;
}

export function cleanNumericParam(
	param?: string,
	defaultValue?: number
): number {
	if (param == null) {
		return defaultValue ?? 0;
	}
	let res = parseInt(param);
	if (!isNaN(res)) {
		return res;
	}
	return defaultValue ?? 0;
}

export function balanceToFloat(balance: {
	denom: string;
	amount: string;
}): Balance {
	return {
		denom: balance.denom,
		amount: parseFloat(balance.amount),
	};
}
