<template>
	<MiniLayout>
		<div class="settingsContainer">
			<div v-for="(item, i) in data" :key="i" class="single">
				<div class="wrap">
					<div class="icon"><InlineSvg :src="IconHelper.get('settings', item)" /></div>
					<div class="text">{{ $t(`settings.main.${item}`) }}</div>
					<span class="toggler">
						<InlineSvg :src="IconHelper.get('common', 'chevron-medium-right')" />
					</span>
				</div>
			</div>
		</div>
	</MiniLayout>
</template>

<script lang="ts" setup>
import IconHelper from "@/core/helpers/Icons";
import InlineSvg from "vue-inline-svg";
import MiniLayout from "@/components/layout/MiniLayout.vue";

const data: Array<string> = [
	"currency",
	"language",
	"addresses",
	"manage",
	"contacts",
	"notifications",
];
</script>

<style lang="scss" scoped>
.miniLayoutContainer {
	:deep(.miniLayout) {
		width: 90%;
		max-width: 1000px;
		padding: 60px;
	}
}
.single {
	border: 1px solid #37373f;
	border-radius: 10px;
	margin-bottom: 8px;
	cursor: pointer;
	padding: 8px 15px;

	&:hover {
		border-color: #686868;
	}

	.wrap {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		align-items: center;

		.icon {
			width: 47px;
			height: 47px;
			flex-grow: 0;
			flex-shrink: 0;
			border: 1px solid #37373f;
			background-color: #000;
			padding-top: 3px;
			padding-left: 3px;
			border-radius: 23px;
			margin-right: 24px;
		}

		.text {
			flex-grow: 1;
			text-transform: uppercase;
			line-height: 22px;
			letter-spacing: 0.08em;
			font-family: "Figtree Medium", sans-serif;
		}

		.toggler {
			flex-grow: 0;
			margin-bottom: -5px;
		}
	}
}
</style>
