import IconHelper from "@/core/helpers/Icons";

export class Currency {
	readonly name: string;
	constructor(name: string) {
		this.name = name;
	}
}

export default class Asset {
	readonly name: string;
	readonly title: string;
	readonly currency: Currency;
	balance?: number;

	constructor(name: string, title: string, currency: Currency, balance?: number) {
		this.name = name;
		this.title = title;
		this.currency = currency;
		this.balance = Math.random() * Math.pow(10, Math.random() * 5);
	}

	get iconFilename(): string {
		return IconHelper.get("networks", this.name);
	}

	get usd(): number {
		return (this.balance ?? 0) / 42;
	}
}
