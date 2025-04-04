import {
	CosmosRequestAccountResponse,
	CosmosSignAminoDoc,
	CosmosSignAminoResponse,
	CosmosSignDirectDoc,
	CosmosSignDirectResponse,
	CosmosSignMessageResponse,
	CosmosSignOptions,
} from "@cosmostation/wallets";
// @ts-expect-error shitty libs all over the place
import type { CosmosSignAndSendTransactionProps } from "@cosmostation/extension/dist/cosmos";

declare type Cosmos = {
	requestAccount: () => Promise<CosmosRequestAccountResponse>;
	signAmino: (
		document: CosmosSignAminoDoc,
		options?: CosmosSignOptions
	) => Promise<CosmosSignAminoResponse>;
	signDirect: (
		document: CosmosSignDirectDoc,
		options?: CosmosSignOptions
	) => Promise<CosmosSignDirectResponse>;
	sendTransaction: (txBytes: string, mode?: number) => Promise<string>;
	signAndSendTransaction: (
		props: CosmosSignAndSendTransactionProps,
		options?: CosmosSignOptions
	) => Promise<string>;
	signMessage: (message: string) => Promise<CosmosSignMessageResponse>;
	verifyMessage: (message: string, signature: string) => Promise<boolean>;
	disconnect: () => Promise<void>;
};
