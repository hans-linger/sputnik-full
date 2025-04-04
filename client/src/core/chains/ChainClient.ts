import type { ChainInfo, Coin } from "@keplr-wallet/types";
import type { AssetBalance } from "@/types/common";
import { EmptyBalance } from "@/core/constants";

export enum ChainConnectionStatus {
	None = "None",
	Connecting = "Connecting",
	Connected = "Connected",
	CannotConnect = "CannotConnect",
}

export enum ChainActionStatus {
	Idle = "Idle",
	Loading = "Loading",
}

export type ChainStatusListener = (state: ChainActionStatus) => void;

export default class ChainClient {
	readonly info: ChainInfo;
	readonly address: string;
	balances: Readonly<Coin[]> = [];
	balancesLoaded: boolean = false;

	constructor(info: ChainInfo, address: string) {
		this.info = info;
		this.address = address;
	}

	_connectionStatus: ChainConnectionStatus = ChainConnectionStatus.None;

	get connectionStatus(): ChainConnectionStatus {
		return this._connectionStatus;
	}

	set connectionStatus(status: ChainConnectionStatus) {
		this._connectionStatus = status;
	}

	_actionStatus: ChainActionStatus = ChainActionStatus.Idle;

	get actionStatus(): ChainActionStatus {
		return this._actionStatus;
	}

	set actionStatus(status: ChainActionStatus) {
		this._actionStatus = status;
		this._statusListeners.forEach((listener) => {
			listener(status);
		});
	}

	_statusListeners: ChainStatusListener[] = [];

	get statusListeners(): ChainStatusListener[] {
		return this._statusListeners;
	}

	get usd(): number {
		return Math.random() * 10;
	}

	get totalBalance(): AssetBalance {
		if (this.balances.length > 0) {
			return Object.assign({ loaded: true }, this.balances[0]);
		}
		return Object.assign({ loaded: this.balancesLoaded }, EmptyBalance);
	}

	addStatusListener(listener: ChainStatusListener): void {
		this.statusListeners.push(listener);
	}

	removeStatusListener(listener: ChainStatusListener): void {
		const i = this._statusListeners.indexOf(listener);
		if (i !== -1) {
			this.statusListeners.splice(i, 1);
		}
	}

	hasBalance(): boolean {
		return this.balances.length > 0;
	}
}
