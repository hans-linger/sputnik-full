<template>
	<MainLayout>
		<div class="transactionsContainer">
			<div class="title">{{ $t("transactions.title") }}</div>
			<div class="list">
				<div v-for="(item, i) in data" class="single">
					<div class="icon">
						<img :src="IconHelper.get('networks', item.network)" />
					</div>
					<div class="amount">{{ $n(item.amount, "currency") }}&thinsp;$COIN</div>
					<div v-if="item.direction === 'sent'" class="sender">
						<span class="dir">{{ $t("transactions.sentTo") }}:</span>
						<span class="user">@{{ item.username }}</span>
					</div>
					<div v-else class="sender">
						<span class="dir">{{ $t("transactions.receivedFrom") }}:</span>
						<span class="user">@{{ item.username }}</span>
					</div>
					<div class="status">
						<img
							:src="
								IconHelper.get('transactions', 'status-' + (item.success ? 'success' : 'fail'))
							" />
					</div>
					<div class="date">{{ transactionDate(item) }}</div>
				</div>
			</div>
		</div>
	</MainLayout>
</template>

<script lang="ts" setup>
import MainLayout from "@/components/layout/MainLayout.vue";
import { shallowRef, ShallowRef } from "vue";
import IconHelper from "@/core/helpers/Icons";
import { useI18n } from "vue-i18n";

const { n } = useI18n();

const networks = ["boot", "cosmos", "injective", "juno", "osmosis", "posthuman", "sputnik"];

type TxData = {
	network: string;
	amount: number;
	direction: "sent" | "received";
	username: string;
	success: boolean;
	date: Date;
};

const data: ShallowRef<TxData[]> = shallowRef(generateData());

function generateData(): TxData[] {
	const res: TxData[] = [];
	for (let i = 0; i < 30; i++) {
		const r = Math.random();
		res.push({
			amount: Math.round(r * 1000000) / 100,
			direction: r > 0.5 ? "sent" : "received",
			network: networks[Math.floor(r * networks.length)],
			username: "user" + (19882 + Math.floor(r * 1000)),
			success: r > 0.2,
			date: new Date(Date.now() - Math.floor(Math.random() * 1e10)),
		});
	}
	res.sort((x, y) => (x.date.getTime() > y.date.getTime() ? -1 : 1));
	return res;
}

function transactionDate(item: TxData): string {
	const d = item.date;
	return (
		d.getUTCFullYear() +
		"." +
		(d.getUTCMonth() + 1).toString().padStart(2, "0") +
		"." +
		d.getUTCDate().toString().padStart(2, "0") +
		" " +
		d.getUTCHours().toString().padStart(2, "0") +
		":" +
		d.getUTCMinutes().toString().padStart(2, "0") +
		":" +
		d.getUTCSeconds().toString().padStart(2, "0")
	);
}
</script>

<style lang="scss" scoped>
.transactionsContainer {
	padding-top: 100px;
	padding-bottom: 50px;
	height: 100%;
	display: flex;
	flex-direction: column;

	.title {
		text-align: center;
		font-size: 24px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		margin-bottom: 40px;
	}

	.list {
		height: 100%;
		overflow-y: scroll;
	}

	.single {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		align-items: center;
		margin: 0 12px 5px;
		gap: 16px;
		padding: 5px 15px;
		border: 1px solid #37373f;
		border-radius: 10px;

		.icon {
			width: 36px;
			flex-grow: 0;
			flex-shrink: 0;

			img {
				width: 36px;
				height: 36px;
				display: block;
			}
		}

		.amount {
			flex-grow: 1;
			flex-shrink: 1;
			font-family: "Figtree Medium", sans-serif;
		}

		.sender {
			width: 50%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			flex-grow: 1;
			font-size: 14px;

			.dir {
				width: 200px;
				flex-grow: 0;
				flex-shrink: 0;
				text-align: right;
				font-family: "Figtree Regular", sans-serif;
			}

			.user {
				font-family: "Figtree Regular", sans-serif;
				color: #009dff;
			}
		}

		.date {
			width: 20%;
			flex-grow: 0;
			flex-shrink: 0;
			font-size: 14px;
			color: #6d6d6d;
		}
	}
}
</style>
