import { Asset, AssetRaw, ChainAddress, ChainAddressRaw } from "../types";

export default class AssetHelper {
	static convertAssetRaw(asset: AssetRaw): Asset {
		return {
			assetId: asset.asset_id,
			name: asset.name,
			usdRate: asset.price_usd ?? 0,
			addresses:
				asset.chain_addresses != null && asset.chain_addresses?.length > 0
					? asset.chain_addresses.map(a =>
							AssetHelper.convertChainAddressRaw(a)
						)
					: [],
		};
	}

	static convertChainAddressRaw(address: ChainAddressRaw): ChainAddress {
		return {
			chainId: address.chain_id,
			networkId: address.network_id,
			address: address.address,
		};
	}
}
